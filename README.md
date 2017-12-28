# lupoex-client

## Getting started

Before you start, make sure you have a recent version of [NodeJS](http://nodejs.org/) environment *>=8.0* with NPM 5.

### Installing the dependencies

From the project folder, execute the following commands:

```
git checkout develop
```
unless you want to run master.

```shell
npm install
```
This will install all required dependencies, including a local version of Webpack that is going to
build and bundle the app. There is no need to install Webpack globally.


Additionally, if you have github access to the tradingview charting_library (which this repo uses) you can run:
 ```
 git submodule update --init assets/charting_library
 ```
This will clone the tradingview charting_library dependency as a git submodule.
**Don't worry, most people do not have access to this repo (unless you are internal to lupoex). You can still run the app locally without it.**

### Running the app

The basic command to run the app locally is:

```shell
npm start
```

This command starts the webpack development server that serves the build bundles.
You can now browse the skeleton app at https://localhost:8080 (or the next available port, notice the output of the command). Changes in the code
will automatically build and reload the app.

If you are getting `node-sass` errors on startup, see the Troubleshooting section.

**Below are some environment variables that can be set (and in some cases must be set):**
#### Environment Variables
1. `REMOTE_BACKEND`
   If you are not internal to lupoex, then you will not have access to a couple of things that are necessary for the functioning of the app,
   (the lupoex API as well as the tradingview charting_library both of which are not open source as of this time). In order to run the app locally,
   you will need to set `REMOTE_BACKEND` to true like so:
   ```shell
   REMOTE_BACKEND=true npm start
   ```
    
2. `PUBLIC_NETWORK`
   You can run the app against the public or test stellar networks. By default, the app will run against the test network. If you would like to run the application
   against the the public network, you must set `PUBLIC_NETWORK` to true like so:
   ```shell
   PUBLIC_NETWORK=true npm start
   ```
   
3. `USE_HTTPS`
    By default, the app will in regular http, however with this flag you can run the app in https like so:
    ```shell
    USE_HTTPS=true npm start
    ```
   **Is your application auto reloading (loop-wise) on start? If so, see the Troubleshooting section...**
   
Both environment variables can be run in one command:
```shell
REMOTE_BACKEND=true PUBLIC_NETWORK=true USE_HTTPS=true npm start
```

#### Running with Hot Module Reload

If you wish to try out the experimental Hot Module Reload, you may run your application with the following command:

```shell
npm start -- webpack.server.hmr
```
Of course, `PUBLIC_NETWORK` and `REMOTE_BACKEND` can be used in this mode as well.

## Updating your project

To update your project to the latest execute the following commands:
```
git pull
```

```
npm run deps
```
**The above command (npm run deps) should also be run after switching between branches that have different dependencies**

## Bundling

To build an optimized, minified production bundle (output to /dist) execute:

```shell
npm start -- build
```

To build 

To test either the development or production build execute:

```shell
npm start -- serve
```

The production bundle includes all files that are required for deployment.

## Deploying
To tag a version execute:
```
./scripts/tag.sh sitename version
```

To actually deploy execute:
```
./scripts/deploy.sh environment sitename
```

## Troubleshooting

1. **Why is my application reloading itself again and again in development mode?**
   Are you running with `USE_HTTPS=true` enabled? If so, you need to trust the security certificate located in `dev-assets`. See the Trusting Certificates section below.
   
2. **Why am I getting node-sass errors on startup?**
Sometimes node-sass needs to be rebuilt for a particular operating system. To fix, run:
```shell
npm rebuild node-sass
```

### Trusting Certificates
If you are running in https mode you will want to trust the certificate located in `dev-assets`. 

To trust a certificate on windows:
1. Open up the start menu and open up the Run Application (search for `run`)
2. Type `mmc` and click ok
3. File > Add/Remove Snap In
4. Select `Certificates` and click Add >
5. Select `Computer Account` then `Local Computer` and click finish
6. Click `Ok` to close the `Add or Remove Snap-ins` window.
7. Double click `Certificates` and the right click `Trusted Root Certification Authorities`
8. In the toolbar that comes up (from the right-click) select All Tasks > Import
9. Complete the Certificate Import Wizard using `dev-assets/server.cert` 
10. Your browser should now trust the certificate and you should no longer get the intermittent page reload.

<!--
## Running The Tests

This skeleton provides three frameworks for running tests.

You can choose one or two and remove the other, or even use all of them for different types of tests.

### Jest

Jest is a powerful unit testing runner and framework.
It runs really fast, however the tests are run under NodeJS, not the browser.
This means there might be some cases where something you'd expect works in reality, but fails in a test. One of those things will be SVG, which isn't supported under NodeJS. However, the framework is perfect for doing unit tests of pure functions, and works pretty well in combination with `aurelia-testing`.

To create new Jest tests, create files with the extension `.test.js`, either in the `src` directory or in the `test/jest-unit` directory.

To run the Jest unit tests, run:

```shell
npm test
```

To run the Jest watcher (re-runs tests on changes), run:

```shell
npm start -- test.jest.watch
```

### Karma + Jasmine

Karma is also a powerful test runner, and combined with Jasmine it can be a pleasure to work with. Karma always runs in the browser. This means that whatever works in real browsers, should also work the same way in the unit tests. But it also means the framework is heavier to execute and not as lean to work with.

To create new Karma tests, create files with the extension `.spec.js`, either in the `src` directory or in the `test/karma-unit` directory.

To run the Karma unit tests, run:

```shell
npm start -- test.karma
```

To run the Karma watcher (re-runs tests on changes), run:

```shell
npm start -- test.karma.watch
```

### Protractor (E2E / integration tests)

Integration tests can be performed with [Protractor](http://angular.github.io/protractor/#/).

1. Place your E2E-Tests into the folder ```test/e2e``` and name them with the extension `.e2e.js`.

2. Run the tests by invoking

```shell
npm start -- e2e
```

## Running all test suites

To run all the unit test suites and the E2E tests, you may simply run:

```shell
npm start -- test.all
```
-->
