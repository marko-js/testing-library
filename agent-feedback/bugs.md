# Suspected Bugs

Out-of-scope defects noticed while working on something else. Format and rules: [README.md](README.md).

## Consume the first render chunk in `render()` instead of awaiting the completed stream

`src/index.ts` › `render` | 2026-07-30 | impact:med | effort:med

The Marko 6 branch does `String(await (template as any).render(input))`, and that await settles only once marko's `ServerRendered` boundary reaches `FlushStatus.complete`, so `*.server.test.ts` can never observe an `<await>`/`<try>` placeholder or any intermediate streaming state — the HTML handed to `JSDOM.fragment` is always the fully drained output, and a fixture whose `load()` promise never settles hangs `render()` until vitest's timeout with no diagnostic. `toString()` is not an escape hatch: marko throws "Cannot consume asynchronous render with 'toString'" while the render is still pending. Nothing is needed from marko — the object returned by `template.render(input)` already exposes `[Symbol.asyncIterator]()`, `pipe()` and `toReadable()`, and a `for await` over a `<try><await>` fixture yields the `Loading…` placeholder in chunk one — so the fix is local: read the first chunk and stop, either as the default or behind a new flag on `RenderOptions` in `src/shared.ts`, leaving the Marko 3/4/5 callback branch untouched. Note CI does not cover this path today: `devDependencies` pins `marko@^5.39.13` while `peerDependencies` allows `3 - 6`, so reproducing needs a Marko 6 install. Re-verify by adding a `<try><await>` fixture under `src/__tests__/fixtures/` plus a case in `src/__tests__/render.server.test.ts` asserting the placeholder text, then running `pnpm test` — today that case sees only resolved content, or times out when the promise never settles.
