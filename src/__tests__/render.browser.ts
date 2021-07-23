import { render, fireEvent, screen, cleanup, act } from "..";
import Counter from "./fixtures/counter.marko";
import LegacyCounter from "./fixtures/legacy-counter";
import UpdateCounter from "./fixtures/update-counter.marko";
import HelloWorld from "./fixtures/hello-world.marko";
import HelloName from "./fixtures/hello-name.marko";
import Clickable from "./fixtures/clickable.marko";
import ScopedId from "./fixtures/scoped-id.marko";

test("renders interactive content in the document", async () => {
  const { getByText } = await render(Counter);
  expect(getByText(/Value: 0/)).toBeInTheDocument();
  expect(screen.getByText(/Value: 0/)).toBeInTheDocument();

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

  expect(emitted("button-click")).toMatchSnapshot();

  expect(emitted().map(({ type }) => type)).toMatchSnapshot();

  await fireEvent.click(button);

  expect(emitted("button-click")).toMatchSnapshot();
  expect(emitted().map(({ type }) => type)).toMatchSnapshot();
});

test("errors when trying to record internal events", async () => {
  const { emitted } = await render(Clickable);
  expect(() => emitted("mount" as string)).toThrowErrorMatchingSnapshot();
});

test("global cleanup removes content from the document", async () => {
  const component = await render(Counter);
  const node = component.getByText(/Value: 0/);
  expect(node).toBeInTheDocument();
  expect(screen.getByText(/Value: 0/)).toEqual(node);
  cleanup();
  expect(node).not.toBeInTheDocument();
});

test("local cleanup removes single component from the document", async () => {
  const componentA = await render(Counter);
  expect(screen.queryAllByText(/Value: 0/)).toHaveLength(1);
  const componentB = await render(Counter);
  expect(screen.queryAllByText(/Value: 0/)).toHaveLength(2);

  componentA.cleanup();
  expect(screen.queryAllByText(/Value: 0/)).toHaveLength(1);

  componentB.cleanup();
  expect(screen.queryAllByText(/Value: 0/)).toHaveLength(0);
});

test("local cleanup fails if component already cleaned up", async () => {
  const componentA = await render(Counter);
  const componentB = await render(Counter);
  expect(screen.getAllByText(/Value: 0/)).toHaveLength(2);

  componentA.cleanup();
  expect(() => componentA.cleanup()).toThrowErrorMatchingSnapshot();

  cleanup();
  expect(() => componentB.cleanup()).toThrowErrorMatchingSnapshot();
});

test("can render into a different container", async () => {
  const container = document.createElement("main");
  const { getByText } = await render(HelloWorld, null, { container });
  expect(getByText("Hello World")).toHaveProperty("parentNode", container);
});

test("act waits for pending updates", async () => {
  const { getByText } = await render(Counter);
  expect(getByText(/Value: 0/)).toBeInTheDocument();

  await act(() => getByText("Increment").click());
  expect(getByText("Value: 1")).toBeInTheDocument();
});

test("fireEvent waits for pending updates", async () => {
  const { getByText } = await render(Counter);
  expect(getByText(/Value: 0/)).toBeInTheDocument();

  await fireEvent(
    getByText("Increment"),
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    })
  );

  expect(getByText("Value: 1")).toBeInTheDocument();
});

test("it renders a stable scoped id", async () => {
  const r1 = await render(ScopedId);
  expect(r1.getByRole("main")).toHaveProperty("id", "c0-test");
  cleanup();
  const r2 = await render(ScopedId);
  expect(r2.getByRole("main")).toHaveProperty("id", "c0-test");
});
