import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent, wait, cleanup } from "..";
import Counter from "./fixtures/counter.marko";
import LegacyCounter from "./fixtures/legacy-counter";
import UpdateCounter from "./fixtures/update-counter.marko";
import HelloWorld from "./fixtures/hello-world.marko";
import HelloName from "./fixtures/hello-name.marko";
import Clickable from "./fixtures/clickable.marko";

afterEach(cleanup);

test("renders interactive content in the document", async () => {
  const { getByText } = await render(Counter);
  expect(getByText(/Value: 0/)).toBeInTheDocument();

  await fireEvent.click(getByText("Increment"));

  expect(getByText("Value: 1")).toBeInTheDocument();
});

test("renders interactive content in the document with Marko 3", async () => {
  const { getByText } = await render(LegacyCounter);
  expect(getByText(/Value: 0/)).toBeInTheDocument();

  await fireEvent.click(getByText("Increment"));

  expect(getByText("Value: 1")).toBeInTheDocument();
});

test("can be rerendered with new input", async () => {
  const { getByText, rerender } = await render(HelloName, { name: "Michael" });

  expect(getByText(/Hello \w+/)).toHaveProperty(
    "textContent",
    expect.stringContaining("Michael")
  );

  await rerender({ name: "Dylan" });

  expect(getByText(/Hello \w+/)).toHaveProperty(
    "textContent",
    expect.stringContaining("Dylan")
  );
});

test("can be rerendered with no input (forced update)", async () => {
  const { getByText, rerender } = await render(UpdateCounter);

  expect(getByText(/Render Count: \d+/)).toHaveProperty(
    "textContent",
    expect.stringContaining("Render Count: 1")
  );

  await rerender();

  expect(getByText(/Render Count: \d+/)).toHaveProperty(
    "textContent",
    expect.stringContaining("Render Count: 2")
  );
});

test("records user events", async () => {
  const { getByText, emitted } = await render(Clickable);
  const button = getByText("Click");

  await fireEvent.click(button);
  await fireEvent.click(button);

  expect(emitted("unknown-event")).toHaveProperty("length", 0);

  expect(emitted("button-click")).toMatchInlineSnapshot(`
        Array [
          Array [
            Object {
              "count": 0,
            },
          ],
          Array [
            Object {
              "count": 1,
            },
          ],
        ]
    `);

  expect(emitted().map(({ type }) => type)).toMatchInlineSnapshot(`
            Array [
              "button-click",
              "button-click",
            ]
      `);

  await fireEvent.click(button);

  expect(emitted("button-click")).toMatchInlineSnapshot(`
        Array [
          Array [
            Object {
              "count": 2,
            },
          ],
        ]
    `);
  expect(emitted().map(({ type }) => type)).toMatchInlineSnapshot(`
            Array [
              "button-click",
            ]
      `);
});

test("errors when trying to record internal events", async () => {
  const { emitted } = await render(Clickable);
  expect(() => emitted("mount" as string)).toThrowErrorMatchingInlineSnapshot(
    `"The emitted helper cannot be used to listen to internal events."`
  );
});

test("cleanup removes content from the document", async () => {
  const { getByText } = await render(Counter);
  const node = getByText(/Value: 0/);
  expect(node).toBeInTheDocument();
  cleanup();
  expect(node).not.toBeInTheDocument();
});

test("can render into a different container", async () => {
  const container = document.createElement("main");
  const { getByText } = await render(HelloWorld, null, { container });
  expect(getByText("Hello World")).toHaveProperty("parentNode", container);
});
