module.exports = {
  projects: [
    project("browser", {
      preset: "@marko/jest/preset/browser",
    }),
    project("server", {
      preset: "@marko/jest/preset/node",
    }),
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};

function project(displayName, config) {
  return {
    ...config,
    displayName,
    testRegex: `/__tests__/([^.]+\\.)?${displayName}\\.ts$`,
    transform: {
      "\\.ts$": "ts-jest",
    },
    coveragePathIgnorePatterns: ["/__tests__/"],
  };
}
