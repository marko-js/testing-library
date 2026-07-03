import { defineConfig } from "rolldown";

export default defineConfig({
  platform: "node",
  input: {
    index: "src/index.ts",
    "index-browser": "src/index-browser.ts",
  },
  external: [/^[^./]/],
  output: [
    {
      format: "cjs",
      dir: "dist",
      entryFileNames: "[name].js",
      chunkFileNames: "[name].js",
      minify: "dce-only",
      sourcemap: false,
    },
    {
      format: "esm",
      dir: "dist",
      entryFileNames: "[name].mjs",
      chunkFileNames: "[name].mjs",
      minify: "dce-only",
      sourcemap: false,
    },
  ],
});
