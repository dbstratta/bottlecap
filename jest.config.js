module.exports = {
  collectCoverage: process.env.CI,
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  setupFiles: ['./src/jest.setup.ts'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
};
