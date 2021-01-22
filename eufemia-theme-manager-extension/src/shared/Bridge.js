import browser from './Browser'
import { insertCSS } from './DOM'
import {
  useThemeStore as backgroundStore,
  useAppStore,
} from '../app/core/Store'

const extensionId =
  (process.env.NODE_ENV === 'development' &&
    process.env.REACT_APP_CHROME_EXTENSION_ID) ||
  undefined

export function getTabId(cbFunc) {
  if (browser) {
    browser?.tabs?.query({ currentWindow: true, active: true }, (tabs) => {
      const tabId = tabs[0].id
      cbFunc(tabId)
    })
  } else {
    cbFunc(null)
  }
}

export function listenForExtensionRequests({ onResponse = null } = {}) {
  if (!browser) {
    return // stop here
  }

  browser?.runtime?.onMessage?.addListener((request, sender, response) => {
    switch (request.type) {
      case 'get-extension-url': {
        getTabId((tabId) => {
          browser.browserAction.getPopup({ tabId }, (popup) => {
            response(popup)
          })
        })

        break
      }

      case 'insert-css': {
        const { elementId, css } = request

        if (typeof css !== 'undefined') {
          insertCSS(css, { elementId })
        }

        response(request)

        break
      }

      case 'store-css': {
        const { css } = request

        if (typeof css !== 'undefined') {
          setLocalThemeData({ css })
        }

        response(request)

        break
      }

      case 'store-themes': {
        const { themes } = request

        if (typeof themes !== 'undefined') {
          setLocalThemeData({ themes })
        }

        response(request)

        break
      }

      case 'get-modifications': {
        const modifications = JSON.parse(
          window.localStorage.getItem('eufemia-theme-editor') || '{}'
        )

        response({ modifications })

        break
      }

      default:
        response(request) // only to have a fallback
        return false
    }

    if (typeof onResponse === 'function') {
      onResponse(request)
    }

    return true
  })
}

export function getThemesAsync() {
  return new Promise((resolve, reject) => {
    if (browser) {
      try {
        sendMessageToRuntime(
          {
            type: 'get-themes',
          },
          (response) => {
            resolve(response || { themes: [] })
          }
        )
      } catch (e) {
        reject(e)
      }
    } else {
      resolve({ themes: null })
    }
  })
}

export function getModificationsFromContentAsync() {
  return new Promise((resolve, reject) => {
    if (browser) {
      try {
        sendMessageToTab(
          {
            type: 'get-modifications',
          },
          (response) => {
            resolve(response || { modifications: {} })
          }
        )
      } catch (e) {
        reject(e)
      }
    } else {
      resolve({ modifications: {} })
    }
  })
}

export function getLocalThemeData() {
  return JSON.parse(
    window.localStorage?.getItem('eufemia-theme-content') || '{}'
  )
}

export function setLocalThemeData(data) {
  const localData = getLocalThemeData()
  window.localStorage?.setItem(
    'eufemia-theme-content',
    JSON.stringify({ ...localData, ...data })
  )
}

export function setLocalThemeCSS() {
  const localData = getLocalThemeData()
  if (localData && localData.css) {
    insertCSS(localData.css, { elementId: 'eufemia-theme' })
  }
}

export function hasEnabledLocalThemeData() {
  const localData = getLocalThemeData()
  return Boolean(localData && localData.css)
}

export function insertCSSIntoPage(data, responseFunc = null) {
  sendMessageToTab({ type: 'insert-css', ...data }, responseFunc)
}

export function storeCSSInPage(data, responseFunc = null) {
  sendMessageToTab({ type: 'store-css', ...data }, responseFunc)
}

export async function getHost() {
  return new Promise((resolve) => {
    if (browser) {
      browser?.tabs?.query({ currentWindow: true, active: true }, (tabs) => {
        const url = new URL(tabs[0].url)
        resolve(url.hostname)
      })
    } else {
      resolve('localhost')
    }
  })
}

export function storeThemesInPage(themes, responseFunc = null) {
  // send it to the background
  sendMessageToRuntime({ type: 'set-themes', themes }, responseFunc)

  // send it to the content
  sendMessageToTab({ type: 'store-themes', themes }, responseFunc)
}

function sendMessageToRuntime(
  data,
  responseFunc = (r) => console.log('Defualt Response', r)
) {
  browser?.runtime?.sendMessage(extensionId, data, responseFunc)
}

function sendMessageToTab(
  data,
  responseFunc = (r) => console.log('Defualt Response', r)
) {
  if (browser) {
    getTabId((tabId) => {
      const themeId = window.EXTENSION_HOST
        ? useAppStore.getState().getHostData().currentThemeId
        : null
      browser?.tabs.sendMessage(
        tabId,
        Object.assign(data, { themeId }),
        responseFunc
      )
    })
  } else if (responseFunc) {
    responseFunc('localhost')
  }
}

export function listenForBackgroundMessages() {
  browser?.runtime?.onMessage?.addListener((request, sender, response) => {
    switch (request.type) {
      case 'get-themes': {
        const { themes } = backgroundStore.getState()

        response({ themes })
        break
      }

      case 'set-themes': {
        const { themes } = request

        backgroundStore.setState({ themes })
        response({ themes })

        break
      }

      default:
        return false
    }

    return true
  })
}

// Only hacky WIP code – to experiment on load the extension inline
// export function insertInlineExtension() {
//   const iframe = document.createElement('iframe')
//   const button = document.createElement('button')
//   const elem = document.body.firstChild

//   iframe.style.position = 'absolute'
//   button.style.position = 'absolute'
//   iframe.style.zIndex = '1000'
//   button.style.zIndex = '1000'
//   iframe.style.width = '42rem'
//   iframe.style.height = '100vh'

//   button.innerHTML = 'Open'

//   button.addEventListener('click', (evt) => {
//     evt.preventDefault()
//     browser?.runtime.sendMessage({ type: 'url' }, (response) => {
//       if (response) {
//         iframe.src = response
//         // elem.appendChild(iframe)
//         document.body.insertBefore(
//           iframe,
//           elem
//           //
//         )
//       }
//     })
//   })

//   // elem.appendChild(button)
//   document.body.insertBefore(button, elem)
// }
