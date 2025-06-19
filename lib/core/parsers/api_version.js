const semver = require('semver');
const ParameterError = require('../errors/parameter_error');

/**
 * Parse to extract API version
 *
 * Trims whitespace and validates against a semver check.
 *
 * @param {string} content The version string to validate and parse.
 * @returns {{version:string}|null}
 * @throws {ParameterError} Throws an error if the version string semver format is invalid.
 */
function parse(content) {
  content = content.trim();

  if (content.length === 0) {
    return null;
  }

  if (!semver.valid(content)) {
    throw new ParameterError(
      'Version format not valid.',
      'apiVersion',
      '@apiVersion major.minor.patch',
      '@apiVersion 1.2.3'
    );
  }

  return {
    version: content
  };
}

/**
 * Exports
 */
module.exports = {
  parse: parse,
  path: 'local',
  method: 'insert',
  extendRoot: true
};
