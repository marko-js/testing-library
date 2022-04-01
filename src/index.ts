import type {
  AsyncReturnValue,
  RenderOptions,
  Template,
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
import { autoCleanupEnabled } from "./shared";

export { FireFunction, FireObject, fireEvent, act } from "./shared";

export type RenderResult = AsyncReturnValue<typeof render>;

export const screen: typeof testingLibraryScreen = {} as any;

let activeContainer: DocumentFragment | undefined;

export async function render<T extends Template>(
  template: T | { default: T },
  input: Parameters<NonNullable<T["renderToString"]>>[0] = {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options?: RenderOptions
): Promise<
  BoundFunctions<typeof Queries> & {
    container: HTMLElement | DocumentFragment;
    instance: any;
    debug: typeof testingLibraryScreen["debug"];
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
  const renderMethod = template.renderToString ? "renderToString" : "render";
  const html = String(
    await new Promise((resolve, reject) =>
      (template as T)[renderMethod]!(input, (err, result) =>
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
    get instance(): any {
      throw new Error(
        "Cannot access component instance for server side tests."
      );
    },
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

if (autoCleanupEnabled && typeof afterEach === "function") {
  afterEach(cleanup);
}
