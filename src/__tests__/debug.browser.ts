import "@testing-library/jest-dom/extend-expect";
import { render, cleanup } from "..";
import HelloWorld from "./fixtures/hello-world.marko";

beforeEach(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  (console.log as any).mockRestore();
});

test("debug pretty prints the component content as html", async () => {
  const { debug } = await render(HelloWorld);
  debug();
  expect(console.log).toHaveBeenCalledTimes(1);
  expect(console.log).toHaveBeenCalledWith(
    expect.stringContaining("Hello World")
  );
});

test("when passed an html element, will print it's content as html instead", async () => {
  const { debug } = await render(HelloWorld);
  const exampleNode = document.createElement("span");
  exampleNode.innerHTML = "Example Debug";
  debug(exampleNode);
  expect(console.log).toHaveBeenCalledTimes(1);
  expect(console.log).toHaveBeenCalledWith(
    expect.stringContaining("Example Debug")
  );
});
