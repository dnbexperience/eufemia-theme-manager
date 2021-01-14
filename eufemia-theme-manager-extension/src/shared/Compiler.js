import React from 'react'
import browser from './Browser'
import {
  useThemeStore,
  useAppStore,
  extensionStorePlain,
} from '../app/core/Store'
import { insertCSS } from './DOM'
import {
  insertCSSIntoPage,
  storeCSSInPage,
  storeThemesInPage,
} from '../shared/Bridge'

export const useCompilerListener = () =>
  React.useState(() => new Compiler().listen())
// React.useEffect(() => new Compiler().listen(), [])

export default class Compiler {
  listen() {
    const unsubStore = useThemeStore.subscribe(this.run)
    const unsubHost = useAppStore.subscribe(this.run)

    return () => {
      unsubStore()
      unsubHost()
    }
  }
  run = () => {
    const { themes } = useThemeStore.getState()

    const { getHostData } = useAppStore.getState()
    const { enabled, currentThemeId } = getHostData()

    if (enabled) {
      const { getTheme } = useThemeStore.getState()
      const theme = getTheme(currentThemeId)
      const css = this.compileList(theme.getThemeChanges())

      this.setCSS(css)
      this.storeCSS(css)
    } else {
      this.reset()
    }

    // have to run after insert/store css
    storeThemesInPage(themes)
  }
  reset() {
    this.setCSS('')
    this.storeCSS('')
  }
  compileList(listWithChanges) {
    const declarations = this.buildDeclarations(listWithChanges)
    return this.combineWithRoot(declarations)
  }
  setCSS(css, elementId = 'eufemia-theme') {
    const hash = String(css) + String(elementId)
    if (this._cssMemoHash === hash) {
      return // stop here
    }
    this._cssMemoHash = hash
    if (browser?.tabs) {
      insertCSSIntoPage({ css, elementId })
    } else {
      insertCSS(css, { elementId })
    }
  }
  storeCSS(css) {
    if (browser?.tabs) {
      storeCSSInPage({ css })
    }
  }
  compileFromTheme(theme, opts) {
    return this.buildDeclarations(theme.getThemeChanges(), opts)
  }
  buildDeclarations(listWithChanges, { modifyDeclaration = null } = {}) {
    return listWithChanges
      .filter((cur) => cur.change)
      .map(({ key, change }) => {
        if (typeof modifyDeclaration === 'function') {
          return modifyDeclaration({ key, change })
        }
        return `${key}: ${change};`
      })
  }
  combineWithRoot(declarations) {
    return declarations?.length ? `:root{${declarations.join('')}}` : ''
  }
}

export function compileModifications({ modifications, themes, ...opts }) {
  if (themes) {
    extensionStorePlain.setState({ themes })
    const { getTheme } = extensionStorePlain.getState()

    const css = Object.entries(modifications)
      .map(([path, { themeId }]) => {
        if (themeId && themeId !== 'inactive') {
          const theme = getTheme(themeId)
          const themeCSS = new Compiler().compileFromTheme(theme, opts).join('')

          return `${path}{${themeCSS}}`
        }

        return null
      })
      .filter(Boolean)
      .join('\n')

    return { css }
  }

  return { css: '' }
}
