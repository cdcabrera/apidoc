import { join } from 'node:path';
import globals from 'globals';
import stylisticJsPlugin from '@stylistic/eslint-plugin';
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
  stylisticJsPlugin.configs.all,
  nodePlugin.configs['flat/recommended'],
  importPlugin.flatConfigs.recommended,
  eslintPluginJs.configs.recommended,
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
      'arrow-parens': ['error', 'as-needed'],
      'comma-dangle': 0,
      'consistent-return': 1,
      'max-len': [
        'error',
        {
          code: 240,
          ignoreUrls: true
        }
      ],
      'n/no-process-exit': 0,
      'n/shebang': 0,
      'n/no-unpublished-bin': 0,
      'n/no-unpublished-require': 0,
      'n/no-unsupported-features/es-syntax': 1,
      'n/no-unsupported-features/node-builtins': 1,
      'no-console': 0,
      'no-debugger': 1,
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-plusplus': 0,
      'no-unused-vars': ['error', { caughtErrors: 'none' }],
      'no-var': 2,
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
