// import React from 'react'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import browser from '../../shared/Browser'
import { originalColorsAsArray } from '../../shared/ColorController'

export function useTheme(themeId) {
  const { getTheme } = useThemeStore()
  return getTheme(themeId)
}

const themesStore = (set, get) => ({
  themes: {},

  getThemes: () => {
    const { getThemeConstructs, themes } = get()

    if (!themes['dnb-ui']) {
      themes['dnb-ui'] = getThemeConstructs()
      themes['blue-test'] = getThemeConstructs()
      themes['demo'] = getThemeConstructs()
    }

    return themes
  },
  createEmptyTheme: (themeId) => {
    const { themes, getThemeConstructs } = get()

    if (!themes[themeId]) {
      themes[themeId] = { ...getThemeConstructs() }
      set({ themes })
    }
  },
  copySelectedTheme: (themeId) => {
    const { themes, selectedThemeId } = get()

    if (!themes[themeId]) {
      themes[themeId] = { ...themes[selectedThemeId] }
      set({ themes })
    }
  },
  removeTheme: (themeId) => {
    const themes = get().themes

    if (themes[themeId]) {
      delete themes[themeId]
      set({ themes })
    }
  },
  getThemeConstructs: () => {
    return {
      colorsList: [],
      spacingList: [],
    }
  },
  getTheme: (themeId = null) => {
    if (!themeId) {
      themeId = get().selectedThemeId
    }

    const setState = (object) => {
      const themes = get().themes
      themes[themeId] = { ...(themes[themeId] || {}), ...object }

      const state = { themes }
      state.selectedThemeId = themeId

      set(state)
    }
    const getState = () => {
      const theme = get().themes[themeId] || null // || get().getThemeConstructs()
      return theme
    }

    const getThemeChanges = () => {
      switch (themeId) {
        case 'dnb-ui': {
          return [
            ...originalColorsAsArray.map(({ key, value }) => ({
              key,
              change: value,
            })),
          ]
        }

        case 'blue-test': {
          return [
            ...originalColorsAsArray.map(({ key }) => ({
              key,
              change: 'blue',
            })),
          ]
        }

        default: {
          const theme = getState()
          return [...(theme?.colorsList || []), ...(theme?.spacingList || [])]
        }
      }
    }

    // Color Theme utils
    const changeColor = (origKey, object) => {
      const theme = getState()
      let found

      const colorsList = (theme?.colorsList || []).map((item) => {
        if (item.key === origKey) {
          found = item = { ...item, ...object }
        }
        return item
      })

      if (!found) {
        colorsList.push(Object.assign(object))
      }

      setState({ colorsList })
    }
    const setColor = (origKey, change, fallbackParams = {}) => {
      changeColor(
        origKey,
        Object.assign(fallbackParams, {
          change,
        })
      )
    }
    const resetColor = (rmKey) => {
      changeColor(rmKey, {
        change: null,
        useCustomColor: null,
      })
    }
    const useColorTools = () => {
      return {
        changeColor,
        setColor,
        resetColor,
      }
    }

    return {
      themeId,
      ...getState(),
      setState,
      getState,
      getThemeChanges,
      useColorTools,
    }
  },
})

const hostStore = (set, get) => ({
  hosts: {},

  setEnabled: (enabled) => {
    get().setByHost({ enabled })
  },
  setFilter: (filter) => {
    get().setByHost({ filter })
  },
  setCurrentThemeId: (currentThemeId) => {
    get().setByHost({ currentThemeId })
  },
  setSelectedThemeId: (selectedThemeId) => {
    get().setByHost({ selectedThemeId })
  },
  getHostData: () => {
    const { hosts } = get()
    const res = hosts[window.EXTENSION_HOST] || {
      enabled: false,
      currentThemeId: null,
      selectedThemeId: 'demo',
    }
    return res
  },
  setByHost: (data) => {
    const { hosts } = get()
    hosts[window.EXTENSION_HOST] = {
      ...(hosts[window.EXTENSION_HOST] || {}),
      ...data,
    }
    set({ hosts })
  },
})

export const extensionStorePlain = create(themesStore)

export const useThemeStore = create(persist(themesStore, getPersistConfig()))

export const useHostStore = create(
  persist(hostStore, getPersistConfig('eufemia-theme-hosts'))
)

// export function postRehydrationMiddleware() {
//   const theme = useTheme.getState().getTheme()
//   ...
// }

function getPersistConfig(name = 'eufemia-theme-data') {
  const useBrowserStorage = true
  return {
    name,
    // blacklist: ['colorTools', 'sgetItempacingTools'],
    // whitelist: ['colorTools', 'spacingTools'],
    // postRehydrationMiddleware,
    // onRehydrateStorage: () => {
    //   console.log('onRehydrateStorage')
    // },
    getStorage: () => ({
      getItem: (name) => {
        return new Promise((resolve, reject) => {
          if (useBrowserStorage && browser && browser.storage !== 'undefined') {
            try {
              browser.storage?.sync.get([name], ({ [name]: themeData }) => {
                // const themeData = data?.themeData || data || '{}'
                resolve(themeData)
              })
            } catch (e) {
              console.warn(e)
              resolve(window.localStorage?.getItem(name) || '{}')
            }
          } else {
            resolve(window.localStorage?.getItem(name) || '{}')
          }
        })
      },
      setItem: (name, themeData) => {
        if (useBrowserStorage && browser && browser.storage !== 'undefined') {
          try {
            browser.storage?.sync.set({ [name]: themeData }, () => {
              // console.log('setItem:', name, themeData)
            })
          } catch (e) {
            console.warn(e)
            window.localStorage?.setItem(name, themeData)
          }
        } else {
          window.localStorage?.setItem(name, themeData)
        }
      },
    }),
  }
}
