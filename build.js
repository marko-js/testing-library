const fs = require("fs");
const path = require("path");
const { build } = require("esbuild");

(async () => {
  const entryPoints = [
    "src/dont-cleanup.ts",
    "src/index.ts",
    "src/index-browser.ts",
    "src/shared.ts",
  ];

  for (const format of ["cjs", "esm"]) {
    const outdir = path.join("dist", format);
    await fs.promises.rmdir(outdir, { recursive: true }).catch(() => {});
    await build({
      format,
      outdir,
      entryPoints,
      platform: "node",
      target: ["node14"],
    });
    await fs.promises.copyFile(
      "src/package.json",
      path.join(outdir, "package.json")
    );
  }
})().catch(() => process.exit(1));
