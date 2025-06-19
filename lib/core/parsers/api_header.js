// Same as @apiParam
const apiParser = require('./api_param.js');

/**
 * Parse to extract API header using the 'Header' group.
 *
 * @param {string} content - The content to be parsed.
 * @param {string} source - UNUSED
 * @returns {{
 *     group: string,
 *     type: string,
 *     size: string,
 *     allowedValues: string,
 *     optional: boolean,
 *     parentNode: *,
 *     field: string,
 *     isArray: boolean,
 *     defaultValue: string,
 *     description: string}|null}
 */
function parse(content, source) {
  return apiParser.parse(content, source, 'Header');
}

/**
 * Construct and return a string representing a structured path for header fields
 * based on a group retrieved from the API parser.
 *
 * @returns {string}
 */
function path() {
  return 'local.header.fields.' + apiParser.getGroup();
}

/**
 * Exports
 */
module.exports = {
  parse: parse,
  path: path,
  method: apiParser.method,
  markdownFields: ['description']
};
