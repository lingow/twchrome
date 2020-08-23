# A Chrome extension for Taskwarrior, using inthe.am as backend.

## Features

* Lists tasks.
* Mark completed with a click
* Create new tasks similarly to how it's done in the commandline.
* Display number of urgent items in different preset urgency buckets.

## Instructions

* Install the extension
* Add your intheam api key in the extension options.
* Click on the extension icon to display the list.
* Click on the add button to add new task.
* Click on the green check icon to mark the task as completed.
 
## Stack

- Write code with [TypeScript](https://www.typescriptlang.org/).
- Unit tests using [Jest](https://facebook.github.io/jest/) & [Sinon.JS](http://sinonjs.org/).
- Lint using [ESLint](https://eslint.org/).
- Format using [Prettier](https://prettier.io/).

## Developing

1. Clone the repository.
2. Remove `.git` directory.
3. Run `npm install`.
4. Change the package information in `package.json`, i.e. name, description, etc.
5. Change the package information in `dist/manifest.json`, i.e. name, description, etc.
6. Run `npm run build`.
7. Load your extension on Chrome from `dist`.

## Unit testing

1. Run `npm run test`.

## Credits

Based on https://github.com/ninoseki/ts-jest-chrome-extension-starter for the
chrome-extension boilerplate code and project structure.
