import { render, screen, fireEvent, cleanup, act, normalize } from "..";
import Counter from "./fixtures/counter.marko";
import SplitCounter from "./fixtures/split-counter.marko";
import LegacyCounter from "./fixtures/legacy-counter";
import Clickable from "./fixtures/clickable.marko";
import HelloName from "./fixtures/hello-name.marko";

test("renders static content in a document with a browser context", async () => {
  const { getByText, container } = await render(Counter);
  expect(
    expect(getByText("Value: 0")).toHaveProperty([
      "ownerDocument",
      "defaultView",
    ])
  ).not.toBeNull();

  expect(container.firstElementChild).toHaveAttribute("class", "counter");
});

test("normalizes a rendered containers content", async () => {
  const { container } = await render(Counter);
  expect(normalize(container)).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div
        class="counter"
      >
        Value: 0
        <button>
          Increment
        </button>
      </div>
    </DocumentFragment>
  `);
});

test("renders split component in the document", async () => {
  const { getByText } = await render(SplitCounter, { message: "Count" });
  expect(getByText(/0/)).toBeDefined();
  expect(getByText(/Count/)).toBeDefined();
});

test("renders static content from a Marko 3 component", async () => {
  const { getByText } = await render(LegacyCounter);
  expect(
    expect(getByText("Value: 0")).toHaveProperty([
      "ownerDocument",
      "defaultView",
    ])
  ).not.toBeNull();
});

test("global cleanup removes content from the document", async () => {
  await render(Counter);
  expect(screen.queryAllByText(/Value: 0/)).toHaveLength(1);
  cleanup();
  expect(screen.queryAllByText(/Value: 0/)).toHaveLength(0);
});

test("local cleanup removes single component from the document", async () => {
  const { cleanup } = await render(Counter);
  expect(screen.queryAllByText(/Value: 0/)).toHaveLength(1);
  cleanup();
  expect(screen.queryAllByText(/Value: 0/)).toHaveLength(0);
  expect(() => cleanup()).toThrowErrorMatchingSnapshot();
});

test("instance is undefined on the server", async () => {
  const result = await render(Clickable);
  expect(result.instance).toBeUndefined();
});

test("fails when rerendering", async () => {
  const { rerender } = await render(HelloName, { name: "Michael" });
  await expect(
    rerender({ name: "Dylan" })
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"Components cannot re-render on the server side."`
  );
});

test("fails when checking emitted events", async () => {
  const { emitted } = await render(Clickable);
  expect(() => emitted("button-click")).toThrowErrorMatchingInlineSnapshot(
    `"Components should not emit events on the server side."`
  );
});

test("fails when calling act", async () => {
  const { getByText } = await render(Counter);
  await expect(
    act(() => getByText("Increment").click())
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"Cannot perform client side interaction tests on the server side. Please use @marko/testing-library in a browser environment."`
  );
});

test("fails when emitting events", async () => {
  const { getByText } = await render(Counter);
  await expect(
    fireEvent.click(getByText("Increment"))
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"Cannot perform client side interaction tests on the server side. Please use @marko/testing-library in a browser environment."`
  );
});
