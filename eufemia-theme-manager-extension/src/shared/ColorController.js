import properties from '@dnb/eufemia/style/properties'

export const originalColorsAsObject = getOriginalColorsAsObject()
export const originalColorsAsArray = getOriginalColorsAsArray()

export function fillRemaningColors(originalColorsList, customColorsList) {
  const keyRef = originalColorsAsObject
  const notInList = (customColorsList || []).filter(({ key }) => !keyRef[key])

  return notInList.concat(
    originalColorsList
      .map((item) => ({
        ...item,
        ...(customColorsList || []).find(({ key }) => key === item.key),
      }))
      .filter(({ key }) => key) // should have a key
  )
}

export function getOriginalColorsAsArray() {
  const colors = Object.entries(originalColorsAsObject).map(([key, value]) => {
    const name = key
      .replace(/--color-/g, ' ')
      .replace(/-/g, ' ')
      .trim()
      .replace(/(^|\s)([a-z])/g, (s) => s.toUpperCase())
    return { key, name, value }
  })

  return colors
}

export function getOriginalColorsAsObject() {
  const colors = Object.entries(properties)
    .filter(([name]) => name.includes('--color-'))
    .reduce((acc, [key, value]) => {
      acc[key] = value
      if (key.includes('-border')) delete acc[key]
      if (key.includes('-background')) delete acc[key]
      if (key.includes('-light')) delete acc[key]
      if (key.includes('-medium')) delete acc[key]
      return acc
    }, {})

  delete colors['--color-sea-green-alt-30']
  delete colors['--color-signal-yellow-30']
  delete colors['--color-black-30']
  delete colors['--color-sea-green-alt']
  delete colors['--color-signal-yellow']

  return colors
}

export const generateThemeIgnoreColors = () =>
  originalColorsAsArray
    .map(({ key, value }) => {
      return `${key}: ${value};`
    })
    .join('\n')
