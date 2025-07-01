// Same as @apiParam
const filterApiParam = require('./api_param.js');

/**
 * API success post filter for parsed results.
 *
 * Filters parsed files and associated filenames based on specific criteria.
 *
 * @param {Array<object>} parsedFiles - List of parsed files to be filtered.
 * @param {Array<string>} filenames - List of filenames corresponding to parsed files.
 */
function postFilter(parsedFiles, filenames) {
  filterApiParam.postFilter(parsedFiles, filenames, 'success');
}

/**
 * Exports
 */
module.exports = {
  postFilter: postFilter
};
