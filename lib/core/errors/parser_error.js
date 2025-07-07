const util = require('util');

/**
 * Extend the error object to broadcast parsing errors in an operation.
 *
 * @param {string} message - Message explaining the error.
 * @param {string} file - Name, or path, of the file where the error occurred.
 * @param {string} block - Specific block in the file associated with the error.
 * @param {string} element - Specific element within the block related to the error.
 * @param {string} source - Source content, or code snippet, that caused the error.
 * @param {Array<object>} extra - Additional data, context, about the error.
 * @class
 */
function ParserError(message, file, block, element, source, extra) {
  // enable stack trace
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;

  this.message = message;
  this.file = file;
  this.block = block;
  this.element = element;
  this.source = source;
  this.extra = extra || [];
}

/**
 * Inherit from Error
 */
util.inherits(ParserError, Error);

/**
 * Exports
 */
module.exports = ParserError;
