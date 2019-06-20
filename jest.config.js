module.exports = {
  projects: [
    project("browser", {
      browser: true
    }),
    project("server", {
      testEnvironment: "node"
    })
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};

function project(displayName, config) {
  return {
    ...config,
    displayName,
    preset: "@marko/jest",
    testRegex: `/__tests__/([^.]+\\.)?${displayName}\\.ts$`,
    transform: {
      "\\.ts$": "ts-jest"
    },
    coveragePathIgnorePatterns: ["/__tests__/"]
  };
}
