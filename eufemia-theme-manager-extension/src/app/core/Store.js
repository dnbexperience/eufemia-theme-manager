import create from 'zustand'
import { persist } from 'zustand/middleware'
import browser from '../../shared/Browser'
import { originalColorsAsArray } from '../../shared/ColorController'

export const extensionStorePlain = create(themesStore)

export const useThemeStore = create(
  persist(themesStore, getPersistConfig('eufemia-theme-data'))
)

export const useAppStore = create(
  persist(hostStore, getPersistConfig('eufemia-theme-app'))
)

export const useWindowStore = create(
  persist(hostStore, getPersistConfig('eufemia-theme-window'))
)

export const useErrorStore = create(errorStore)

export function useTheme(themeId) {
  const { getTheme } = useThemeStore()
  return getTheme(themeId)
}

function themesStore(set, get) {
  return {
    themes: {},

    getThemes: () => {
      const { getThemeConstructs, themes } = get()

      if (!themes['dnb-ui']) {
        themes['dnb-ui'] = getThemeConstructs()
        themes['demo'] = getThemeConstructs()
      }

      if (!themes['blue-test']) {
        themes['blue-test'] = getThemeConstructs()
      }

      if (!themes['2x-test']) {
        themes['2x-test'] = getThemeConstructs()
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
        spacingsList: [],
        fontsizeList: [],
      }
    },
    getTheme: (themeId = null) => {
      if (!themeId) {
        themeId = get().selectedThemeId
      }

      const setState = (object) => {
        const themes = get().themes
        themes[themeId] = Object.assign(themes[themeId] || {}, object)
        // themes[themeId] = { ...(themes[themeId] || {}), ...object }

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

          case '2x-test': {
            return [
              {
                css: 'html{font-size: 200%;}',
              },
            ]
          }

          default: {
            const theme = getState()
            return [
              ...(theme?.colorsList || []),
              ...(theme?.spacingsList || []),
              ...(theme?.fontsizesList || []),
            ]
          }
        }
      }

      // Color utils
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

      // Spacing utils
      const changeSpacing = (origKey, object) => {
        const theme = getState()
        let found

        const spacingsList = (theme?.spacingsList || []).map((item) => {
          if (item.key === origKey) {
            found = item = { ...item, ...object }
          }
          return item
        })

        if (!found) {
          spacingsList.push(Object.assign(object))
        }

        setState({ spacingsList })
      }
      const setSpacing = (origKey, change, fallbackParams = {}) => {
        changeSpacing(
          origKey,
          Object.assign(fallbackParams, {
            change,
          })
        )
      }
      const resetSpacing = (rmKey) => {
        changeSpacing(rmKey, {
          change: null,
        })
      }
      const useSpacingTools = () => {
        return {
          changeSpacing,
          setSpacing,
          resetSpacing,
        }
      }

      // Font-size utils
      const changeFontsize = (origKey, object) => {
        const theme = getState()
        let found

        const fontsizesList = (theme?.fontsizesList || []).map((item) => {
          if (item.key === origKey) {
            found = item = { ...item, ...object }
          }
          return item
        })

        if (!found) {
          fontsizesList.push(Object.assign(object))
        }

        setState({ fontsizesList })
      }
      const setFontsize = (origKey, change, fallbackParams = {}) => {
        changeFontsize(
          origKey,
          Object.assign(fallbackParams, {
            change,
          })
        )
      }
      const setRootFontsize = (value) => {
        changeFontsize('root-font-size', {
          key: 'root-font-size',
          value,
          css: value ? `html{font-size: ${value / 16}em;}` : '',
        })
      }
      const resetFontsize = (rmKey) => {
        changeFontsize(rmKey, {
          change: null,
        })
      }
      const useFontsizeTools = () => {
        return {
          changeFontsize,
          setRootFontsize,
          setFontsize,
          resetFontsize,
        }
      }

      return {
        themeId,
        ...getState(),
        setState,
        getState,
        getThemeChanges,
        useColorTools,
        useSpacingTools,
        useFontsizeTools,
      }
    },
  }
}

const defaultFallback = {
  enabled: false,
  selectedTab: 'colors',
  currentThemeId: null,
  selectedThemeId: 'demo',
}

function hostStore(set, get) {
  return {
    hosts: {},

    setEnabled: (enabled) => {
      get().setByHost({ enabled })
    },
    setFilter: (cacheKey, filter) => {
      const filters = get().getHostData()?.filters || {}
      const existing = get().getFilter(cacheKey) || {}
      filters[cacheKey] = Object.assign(existing, filter)
      get().setByHost({ filters })
    },
    getFilter: (cacheKey) => {
      const data = get().getHostData()
      return data?.filters ? data.filters[cacheKey] : null
    },
    setCurrentThemeId: (currentThemeId) => {
      get().setByHost({ currentThemeId })
    },
    setSelectedThemeId: (selectedThemeId) => {
      get().setByHost({ selectedThemeId })
    },
    setSelectedTab: (selectedTab) => {
      get().setByHost({ selectedTab })
    },
    getHostData: () => {
      const { hosts } = get()
      return hosts[window.EXTENSION_HOST] || defaultFallback
    },
    setByHost: (data) => {
      const { hosts } = get()
      hosts[window.EXTENSION_HOST] = Object.assign(
        hosts[window.EXTENSION_HOST] || defaultFallback,
        data
      )
      set({ hosts })
    },
  }
}

function errorStore(set) {
  return {
    error: null,
    setError: (error) => {
      console.warn(error)
      set({ error })
    },
    hideError: () => {
      set({ error: null })
    },
  }
}

// function postRehydrationMiddleware() {
//   const theme = useTheme.getState().getTheme()
//   ...
// }

function getPersistConfig(name) {
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
                if (browser.runtime.lastError) {
                  useErrorStore
                    .getState()
                    .setError(browser.runtime.lastError.message)
                } else {
                  // const themeData = data?.themeData || data || '{}'
                  resolve(themeData)
                }
              })
            } catch (e) {
              useErrorStore.getState().setError(e.message)
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
              // cgonsole.lo('setItem:', name, themeData)
              if (browser.runtime.lastError) {
                useErrorStore
                  .getState()
                  .setError(browser.runtime.lastError.message)
              }
            })
          } catch (e) {
            useErrorStore.getState().setError(e.message)

            window.localStorage?.setItem(name, themeData)
          }
        } else {
          window.localStorage?.setItem(name, themeData)
        }
      },
    }),
  }
}
