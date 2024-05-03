/** @type {import('jest').Config} */
const config = {
  transform: {
    // "\\.[jt]sx?$": "babel-jest",
    // "\\.css$": "some-css-transformer",
    '\\.[jt]sx?$': 'babel-jest',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['./src/jest.setup.js'],
};

module.exports = config;
