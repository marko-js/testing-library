---
type: bug
impact: med
effort: med
site: src/index.ts › render
---

# Parse a document-level template as a document instead of a fragment

The server `render()` builds its container with `JSDOM.fragment(html)`, and a fragment parse drops `<html>`, `<head>` and `<body>` and splices their children in at the top level. A template that is the document — a `@marko/run` `+layout.marko` is one, and the starter ships a test file next to it — therefore renders into a container where `querySelector("html")`, `("head")` and `("body")` are all null, so `lang`, `charset`, `viewport` and every other head assertion is unreachable; meanwhile `<title>` text joins the body text every text query reads, so `container.textContent` interleaves head and body and `getByText` matches the title. Nothing warns that the wrapper elements were discarded. Either parse as a document when the markup contains a document element, or add a documented flag to `RenderOptions` in `src/shared.ts`; the browser build mounts into a real container and is unaffected.

Check: add a `fixtures/` template of `<html lang="en"><head><meta charset="utf-8"><title>Roster</title></head><body><p>HELLO FROM BODY</p></body></html>` and render it in `src/__tests__/render.server.test.ts`; today `container.childNodes` is `META, TITLE, P`, `querySelector("html")` is null and `container.textContent` is `"RosterHELLO FROM BODY"`, and `<html lang="en">` should be assertable with the title text out of the body text.
