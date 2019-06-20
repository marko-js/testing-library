export interface EventRecord {
  "*"?: Array<{ type: string; args: unknown[] }>;
  [x: string]: unknown[] | undefined;
}

export interface RenderOptions {
  container?: Element | DocumentFragment;
}

export interface Template {
  render(input: unknown): Promise<any>;
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
