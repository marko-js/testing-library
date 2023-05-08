import type {
  AsyncReturnValue,
  RenderOptions,
  EventRecord,
  InternalEventNames,
} from "./shared";
import { JSDOM } from "jsdom";
import {
  within,
  logDOM,
  BoundFunctions,
  queries as Queries,
  screen as testingLibraryScreen,
} from "@testing-library/dom";

export { FireFunction, FireObject, fireEvent, act } from "./shared";

export type RenderResult = AsyncReturnValue<typeof render>;

export const screen: typeof testingLibraryScreen = {} as any;

let activeContainer: DocumentFragment | undefined;

export async function render<T extends Marko.Template>(
  template: T | { default: T },
  input: Marko.Input<T> = {} as any,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options?: RenderOptions
): Promise<
  BoundFunctions<typeof Queries> & {
    container: HTMLElement | DocumentFragment;
    instance: any;
    debug: (typeof testingLibraryScreen)["debug"];
    emitted<N extends string = "*">(
      type?: N extends InternalEventNames ? never : N
    ): NonNullable<EventRecord[N]>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rerender(newInput?: typeof input): Promise<void>;
    cleanup(): void;
  }
> {
  if (template && "default" in template) {
    template = template.default;
  }

  // Doesn't use promise API so that we can support Marko v3
  const renderMethod = (template as any).renderToString
    ? "renderToString"
    : "render";
  const html = String(
    await new Promise((resolve, reject) =>
      (template as any)[renderMethod]!(input, (err: any, result: any) =>
        err ? reject(err) : resolve(result)
      )
    )
  );

  const {
    window: { document },
  } = new JSDOM();
  const container = (activeContainer = document.importNode(
    JSDOM.fragment(html),
    true
  ));
  (container as any).outerHTML = html; // Fixes prettyDOM for container

  const queries = {
    debug: function debug(element, maxLength, options) {
      if (!element) {
        debug(Array.from(container.children), maxLength, options);
      } else if (Array.isArray(element)) {
        for (const child of element) {
          logDOM(child, maxLength, options);
        }
      } else {
        logDOM(element, maxLength, options);
      }
    },
    ...within(container as any as HTMLElement),
  } as typeof testingLibraryScreen;

  // For SSR tests screen is always references the last rendered component.
  Object.assign(screen, queries);

  return {
    container,
    instance: undefined as any,
    emitted<N extends string = "*">(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      type?: N extends InternalEventNames ? never : N
    ): NonNullable<EventRecord[N]> {
      throw new Error("Components should not emit events on the server side.");
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rerender(newInput?: typeof input): Promise<void> {
      return Promise.reject(
        new Error("Components cannot re-render on the server side.")
      );
    },
    cleanup() {
      if (activeContainer !== container) {
        throw new Error(
          "Component was already destroyed before cleanup called."
        );
      }

      cleanupComponent();
    },
    ...queries,
  } as const;
}

export function cleanup() {
  cleanupComponent();
}

function cleanupComponent() {
  if (activeContainer) {
    (activeContainer as any).outerHTML = "";
    while (activeContainer.firstChild) {
      activeContainer.removeChild(activeContainer.firstChild);
    }

    activeContainer = undefined;
  }
}

export * from "@testing-library/dom";

if (
  !(globalThis as any).___disable_marko_test_auto_cleanup___ &&
  typeof afterEach === "function"
) {
  afterEach(cleanup);
}
