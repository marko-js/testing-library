---
type: bug
impact: high
effort: low
site: src/index-browser.ts › render
---

# Reclaim the default container when a `render()` throws

The default container is created and appended to `document.body` in the destructuring default of `options`, but the `MountedComponent` record is only added to `mountedComponents` after the mount (`template.mount()` on Marko 6, `renderResult.appendTo()` on 3-5) returns. A render that throws therefore rejects with its container already in the document and no record, so neither `cleanup()` nor the automatic `afterEach(cleanup)` — both of which iterate `mountedComponents` — can reclaim it, and the markup stays in `document.body` for the rest of the file. The next, unrelated test still resolves `screen.queryByText(...)` against it, which is the most expensive shape a test-infrastructure bug takes: the failure appears somewhere the reader has no reason to suspect, and error-path tests are exactly where it bites. Add the record before mounting, or wrap the mount so a throw removes a default container and rethrows.

Check: add a `fixtures/` component whose `onMount` throws and a `src/__tests__/render.browser.test.ts` pair where test A does `try { await render(Thrower) } catch {}` and test B asserts `document.body.innerHTML` is empty; today B sees `<div><div>LEAKED TEXT</div></div>` and a truthy `screen.queryByText("LEAKED TEXT")`, and it should see an empty body.
