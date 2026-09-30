module.exports = {
  root: true, // stop ESLint from using the React Native config in the parent folder
  env: {node: true, es2022: true},
  extends: ['eslint:recommended'],
  parserOptions: {ecmaVersion: 2022, sourceType: 'script'},
};