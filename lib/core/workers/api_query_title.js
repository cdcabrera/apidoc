const apiWorker = require('./api_param_title.js');

// Additional information for error log
const _messages = {
  common: {
    element: 'apiQuery',
    usage: '@apiQuery (group) varname',
    example: '@apiDefine MyValidParamGroup Some title\n@apiQuery (MyValidParamGroup) username'
  }
};

/**
 * PreProcess API Query Title
 *
 * Pre-processes the given parsed files, filenames, and package information
 * by delegating the operation to an API worker.
 *
 * @param {Array<object>} parsedFiles - Array of parsed file objects to process.
 * @param {Array<string>} filenames - Array of filenames corresponding to the parsed files.
 * @param {object} packageInfos - Object containing package information to apply during processing.
 * @returns {object}
 */
function preProcess(parsedFiles, filenames, packageInfos) {
  return apiWorker.preProcess(parsedFiles, filenames, packageInfos, 'defineQueryTitle');
}

/**
 * PostProcess API Query Title
 *
 * Processes the parsed files and metadata after the initial processing is completed.
 *
 * @param {Array<object>} parsedFiles - Array of objects containing the parsed file data.
 * @param {Array<string>} filenames - Array of filenames associated with the parsed files.
 * @param {object} preProcess - Pre-processing results containing defined titles.
 * @param {object} packageInfos - Collection of package-level details and information.
 */
function postProcess(parsedFiles, filenames, preProcess, packageInfos) {
  apiWorker.postProcess(parsedFiles, filenames, preProcess, packageInfos, 'defineQueryTitle', 'query', _messages);
}

/**
 * Exports
 */
module.exports = {
  preProcess: preProcess,
  postProcess: postProcess
};
