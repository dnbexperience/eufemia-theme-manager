import { createThemeEditor, removeThemeEditor } from './editor/ExtensionEditor'
import {
  listenForExtensionRequests,
  hasEnabledLocalThemeData,
  setLocalThemeCSS,
  // getThemesAsync,
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
  if (hasEnabledLocalThemeData()) {
    setTimeout(() => {
      setLocalThemeModifications()
    }, 1) // without this delay, zustand is removing our data!
  }
}

listenForExtensionRequests({
  onResponse: (response) => {
    switch (response.type) {
      case 'store-themes': {
        const themes = response.themes
        setLocalThemeData({ themes })

        setLocalThemeModifications()

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
    createThemeEditor()

    const themes = getLocalThemeData()?.themes
    if (themes) {
      applyModifications({ themes })
      flushThemesHash()
    }

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
