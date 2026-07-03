declare module "*.marko" {
  let x: any;
  export default x;
}

declare module "marko-widgets";

declare namespace Marko {
  // TODO: this project should use Marko 5 for the types on the cli
  // However this is not currently possible since it also needs to test
  // against the v3 compat layer in Marko 4.

  export interface Template<Input = unknown, Return = unknown> {}

  export type TemplateInput<T> = any;

  export type Input<T> = any;
}
