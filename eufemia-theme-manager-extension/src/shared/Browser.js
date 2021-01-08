let useBrowser = undefined

if (!String(window.location.host).includes('localhost')) {
  if (process.env.REACT_APP_BROWSER === 'chrome') {
    useBrowser = window.chrome
  } else {
    useBrowser = window.browser
  }
}

export default useBrowser
