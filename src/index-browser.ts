import { within, prettyDOM } from "@testing-library/dom";
import {
  AsyncReturnValue,
  RenderOptions,
  Template,
  EventRecord,
  InternalEventNames,
  INTERNAL_EVENTS
} from "./shared";

const mountedComponents = new Set();

export * from "@testing-library/dom";
export { FireFunction, FireObject, fireEvent } from "./shared";

export type RenderResult = AsyncReturnValue<typeof render>;

export async function render<T extends Template>(
  template: T,
  input: Parameters<T["render"]>[0] = {},
  options: RenderOptions = {}
) {
  let isDefaultContainer = false;
  const {
    container = (isDefaultContainer = true) &&
      document.body.appendChild(document.createElement("div"))
  } = options;

  // Doesn't use promise API so that we can support Marko v3
  const renderResult = (await new Promise((resolve, reject) =>
    template.render(input, (err, result) =>
      err ? /* istanbul ignore next */ reject(err) : resolve(result)
    )
  )) as any;

  const isV4 = renderResult.getComponent;
  const instance = renderResult
    .appendTo(container)
    [isV4 ? "getComponent" : /* istanbul ignore next */ "getWidget"]();
  const eventRecord: EventRecord = {};
  mountedComponents.add({ container, instance, isDefaultContainer });

  const _emit = instance.emit;
  instance.emit = (...args: [string, ...unknown[]]) => {
    const [type] = args;

    if (!INTERNAL_EVENTS.includes(type as InternalEventNames)) {
      const userArgs = args.slice(1);
      (eventRecord["*"] || (eventRecord["*"] = [])).push({
        type,
        args: userArgs
      });
      (eventRecord[type] || (eventRecord[type] = [])).push(userArgs);
    }

    return _emit.apply(instance, args);
  };

  return {
    container,
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
    rerender(newInput?: typeof input): Promise<void> {
      return new Promise(resolve => {
        instance.once(
          isV4 ? "update" : /* istanbul ignore next */ "render",
          () => resolve()
        );

        if (newInput) {
          /* istanbul ignore else */
          if (instance.setProps) {
            instance.setProps(newInput);
          } else {
            instance.input = newInput;
          }
        } else {
          /* istanbul ignore else */
          if (instance.forceUpdate) {
            instance.forceUpdate();
          } else {
            instance.setStateDirty("__forceUpdate__");
          }
        }
      });
    },
    // eslint-disable-next-line no-console
    debug(el?: ParentNode) {
      if (el) {
        console.log(prettyDOM(el as HTMLElement));
      } else {
        console.log(
          ...[].map.call(container.children, (child: HTMLElement) =>
            prettyDOM(child)
          )
        );
      }
    },
    ...within((container as any) as HTMLElement)
  } as const;
}

export function cleanup() {
  mountedComponents.forEach(destroyComponent);
  resetComponentIdCounter();
}

function destroyComponent(component) {
  const { instance, container, isDefaultContainer } = component;

  instance.destroy();

  /* istanbul ignore else  */
  if (isDefaultContainer && container.parentNode === document.body) {
    document.body.removeChild(container);
  }

  mountedComponents.delete(container);
}

function resetComponentIdCounter() {
  const counter = (window as any).$MUID;
  if (counter) {
    counter.i = 0;
  }
}
