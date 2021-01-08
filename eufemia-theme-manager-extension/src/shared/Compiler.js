import React from 'react'
import browser from './Browser'
import {
  useThemeStore,
  useHostStore,
  extensionStorePlain,
} from '../app/core/Store'
import { insertCSS } from './DOM'
import {
  insertCSSIntoPage,
  storeCSSInPage,
  makeThemesAvailable,
} from '../shared/Bridge'

export const useCompilerListener = () =>
  React.useState(() => new Compiler().listen())
// React.useEffect(() => new Compiler().listen(), [])

export default class Compiler {
  listen() {
    const unsubStore = useThemeStore.subscribe(this.run)
    const unsubHost = useHostStore.subscribe(this.run)

    return () => {
      unsubStore()
      unsubHost()
    }
  }
  run = () => {
    const { themes } = useThemeStore.getState()
    makeThemesAvailable(themes)

    const { getHostData } = useHostStore.getState()
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
  compileFromTheme(theme) {
    return this.buildDeclarations(theme.getThemeChanges())
  }
  buildDeclarations(listWithChanges) {
    return listWithChanges
      .filter((cur) => cur.change)
      .map(({ key, change }) => {
        return `${key}: ${change};`
      })
  }
  combineWithRoot(declarations) {
    return declarations?.length ? `:root{${declarations.join('')}}` : ''
  }
}

export function compileModifications({ modifications, themes }) {
  if (themes) {
    extensionStorePlain.setState({ themes })
    const { getTheme } = extensionStorePlain.getState()

    const css = Object.entries(modifications)
      .map(([path, { themeId }]) => {
        if (themeId && themeId !== 'inactive') {
          const theme = getTheme(themeId)
          const themeCSS = new Compiler().compileFromTheme(theme).join('')

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
