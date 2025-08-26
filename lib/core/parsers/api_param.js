const unindent = require('../utils/unindent');

let group = '';
const parents = {};

/**
 * Grouped regular expressions used for parsing and validating specific patterns.
 *
 * Search: group, type, optional, fieldname, defaultValue, size, description
 * Example: {String{1..4}} [user.name='John Doe'] Users fullname.
 *
 * Naming convention:
 *     b -> begin
 *     e -> end
 *     name -> the field value
 *     oName -> wrapper for optional field
 *     wName -> wrapper for field
 *
 * @type {{
 *     b: string,
 *     oGroup: {b: string, group: string, e: string},
 *     oType: {
 *         b: string,
 *         type: string,
 *         oSize: {b: string, size: string, e: string},
 *         oAllowedValues: {b: string, possibleValues: string, e: string},
 *         e: string
 *     },
 *     wName: {
 *         b: string,
 *         name: string,
 *         withArray: string,
 *         oDefaultValue: {b: string, withDoubleQuote: string, withQuote: string, withoutQuote: string, e: string},
 *         e: string
 *     },
 *     description: string,
 *     e: string}}
 * @property {string} b - A string representing the start of the pattern (`^`).
 * @property {object} oGroup - Optional group configuration.
 * @property {string} oGroup.b - Starting part of the optional group that includes '(' with optional surrounding spaces.
 * @property {string} oGroup.group - Captures the group content (`1`).
 * @property {string} oGroup.e - Ending part of the optional group that includes ')' with optional surrounding spaces.
 * @property {object} oType - Optional type configuration.
 * @property {string} oType.b - Starting part of the optional type that includes '{' with optional surrounding spaces.
 * @property {string} oType.type - Captures the type value, including alphanumeric characters, symbols, or specific patterns (`2`).
 * @property {object} oType.oSize - Optional size within the type configuration.
 * @property {string} oType.oSize.b - Starting part of the optional size, denoted by '{' with optional surrounding spaces.
 * @property {string} oType.oSize.size - Captures the size value (`3`).
 * @property {string} oType.oSize.e - Ending part of the optional size that includes '}' with optional surrounding spaces.
 * @property {object} oType.oAllowedValues - Optional allowed values within the type configuration.
 * @property {string} oType.oAllowedValues.b - Starting part of the optional allowed values, denoted by '=' with optional surrounding spaces.
 * @property {string} oType.oAllowedValues.possibleValues - Captures possible values (`4`).
 * @property {string} oType.oAllowedValues.e - Ending part of the optional allowed values, ensuring it closes within '}' and has optional surrounding spaces.
 * @property {string} oType.e - Ending part of the optional type configuration, includes '}' with optional surrounding spaces.
 * @property {object} wName - Configuration for capturing names (including optional markers and array formats).
 * @property {string} wName.b - Starting part of the name, which can include optional markers (`[`) with optional surrounding spaces.
 * @property {string} wName.name - Captures the name, which can include alphanumeric characters, symbols, or markers (`6`).
 * @property {string} wName.withArray - Captures optional array specifications within the name configuration.
 * @property {object} wName.oDefaultValue - Optional configuration for capturing default values.
 * @property {string} wName.oDefaultValue.b - Starting part of the default value, prefixed with '=' and optional surrounding spaces.
 * @property {string} wName.oDefaultValue.withDoubleQuote - Captures the default value enclosed in double quotes (`7`).
 * @property {string} wName.oDefaultValue.withQuote - Captures the default value enclosed in single quotes (`8`).
 * @property {string} wName.oDefaultValue.withoutQuote - Captures the default value without quotes, allowing various content (`9`).
 * @property {string} wName.oDefaultValue.e - Ending part of the default value configuration.
 * @property {string} wName.e - Ending part of the name configuration, including optional surrounding spaces and `]`.
 * @property {string} description - Captures optional descriptions following the parsed patterns (`10`).
 * @property {string} e - Matches the end of the pattern (`$|@`).
 */
const regExp = {
  b: '^', // start
  oGroup: {
    // optional group: (404)
    b: '\\s*(?:\\(\\s*', // starting with '(', optional surrounding spaces
    group: '(.+?)', // 1
    e: '\\s*\\)\\s*)?' // ending with ')', optional surrounding spaces
  },
  oType: {
    // optional type: {string}
    b: '\\s*(?:\\{\\s*', // starting with '{', optional surrounding spaces
    type: '([a-zA-Z0-9()#:\\.\\/\\\\\\[\\]_|-]+)', // 2
    oSize: {
      // optional size within type: {string{1..4}}
      b: '\\s*(?:\\{\\s*', // starting with '{', optional surrounding spaces
      size: '(.+?)', // 3
      e: '\\s*\\}\\s*)?' // ending with '}', optional surrounding spaces
    },
    oAllowedValues: {
      // optional allowed values within type: {string='abc','def'}
      b: '\\s*(?:=\\s*', // starting with '=', optional surrounding spaces
      possibleValues: '(.+?)', // 4
      e: '(?=\\s*\\}\\s*))?' // ending with '}', optional surrounding spaces
    },
    e: '\\s*\\}\\s*)?' // ending with '}', optional surrounding spaces
  },
  wName: {
    b: '(\\[?\\s*', // 5 optional optional-marker
    name: '([#@a-zA-Z0-9\\$\\:\\.\\/\\\\_-]+', // 6
    withArray: '(?:\\[[a-zA-Z0-9\\.\\/\\\\_-]*\\])?)', // https://github.com/apidoc/apidoc-core/pull/4
    oDefaultValue: {
      // optional defaultValue
      b: '(?:\\s*=\\s*(?:', // starting with '=', optional surrounding spaces
      withDoubleQuote: '"([^"]*)"', // 7
      withQuote: "|'([^']*)'", // 8
      withoutQuote: '|(.*?)(?:\\s|\\]|$)', // 9
      e: '))?'
    },
    e: '\\s*\\]?\\s*)'
  },
  description: '(.*)?', // 10
  e: '$|@'
};

