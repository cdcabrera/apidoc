// Same as @apiUse
const apiWorker = require('./api_use.js');

// Additional information for error log
const _messages = {
  common: {
    element: 'apiStructure',
    usage: '@apiStructure group',
    example: '@apiDefine MyValidStructureGroup Some title\n@apiStructure MyValidStructureGroup'
  }
};

/**
 * PreProcess API Structure
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
  return apiWorker.preProcess(parsedFiles, filenames, packageInfos, 'defineStructure');
}

/**
 * PostProcess API Structure
 *
 * Processes the parsed files and metadata after the initial processing is completed.
 * Handles structure definitions by delegating to an API worker.
 *
 * @param {Array<object>} parsedFiles - Array of objects containing the parsed file data.
 * @param {Array<string>} filenames - Array of filenames associated with the parsed files.
 * @param {object} preProcess - Pre-processing results containing defined structures.
 * @param {object} packageInfos - Collection of package-level details and information.
 */
function postProcess(parsedFiles, filenames, preProcess, packageInfos) {
  apiWorker.postProcess(parsedFiles, filenames, preProcess, packageInfos, 'defineStructure', 'structure', _messages);
}

/**
 * Exports
 */
module.exports = {
  preProcess: preProcess,
  postProcess: postProcess
};
