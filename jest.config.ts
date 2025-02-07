export default {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { isolatedModules: true }],
    "^.+\\.js$": "babel-jest",
  },
  testEnvironment: "node",
  moduleFileExtensions: ["js", "ts"],
  collectCoverage: true, // Enable coverage collection
  collectCoverageFrom: [
    "src/**/*.{ts,tsx,js,jsx}", // Specify the files for coverage
    "!src/**/*.d.ts", // Exclude declaration files
  ],
  coverageDirectory: "coverage", // Directory to output coverage reports,
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  }
};
