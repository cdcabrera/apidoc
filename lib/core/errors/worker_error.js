const util = require('util');

/**
 * Extend the error object to broadcast worker process errors.
 *
 * @param {string} message - Error message providing details about what caused the error.
 * @param {string} file - File where the error occurred.
 * @param {string} block - Specific block of code or logic related to the error.
 * @param {string} element - Specific element involved in or responsible for the error.
 * @param {string} definition - Definition or configuration related to the error.
 * @param {string} example - Sample related to the error context.
 * @param {any} extra - Additional data, context, about the error.
 * @class
 */
function WorkerError(message, file, block, element, definition, example, extra) {
  // enable stack trace
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;

  this.message = message;
  this.file = file;
  this.block = block;
  this.element = element;
  this.definition = definition;
  this.example = example;
  this.extra = extra;
}

/**
 * Inherit from Error
 */
util.inherits(WorkerError, Error);

/**
 * Exports
 */
module.exports = WorkerError;
