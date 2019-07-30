import { render, fireEvent } from "..";
import Counter from "./fixtures/counter.marko";
import LegacyCounter from "./fixtures/legacy-counter";
import Clickable from "./fixtures/clickable.marko";
import HelloName from "./fixtures/hello-name.marko";

test("renders static content in a document without a browser context", async () => {
  const { getByText } = await render(Counter);
  expect(getByText("Value: 0")).toHaveProperty(
    ["ownerDocument", "defaultView"],
    null
  );
});

test("renders static content from a Marko 3 component", async () => {
  const { getByText } = await render(LegacyCounter);
  expect(getByText("Value: 0")).toHaveProperty(
    ["ownerDocument", "defaultView"],
    null
  );
});

test("fails when rerendering", async () => {
  const { rerender } = await render(HelloName, { name: "Michael" });
  await expect(
    rerender({ name: "Dylan" })
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"Components cannot re-render on the server side"`
  );
});

test("fails when checking emitted events", async () => {
  const { emitted } = await render(Clickable);
  expect(() => emitted("button-click")).toThrowErrorMatchingInlineSnapshot(
    `"Components should not emit events on the server side"`
  );
});

test("fails when emitting events", async () => {
  const { getByText } = await render(Counter);
  await expect(
    fireEvent.click(getByText("Increment"))
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"Unable to find the \\"window\\" object for the given node. fireEvent currently supports firing events on DOM nodes, document, and window. Please file an issue with the code that's causing you to see this error: https://github.com/testing-library/dom-testing-library/issues/new"`
  );
});
