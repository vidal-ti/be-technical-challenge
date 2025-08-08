// .eslintrc.cjs
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    // Si quieres reglas con información de tipos (más precisas) descomenta project:
    // project: ['./tsconfig.json']
  },
  env: {
    node: true,
    es2022: true,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended' // integra Prettier con ESLint
  ],
  rules: {
    // Tus reglas personalizadas:
    'prettier/prettier': ['error'],
    'no-console': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off'
  }
};
