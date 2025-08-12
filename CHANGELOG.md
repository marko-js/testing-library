# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [6.4.0](https://github.com/marko-js/testing-library/compare/v6.3.1...v6.4.0) (2025-08-12)


### Features

* strip marko generated scripts when normalizing ([e7a444f](https://github.com/marko-js/testing-library/commit/e7a444fea14c722be442b1878d203aac0b2a00f3))

### [6.3.1](https://github.com/marko-js/testing-library/compare/v6.3.0...v6.3.1) (2025-07-01)


### Bug Fixes

* improve scheduler to support marko 6 ([21ffd18](https://github.com/marko-js/testing-library/commit/21ffd18df774b88aea2b2f2fb5513d79e8856af8))
* load mjs file for esm browser env ([1502f1e](https://github.com/marko-js/testing-library/commit/1502f1e8b9cba281fc5cead2580f3c8c58305c42))

## [6.3.0](https://github.com/marko-js/testing-library/compare/v6.2.0...v6.3.0) (2025-06-30)


### Features

* marko 6 support ([ba3c997](https://github.com/marko-js/testing-library/commit/ba3c9974acae90861c2e0dcbb35854590d9aedeb))

## [6.2.0](https://github.com/marko-js/testing-library/compare/v6.1.5...v6.2.0) (2024-02-14)


### Features

* expose normalize api ([#24](https://github.com/marko-js/testing-library/issues/24)) ([80bd74a](https://github.com/marko-js/testing-library/commit/80bd74afcf1fbf072955c164c2f63e111589c1ec))

### [6.1.5](https://github.com/marko-js/testing-library/compare/v6.1.4...v6.1.5) (2023-12-07)


### Bug Fixes

* bump jsdom version ([abb8ef9](https://github.com/marko-js/testing-library/commit/abb8ef994a8433994bed1b00aa8a840030d65c97))

### [6.1.4](https://github.com/marko-js/testing-library/compare/v6.1.3...v6.1.4) (2023-05-09)


### Bug Fixes

* allow  in template input types ([058b839](https://github.com/marko-js/testing-library/commit/058b839c9354dfdc9780569f87bb9689fd93c3e1))

### [6.1.3](https://github.com/marko-js/testing-library/compare/v6.1.2...v6.1.3) (2023-05-08)

### [6.1.2](https://github.com/marko-js/testing-library/compare/v6.1.1...v6.1.2) (2022-04-22)


### Bug Fixes

* avoid erroring when reading instance in ssr mode ([2f5fcc0](https://github.com/marko-js/testing-library/commit/2f5fcc0f16d38e8cd9d96de14578d53f8e2353e8))

### [6.1.1](https://github.com/marko-js/testing-library/compare/v6.1.0...v6.1.1) (2022-04-22)


### Bug Fixes

* issue with instance property being read on ssr test load ([7fb3398](https://github.com/marko-js/testing-library/commit/7fb3398d30ce66888a1265cc2e3e9b47eab39355))

## [6.1.0](https://github.com/marko-js/testing-library/compare/v6.0.0...v6.1.0) (2022-04-01)


### Features

* expose instance property from render ([0fd1e22](https://github.com/marko-js/testing-library/commit/0fd1e220fcba4a5f5d0b951bae925241e1afaca3))

## [6.0.0](https://github.com/marko-js/testing-library/compare/v5.1.0...v6.0.0) (2021-10-21)


### ⚠ BREAKING CHANGES

* see https://github.com/testing-library/dom-testing-library/releases/tag/v8.0.0

### Features

* upgrade to @testing-library/dom@8 ([2760e58](https://github.com/marko-js/testing-library/commit/2760e58b26459f9a804a2751619c0e0e62a88229))

## [5.1.0](https://github.com/marko-js/testing-library/compare/v5.0.4...v5.1.0) (2021-07-23)


### Features

* expose helper to perform action and wait for update ([#13](https://github.com/marko-js/testing-library/issues/13)) ([7cd9d12](https://github.com/marko-js/testing-library/commit/7cd9d12f510a61b42d96fa0aae8d784692a555d8))

### [5.0.4](https://github.com/marko-js/testing-library/compare/v5.0.3...v5.0.4) (2021-06-11)


### Bug Fixes

* improve commonjs support for ssr screen api ([4ef10a3](https://github.com/marko-js/testing-library/commit/4ef10a3bcd072c6e54895213d63e6f317581db1e))

### [5.0.3](https://github.com/marko-js/testing-library/compare/v5.0.2...v5.0.3) (2021-06-03)


### Bug Fixes

* use batching closer to Marko's for fireEvent ([69c0d99](https://github.com/marko-js/testing-library/commit/69c0d99eeac8efc1749ae2a9f57d4e7447d9af81))

### [5.0.2](https://github.com/marko-js/testing-library/compare/v5.0.1...v5.0.2) (2021-06-02)


### Bug Fixes

* issue with resolving browser utils ([fa94d16](https://github.com/marko-js/testing-library/commit/fa94d16bf116be6e8f63ac5639c9d07d35171bd3))

### [5.0.1](https://github.com/marko-js/testing-library/compare/v5.0.0...v5.0.1) (2021-06-02)


### Bug Fixes

* don't publish tsbuildinfo ([0562beb](https://github.com/marko-js/testing-library/commit/0562beb17ec20cd1fe9442efe17dc84c11e734f5))

## [5.0.0](https://github.com/marko-js/testing-library/compare/v4.1.0...v5.0.0) (2021-06-02)


### ⚠ BREAKING CHANGES

* drop support for `cleanup-after-each` import, now this is the default

### Features

* support `screen` export ([#12](https://github.com/marko-js/testing-library/issues/12)) ([fe01359](https://github.com/marko-js/testing-library/commit/fe0135949c19029645293d722ba75b165281e5af))

## [4.1.0](https://github.com/marko-js/testing-library/compare/v4.0.3...v4.1.0) (2021-04-06)


### Features

* better support @testing-library/jest-dom for ssr tests ([333d860](https://github.com/marko-js/testing-library/commit/333d860b13fed9049302ba4ba5da8fb0852f44dd))

### [4.0.3](https://github.com/marko-js/testing-library/compare/v4.0.2...v4.0.3) (2020-07-30)

### [4.0.2](https://github.com/marko-js/testing-library/compare/v4.0.1...v4.0.2) (2020-05-13)


### Bug Fixes

* ignore coverage for batched uupdate fallback ([68d1756](https://github.com/marko-js/testing-library/commit/68d1756eaa20f8ded99b9a6afc65a82f09ee164a))
* regression caused by tslib update ([0c740ea](https://github.com/marko-js/testing-library/commit/0c740eaa4794d9ef31f580acf295108fdcb4ceb3))

### [4.0.1](https://github.com/marko-js/testing-library/compare/v4.0.0...v4.0.1) (2020-04-20)


### Bug Fixes

* prevent race conditions when waiting for updates from fireEvent ([92fd78f](https://github.com/marko-js/testing-library/commit/92fd78fd7829c5fcb1dcde31e9fd82deff5de751))

## [4.0.0](https://github.com/marko-js/testing-library/compare/v3.0.2...v4.0.0) (2020-04-13)


### ⚠ BREAKING CHANGES

* https://github.com/testing-library/dom-testing-library/releases/tag/v7.0.0

### Features

* upgrade @testing-library/dom-testing-library ([#7](https://github.com/marko-js/testing-library/issues/7)) ([9b39530](https://github.com/marko-js/testing-library/commit/9b39530bd5800f192cf7e90a041d5d7179d1e040))

### [3.0.2](https://github.com/marko-js/testing-library/compare/v3.0.1...v3.0.2) (2020-04-10)


### Bug Fixes

* return the result of fireEvent in our async wrapper ([71fdfd1](https://github.com/marko-js/testing-library/commit/71fdfd1))



### [3.0.1](https://github.com/marko-js/testing-library/compare/v3.0.0...v3.0.1) (2020-02-22)


### Bug Fixes

* reset id counter on cleanup ([#5](https://github.com/marko-js/testing-library/issues/5)) ([335ab49](https://github.com/marko-js/testing-library/commit/335ab49))



## [3.0.0](https://github.com/marko-js/testing-library/compare/v2.1.0...v3.0.0) (2019-10-24)


### ⚠ BREAKING CHANGES

* @testing-library/dom has been upgraded, see https://github.com/testing-library/dom-testing-library/releases/tag/v6.0.0

### Bug Fixes

* allow Marko 3 as a peerDep and upgrade testing library deps ([a6e0156](https://github.com/marko-js/testing-library/commit/a6e0156b71d69be2e95e5afb4f477ac6da03a4f0))

## [2.1.0](https://github.com/marko-js/testing-library/compare/v2.0.1...v2.1.0) (2019-10-11)


### Features

* add browser context to server tests, improve errors ([e94c651](https://github.com/marko-js/testing-library/commit/e94c651))



### [2.0.1](https://github.com/marko-js/testing-library/compare/v2.0.0...v2.0.1) (2019-08-01)


### Bug Fixes

* rerender legacy compatibility components ([ad3f90b](https://github.com/marko-js/testing-library/commit/ad3f90b))



## [2.0.0](https://github.com/marko-js/testing-library/compare/v1.1.2...v2.0.0) (2019-07-30)


### Features

* export our own async version of fireEvent ([#3](https://github.com/marko-js/testing-library/issues/3)) ([7ff8fbe](https://github.com/marko-js/testing-library/commit/7ff8fbe))


### BREAKING CHANGES

* fireEvent no longer returns a boolean and instead
returns a promise.



# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.
