---
type: bug
impact: med
effort: low
site: src/index-browser.ts › cleanup
---

# Read `___disable_marko_test_auto_cleanup___` when cleanup runs, not when the module is evaluated

`dont-cleanup-after-each/index.js` only sets `globalThis.___disable_marko_test_auto_cleanup___`, and the trailing block of both `src/index-browser.ts` and `src/index.ts` reads that flag once, at module evaluation, to decide whether to register `afterEach(cleanup)`. ES modules evaluate in source order, so the opt-out works only when its import is written above `@marko/testing-library` — and the natural order, `import { render } from "@marko/testing-library"` first, silently does nothing: components are still removed between tests and no message says why. The README shows the import on its own, so nothing warns the reader that position is load-bearing, and an import sorter can flip the behaviour of an untouched test file. Register the hook unconditionally and read the flag inside the callback, so it can arrive any time before the first test, or throw when it is set after registration.

Check: two `*.browser.test.ts` files that each render `fixtures/hello-world.marko` in the first test and count `document.body.querySelectorAll("div")` in the second, one importing `../../dont-cleanup-after-each/index.js` above `../index-browser` and one below; today the second test logs 2 divs in the first file and 0 in the second with no message either way, and both should log 2.
