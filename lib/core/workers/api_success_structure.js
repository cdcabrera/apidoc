// Same as @apiUse
const apiWorker = require('./api_use.js');

// Additional information for error log
const _messages = {
  common: {
    element: 'apiSuccessStructure',
    usage: '@apiSuccessStructure group',
    example: '@apiDefine MyValidSuccessStructureGroup Some title\n@apiSuccessStructure MyValidSuccessStructureGroup'
  }
};

/**
 * PreProcess API Success Structure
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
  return apiWorker.preProcess(parsedFiles, filenames, packageInfos, 'defineSuccessStructure');
}

/**
 * PostProcess API Success Structure
 *
 * Processes the parsed files and metadata after the initial processing is completed.
 *
 * @param {Array<object>} parsedFiles - Array of objects containing the parsed file data.
 * @param {Array<string>} filenames - Array of filenames associated with the parsed files.
 * @param {object} preProcess - Pre-processing results containing defined success structures.
 * @param {object} packageInfos - Collection of package-level details and information.
 */
function postProcess(parsedFiles, filenames, preProcess, packageInfos) {
  apiWorker.postProcess(
    parsedFiles,
    filenames,
    preProcess,
    packageInfos,
    'defineSuccessStructure',
    'successStructure',
    _messages
  );
}

/**
 * Exports
 */
module.exports = {
  preProcess: preProcess,
  postProcess: postProcess
};
