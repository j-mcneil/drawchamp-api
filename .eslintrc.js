module.exports = {
  root: true,
  extends: ['plugin:prettier/recommended'],
  plugins: ['import'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      // use <root>/path/to/folder/tsconfig.json
      typescript: {
        project: './',
      },
    },
  },
  rules: {
    'prettier/prettier': ['warn', {}, { usePrettierrc: true }],
    'import/no-unresolved': 'error',
  },

  overrides: [
    {
      files: ['*.js'],
      parser: 'espree',
    },
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser', // the TypeScript parser we installed earlier
      extends: [
        'plugin:@typescript-eslint/eslint-recommended', // eslint TypeScript rules (github.com/typescript-eslint/typescript-eslint)
        'plugin:@typescript-eslint/recommended',

        // Prettier plugin and recommended rules
        'prettier',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
      ],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': ['off'],
        '@typescript-eslint/no-explicit-any': ['off'],
        'import/order': [
          'error',
          {
            groups: ['builtin', 'external', 'internal'],
            'newlines-between': 'always',
            alphabetize: {
              order: 'asc',
              caseInsensitive: true,
            },
          },
        ],
      },
    },
  ],

  env: {
    node: true,
    es6: true,
  },
};