/**
 * Flatten all string values within an object, and nested objects, into a single concatenated string.
 *
 * @param {object} obj - The input object whose string values need to be concatenated.
 * @returns {string}
 * @private
 */
function _objectValuesToString(obj) {
  let str = '';

  for (const el in obj) {
    if (typeof obj[el] === 'string') {
      str += obj[el];
    } else {
      str += _objectValuesToString(obj[el]);
    }
  }

  return str;
}

/**
 * Retrieve the parent node object of a given field by traversing the field string
 * to find a matching path in the parent object.
 *
 * @param {string} field - The string representing the field path to search for a parent node.
 * @returns {{ path: string }|undefined}
 * @private
 */
function _getParentNode(field) {
  let i = field.length;

  while (i--) {
    if (field.charAt(i) === '.') {
      const path = field.substring(0, i);
      const parentNode = parents[path];

      if (parentNode) {
        return Object.assign({ path: path }, parentNode);
      }
    }
  }
}

const parseRegExp = new RegExp(_objectValuesToString(regExp));

const allowedValuesWithDoubleQuoteRegExp = /"[^"]*[^"]"/g;
const allowedValuesWithQuoteRegExp = /'[^']*[^']'/g;
const allowedValuesRegExp = /[^,\s]+/g;

/**
 * Parse to extract API param
 *
 * @param {string} content Raw input string to be parsed. May contain line breaks and metadata formatted in a predefined syntax.
 * @param {string} source - UNUSED
 * @param {string} defaultGroup - Name to use if no group is identified in the content.
 * @returns {{
 *     group: string,
 *     type: string,
 *     size: string,
 *     allowedValues: string,
 *     optional: boolean,
 *     parentNode: *,
 *     field: string,
 *     isArray: boolean,
 *     defaultValue: string,
 *     description: string}|null} Parsed metadata
 */
function parse(content, source, defaultGroup) {
  content = content.trim();

  // replace Linebreak with Unicode
  content = content.replace(/\n/g, '\uffff');

  const matches = parseRegExp.exec(content);

  if (!matches) {
    return null;
  }

  // reverse Unicode Linebreaks
  matches.forEach(function (val, index, array) {
    if (val) {
      array[index] = val.replace(/\uffff/g, '\n');
    }
  });

  let allowedValues = matches[4];

  if (allowedValues) {
    let regExp;

    if (allowedValues.charAt(0) === '"') {
      regExp = allowedValuesWithDoubleQuoteRegExp;
    } else if (allowedValues.charAt(0) === "'") {
      regExp = allowedValuesWithQuoteRegExp;
    } else {
      regExp = allowedValuesRegExp;
    }

    let allowedValuesMatch;
    const list = [];

    while ((allowedValuesMatch = regExp.exec(allowedValues))) {
      list.push(allowedValuesMatch[0]);
    }
    allowedValues = list;
  }

  // Set global group variable
  group = matches[1] || defaultGroup || 'Parameter';

  const type = matches[2];
  const field = matches[6];
  const parentNode = _getParentNode(field);
  const isArray = Boolean(type && type.indexOf('[]') !== -1);

  // store the parent to assign it to its children later
  if (type && type.indexOf('Object') !== -1) {
    parents[field] = { parentNode, field, type, isArray };
  }

  return {
    group: group,
    type: type,
    size: matches[3],
    allowedValues: allowedValues,
    optional: Boolean(matches[5] && matches[5][0] === '['),
    parentNode: parentNode,
    field: field,
    isArray: isArray,
    defaultValue: matches[7] || matches[8] || matches[9],
    description: unindent(matches[10] || '')
  };
}

/**
 * Construct and return a string representing a structured path for parameter fields
 * based on a group retrieved from the API parser.
 *
 * @returns {string}
 */
function path() {
  return 'local.parameter.fields.' + getGroup();
}

/**
 * Retrieve the current group.
 *
 * @returns {string}
 */
function getGroup() {
  return group;
}

/**
 * Exports
 */
module.exports = {
  parse: parse,
  path: path,
  method: 'push',
  getGroup: getGroup,
  markdownFields: ['description', 'type'],
  markdownRemovePTags: ['type']
};
