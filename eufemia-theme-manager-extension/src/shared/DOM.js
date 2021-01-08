import { getOffsetTop, getOffsetLeft } from 'dnb-ui-lib/shared/helpers'

const containers = [] // stores container HTMLElement references
const styleElements = [] // stores {prepend: HTMLElement, append: HTMLElement}

export function insertCSS(
  css,
  {
    elementId = 'inserted-css',
    replace = true,
    prepend = false,
    targetElement = document.querySelector('head'),
  } = {}
) {
  css = String(css || '')
  const position = prepend === true ? 'prepend' : 'append'
  let containerId = containers.indexOf(targetElement)

  // first time we see this container, create the necessary entries
  if (containerId === -1) {
    containerId = containers.push(targetElement) - 1
    styleElements[containerId] = {}
  }

  // try to get the corresponding container + position styleElement, create it otherwise
  let styleElement

  if (
    typeof styleElements[containerId] !== 'undefined' &&
    typeof styleElements[containerId][elementId] !== 'undefined'
  ) {
    styleElement = styleElements[containerId][elementId]
  } else {
    styleElement = styleElements[containerId][elementId] = createStyleElement({
      elementId,
    })

    if (position === 'prepend') {
      targetElement.insertBefore(styleElement, targetElement.childNodes[0])
    } else {
      targetElement.appendChild(styleElement)
    }
  }

  // strip potential UTF-8 BOM if css was read from a file
  if (css.charCodeAt(0) === 0xfeff) {
    css = css.substr(1, css.length)
  }

  // actually add the stylesheet
  if (replace) {
    if (styleElement.styleSheet) {
      styleElement.styleSheet.cssText = css
    } else {
      styleElement.textContent = css
    }
  } else {
    if (styleElement.styleSheet) {
      styleElement.styleSheet.cssText += css
    } else {
      styleElement.textContent += css
    }
  }

  return styleElement
}

function createStyleElement({ elementId = null } = {}) {
  const styleElement = document.createElement('style')
  styleElement.setAttribute('type', 'text/css')
  if (elementId) {
    styleElement.setAttribute('id', elementId)
  }

  return styleElement
}

function constructCSSPath(el) {
  if (!(el instanceof Element)) {
    return // stop here
  }
  const VALID_CLASSNAME = /^[_a-zA-Z\- ]*$/
  let path = []

  while (el.nodeType === Node.ELEMENT_NODE) {
    let selector = el.nodeName.toLowerCase()
    if (el.id) {
      selector += `#${el.id}`
      path.unshift(selector)
      break
    } else if (el.className && VALID_CLASSNAME.test(el.className)) {
      selector += `.${el.className.trim().replace(/\s+/g, '.')}`
    } else {
      let sib = el,
        nth = 1
      while ((sib = sib.previousElementSibling)) {
        if (sib.nodeName.toLowerCase() === selector) nth++
      }
      if (nth !== 1) selector += ':nth-of-type(' + nth + ')'
    }
    path.unshift(selector)
    el = el.parentNode
  }

  return path.join(' > ')
}

