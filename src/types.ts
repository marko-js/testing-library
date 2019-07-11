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
