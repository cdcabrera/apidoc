import { node, jest, globals } from '@cdcabrera/eslint-config-toolkit';

export default [
  {
    files: ['bin/!(*.*)']
  },
  {
    ignores: ['example/**/*', '**/vendor/**/*', 'test/**/*']
  },
  ...node,
  ...jest,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jquery
      }
    },
    rules: {
      'consistent-return': 0,
      'func-names': 0,
      'no-param-reassign': 0,
      'import/no-dynamic-require': 0,
      'import/no-unresolved': 0,
      'n/no-process-exit': 0,
      'n/no-unpublished-require': 0
    }
  }
];
