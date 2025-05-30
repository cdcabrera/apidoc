import { join } from 'node:path';
import globals from 'globals';
import { includeIgnoreFile } from '@eslint/compat';
import eslintPluginJs from '@eslint/js';
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
      ecmaVersion: 2021
    },
    rules: {
      'comma-dangle': 0,
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
