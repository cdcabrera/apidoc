/**
 * Parse to extract API sample request
 *
 * Trims whitespace
 *
 * @param {string} content - The content to be parsed.
 * @returns {{url: string}|null}
 */
function parse(content) {
  const url = content.trim();

  if (url.length === 0) {
    return null;
  }

  return {
    url: url
  };
}

/**
 * Exports
 */
module.exports = {
  parse: parse,
  path: 'local.sampleRequest',
  method: 'push'
};
