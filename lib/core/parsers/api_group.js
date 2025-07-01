/**
 * Parse to extract API group
 *
 * Trims whitespace and replaces spaces with underscores.
 *
 * @param {string} content - The content to be parsed.
 * @returns {{group: *}|null}
 */
function parse(content) {
  const group = content.trim();

  if (group.length === 0) {
    return null;
  }

  return {
    group: group.replace(/(\s+)/g, '_')
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
