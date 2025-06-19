import { join } from 'node:path';
import globals from 'globals';
import { includeIgnoreFile } from '@eslint/compat';
import eslintPluginJs from '@eslint/js';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import importPlugin from 'eslint-plugin-import';
import nodePlugin from 'eslint-plugin-n';
import prettierPlugin from 'eslint-plugin-prettier/recommended';

export default [
  {
    files: ['bin/!(*.*)']
  },
  includeIgnoreFile(join(process.cwd(), '.gitignore')),
  {
    ignores: ['example/**/*', '**/vendor/**/*', 'test/**/*']
  },
  jsdocPlugin.configs['flat/recommended'],
  nodePlugin.configs['flat/recommended'],
  eslintPluginJs.configs.recommended,
  importPlugin.flatConfigs.recommended,
  prettierPlugin,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jquery
      },
      ecmaVersion: 2022
    },
    rules: {
      'comma-dangle': 0,
      'jsdoc/require-jsdoc': 2,
      'jsdoc/require-param': 2,
      'jsdoc/require-param-description': 0,
      'jsdoc/require-param-name': 2,
      'jsdoc/require-param-type': 2,
      'jsdoc/require-property': 2,
      'jsdoc/require-property-description': 0,
      'jsdoc/require-property-name': 2,
      'jsdoc/require-property-type': 2,
      'jsdoc/require-returns': 2,
      'jsdoc/require-returns-description': 0,
      'jsdoc/require-returns-type': 2,
      'jsdoc/tag-lines': [
        'warn',
        'always',
        {
          count: 0,
          applyToEndTag: false,
          startLines: 1
        }
      ],
      'n/no-process-exit': 0,
      'n/no-unpublished-bin': 0,
      'n/no-unpublished-require': 0,
      'n/no-unsupported-features/node-builtins': 1,
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-unused-vars': ['error', { caughtErrors: 'none' }],
      'prettier/prettier': [
        'error',
        {
          arrowParens: 'avoid',
          singleQuote: true,
          trailingComma: 'none',
          printWidth: 120
        }
      ],
      semi: ['error', 'always']
    }
  }
];
