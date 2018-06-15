module.exports = {
  root: true,
  parser: "typescript-eslint-parser",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },

  plugins: ["typescript"],

  env: {
    es6: true
  },

  extends: ["eslint:recommended", "airbnb-base"],

  rules: {
    "import/no-named-as-default": "off",
    "import/no-extraneous-dependencies": "off"
  }
};
