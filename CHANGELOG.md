# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
