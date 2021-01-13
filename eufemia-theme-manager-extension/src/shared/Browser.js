let useBrowser = undefined

if (
  !(
    process.env.NODE_ENV === 'development' &&
    process.env.REACT_APP_EXTENSION_LOCALHOST_DEV &&
    String(window.location.host).includes('localhost')
  )
) {
  if (process.env.REACT_APP_BROWSER === 'chrome') {
    useBrowser = window.chrome
  } else {
    useBrowser = window.browser
  }
}

export default useBrowser
