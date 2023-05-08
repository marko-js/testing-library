import { build } from "esbuild";

const entryPoints = [
  "src/index.ts",
  "src/index-browser.ts"
];

Promise.all([
  runBuild({ format: "esm", outExtension: { ".js": ".mjs" } }),
  runBuild({ format: "cjs" })
]).catch(err => {
  console.error(err);
  process.exit(1);
});

function runBuild(opts) {
  return build({
    ...opts,
    entryPoints,
    outdir: "dist",
    platform: "node",
    target: ["node14"],
    bundle: true,
    splitting: false,
    plugins: [
      {
        name: "external-modules",
        setup(build) {
          build.onResolve(
            { filter: /^[^./]|^\.[^./]|^\.\.[^/]/ },
            ({ path }) => ({
              path,
              external: true,
            })
          );
        },
      },
    ],
  })
}