module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.pegjs$": "pegjs-jest",
  },
  setupFiles: ["<rootDir>/src/__setup__/testSetup.ts"],
};
