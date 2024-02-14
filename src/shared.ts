import type { EventType } from "@testing-library/dom";
import {
  fireEvent as originalFireEvent,
  FireFunction as originalFireFunction,
  FireObject as originalFireObject,
} from "@testing-library/dom";

export interface EventRecord {
  "*"?: Array<{ type: string; args: unknown[] }>;
  [x: string]: unknown[] | undefined;
}

export interface RenderOptions {
  container?: Element | DocumentFragment;
}

export const INTERNAL_EVENTS = [
  "create",
  "input",
  "render",
  "mount",
  "update",
  "destroy",
] as const;

export type InternalEventNames = (typeof INTERNAL_EVENTS)[number];

export type FireFunction = (
  ...params: Parameters<originalFireFunction>
) => Promise<ReturnType<originalFireFunction>>;

export type FireObject = {
  [K in EventType]: (
    ...params: Parameters<originalFireObject[keyof originalFireObject]>
  ) => Promise<ReturnType<originalFireFunction>>;
};

const SHOW_ELEMENT = 1;
const SHOW_COMMENT = 128;
const COMMENT_NODE = 8;

export function normalize<T extends DocumentFragment | Element>(container: T) {
  const idMap: Map<string, number> = new Map();
  const clone = container.cloneNode(true) as T;
  const document = container.ownerDocument!;
  const commentAndElementWalker = document.createTreeWalker(
    clone,
    SHOW_ELEMENT | SHOW_COMMENT
  );

  let node: Comment | Element;
  let nextNode = commentAndElementWalker.nextNode();
  while ((node = nextNode as Comment | Element)) {
    nextNode = commentAndElementWalker.nextNode();
    if (isComment(node)) {
      node.remove();
    } else {
      const { id, attributes } = node;
      if (/\d/.test(id)) {
        let idIndex = idMap.get(id);

        if (idIndex === undefined) {
          idIndex = idMap.size;
          idMap.set(id, idIndex);
        }

        node.id = `GENERATED-${idIndex}`;
      }

      for (let i = attributes.length; i--; ) {
        const attr = attributes[i];

        if (/^data-(w-|widget$|marko(-|$))/.test(attr.name)) {
          node.removeAttributeNode(attr);
        }
      }
    }
  }

  if (idMap.size) {
    const elementWalker = document.createTreeWalker(clone, SHOW_ELEMENT);

    nextNode = elementWalker.nextNode();
    while ((node = nextNode as Element)) {
      nextNode = elementWalker.nextNode();
      const { attributes } = node;

      for (let i = attributes.length; i--; ) {
        const attr = attributes[i];
        const { value } = attr;
        const updated = value
          .split(" ")
          .map((part) => {
            const idIndex = idMap.get(part);
            if (idIndex === undefined) {
              return part;
            }

            return `GENERATED-${idIndex}`;
          })
          .join(" ");

        if (value !== updated) {
          attr.value = updated;
        }
      }
    }
  }

  clone.normalize();

  return clone;
}

export async function act<T extends (...args: unknown[]) => unknown>(fn: T) {
  type Return = ReturnType<T>;
  if (typeof window === "undefined") {
    throw new Error(
      "Cannot perform client side interaction tests on the server side. Please use @marko/testing-library in a browser environment."
    );
  }

  const result = await fn();
  await waitForBatchedUpdates();
  return result as T extends (...args: unknown[]) => Promise<unknown>
    ? AsyncReturnValue<T>
    : Return;
}

export const fireEvent = ((...params) =>
  act(() => originalFireEvent(...params))) as FireFunction & FireObject;

(Object.keys(originalFireEvent) as EventType[]).forEach(
  (eventName: EventType) => {
    const fire = originalFireEvent[eventName];
    fireEvent[eventName] = (...params) => act(() => fire(...params));
  }
);

export type AsyncReturnValue<
  AsyncFunction extends (...args: any) => Promise<any>
> = Parameters<
  NonNullable<Parameters<ReturnType<AsyncFunction>["then"]>[0]>
>[0];

type Callback = (...args: unknown[]) => void;
const tick =
  // Re-implements the same scheduler Marko 4/5 is using internally.
  typeof window === "object" && typeof window.postMessage === "function"
    ? (() => {
        let queue: Callback[] = [];
        const id = `${Math.random()}`;
        window.addEventListener("message", ({ data }) => {
          if (data === id) {
            const callbacks = queue;
            queue = [];
            for (const cb of callbacks) {
              cb();
            }
          }
        });

        return (cb: Callback) => {
          if (queue.push(cb) === 1) {
            window.postMessage(id, "*");
          }
        };
      })()
    : (cb: Callback) => setTimeout(cb, 0);

function waitForBatchedUpdates() {
  return new Promise(tick);
}

function isComment(node: Node): node is Comment {
  return node.nodeType === COMMENT_NODE;
}
