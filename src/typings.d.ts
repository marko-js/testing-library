declare module "*.marko" {
  let x: any;
  export default x;
}

declare namespace Marko {
  // TODO: this project should use Marko 5 for the types on the cli
  // However this is not currently possible since it also needs to test
  // against the v3 compat layer in Marko 4.

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Template<Input = unknown, Return = unknown> {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export type TemplateInput<T> = any;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export type Input<T> = any;
}
