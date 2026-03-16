import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      eqeqeq: ['error', 'always'],
    },
  },
  {
    files: ['apps/live-presence/src/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: {
        Bun: 'readonly',
      },
    },
  },
  {
    ignores: [
      'dist',
      'node_modules',
      '.next',
      'out',
      'build',
      '**/*.config.js',
      '**/*.config.ts',
      '.husky',
      '.lintstagedrc.js',
      '.commitlintrc.js',
    ],
  },
];
