# strict-import

> Prevent `require` from searching upwards for required modules


## Background

The [`require() algorithm`](https://nodejs.org/api/modules.html#modules_all_together) works by searching for a `node_modules` directory with your required module from the current directory and upwards until it reaches the system root directory.

This means that if you have nested projects, and have a module called `foo` installed at the top-level, the sub-projects can also import `foo` without installing it. While useful in some cases, it can also cause problems.

I made this module because I'm working on an Electron app, where we use `electron-builder` with a [two package structure](https://www.electron.build/tutorials/two-package-structure). We depended on module `foo` in the renderer, which was defined top-level, since we use Webpack for bundling. We later started using `foo` in the main process code too, which is placed in an `app` subdirectory. The problem is that we forgot to add `foo` as a dependency in the `app` directory, but it worked fine in development as `require` just found it at the top-level. In production, however, it crashed, since we no longer had the top-level dependency, as only the `app` directory is included in the built app. With this module, we can ensure that doesn't happen again.


## Install

```
$ npm install strict-import
```


## Usage

At the top of your `index.js` file.

```js
require('strict-import')(module);

// This now only works if `foo` is in `./node_modules`,
// but not if it's in `../node_modules`
const foo = require('foo');
```


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
