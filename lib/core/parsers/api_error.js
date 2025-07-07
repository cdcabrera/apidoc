// Same as @apiParam
const apiParser = require('./api_param.js');

/**
 * Parse to extract API error using the 'Error 4xx' group.
 *
 * @param {string} content - Content to be parsed.
 * @param {string} source - UNUSED
 * @returns {{
 *     group: string|*,
 *     type: string,
 *     size: string,
 *     allowedValues: string,
 *     optional: *|boolean,
 *     parentNode: *|undefined,
 *     field: string,
 *     isArray: *|boolean,
 *     defaultValue: *,
 *     description: string}}
 */
function parse(content, source) {
  return apiParser.parse(content, source, 'Error 4xx');
}

/**
 * Construct and return a string representing a structured path for error fields
 * based on a group retrieved from the API parser.
 *
 * @returns {string}
 */
function path() {
  return 'local.error.fields.' + apiParser.getGroup();
}

/**
 * Exports
 */
module.exports = {
  parse: parse,
  path: path,
  method: apiParser.method,
  markdownFields: ['description', 'type'],
  markdownRemovePTags: ['type']
};
