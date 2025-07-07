// Same as @apiParam
const filterApiParam = require('./api_param.js');

/**
 * API header post filter for parsed results.
 *
 * Filters parsed file content based on specific criteria in the header.
 *
 * @param {Array<object>} parsedFiles - Array of parsed file objects to be filtered.
 * @param {Array<string>} filenames - Array of filenames corresponding to the parsed files.
 */
function postFilter(parsedFiles, filenames) {
  filterApiParam.postFilter(parsedFiles, filenames, 'header');
}

/**
 * Exports
 */
module.exports = {
  postFilter: postFilter
};
