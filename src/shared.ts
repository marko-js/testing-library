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

export interface Template {
  renderToString?(
    input: unknown,
    cb: (err: Error | null, result: any) => void
  ): any;
  render(input: unknown, cb: (err: Error | null, result: any) => void): any;
}

export let autoCleanupEnabled = true;
export function disableAutoCleanup() {
  autoCleanupEnabled = false;
}

export const INTERNAL_EVENTS = [
  "create",
  "input",
  "render",
  "mount",
  "update",
  "destroy",
] as const;

export type InternalEventNames = typeof INTERNAL_EVENTS[number];

export type FireFunction = (
  ...params: Parameters<originalFireFunction>
) => Promise<ReturnType<originalFireFunction>>;

export type FireObject = {
  [K in EventType]: (
    ...params: Parameters<originalFireObject[keyof originalFireObject]>
  ) => Promise<ReturnType<originalFireFunction>>;
};

export const fireEvent = (async (...params) => {
  failIfNoWindow();
  const result = originalFireEvent(...params);
  await waitForBatchedUpdates();
  return result;
}) as FireFunction & FireObject;

(Object.keys(originalFireEvent) as EventType[]).forEach(
  (eventName: EventType) => {
    const fire = originalFireEvent[eventName];
    fireEvent[eventName] = async (...params) => {
      failIfNoWindow();
      const result = fire(...params);

      await waitForBatchedUpdates();
      return result;
    };
  }
);

export type AsyncReturnValue<
  AsyncFunction extends (...args: any) => Promise<any>
> = Parameters<
  NonNullable<Parameters<ReturnType<AsyncFunction>["then"]>[0]>
>[0];

function failIfNoWindow() {
  if (typeof window === "undefined") {
    throw new Error(
      "Cannot fire events when testing on the server side. Please use @marko/testing-library in a browser environment."
    );
  }
}

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
