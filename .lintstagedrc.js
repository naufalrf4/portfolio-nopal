module.exports = {
  // TypeScript and JavaScript files
  '**/*.{ts,tsx,js,jsx}': ['eslint --fix', 'prettier --write'],

  // JSON, YAML, Markdown files
  '**/*.{json,yaml,yml,md}': ['prettier --write'],

  // CSS files
  '**/*.{css,scss}': ['prettier --write'],
};
