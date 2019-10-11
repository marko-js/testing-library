import { render, fireEvent } from "..";
import Counter from "./fixtures/counter.marko";
import LegacyCounter from "./fixtures/legacy-counter";
import Clickable from "./fixtures/clickable.marko";
import HelloName from "./fixtures/hello-name.marko";

test("renders static content in a document with a browser context", async () => {
  const { getByText } = await render(Counter);
  expect(
    expect(getByText("Value: 0")).toHaveProperty([
      "ownerDocument",
      "defaultView"
    ])
  ).not.toBeNull();
});

test("renders static content from a Marko 3 component", async () => {
  const { getByText } = await render(LegacyCounter);
  expect(
    expect(getByText("Value: 0")).toHaveProperty([
      "ownerDocument",
      "defaultView"
    ])
  ).not.toBeNull();
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
    `"Cannot fire events when testing on the server side. Please use @marko/testing-library in a browser environment."`
  );
});
