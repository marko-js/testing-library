import { within, prettyDOM } from "@testing-library/dom";
import {
  RenderOptions,
  Template,
  EventRecord,
  InternalEventNames,
  INTERNAL_EVENTS
} from "./types";

export * from "@testing-library/dom";

const mountedComponents = new Set();

export async function render<T extends Template>(
  template: T,
  input: Parameters<T["render"]>[0] = {},
  options: RenderOptions = {}
) {
  const {
    container = document.body.appendChild(document.createElement("div"))
  } = options;

  const result = await template.render(input);
  const component = result.appendTo(container).getComponent();
  const eventRecord: EventRecord = {};
  mountedComponents.add({ container, component });

  const _emit = component.emit;
  component.emit = (...args: [string, ...unknown[]]) => {
    const [type] = args;

    if (!INTERNAL_EVENTS.includes(type as InternalEventNames)) {
      const userArgs = args.slice(1);
      (eventRecord["*"] || (eventRecord["*"] = [])).push({
        type,
        args: userArgs
      });
      (eventRecord[type] || (eventRecord[type] = [])).push(userArgs);
    }

    return _emit.apply(component, args);
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
        component.once("update", () => resolve());

        if (newInput) {
          component.input = newInput;
        } else {
          component.forceUpdate();
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
  };
}

export function cleanup() {
  mountedComponents.forEach(destroyComponent);
}

function destroyComponent({ container, component }) {
  component.destroy();

  /* istanbul ignore else  */
  if (container.parentNode === document.body) {
    document.body.removeChild(container);
  }

  mountedComponents.delete(container);
}
