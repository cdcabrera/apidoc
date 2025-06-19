const unindent = require('../utils/unindent');

/**
 * Parse to extract API description
 *
 * @param {string} content - Content to be parsed.
 * @returns {{description: string}|null}
 */
function parse(content) {
  const description = content.trim();

  if (description.length === 0) {
    return null;
  }

  return {
    description: unindent(description)
  };
}

/**
 * Exports
 */
module.exports = {
  parse: parse,
  path: 'local',
  method: 'insert',
  markdownFields: ['description']
};
