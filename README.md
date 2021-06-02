<div align="center">
  <!-- Logo -->
  <a href="https://www.joypixels.com/emoji/1f986">
    <img
      height="80"
      width="80"
      alt="duck"
      src="https://raw.githubusercontent.com/marko-js/testing-library/master/assets/duck.png"
    />
  </a>
  <br/>
  <h1>@marko/testing-library</h1>
  <p>Simple and complete Marko testing utilities that encourage good testing practices.</p>

  <!-- CI -->
  <a href="https://travis-ci.org/marko-js/testing-library">
  <img src="https://img.shields.io/travis/marko-js/testing-library.svg" alt="Build status"/>
  </a>
  <!-- Coverage -->
  <a href="https://codecov.io/gh/marko-js/testing-library">
    <img src="https://codecov.io/gh/marko-js/testing-library/branch/master/graph/badge.svg?token=LirxYQjltb" alt="Test Coverage"/>
  </a>
  <!-- Language -->
  <a href="http://typescriptlang.org">
    <img src="https://img.shields.io/badge/%3C%2F%3E-typescript-blue.svg" alt="TypeScript"/>
  </a>
  <!-- Format -->
  <a href="https://github.com/prettier/prettier">
    <img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg" alt="Styled with prettier"/>
  </a>
  <!-- NPM Version -->
  <a href="https://npmjs.org/package/@marko/testing-library">
    <img src="https://img.shields.io/npm/v/@marko/testing-library.svg" alt="NPM Version"/>
  </a>
  <!-- Downloads -->
  <a href="https://npmjs.org/package/@marko/testing-library">
    <img src="https://img.shields.io/npm/dm/@marko/testing-library.svg" alt="Downloads"/>
  </a>
</div>

## Table of Contents

