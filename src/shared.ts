import {
  fireEvent as originalFireEvent,
  wait,
  EventType,
  FireFunction as originalFireFunction,
  FireObject as originalFireObject
} from "@testing-library/dom";

export interface EventRecord {
  "*"?: Array<{ type: string; args: unknown[] }>;
  [x: string]: unknown[] | undefined;
}

export interface RenderOptions {
  container?: Element | DocumentFragment;
}

export interface Template {
  renderToString(
    input: unknown,
    cb: (err: Error | null, result: any) => void
  ): any;
  render(input: unknown, cb: (err: Error | null, result: any) => void): any;
}

export const INTERNAL_EVENTS = [
  "create",
  "input",
  "render",
  "mount",
  "update",
  "destroy"
] as const;

export type InternalEventNames = typeof INTERNAL_EVENTS[number];

export type FireFunction = (
  ...params: Parameters<originalFireFunction>
) => Promise<void>;

export type FireObject = {
  [K in EventType]: (
    ...params: Parameters<originalFireObject[keyof originalFireObject]>
  ) => Promise<void>;
};

export const fireEvent = (async (...params) => {
  failIfNoWindow();
  originalFireEvent(...params);
  await wait();
}) as FireFunction & FireObject;

Object.keys(originalFireEvent).forEach((eventName: EventType) => {
  const fire = originalFireEvent[eventName];
  fireEvent[eventName] = async (...params) => {
    failIfNoWindow();
    fire(...params);

    // TODO: this waits for a possible update using setTimeout(0) which should
    // be sufficient, but ideally we would hook into the Marko lifecycle to
    // determine when all pending updates are complete.
    await wait();
  };
});

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
