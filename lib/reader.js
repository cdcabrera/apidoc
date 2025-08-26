/*
 * apidoc
 * https://apidocjs.com
 *
 * Authors:
 * Peter Rottmann <rottmann@inveris.de>
 * Nicolas CARPi @ Deltablot
 * Copyright (c) 2013 inveris OHG
 * Licensed under the MIT license.
 */
const _ = require('lodash');

const defaultConfig = {
  name: 'Acme project',
  version: '0.0.0',
  description: 'REST Api'
};

/**
 * Reader class
 *
 * Processes application configuration files, reads content,
 * and extracts relevant information to initialize and manage header/footer content.
 *
 * @class
 */
class Reader {
  /**
   * Initialize class
   *
   * @param {object} app - Application instance
   * @param {object} app.log - Logger instance
   * @param {object} app.options - Application options
   */
  constructor(app) {
    this.app = app;
    this.log = app.log;
    this.opt = app.options;
    this.fs = require('fs-extra');
    this.path = require('path');
  }

  /**
   * Read configuration data from a config file or search for a config file.
   *
   * Configuration can be read from
   * - `apidoc.json`
   * - `apidoc.config.js`
   * - `package.json`
   *
   * @returns {object} Combined configuration object, including provided
   *     or searched configuration and header/footer details.
   * @memberof Reader
   */
  read() {
    let config = {};

    // if the config file is provided, we use this and do no try to read other files
    if (this.opt.config) {
      this.log.debug('Config file provided, reading this.');
      config = require(this.path.resolve(this.opt.config));
    } else {
      config = this.search();
    }

    // replace header footer with file contents
    return Object.assign(config, this.getHeaderFooter(config));
  }

  /**
   * Search for API documentation configuration files in specified directories.
   *
   * @returns {{name: string, version: string, description: string}} Merged configuration object
   * @memberof Reader
   */
  search() {
    this.log.debug('Now looking for apidoc config files');
    // possible sources of information
    const sources = ['package.json', 'apidoc.json', 'apidoc.config.js'];

    // create a new object because JavaScript will not assign value
    const config = Object.assign({}, defaultConfig);

    // loop the three possible sources of information to try and find packageInfo
    sources.forEach(configFile => {
      this.log.debug(`Now looking for ${configFile}`);
      // first look in cwd dir
      Object.assign(config, this.findConfigFileInDir(configFile, process.cwd()));
      // scan each source dir to find a valid config file
      this.opt.src.forEach(dir => {
        Object.assign(config, this.findConfigFileInDir(configFile, dir));
      });
    });
    if (_.isEqual(config, defaultConfig)) {
      this.log.warn('No config files found.');
    }

    return config;
  }

  /**
   * Get json.header / json.footer title and markdown content
   *
   * Retrieves and processes header and footer configurations by reading content from the specified files
   * and rendering it with a Markdown parser if available.
   *
   * @param {object} config - Configuration object containing details about header and footer settings.
   * @param {object} [config.header] - Header configuration
   * @param {string} config.header.filename - Header filename
   * @param {string} config.header.title - Header title
   * @param {object} [config.footer] - Footer configuration
   * @param {string} config.footer.filename - Footer filename
   * @param {string} config.footer.title - Footer title
   * @param {Array<string>} config.input - Input directories to search for the files.
   * @returns {object} Object containing processed header and footer content, including their titles.
   * @throws {Error} If the header or footer file cannot be read.
   * @memberof Reader
   */
  getHeaderFooter(config) {
    const result = {};

    ['header', 'footer'].forEach(key => {
      if (config[key] && config[key].filename) {
        this.log.debug('Now looking for ' + key);
        // note that markdown files path is taken from first input value
        let filePath = this.path.join(config.input ? config.input[0] : './', config[key].filename);

        // try again to find it in current dir
        if (!this.fs.existsSync(filePath)) {
          filePath = this.path.join(process.cwd(), config[key].filename);
        }

        // try again to find it in input folders
        if (!this.fs.existsSync(filePath)) {
          filePath = this.findFileInSrc(config[key].filename);
        }

        // try again to find it in dir with the config file
        if (!this.fs.existsSync(filePath) && typeof this.opt.config === 'string') {
          filePath = this.path.join(this.path.dirname(this.opt.config), config[key].filename);
        }

        try {
          this.log.debug(`Reading ${key} file: ${filePath}`);
          const content = this.fs.readFileSync(filePath, 'utf8');

          result[key] = {
            title: config[key].title,
            content: this.app.markdownParser ? this.app.markdownParser.render(content) : content
          };
        } catch (e) {
          throw new Error('Can not read: ' + filePath);
        }
      }
    });

    return result;
  }

  /**
   * Search for a configuration file in a specified directory.
   *
   * @param {string} filename - Name of the configuration file to locate.
   * @param {string} dir - Directory to scan
   * @returns {string|*|{}} Configuration data if the file is found, or an empty object if not found.
   * @memberof Reader
   */
  findConfigFileInDir(filename, dir) {
    let foundConfig;
    const target = this.path.resolve(this.path.join(dir, filename));

    if (this.fs.existsSync(target)) {
      this.log.debug(`Found file: ${target}`);
      foundConfig = require(target);
      // if it has an apidoc key, read that
      if (foundConfig.apidoc) {
        this.log.verbose(`Using apidoc key of ${filename}`);
        // pull any missing config from root
        ['version', 'name', 'description'].forEach(key => {
          if (!foundConfig.apidoc[key] && foundConfig[key]) {
            this.log.verbose(`Using ${key} from root of ${filename}`);
            foundConfig.apidoc[key] = foundConfig[key];
          }
        });

        return foundConfig.apidoc;
      }
      // for package.json we don't want to read it if it has no apidoc key
      if (filename !== 'package.json') {
        return foundConfig;
      }
    }

    return {};
  }

  /**
   * Look for a file in each of the input folders.
   *
   * If multiple files with the same name exist in different directories, the method returns the first valid file it finds.
   *
   * @param {string} filename - Name of the file to search for
   * @returns {string} Resolved path of the found file, or an empty string if not.
   * @memberof Reader
   */
  findFileInSrc(filename) {
    // scan each source dir to find a valid config file
    // note that any file found here will supersede a previously found file
    for (const dir of this.opt.src) {
      const target = this.path.join(dir, filename);

      if (this.fs.existsSync(target)) {
        this.log.debug('Found file: ' + target);

        return this.path.resolve(target);
      }
    }

    return '';
  }
}

module.exports = {
  Reader: Reader,
  defaultConfig: defaultConfig
};
