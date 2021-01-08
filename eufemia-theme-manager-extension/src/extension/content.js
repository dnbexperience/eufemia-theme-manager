import { createThemeEditor, removeThemeEditor } from './editor/ExtensionEditor'
import {
  listenForExtensionRequests,
  hasLocalThemeData,
  setLocalThemeCSS,
  getThemesAsync,
} from '../shared/Bridge'
import {
  listenForModifications,
  applyModifications,
  removeCustomModifications,
  flushThemesHash,
} from './editor/EditorStore'

listenForExtensionRequests({
  onResponse: (response) => {
    if (response.type === 'store-css') {
      getThemesAsync().then(({ themes }) => {
        setLocalThemeModifications({ themes })

        if (response.themeId === 'blue-test' && response.css) {
          removeCustomModifications()
        }
      })
    }
  },
})

let unsub
function setLocalThemeModifications({ themes }) {
  if (hasLocalThemeData()) {
    setLocalThemeCSS()
    createThemeEditor()

    applyModifications({ themes })
    flushThemesHash()

    if (typeof unsub === 'undefined') {
      unsub = listenForModifications({
        onModification: () => {
          // get fresh themes
          getThemesAsync().then(({ themes }) => {
            applyModifications({ themes })
          })
        },
      })
    }
  } else if (unsub) {
    removeThemeEditor()
    removeCustomModifications()

    unsub()
    unsub = undefined
  }
}

if (hasLocalThemeData()) {
  getThemesAsync().then(({ themes }) => {
    setLocalThemeModifications({ themes })
  })
}
