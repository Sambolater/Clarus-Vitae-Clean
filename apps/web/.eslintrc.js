module.exports = {
  root: true,
  extends: ['../../packages/config/eslint/nextjs.js'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
