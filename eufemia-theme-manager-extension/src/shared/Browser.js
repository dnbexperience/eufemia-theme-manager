let useBrowser = undefined

export const isDev =
  process.env.NODE_ENV === 'development' &&
  process.env.RUNTIME_EXTENSION_DEV_LOCALHOST
//  &&
// String(window.location.host).includes('localhost')

if (!isDev) {
  if (process.env.RUNTIME_BROWSER === 'chrome') {
    useBrowser = window.chrome
  } else {
    useBrowser = window.browser
  }
}

export default useBrowser
