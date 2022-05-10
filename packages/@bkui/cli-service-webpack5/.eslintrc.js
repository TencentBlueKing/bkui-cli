module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [
      'tsconfig.json',
    ],
  },
  extends: ['@bktest/eslint-config-bk/ts'],
  ignorePatterns: ['.eslintrc.js', 'bin/index.js'],
  overrides: [
    {
      files: ['*.js', '*.ts'],
      rules: {
        'no-param-reassign': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/explicit-member-accessibility': 'off',
      },
    },
  ],
};
