// Same as @apiParam
const filterApiParam = require('./api_param.js');

/**
 * API error post filter for parsed results.
 *
 * Filters the given parsed files and filenames based on specific criteria.
 *
 * @param {Array<object>} parsedFiles - Array of parsed file objects to be filtered.
 * @param {Array<string>} filenames - Array of filenames corresponding to the parsed files.
 */
function postFilter(parsedFiles, filenames) {
  filterApiParam.postFilter(parsedFiles, filenames, 'error');
}

/**
 * Exports
 */
module.exports = {
  postFilter: postFilter
};
