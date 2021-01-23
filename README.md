# A Chrome extension for Taskwarrior, using inthe.am as backend.

## Features

* Lists tasks.
* Mark completed with a click
* Create new tasks similarly to how it's done in the commandline.
* Display number of urgent items in different preset urgency buckets.
* Edit tasks with `<selectors> modify <modifications>` where selectors and 
  modifications are task properties, and selector can also be task short id.

## Instructions

* Clone
* `npm install`
* `npm run-script build`
* Install the extension with "Load Unpacked"
* Add your intheam api key in the extension options.
* Click on the extension icon to display the list.
* Add tasks with `add ...` command
* Filter tasks with any other command 
  * `by description` keeps tasks including "description" in their description
  * `project:myproject` keeps tasks within the "myproject" project
  * `+mytag` keeps tasks with the "mytag" tag set.
* Remove filters by clicking on them.
* The funnel icon will include existing tag and project filters in the newly
  created tasks.
* The link icon will include current url as an annotation of the task.
* Click on the green check icon to mark the task as completed.
 
## Stack

- Write code with [TypeScript](https://www.typescriptlang.org/).
- Unit tests using [Jest](https://facebook.github.io/jest/) & [Sinon.JS](http://sinonjs.org/).
- Lint using [tslint](https://palantir.github.io/tslint/)
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
