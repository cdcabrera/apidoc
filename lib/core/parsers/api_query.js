// Same as @apiParam
const apiParser = require('./api_param.js');

/**
 * Parse to extract API query
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
  return apiParser.parse(content, source, 'Query');
}

/**
 * Exports
 */
module.exports = {
  parse: parse,
  path: 'local.query',
  method: apiParser.method,
  markdownFields: ['description']
};
