# Eufemia Theme Browser Extension

This is a browser extension to help creating [Eufemia Design System](https://eufemia.dnb.no) UI Themes.

It can target any output, using the `dnb-ui-lib` with all their CSS vars, like `--color-black` etc.\
The target can then get manipulated in various ways.

## State of art

Most of the code written in that extension, is created during Christmas break evenings, so no optimization of state management and exiting integration tests got written. Contribution welcome!

## Mono-repo

As of now, only one package is in this mono-repo, so you may have to cd into `/eufemia-theme-manager-extension/`.

## Local development

1. Build the extension with e.g.: `yarn build:chrome`,
1. "Load unpacked" extension from Your browser and load the output: `dist-chrome`,

### `yarn build:watch`

Generates both the app and extension.

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### Develop from localhost:3000

In case you want to run the app only, you have to define that in an `.env` file.

1. Create a `.env` file.
1. Set the dev mode to true: `REACT_APP_EXTENSION_DEV_LOCALHOST=true`,
1. Set the watch mode to true: `REACT_APP_EXTENSION_DEV_WATCH=true`,
1. And optionally, set the browser defined extension ID (e.g. REACT_APP_CHROME_EXTENSION_ID=jckgnjhmlbjndbemghpeadkbkbcidpgl)
