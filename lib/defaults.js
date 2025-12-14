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

/**
 * Provide default values for the app
 */
const path = require('path');
const winston = require('winston');
let Markdown = require('markdown-it');

/**
 * Create and return a logger instance
 *
 * @param {object} options - Configuration options
 * @param {string} [options.logFormat] - Log format ('json' or default)
 * @param {boolean} [options.colorize] - Enable colorized output
 * @param {boolean} [options.debug] - If true, debug level logging
 * @param {boolean} [options.verbose] - If true, verbose level logging
 * @param {boolean} [options.silent] - If true, disables logging
 * @returns {object} Winston logger instance.
 */
function getLogger(options) {
  // default format
  let format = winston.format.simple();

  if (options.logFormat === 'json') {
    // remove colors for json output
    options.colorize = false;
    format = winston.format.json();
  }
  // add colors (default is true)
  if (options.colorize) {
    format = winston.format.combine(winston.format.colorize(), format);
  }

  // console logger
  return winston.createLogger({
    transports: [
      new winston.transports.Console({
        level: options.debug ? 'debug' : options.verbose ? 'verbose' : 'info',
        silent: options.silent
      })
    ],
    format: format
  });
}

/**
 * Get the markdown parser
 *
 * @param {object} options - Configuration options
 * @param {boolean|string} options.markdown - Markdown parser behavior:
 *     - `true` to use the default Markdown parser with specific settings.
 *     - `false` to disable parsing.
 *     - A string indicating the path to a custom parser.
 * @returns {object|unknown} An instance of the Markdown parser if enabled or configured
 */
function getMarkdownParser(options) {
  // Markdown Parser: enable / disable / use a custom parser.
  let markdownParser;

  if (options.markdown === true) {
    markdownParser = new Markdown({
      breaks: false,
      html: true,
      linkify: false,
      typographer: false,
      highlight: function (str, lang) {
        if (lang) {
          return '<pre><code class="language-' + lang + '">' + str + '</code></pre>';
        }

        return '<pre><code>' + str + '</code></pre>';
      }
    });
  } else if (options.markdown !== false) {
    // Include custom Parser @see https://github.com/apidoc/apidoc/wiki/Custom-markdown-parser and test/markdown/custom_markdown_parser.js
    if (
      options.markdown.substr(0, 2) !== '..' &&
      ((options.markdown.substr(0, 1) !== '/' &&
        options.markdown.substr(1, 2) !== ':/' &&
        options.markdown.substr(1, 2) !== ':\\' &&
        options.markdown.substr(0, 1) !== '~') ||
        options.markdown.substr(0, 1) === '.')
    ) {
      options.markdown = path.join(process.cwd(), options.markdown);
    }
    Markdown = require(options.markdown); // Overwrite default Markdown.
    markdownParser = new Markdown();
  }

  return markdownParser;
}

module.exports = {
  getLogger: getLogger,
  getMarkdownParser: getMarkdownParser
};
