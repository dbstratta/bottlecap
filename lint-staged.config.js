module.exports = {
  '*.json': ['prettier --write', 'git add'],
  '*.{js,jsx,ts,tsx}': ['prettier --write', 'tslint --fix', 'git add'],
};
