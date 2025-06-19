/**
 * Parse to extract API private
 *
 * @returns {{private: boolean}} Return an object with the `private` property always set to true.
 */
function parse() {
  return {
    private: true
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
