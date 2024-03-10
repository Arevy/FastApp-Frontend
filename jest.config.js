/** @type {import('jest').Config} */
const config = {
  transform: {
    "\\.[jt]sx?$": "babel-jest",
    "\\.css$": "some-css-transformer",
  },
  setupFilesAfterEnv: ["src/jest.setup.js"],
};

module.exports = config;
