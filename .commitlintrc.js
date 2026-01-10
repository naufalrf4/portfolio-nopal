module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation only changes
        'style', // Code style changes (formatting, etc.)
        'refactor', // Code refactoring
        'perf', // Performance improvements
        'test', // Adding or updating tests
        'build', // Build system or dependencies
        'ci', // CI configuration changes
        'chore', // Other changes (maintenance)
        'revert', // Revert a previous commit
      ],
    ],
    'scope-enum': [
      2,
      'always',
      [
        'public', // Public portfolio app
        'admin', // Admin dashboard app
        'links', // Links hub app
        'ngl', // NGL anonymous feedback app
        'rag', // RAG chatbot service
        'ui', // Shared UI package
        'types', // Shared types package
        'sdk', // SDK package
        'config', // Config package
        'auth', // Auth package
        'infra', // Infrastructure (monorepo, docker, etc.)
        'deps', // Dependency updates
      ],
    ],
    'subject-case': [2, 'never', ['upper-case', 'pascal-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-empty': [2, 'never'],
  },
};
