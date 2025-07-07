const util = require('util');
const fs = require('path');

/**
 * Extend the base error object to include additional file and path details.
 *
 * @param {string} message - Descriptive error message explaining the nature of the error.
 * @param {string} [file] - Name of the file associated with the error. Defaults to an empty string if not provided.
 * @param {string} [path] - Full path of the file associated with the error. Defaults to the file name if not provided.
 * @class
 */
function FileError(message, file, path) {
  // enable stack trace
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;

  this.message = message;
  this.file = file || '';
  this.path = path || file;

  if (this.path && this.path.charAt(this.path.length - 1) !== '/') {
    this.path = fs.dirname(this.path);
  }
}

/**
 * Inherit from Error
 */
util.inherits(FileError, Error);

/**
 * Exports
 */
module.exports = FileError;
