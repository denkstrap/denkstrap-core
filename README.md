# @denkstrap/core 
[![npm (scoped)](https://img.shields.io/npm/v/@denkstrap/core.svg)](https://www.npmjs.com/package/@denkstrap/core) [![Build Status](https://travis-ci.org/denkstrap/denkstrap-core.svg?branch=master)](https://travis-ci.org/denkstrap/denkstrap-core) [![Coverage Status](https://coveralls.io/repos/github/denkstrap/denkstrap-core/badge.svg?branch=master)](https://coveralls.io/github/denkstrap/denkstrap-core?branch=master)

***WARNING:*** Version 3 is **NOT** compatible with denkstrap and denkstrap modules from previous versions.

## Installation
```bash
npm install --save @denkstrap/core
```

### ESM 
```javascript
// ESM Module Syntax
// ES5 transpiled

import { Denkstrap } from '@denkstrap/core';

const denkstrap = new Denkstrap({...});
```

### UMD
```javascript
// UMD Module Syntax
// ES5 transpiled

// AMD
define(['@denkstrap/core/umd/index'], (ds) => {
    const denkstrap = new ds.Denkstrap({...});
})

// CommonJS
const Denkstrap = require('@denkstrap/core/umd/index').Denkstrap;
const denkstrap = new Denkstrap({...});
```

### ESNext
```javascript
// ESM Module Syntax
// transpile yourself

import { Denkstrap } from '@denkstrap/core/esnext';

const denkstrap = new Denkstrap({...});
```

## Contributing to @denkstrap/core

### Requirements

There are a few prerequisites for this repository:

- [nvm](https://github.com/creationix/nvm) on Mac and Linux, [nvmw](https://github.com/hakobera/nvmw) or [nvm-windows](https://github.com/coreybutler/nvm-windows) on Windows
- As an alternative you have node.js version 8 as your systems default node.js version

### Initialization

When first cloning this repository you have to do an initialization. Due to the fact we are
using node.js for our build tasks you have to install all the dependencies.

But first things first. We use node.js version 8 which is the Long-Term-Support version. As
you have read in the requirements section you have to have either node.js 8 installed or nvm
installed. If you do not sure which version of node.js is installed check it by typing `node --version`
in your console. If you should see something like `8.9.4` you are good to go to the installation
section. If not, go on reading the Initializing Node.js section.

#### Initializing Node.js

Be sure to have nvm installed! Switch to bash by entering `bash` in the console.
Then type `nvm --version` in your console to check.

If it is not installed use [these instructions](https://github.com/creationix/nvm#user-content-install-script). When you are using Windows try [nvmw](https://github.com/hakobera/nvmw) or [nvm-windows](https://github.com/coreybutler/nvm-windows).

Are you sure nvm is installed? Fine! Type `nvm install 8` to your terminal.

##### Windows?

The description above does yet not work 100% on Windows machines. When you just type `nvm install`
there will not be happening as much as on POSIX systems. You have to type `nvm install 8` or
`nvm use 8` if you have node.js version 8 already installed. That will work fine. When
[#63](https://github.com/hakobera/nvmw/pull/63) gets merged the description above will work on Windows machines.

#### Installation

There are some prerequisites for this project template to be installed. Type `npm install` to
install all dependencies.

#### Update

When someone changed in the project the required Node modules, run the command `npm update`.

### Build

When you have all requirements installed, run the following commands to build the sources:

`npm build` for a production build for all target enviroments (ESM, UMD and ESNext)

Or run `npm run build:<esm|esnext|umd>` to build a specific enviroment.

Additionally you can run `npm run eslint` and `npm test` to ensure the tests are green and all sources follow the coding guidelines. Have a look at our test-stack documentation for advanced javascript testing.

For building an artifact which you can install locally for testing purposes run `npm run build && npm pack`. This will create an tarball file named `denkstrap-core-<version>.tgz` inside the root directory.

### Documentations

There are a few more Documentations:

- TODO: write documentations

Happy Coding!
