/*
 * apidoc
 * https://apidocjs.com
 *
 * Copyright (c) 2013 inveris OHG
 * Authors: Peter Rottmann <rottmann@inveris.de>
 * Nicolas CARPi @ Deltablot
 * Licensed under the MIT license.
 */

/**
 * Write output files
 */
class Writer {
  constructor(api, app, cacheBustingQueryParam = `v=${Date.now()}`) {
    this.api = api;
    this.log = app.log;
    this.opt = app.options;
    this.cacheBustingQueryParam = String(cacheBustingQueryParam);
    this.fs = require('fs-extra');
    this.path = require('path');
  }

  // The public method
  write() {
    if (this.opt.dryRun) {
      this.log.info('Dry run mode enabled: no files created.');
      return new Promise(resolve => {
        return resolve();
      });
    }

    this.log.verbose('Writing files...');
    if (this.opt.single) {
      return this.createSingleFile();
    }
    return this.createOutputFiles();
  }

  /**
   * Find assets from node_modules folder and return its path
   * Argument is the path relative to node_modules folder
   */
  findAsset(assetPath) {
    try {
      const path = require.resolve(assetPath);
      return path;
    } catch {
      this.log.error('Could not find where dependencies of apidoc live!');
    }
  }

  createOutputFiles() {
    this.createDir(this.opt.dest);

    // create index.html
    this.log.verbose('Copying template index.html to: ' + this.opt.dest);
    this.fs.writeFileSync(this.path.join(this.opt.dest, 'index.html'), this.getIndexContent());

    // create assets folder
    const assetsPath = this.path.resolve(this.path.join(this.opt.dest, 'assets'));
    this.createDir(assetsPath);

    // save the parsed api file
    if (this.opt.writeJson) {
      const jsonFile = this.path.join(assetsPath, 'api-data.json');
      this.log.verbose('Saving parsed API to: ' + jsonFile);
      this.fs.writeFileSync(jsonFile, this.api.data);
    }

    // images
    this.fs.copySync(this.path.join(this.opt.template, 'img'), assetsPath);

    return this.runBundler(this.path.resolve(assetsPath));
  }

  /**
   * Run bundler in a promise
   */
  runBundler(outputPath) {
    this.log.verbose('Running bundler');

    return new Promise((resolve, reject) => {
      // run esbuild to create the bundle file in assets
      const esbuild = require('esbuild');
      const entryPoint = this.path.resolve(this.path.join(this.opt.template, 'src', 'main.js'));
      const outfile = this.path.join(outputPath, 'main.bundle.js');

      this.log.debug(`output file: ${outfile}`);

      // Load esbuild config
      const esbuildConfig = require(this.path.resolve(this.path.join(this.opt.template, 'src', 'esbuild.config.js')));

      // Override config with runtime values
      const buildOptions = {
        ...esbuildConfig,
        entryPoints: [entryPoint],
        outfile: outfile,
        minify: !this.opt.debug,
        sourcemap: this.opt.debug ? 'inline' : false,
        define: {
          API_DATA: this.api.data,
          API_PROJECT: this.api.project
        },
        logLevel: this.opt.debug ? 'debug' : 'info'
      };

      esbuild
        .build(buildOptions)
        .then(() => {
          this.log.debug('Generated bundle successfully');
          return resolve(outputPath);
        })
        .catch(err => {
          this.log.error('Bundle failure:', err);
          return reject(err);
        });
    });
  }

  /**
   * Get index.html content as string with placeholder values replaced
   */
  getIndexContent() {
    const projectInfo = JSON.parse(this.api.project);
    const title = projectInfo.title || projectInfo.name || 'Loading...';
    const description = projectInfo.description || projectInfo.name || 'API Documentation';

    const indexHtml = this.fs.readFileSync(this.path.join(this.opt.template, 'index.html'), 'utf8');
    return (
      indexHtml
        .toString()
        // replace titles, descriptions and cache busting query params
        .replace(/__API_NAME__/g, title)
        .replace(/__API_DESCRIPTION__/g, description)
        .replace(/__API_CACHE_BUSTING_QUERY_PARAM__/g, this.cacheBustingQueryParam)
    );
  }

  /**
   * Create a self-contained single HTML file by bundling CSS and JS into the file
   * - modify the main index HTML content to embed CSS, JS directly
   * - remove external links to assets
   * - save the final file to the destination directory
   *
   * @return {Promise<void>} A promise that resolves once the single HTML file is successfully created.
   */
  createSingleFile() {
    // dest is a file path, so get the folder with dirname
    this.createDir(this.path.dirname(this.opt.dest));

    const tmpPath = '/tmp/apidoc-tmp';
    // TODO add favicons in base64 in the html
    this.createDir(tmpPath);

    return this.runBundler(tmpPath).then(tmpPath => {
      const mainBundleCss = this.fs.readFileSync(this.path.join(tmpPath, 'main.bundle.css'), 'utf8');
      const mainBundle = this.fs.readFileSync(this.path.join(tmpPath, 'main.bundle.js'), 'utf8');

      // modify index html for single page use
      const indexContent = this.getIndexContent()
        // replace image and css assets
        .replace(/<link href="assets\/main[^>]*>/g, `<style>${mainBundleCss}</style>`)
        // replace js assets
        .replace(/<script src="assets[^>]*><\/script>/, '');

      // concatenate all the content (html + javascript bundle with bundled CSS)
      const finalContent = `${indexContent}
      <script>${mainBundle}</script>`;

      // create a target file
      const finalPath = this.path.join(this.opt.dest, 'index.html');
      // make sure the destination exists
      this.createDir(this.opt.dest);
      this.log.verbose(`Generating self-contained single file: ${finalPath}`);
      this.fs.writeFileSync(finalPath, finalContent);
    });
  }

  /**
   * Write a JSON file
   *
   * @param {string} dest Destination path
   * @param {string} data Content of the file
   */
  writeJsonFile(dest, data) {
    this.log.verbose(`Writing json file: ${dest}`);
    this.fs.writeFileSync(dest, data + '\n');
  }

  /**
   * Write js file
   *
   * @param {string} dest Destination path
   * @param {string} data Content of the file
   */
  writeJSFile(dest, data) {
    this.log.verbose(`Writing js file: ${dest}`);
    switch (this.opt.mode) {
      case 'amd':
      case 'es':
        this.fs.writeFileSync(dest, 'export default ' + data + ';\n');
        break;
      case 'commonJS':
        this.fs.writeFileSync(dest, 'module.exports = ' + data + ';\n');
        break;
      default:
        this.fs.writeFileSync(dest, 'define(' + data + ');' + '\n');
    }
  }

  /**
   * Create a directory
   *
   * @param {string} dir Path of the directory to create
   */
  createDir(dir) {
    if (!this.fs.existsSync(dir)) {
      this.log.verbose('Creating dir: ' + dir);
      this.fs.mkdirsSync(dir);
    }
  }
}

module.exports = Writer;
