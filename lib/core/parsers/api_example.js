const unindent = require('../utils/unindent');

/**
 * Parse to extract API example
 *
 * @param {string} content - Content to be parsed.
 * @param {string} source - Source string for metadata, including type and title information.
 * @returns {{title: string, content: string, type: string}|null}
 */
function parse(content, source) {
  source = source.trim();

  let title = '';
  let text = '';
  let type;

  // Search for @apiExample "[{type}] title and content
  // /^(@\w*)?\s?(?:(?:\{(.+?)\})\s*)?(.*)$/gm;
  const parseRegExpFirstLine = /(@\w*)?(?:(?:\s*\{\s*([a-zA-Z0-9./\\[\]_-]+)\s*\}\s*)?\s*(.*)?)?/;
  const parseRegExpFollowing = /(^.*\s?)/gm;

  let matches;
  if ((matches = parseRegExpFirstLine.exec(source))) {
    type = matches[2];
    title = matches[3];
  }

  parseRegExpFollowing.exec(content); // ignore line 1
  while ((matches = parseRegExpFollowing.exec(source))) {
    text += matches[1];
  }

  if (text.length === 0) {
    return null;
  }

  return {
    title: title,
    content: unindent(text),
    type: type || 'json'
  };
}

/**
 * Exports
 */
module.exports = {
  parse: parse,
  path: 'local.examples',
  method: 'push'
};
