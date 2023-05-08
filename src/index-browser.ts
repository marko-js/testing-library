import type {
  RenderOptions,
  Template,
  EventRecord,
  InternalEventNames,
  AsyncReturnValue,
} from "./shared";
import { within, logDOM, PrettyDOMOptions } from "@testing-library/dom";
import { autoCleanupEnabled, INTERNAL_EVENTS } from "./shared";

interface MountedComponent {
  container: Element | DocumentFragment;
  instance: any;
  isDefaultContainer: boolean;
}
const mountedComponents = new Set<MountedComponent>();

export { FireFunction, FireObject, fireEvent, act } from "./shared";

export type RenderResult = AsyncReturnValue<typeof render>;

export async function render<T extends Template>(
  template: T | { default: T },
  input: Parameters<T["render"]>[0] = {},
  options: RenderOptions = {}
) {
  if (template && "default" in template) {
    template = template.default;
  }

  let isDefaultContainer = false;
  const {
    container = (isDefaultContainer = true) &&
      document.body.appendChild(document.createElement("div")),
  } = options;

  // Doesn't use promise API so that we can support Marko v3
  const renderResult = (await new Promise((resolve, reject) =>
    (template as T).render(input, (err, result) =>
      err ? reject(err) : resolve(result)
    )
  )) as any;

  const isV4 = renderResult.getComponent;
  const instance = renderResult
    .appendTo(container)
    [isV4 ? "getComponent" : "getWidget"]();
  const eventRecord: EventRecord = {};
  const mountedComponent: MountedComponent = {
    container,
    instance,
    isDefaultContainer,
  };
  mountedComponents.add(mountedComponent);

  const _emit = instance.emit;
  instance.emit = (...args: [string, ...unknown[]]) => {
    const [type] = args;

    if (!INTERNAL_EVENTS.includes(type as InternalEventNames)) {
      const userArgs = args.slice(1);
      (eventRecord["*"] || (eventRecord["*"] = [])).push({
        type,
        args: userArgs,
      });
      (eventRecord[type] || (eventRecord[type] = [])).push(userArgs);
    }

    return _emit.apply(instance, args);
  };

  return {
    container,
    instance,
    emitted<N extends string = "*">(
      type?: N extends InternalEventNames ? never : N
    ) {
      if (INTERNAL_EVENTS.includes(type as InternalEventNames)) {
        throw new Error(
          "The emitted helper cannot be used to listen to internal events."
        );
      }

      const events = eventRecord[type || "*"];
      const copy = events ? events.slice() : [];

      if (events) {
        events.length = 0;
      }

      return copy as NonNullable<EventRecord[N]>;
    },
    waitForEmitted(type = "*", options?: { timeout?: number }) {
      if (INTERNAL_EVENTS.includes(type as InternalEventNames)) {
        throw new Error(`Cannot wait for the internal "${type}" event.`);
      }

      const events = eventRecord[type];
      if (events?.length) {
        return Promise.resolve(events.pop());
      }

      return new Promise<unknown>((resolve, reject) => {
        const timeout = options?.timeout ?? 1000;

        if (timeout > 0) {
          const pass = () => {
            instance.removeListener(type, pass);
            clearTimeout(timeoutId);
            resolve(eventRecord[type]!.pop());
          };
          const fail = () => {
            const err = new Error(`Timed out waiting for "${type}" event.`);
            err.name = "TimeoutError";
            instance.removeListener(type, pass);
            reject(err);
          };

          const timeoutId = setTimeout(fail, timeout);
          instance.on(type, pass);
        } else {
          instance.once(type, () => resolve(eventRecord[type]!.pop()));
        }
      });
    },
    rerender(newInput?: typeof input): Promise<void> {
      return new Promise((resolve) => {
        instance.once(isV4 ? "update" : "render", () => resolve());

        if (newInput) {
          if (instance.setProps) {
            instance.setProps(newInput);
          } else {
            instance.input = newInput;
          }
        } else {
          if (instance.forceUpdate) {
            instance.forceUpdate();
          } else {
            instance.setStateDirty("__forceUpdate__");
          }
        }
      });
    },
    cleanup() {
      if (!mountedComponents.has(mountedComponent)) {
        throw new Error(
          "Component was already destroyed before cleanup called."
        );
      }
      cleanupComponent(mountedComponent);
    },
    debug: function debug(
      element?: Element | HTMLDocument | (Element | HTMLDocument)[] | undefined,
      maxLength?: number,
      options?: PrettyDOMOptions
    ) {
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
  } as const;
}

export function cleanup() {
  mountedComponents.forEach(cleanupComponent);

  // reset internal Marko component id count
  const counter = (window as any).$MUID;
  if (counter) {
    counter.i = 0;
  }
}

function cleanupComponent(mountedComponent: MountedComponent) {
  const { instance, container, isDefaultContainer } = mountedComponent;
  instance.destroy();

  if (isDefaultContainer && container.parentNode === document.body) {
    document.body.removeChild(container);
  }

  mountedComponents.delete(mountedComponent);
}

export * from "@testing-library/dom";

if (autoCleanupEnabled && typeof afterEach === "function") {
  afterEach(cleanup);
}
