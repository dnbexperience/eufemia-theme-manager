import { createThemeEditor, removeThemeEditor } from './editor/ExtensionEditor'
import {
  listenForExtensionRequests,
  hasEnabledLocalThemeData,
  setLocalThemeCSS,
  getThemesAsync,
  getLocalThemeData,
  setLocalThemeData,
} from '../shared/Bridge'
import {
  listenForModifications,
  applyModifications,
  removeCustomModifications,
  flushThemesHash,
} from './editor/EditorStore'

if (hasEnabledLocalThemeData()) {
  setLocalThemeModifications()

  // or, get fresh themes, in case a data has changed
  getThemesAsync().then(({ themes }) => {
    setLocalThemeData({ themes })
    setLocalThemeModifications()
  })
}

listenForExtensionRequests({
  onResponse: (response) => {
    switch (response.type) {
      case 'store-themes': {
        const themes = response.themes
        setLocalThemeData({ themes })
        setLocalThemeModifications()
        flushThemesHash()

        if (response.themeId === 'blue-test' && response.css) {
          removeCustomModifications()
        }
        break
      }

      default: {
      }
    }
  },
})

let unsub
function setLocalThemeModifications() {
  if (hasEnabledLocalThemeData()) {
    setLocalThemeCSS()

    const themes = getLocalThemeData()?.themes
    if (themes) {
      applyModifications({ themes })
    }

    createThemeEditor()

    if (typeof unsub === 'undefined') {
      unsub = listenForModifications({
        onModification: () => {
          const themes = getLocalThemeData()?.themes
          applyModifications({ themes })

          // or, get fresh themes
          // getThemesAsync().then(({ themes }) => {
          //   applyModifications({ themes })
          // })
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
