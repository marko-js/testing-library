---
type: bug
impact: high
effort: low
site: src/index.ts › render
---

# Give the server render's JSDOM a real URL so a failing assertion prints its diff

`render()` builds its document with `new JSDOM()`, whose URL defaults to `about:blank`, an opaque origin. Any failing `expect()` in a node-environment test whose expected or received value contains a rendered node makes the runner serialize that node for the diff; the walk reaches `ownerDocument.defaultView.localStorage`, which throws `SecurityError: localStorage is not available for opaque origins`, and that error replaces the entire report — no expected/received, no code frame, no file and line, and several failures in one file collapse into a single `SecurityError` line. Every server-side assertion about the DOM is affected (`toBe`, `toEqual`, `toHaveLength` all reproduce), so the one moment a test suite is supposed to explain itself is the moment it says nothing, and finding a wrong number costs a rewrite-and-rerun loop. `new JSDOM("", { url: "http://localhost" })` restores the ordinary diff and leaves the existing suite green.

Check: add a case to `src/__tests__/render.server.test.ts` that renders `fixtures/counter.marko` and asserts `expect(getByText("Value: 0")).toBe(null)`; today the run prints only `SecurityError: localStorage is not available for opaque origins`, and it should print the `- Expected null` / `+ Received <div class="counter">` diff with the failing line.
