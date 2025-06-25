/**
 * Parse to extract API name
 *
 * Parses content, trims whitespace, and replaces spaces with underscores.
 *
 * @param {string} content - The content to be parsed.
 * @returns {{name: string}|null} Processed name property, or null if the content is empty.
 */
function parse(content) {
  const name = content.trim();

  if (name.length === 0) {
    return null;
  }

  return {
    name: name.replace(/(\s+)/g, '_')
  };
}

/**
 * Exports
 */
module.exports = {
  parse: parse,
  path: 'local',
  method: 'insert'
};
