const util = require('util');

/**
 * Extend the error object to broadcast parameter errors in an operation or configuration.
 *
 * @param {string} message - Error message providing details about the issue.
 * @param {string} element - Name, or identifier, of the parameter causing the error.
 * @param {string} definition - Description, or definition, of the parameter expected.
 * @param {string} example - Example value, or usage guideline, for the parameter.
 * @class
 */
function ParameterError(message, element, definition, example) {
  // enable stack trace
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;

  this.message = message;
  this.element = element;
  this.definition = definition;
  this.example = example;
}

/**
 * Inherit from Error
 */
util.inherits(ParameterError, Error);

/**
 * Exports
 */
module.exports = ParameterError;
