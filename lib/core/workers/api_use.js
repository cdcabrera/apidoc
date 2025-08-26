const _ = require('lodash');
const semver = require('semver');
const WorkerError = require('../errors/worker_error');

// Additional information for error log
const _messages = {
  common: {
    element: 'apiUse',
    usage: '@apiUse group',
    example: '@apiDefine MyValidGroup Some title\n@apiUse MyValidGroup'
  }
};

/**
 * PreProcess API Use
 *
 * Pre-processes the given parsed files, filenames, and package information
 * to extract and organize defined blocks for later use.
 *
 * @param {Array<object>} parsedFiles - Array of parsed file objects to process.
 * @param {Array<string>} filenames - Array of filenames corresponding to the parsed files.
 * @param {object} packageInfos - Object containing package information to apply during processing.
 * @param {string} [target] - Target path in preProcess-Object (returned result), where the data should be set.
 * @returns {object} Processed data organized by the target key.
 */
function preProcess(parsedFiles, filenames, packageInfos, target) {
  target = target || 'define';
  const source = target; // relative path to the tree (global.), from where the data should be fetched.

  const result = {};

  result[target] = {};

  parsedFiles.forEach(function (parsedFile) {
    parsedFile.forEach(function (block) {
      if (block.global[source]) {
        const name = block.global[source].name;
        const version = block.version || packageInfos.defaultVersion;

        if (!result[target][name]) {
          result[target][name] = {};
        }

        // fetch from local
        result[target][name][version] = block.local;
      }
    });
  });

  if (result[target].length === 0) {
    delete result[target];
  }

  return result;
}

/**
 * PostProcess API Use
 *
 * Processes the parsed files and metadata after the initial processing is completed.
 * Handles referenced definitions, versioning, and merges matched data into the parsed blocks.
 *
 * @param {Array<object>} parsedFiles - Array of objects containing the parsed file data.
 * @param {Array<string>} filenames - Array of filenames associated with the parsed files.
 * @param {object} preProcess - Pre-processing results containing defined blocks.
 * @param {object} packageInfos - Collection of package-level details and information.
 * @param {string} [source] - Source path in preProcess-Object.
 * @param {string} [target] - Relative path to the tree (local.), where the data should be modified.
 * @param {object} [messages] - Messages used for error reporting.
 */
function postProcess(parsedFiles, filenames, preProcess, packageInfos, source, target, messages) {
  source = source || 'define';
  target = target || 'use';
  messages = messages || _messages;

  parsedFiles.forEach(function (parsedFile, parsedFileIndex) {
    parsedFile.forEach(function (block) {
      const loopCounter = 0; // add a loop counter to have a break condition when the recursion depth exceed a predefined limit

      while (block.local[target]) {
        if (loopCounter > 10) {
          throw new WorkerError(
            'recursion depth exceeds limit with @apiUse',
            filenames[parsedFileIndex],
            block.index,
            messages.common.element,
            messages.common.usage,
            messages.common.example,
            [{ Groupname: block.name }]
          );
        }

        // create a copy of the elements for save iterating of the elements
        const blockClone = block.local[target].slice();

        // remove unneeded target before starting the loop, to allow a save insertion of new elements
        // TODO: create a cleanup filter
        delete block.local[target];

        for (let blockIndex = 0; blockIndex < blockClone.length; ++blockIndex) {
          const definition = blockClone[blockIndex];
          const name = definition.name;
          const version = block.version || packageInfos.defaultVersion;

          if (!preProcess[source] || !preProcess[source][name]) {
            throw new WorkerError(
              'Referenced groupname does not exist / it is not defined with @apiDefine.',
              filenames[parsedFileIndex],
              block.index,
              messages.common.element,
              messages.common.usage,
              messages.common.example,
              [{ Groupname: name }]
            );
          }

          let matchedData = {};

          if (preProcess[source][name][version]) {
            // found the version
            matchedData = preProcess[source][name][version];
          } else {
            // find nearest matching version
            let foundIndex = -1;
            let lastVersion = packageInfos.defaultVersion;

            const versionKeys = Object.keys(preProcess[source][name]);

            for (let versionIndex = 0; versionIndex < versionKeys.length; ++versionIndex) {
              const currentVersion = versionKeys[versionIndex];

              if (semver.gte(version, currentVersion) && semver.gte(currentVersion, lastVersion)) {
                lastVersion = currentVersion;
                foundIndex = versionIndex;
              }
            }

            if (foundIndex === -1) {
              throw new WorkerError(
                'Referenced definition has no matching or a higher version. ' +
                'Check version number in referenced define block.',
                filenames[parsedFileIndex],
                block.index,
                messages.common.element,
                messages.common.usage,
                messages.common.example,
                [{ Groupname: name }, { Version: version }, { 'Defined versions': versionKeys }]
              );
            }

            const versionName = versionKeys[foundIndex];

            matchedData = preProcess[source][name][versionName];
          }

          // copy matched elements into parsed block
          _recursiveMerge(block.local, matchedData);
        }
      }
    });
  });
}

/**
 * Recursive Merge of Objects with Arrays
 *
 * Merges two objects recursively, concatenating arrays when encountered.
 * This is a utility function used by the postProcess function.
 *
 * @param {object} block - The target object to merge into.
 * @param {object} matchedData - The source object to merge from.
 * @todo Bad Hack - watch for something better
 */
function _recursiveMerge(block, matchedData) {
  _.mergeWith(block, matchedData, function (a, b) {
    if (a instanceof Array) {
      return a.concat(b);
    }
    if (_.isObject(a)) {
      _recursiveMerge(a, b);
    }

    return a;
  });
}

/**
 * Exports
 */
module.exports = {
  preProcess: preProcess,
  postProcess: postProcess
};
