const jsonfile = require('jsonfile');

let packageJSONData: {
  dependencies: { [x: string]: string };
  devDependencies: { [x: string]: string };
};

describe('package.json file', () => {
  beforeAll(() => {
    const file = './package.json';
    packageJSONData = jsonfile.readFileSync(file);
  });

  test('Should have all dependencies with semver version fixed or caret versioning', () => {
    if (packageJSONData.dependencies) {
      const validPattern = /^(\^?\d+\.\d+\.\d+)/; // Allow versions like 1.0.0 or ^1.0.0
      const regex = RegExp(validPattern);

      let allDependenciesAreFixed = true;
      for (let key in packageJSONData.dependencies) {
        if (!regex.test(packageJSONData.dependencies[key])) {
          allDependenciesAreFixed = false;
          break; // Break early if any dependency does not match the pattern
        }
      }

      expect(allDependenciesAreFixed).toBe(true);
    }
  });

  test('Should have all devDependencies with semver version fixed or caret versioning', () => {
    if (packageJSONData.devDependencies) {
      const validPattern = /^(\^?\d+\.\d+\.\d+)/; // Allow versions like 1.0.0 or ^1.0.0
      const regex = RegExp(validPattern);

      let allDevDependenciesAreFixed = true;
      for (let key in packageJSONData.devDependencies) {
        if (!regex.test(packageJSONData.devDependencies[key])) {
          allDevDependenciesAreFixed = false;
          break; // Break early if any devDependency does not match the pattern
        }
      }

      expect(allDevDependenciesAreFixed).toBe(true);
    }
  });
});
