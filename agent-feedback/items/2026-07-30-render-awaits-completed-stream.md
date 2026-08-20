---
type: bug
impact: med
effort: med
site: src/index.ts › render
---

# Consume the first render chunk in `render()` instead of awaiting the completed stream

The Marko 6 branch does `String(await (template as any).render(input))`, and that await settles only once marko's `ServerRendered` boundary reaches `FlushStatus.complete`, so a `*.server.test.ts` can never observe an `<await>`/`<try>` placeholder or any intermediate streaming state. The HTML handed to `JSDOM.fragment` is always the fully drained output, and a fixture whose `load()` promise never settles hangs `render()` until vitest's timeout with no diagnostic. `toString()` is not an escape hatch: marko throws "Cannot consume asynchronous render with 'toString'" while the render is still pending. Nothing is needed from marko, since the object returned by `template.render(input)` already exposes `[Symbol.asyncIterator]()`, `pipe()`, and `toReadable()`, and a `for await` over a `<try><await>` fixture yields the `Loading...` placeholder in chunk one. Read the first chunk and stop, either as the default or behind a new flag on `RenderOptions` in `src/shared.ts`, leaving the Marko 3/4/5 callback branch untouched. CI does not cover this path: `devDependencies` pins `marko@^5.39.13` while `peerDependencies` allows `3 - 6`, so reproducing needs a Marko 6 install.

Check: add a `<try><await>` fixture under `src/__tests__/fixtures/` plus a case in `src/__tests__/render.server.test.ts` asserting the placeholder text, then `pnpm test`; the case sees only resolved content, or times out when the promise never settles.
