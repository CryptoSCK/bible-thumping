// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // Possible Errors
      'no-console': 'warn',
      'no-unused-vars': 'error',

      // Best Practices
      'eqeqeq': ['error', 'always'],
      'no-duplicate-imports': 'error',

      // TypeScript-specific rules
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-types': 'error',

      // Formatting and Style
      'indent': ['error', 2],
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'max-len': ['warn', { code: 120 }],
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      '*.config.js',
      '**/*.test.ts',
      '**/*.spec.ts',
      '.git/',
      '.vscode/',
      '.idea/'
    ]
  }
);