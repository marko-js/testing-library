import { render, fireEvent } from "..";
import Counter from "./fixtures/counter.marko";
import Clickable from "./fixtures/clickable.marko";
import HelloName from "./fixtures/hello-name.marko";

test("renders static content in a document without a browser context", async () => {
  const { getByText } = await render(Counter);
  expect(getByText("Value: 0")).toHaveProperty(
    ["ownerDocument", "defaultView"],
    null
  );
});

test("fails when rerendering", async () => {
  const { rerender } = await render(HelloName, { name: "Michael" });
  await expect(rerender({ name: "Dylan" })).rejects.toThrow(/cannot re-render/);
});

test("fails when checking emitted events", async () => {
  const { emitted } = await render(Clickable);
  expect(() => emitted("button-click")).toThrow(/should not emit events/);
});

test("fails when emitting events", async () => {
  const { getByText } = await render(Counter);
  expect(() => fireEvent.click(getByText("Increment"))).toThrow(
    /fireEvent currently supports/
  );
});