- [**Read The Docs**](https://testing-library.com/docs/marko-testing-library/intro) | [Edit the docs](https://github.com/testing-library/testing-library-docs)
- [The problem](#the-problem)
- [This solution](#this-solution)
- [Installation](#installation)
- [API](#api)
- [Setup](#setup)
- [Guiding Principles](#guiding-principles)
- [Docs](#docs)
- [Code of Conduct](#code-of-conduct)

## The problem

You want to write maintainable tests for your Marko components. As a part of
this goal, you want your tests to avoid including implementation details of your
components and rather focus on making your tests give you the confidence for
which they are intended. As part of this, you want your testbase to be
maintainable in the long run so refactors of your components (changes to
implementation but not functionality) don't break your tests and slow you and
your team down.

## This solution

The `@marko/testing-library` is a very lightweight solution for testing Marko
components. It provides light utility functions on top of [`@testing-library/dom`](https://github.com/testing-library/dom-testing-library) in a way that encourages better testing practices. Its primary guiding principle is:

> [The more your tests resemble the way your software is used, the more confidence they can give you.](#guiding-principles)

## Installation

```console
npm install --save-dev @marko/testing-library
```

You may also be interested in installing `jest-dom` so you can use
[the custom jest matchers](https://github.com/testing-library/jest-dom#readme). Or if using another test runner like [mocha](https://mochajs.org) you could check out [`chai-dom`](https://www.chaijs.com/plugins/chai-dom/).

## API

Marko testing library exposes all of the same utilities for [querying the dom](https://testing-library.com/docs/dom-testing-library/api-queries), [firing events](https://testing-library.com/docs/dom-testing-library/api-events) and [testing asynchronous behavior](https://testing-library.com/docs/dom-testing-library/api-async) as [@testing-library/dom](https://github.com/testing-library/dom-testing-library). This module only exposes two additional APIs to make testing against your components easier.

### `render(template, input?, { container }?)`

This funcition renders your template asynchronously and provides you with [query helpers](https://testing-library.com/docs/dom-testing-library/api-queries) that are scoped to output DOM.

```javascript
import { render, screen } from "@marko/testing-library";
import HelloTemplate from "./src/__test__/fixtures/hello-name.marko";

test("contains the text", async () => {
  const { rerender } = await render(HelloTemplate, {
    name: "World",
  });

  // Will find the element within the rendered result from the template.
  expect(screen.getByText("Hello World")).toBeInTheDocument();

  // You can also rerender the component if needed.
  await rerender({ name: "Marko" });

  expect(screen.getByText("Hello Marko")).toBeInTheDocument();
});
```

The render result will also provide you with a `container` HTMLElement. This acts as an escape hatch and allows you to test your components going against the [guiding principles](#guiding-principles). With the `container` you can grab any element using `querySelector` or other means that mean nothing to your users.

```javascript
test("not a great test", async () => {
  const { container } = await render(HelloTemplate, { name: "World" });

  expect(container.querySelector("div")).toBeInTheDocument();
});
```

The problem with the above test is that your user does not care about or see that there is a `div` element, the user only see's the text content of the div. Maybe it turns out that a div wasn't the best element and we should switch to an h1? Now your tests are broken, even though there is likely no perceptable change to the user.

### `cleanup()`

With client side tests your components are rendered into a placeholder HTMLElement.
You can call `cleanup` at any time to destroy any attached components and remove them from the DOM.

```javascript
import { cleanup, screen } from "@marko/testing-library";
import HelloTemplate from "./src/__test__/fixtures/hello-name.marko";

test("contains the text", async () => {
  await render(HelloTemplate, { name: "World" });

  expect(screen.getByText("Hello World")).toBeInTheDocument();

  cleanup();

  expect(screen.queryByText("Hello Marko")).toBeNull();
});
```

By default if your testing framework exposes an `afterEach` hook (such as `jest` and `mocha`) then `cleanup` will be automatically invoked after each of your tests run.

If you'd like to disable the automatic cleanup behavior described above you can import `@marko/testing-library/dont-cleanup-after-each`.

```javascript
import "@marko/testing-library/dont-cleanup-after-each";
```

With mocha you can use `mocha -r @marko/testing-library/dont-cleanup-after-each` as a shorthand.

If you are using Jest, you can include `setupFilesAfterEnv: ["@marko/testing-library/dont-cleanup-after-each"]` in your Jest config to avoid doing this in each file.

## Setup

Marko testing library is not dependent on any test runner, however it is dependent on the test environment. These utilities work for testing both server side, and client side Marko templates and provide a slightly different implementation for each. This is done using a [browser shim](https://github.com/defunctzombie/package-browser-field-spec), just like in Marko.

The [browser shim](https://github.com/defunctzombie/package-browser-field-spec) is picked up by many tools, including all bundlers and some test runners.

Below is some example configurations to test both server and browser components with some popular test runners.

### [Jest](http://jestjs.io)

For Jest to understand Marko templates you must first [install the @marko/jest preset](https://github.com/marko-js/jest#installation). This allows your Marko templates to be imported into your tests.

To test components rendered in the client side, be sure to use the `@marko/jest/preset/browser` jest preset and you are good to go!

**jest.config.js**

```javascript
module.exports = {
  preset: "@marko/jest/preset/browser",
};
```

If you'd like to test components using server side rendering you can instead use the `@marko/jest/preset/node` jest preset.

**jest.config.js**

```javascript
module.exports = {
  preset: "@marko/jest/preset/node",
};
```

A Jest configuration can also have multiple [projects](https://jestjs.io/docs/en/configuration#projects-array-string-projectconfig) which we can use to create a combined configuration for server side tests, and browser side tests, like so:

**jest.config.js**

```javascript
module.exports = {
  projects: [
    {
      displayName: "server",
      preset: "@marko/jest/preset/node",
      testRegex: "/__tests__/[^.]+\\.server\\.js$",
    },
    {
      displayName: "browser",
      preset: "@marko/jest/preset/browser",
      testRegex: "/__tests__/[^.]+\\.browser\\.js$",
    },
  ],
};
```

### [Mocha](https://mochajs.org)

Mocha also works great for testing Marko components. Mocha, however, has no understanding of [browser shims](https://github.com/defunctzombie/package-browser-field-spec) which means out of the box it can only work with server side Marko components.

To run server side Marko tests with `mocha` you can simply run the following command:

```console
mocha -r marko/node-require
```

This enables the [Marko require hook](https://markojs.com/docs/installing/#require-marko-views) and allows you to require server side Marko templates directly in your tests.

For client side testing of your components with Mocha often you will use a bundler to build your tests (this will properly resolve the browser shims mentioned above) and then you can load these tests in some kind of browser context.

## Guiding Principles

> [The more your tests resemble the way your software is used, the more
> confidence they can give you.][https://testing-library.com/docs/guiding-principles]

We try to only expose methods and utilities that encourage you to write tests
that closely resemble how your Marko components are used.

Utilities are included in this project based on the following guiding
principles:

1.  If it relates to rendering components, then it should deal with DOM nodes
    rather than component instances, and it should not encourage dealing with
    component instances.
2.  It should be generally useful for testing the application components in the
    way the user would use it. We _are_ making some trade-offs here because
    we're using a computer and often a simulated browser environment, but in
    general, utilities should encourage tests that use the components the way
    they're intended to be used.
3.  Utility implementations and APIs should be simple and flexible.

At the end of the day, what we want is for this library to be pretty
light-weight, simple, and understandable.

## Docs

[**Read The Docs**](https://testing-library.com/docs/marko-testing-library/intro) |
[Edit the docs](https://github.com/testing-library/testing-library-docs)

## Code of Conduct

This project adheres to the [eBay Code of Conduct](./.github/CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.
