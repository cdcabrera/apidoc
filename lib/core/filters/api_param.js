/**
 * API param post filter for parsed results.
 *
 * Filters out duplicate fields in the provided parsed file objects based on the specified tagName.
 * This happens when overwriting a global inherited field with a local definition.
 *
 * @param {Array<object>} parsedFiles - Array of parsed file objects to process. Each parsed file object contains blocks of data.
 * @param {Array<string>} filenames - UNUSED, an array of filenames corresponding to the parsed files. Not used directly in the filtering process.
 * @param {string} [tagName] - Tag name to target. Defaults to 'parameter' if not specified.
 */
function postFilter(parsedFiles, filenames, tagName) {
  tagName = tagName || 'parameter';

  parsedFiles.forEach(function (parsedFile) {
    parsedFile.forEach(function (block) {
      if (block.local[tagName] && block.local[tagName].fields) {
        const blockFields = block.local[tagName].fields;
        Object.keys(blockFields).forEach(function (blockFieldKey) {
          const fields = block.local[tagName].fields[blockFieldKey];
          const newFields = [];
          const existingKeys = {};
          fields.forEach(function (field) {
            const key = field.field; // .field (=id) is the key to check if it exists twice
            if (!existingKeys[key]) {
              existingKeys[key] = 1;
              newFields.push(field);
            }
          });
          block.local[tagName].fields[blockFieldKey] = newFields;
        });
      }
    });
  });
}

/**
 * Exports
 */
module.exports = {
  postFilter: postFilter
};
