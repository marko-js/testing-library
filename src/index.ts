import { JSDOM } from "jsdom";
import { within, prettyDOM } from "@testing-library/dom";
import {
  RenderOptions,
  Template,
  EventRecord,
  InternalEventNames
} from "./types";

export * from "@testing-library/dom";

export async function render<T extends Template>(
  template: T,
  input: Parameters<T["renderToString"]>[0] = {},
  options?: RenderOptions
) {
  // Doesn't use promise API so that we can support Marko v3
  const html = String(
    await new Promise((resolve, reject) =>
      template.renderToString(input, (err, result) =>
        err ? reject(err) : resolve(result)
      )
    )
  );
  const container = JSDOM.fragment(html);
  (container as any).outerHTML = html; // Fixes prettyDOM for container

  return {
    container,
    emitted<N extends string = "*">(
      type?: N extends InternalEventNames ? never : N
    ): NonNullable<EventRecord[N]> {
      throw new Error("Component's should not emit events on the server side");
    },
    rerender(newInput?: typeof input): Promise<void> {
      return Promise.reject(
        new Error("Component's cannot re-render on the server side")
      );
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

/* istanbul ignore next: There is no cleanup for SSR. */
export function cleanup() {}
