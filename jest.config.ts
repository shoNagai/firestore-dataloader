module.exports = {
  name: "test",
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  preset: "ts-jest",
  testMatch: ["<rootDir>/**/__tests__/**/*.ts?(x)"],
  cacheDirectory: "./.jest-cache",
  maxWorkers: 1,
  testPathIgnorePatterns: ["/node_modules/", "<rootDir>/build/"],
  transform: {
    "\\.(jsx?|tsx?|ts?)$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js"],
  moduleDirectories: ["node_modules", "<rootDir>./"],
  testEnvironment: "node",
};
