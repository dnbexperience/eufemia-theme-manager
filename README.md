# Eufemia Theme Browser Extension

This is a browser extension to help creating [Eufemia Design System](https://eufemia.dnb.no) UI Themes.

It can target any output, using the `dnb-ui-lib` with all their CSS vars, like `--color-black` etc.\
The target can then get manipulated in various ways.

## Local development

1. Build the extension with e.g.: `yarn build:chrome`
1. "Load unpacked" extension from Your browser and load the output: `dist-chrome`
1. Create a `.env` file in root with the local extension ID (e.g. REACT_APP_CHROME_EXTENSION_ID=jckgnjhmlbjndbemghpeadkbkbcidpgl)

### `yarn build:watch`

Generates both the app and extension.

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.
