module.exports = {
    transform: {
      '^.+\\.[t|j]sx?$': 'babel-jest',
    },
    moduleNameMapper: {
      '^.+\\.(jpg|jpeg|png|gif|webp|svg|css|scss)$': 'jest-transform-stub' // Add 'scss' here
    },
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ["<rootDir>/node_modules/"]
  };
  