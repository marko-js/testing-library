module.exports = {
  projects: [
    project("browser", {
      preset: "@marko/jest/preset/browser",
    }),
    project("server", {
      preset: "@marko/jest/preset/node",
    }),
  ],
};

function project(displayName, config) {
  return {
    ...config,
    displayName,
    coveragePathIgnorePatterns: ["/__tests__/"],
    setupFilesAfterEnv: ["<rootDir>/jest-setup.js"],
    testRegex: `/__tests__/([^.]+\\.)?${displayName}\\.ts$`,
    transform: { "\\.ts$": ["esbuild-jest", { sourcemap: true }] },
  };
}
