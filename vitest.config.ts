import marko from "@marko/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [marko()],
  test: {
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "istanbul",
      include: ["src/**/*.ts"],
      exclude: ["src/**/__tests__/**"],
      reporter: ["text-summary", "lcov"],
    },
    projects: [
      {
        extends: true,
        test: {
          name: "server",
          environment: "node",
          include: ["src/**/__tests__/*.server.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "browser",
          environment: "jsdom",
          include: ["src/**/__tests__/*.browser.test.ts"],
        },
      },
    ],
  },
});
