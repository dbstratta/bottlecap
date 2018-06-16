module.exports = {
  singleQuote: true,
  trailingComas: 'all',
  overrides: [
    {
      files: '*.json',
      options: { trailingComas: 'none' },
    },
  ],
};
