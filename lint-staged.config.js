module.exports = {
  '*.json': ['prettier --write', 'git add'],
  '*.{js,jsx}': ['prettier-eslint --write', 'git add'],
  '*.{ts,tsx}': ['prettier --write', 'tslint --fix', 'git add'],
};
