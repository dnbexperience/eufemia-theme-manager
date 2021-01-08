import create from 'zustand'
import { persist } from 'zustand/middleware'

import { compileModifications } from '../../shared/Compiler'
import { insertCSS } from '../../shared/DOM'

export const useEditorStore = create(
  persist(
    (set, get) => ({
      enabled: false,
      themesHash: null,
      modifications: {},
      addModification: ({ path, themeId = null }) => {
        const { modifications } = get()
        modifications[path] = { themeId }
        set({ modifications })
      },
      setTheme: ({ path, themeId }) => {
        const { modifications } = get()
        modifications[path] = { themeId }
        set({ modifications })
      },
      removeTheme: ({ path }) => {
        const { modifications } = get()
        delete modifications[path]
        set({ modifications })
      },
      setEnabled: (enabled) => {
        set({ enabled })
      },
    }),

    getPersistConfig()
  )
)

export function listenForModifications({ onModification } = {}) {
  return useEditorStore.subscribe(
    () => {
      if (typeof onModification === 'function') {
        onModification()
      }
    }
    // (state) => state.modifications // Does not work, but why? the subscription gets not called!
  )
}

function getPersistConfig() {
  return {
    name: 'eufemia-theme-editor',
  }
}

export function applyModifications({ themes }) {
  const { modifications } = useEditorStore.getState()
  const { css } = compileModifications({ modifications, themes })
  insertCSS(css, { elementId: 'eufemia-theme-custom' })
}

export function removeCustomModifications() {
  insertCSS('', { elementId: 'eufemia-theme-custom' })
}

export function flushThemesHash() {
  useEditorStore.setState({ themesHash: Date.now() })
}