export function createDOMInspector({
  root = 'body',
  exclude = [], // string or node Element
  preventClick = true,
  outlineStyle = '0.5rem solid rgba(0, 114, 114, 0.5)',
  onClick,
  onHover,
} = {}) {
  let selected, excludedElements

  const removeHighlight = (el) => {
    if (el) {
      el.style.outline = ''
      el.style.cursor = ''
    }
  }

  const highlight = (el) => {
    if (preventClick) {
      el.style.cursor = ''
    }
    el.style.outline = outlineStyle
    el.style.outlineOffset = `-${el.style.outlineWidth}`
  }

  const shouldBeExcluded = (ev) => {
    if (
      excludedElements &&
      excludedElements.length &&
      excludedElements.some(
        (parent) => parent === ev.target || parent.contains(ev.target)
      )
    ) {
      return true
    }
  }

  const handleMouseOver = (ev) => {
    if (shouldBeExcluded(ev)) {
      return // stop here
    }

    selected = ev.target
    highlight(selected)

    if (preventClick) {
      ev.preventDefault()
      ev.stopPropagation()
    }

    if (typeof onHover === 'function') {
      onHover({ element: ev.target, path: constructCSSPath(ev.target) })
    }
  }

  const handleMouseOut = (ev) => {
    if (shouldBeExcluded(ev)) {
      return // stop here
    }

    removeHighlight(ev.target)
  }

  const handleMouseDown = (ev) => {
    if (shouldBeExcluded(ev)) {
      return // stop here
    }

    if (preventClick) {
      ev.preventDefault()
      ev.stopPropagation()
    }
  }

  const handleClick = (ev) => {
    if (shouldBeExcluded(ev)) {
      return // stop here
    }

    if (preventClick) {
      ev.preventDefault()
      ev.stopPropagation()
    }

    if (typeof onClick === 'function') {
      onClick({ element: ev.target, path: constructCSSPath(ev.target) })
    }
  }

  const prepareExcluded = (rootEl) => {
    if (!exclude.length) {
      return []
    }
    const excludedNested = exclude.flatMap((element) => {
      if (typeof element === 'string' || element instanceof String) {
        return Array.from(rootEl.querySelectorAll(element))
      } else if (element instanceof Element) {
        return [element]
      } else if (element.length > 0 && element[0] instanceof Element) {
        return Array.from(element)
      }
      return []
    })
    return Array.from(excludedNested).flat()
  }

  const enable = (onClickCallback) => {
    const rootEl = document.querySelector(root)
    if (!rootEl) {
      return // stop here
    }

    if (exclude) {
      excludedElements = prepareExcluded(rootEl)
    }

    rootEl.addEventListener('mouseover', handleMouseOver, true)
    rootEl.addEventListener('mouseout', handleMouseOut, true)
    rootEl.addEventListener('mousedown', handleMouseDown, true)
    rootEl.addEventListener('click', handleClick, true)

    if (onClickCallback) {
      onClick = onClickCallback
    }

    // createInspectorMarker()
  }

  const cancel = () => {
    const rootEl = document.querySelector(root)
    if (!rootEl) {
      return // stop here
    }
    rootEl.removeEventListener('mouseover', handleMouseOver, true)
    rootEl.removeEventListener('mouseout', handleMouseOut, true)
    rootEl.removeEventListener('mousedown', handleMouseDown, true)
    rootEl.removeEventListener('click', handleClick, true)
    removeHighlight(selected)
  }

  return {
    enable,
    cancel,
  }
}

export function createInspectorMarker() {
  try {
    let markerEl = document.getElementById('eufmeia-theme-inspector-marker')

    if (!markerEl) {
      markerEl = document.createElement('div')
      markerEl.setAttribute('id', 'eufmeia-theme-inspector-marker')
      markerEl.style.display = 'none'
      markerEl.style.position = 'absolute'
      markerEl.style.zIndex = '9000'
      // markerEl.style.background = 'rgba(0, 114, 114, 0.5)'
      markerEl.style.transition = 'background 2s ease'
      markerEl.style.outline = '0.5rem solid rgba(0, 114, 114, 0.5)'
      document.body.appendChild(markerEl)
    }

    return {
      element: markerEl,
      hide: () => {
        if (markerEl) {
          markerEl.style.display = 'none'
        }
      },
      show: (element) => {
        if (markerEl) {
          const style = getComputedStyle(element)

          markerEl.style.display = 'block'
          markerEl.style.top = `${getOffsetTop(element)}px`
          markerEl.style.left = `${getOffsetLeft(element)}px`
          markerEl.style.width = style.width
          markerEl.style.height = style.height
          markerEl.style.background = 'rgba(0, 114, 114, 0.5)'

          setTimeout(() => {
            try {
              markerEl.style.background = 'transparent'
            } catch (e) {
              console.warn(e)
            }
          }, 300)
        }
      },
    }
  } catch (e) {
    console.warn(e)
  }
}
