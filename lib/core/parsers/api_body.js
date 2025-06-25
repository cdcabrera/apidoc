// Same as @apiParam
const apiParser = require('./api_param.js');

/**
 * Parse to extract the API body
 *
 * @param {string} content - Content to be parsed.
 * @param {string} source - UNUSED
 * @returns {{
 *     group: string|*,
 *     type: string,
 *     size: string,
 *     allowedValues: string,
 *     optional: boolean|*,
 *     parentNode: *|undefined,
 *     field: string,
 *     isArray: *|boolean,
 *     defaultValue:*,
 *     description: string
 *     }} Parsed result object, which may include additional properties like `checked` if the type is boolean.
 */
function parse(content, source) {
  const result = apiParser.parse(content, source, 'Body');
  // for checkboxes the html will look at the checked property for setting the checked
  // state of the box, not the defaultValue
  if (typeof result.type === 'string' && result.type.toLowerCase() === 'boolean') {
    result.checked = Boolean(result.defaultValue);
  }
  return result;
}

/**
 * Exports
 */
module.exports = {
  parse: parse,
  path: 'local.body',
  method: apiParser.method,
  markdownFields: ['description']
};
