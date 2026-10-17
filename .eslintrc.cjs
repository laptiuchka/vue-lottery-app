module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: ['boundaries'],
  settings: {
    'boundaries/elements': [
      { type: 'app', pattern: 'src/app/*' },
      { type: 'pages', pattern: 'src/pages/*' },
      { type: 'widgets', pattern: 'src/widgets/*' },
      { type: 'features', pattern: 'src/features/*' },
      { type: 'entities', pattern: 'src/entities/*' },
      { type: 'shared', pattern: 'src/shared/*' },
    ],
    'boundaries/ignore': ['**/*.spec.ts', '**/*.test.ts'],
  },
  rules: {
    'boundaries/dependencies': [
      2,
      {
        default: 'disallow',
        policies: [
          {
            from: { element: { type: 'app' } },
            allow: [
              { to: { element: { type: 'pages' } } },
              { to: { element: { type: 'widgets' } } },
              { to: { element: { type: 'features' } } },
              { to: { element: { type: 'entities' } } },
              { to: { element: { type: 'shared' } } },
            ],
          },
          {
            from: { element: { type: 'pages' } },
            allow: [
              { to: { element: { type: 'widgets' } } },
              { to: { element: { type: 'features' } } },
              { to: { element: { type: 'entities' } } },
              { to: { element: { type: 'shared' } } },
            ],
          },
          {
            from: { element: { type: 'widgets' } },
            allow: [
              { to: { element: { type: 'features' } } },
              { to: { element: { type: 'entities' } } },
              { to: { element: { type: 'shared' } } },
            ],
          },
          {
            from: { element: { type: 'features' } },
            allow: [
              { to: { element: { type: 'entities' } } },
              { to: { element: { type: 'shared' } } },
            ],
          },
          {
            from: { element: { type: 'entities' } },
            allow: [{ to: { element: { type: 'shared' } } }],
          },
          {
            from: { element: { type: 'shared' } },
            allow: [{ to: { element: { type: 'shared' } } }],
          },
        ],
      },
    ],
  },
}