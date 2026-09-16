export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // triggers a minor release
        'fix', // triggers a patch release
        'perf', // triggers a patch release
        'docs',
        'test',
        'ci',
        'chore',
        'refactor',
        'style',
        'revert',
        'build',
      ],
    ],

    // release-monorepo-semantically matches a commit to a package by comparing
    // the scope against the package.json `name` exactly, so feat/fix/perf
    // commits must use the full package name to release that package.
    'scope-enum': [
      2,
      'always',
      [
        '@ibabkin/openapi-to-server-interface',
        '@ibabkin/openapi-to-request-validator',
        '@ibabkin/openapi-express-server',

        'templates',
        'release',
        'deps',
        'config',
        'github',
        'linter',
      ],
    ],
    'scope-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-max-length': [2, 'always', 100],
  },
};
