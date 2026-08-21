---
type: bug
impact: med
effort: low
site: src/index-browser.ts › render
---

# Mint a distinct `$global.renderId` per Marko 6 `render()` so two renders in one test do not collide

The Marko 6 branch calls `(template as any).mount(input, container)` with no `$global`, and `mount` in marko's `packages/runtime-tags/src/dom/template.ts` then defaults `runtimeId`/`renderId` to `DEFAULT_RUNTIME_ID`/`DEFAULT_RENDER_ID` on every call, so every `render()` in a test restarts the same scope-id namespace. Two renders of a tag that uses `<id/x>` therefore emit the same `id` into the same document, and the duplicate `id` makes `label.control` resolve to the first render's element, so the second result's `getByLabelText` throws "Found a label with the text of: X, however the element associated with this label is non-labellable" even though `container` is a separate node. A component library then cannot assert the ordinary "two instances mint different ids" case at all. The Marko 3/4/5 branch does not have this hole because marko increments `window.$MUID` per render and `cleanup` resets it, which is why the existing "it renders a stable scoped id" case in `src/__tests__/render.browser.test.ts` only needs stability across `cleanup()`. Merging a per-render `$global: { renderId }` into `input` fixes it, and `renderId` rather than `runtimeId` keeps the resume/compat namespace alone. CI does not cover this path: `devDependencies` pins `marko@^5.39.13` while `peerDependencies` allows `3 - 6`, so reproducing needs a Marko 6 install.

Check: add a fixture using `<id/controlId>` with a `<label for=controlId>`/`<input id=controlId>` pair, then a `src/__tests__/render.browser.test.ts` case that renders it twice without an intervening `cleanup()` and asserts the two `container.querySelector("input").id` values differ; today both are `cM_2` and the second `getByLabelText` throws, and after the fix they differ and both queries resolve inside their own container.
