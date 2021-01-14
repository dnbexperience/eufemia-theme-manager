import properties from 'dnb-ui-lib/style/properties'

export const originalSpacingsAsObject = getOriginalSpacingsAsObject()
export const originalSpacingsAsArray = getOriginalSpacingsAsArray()

export function fillRemaningSpacings(originalSpacingsList, customSpacingsList) {
  const keyRef = originalSpacingsAsObject
  const notInList = (customSpacingsList || []).filter(({ key }) => !keyRef[key])
  // .map((item) => ({ ...item, enabled: false }))

  return originalSpacingsList
    .map((item) => ({
      ...item,
      // enabled: false,
      ...(customSpacingsList || []).find(({ key }) => key === item.key),
    }))
    .concat(notInList)
    .filter(({ key }) => key) // should have a key
}

export function getOriginalSpacingsAsArray() {
  const spacings = Object.entries(originalSpacingsAsObject).map(
    ([key, value]) => {
      const name = key
        .replace(/--spacing-/g, ' ')
        // .replace(/-/g, ' ')
        .trim()
      // .replace(/(^[a-z]+)/g, (s) => s.toUpperCase())
      return { key, name, value }
    }
  )

  return spacings
}

export function getOriginalSpacingsAsObject() {
  const spacings = Object.entries(properties)
    .filter(([name]) => name.includes('--spacing-'))
    .reduce((acc, [key, value]) => {
      acc[key] = value
      return acc
    }, {})

  return spacings
}

export const generateThemeIgnoreSpacings = () =>
  originalSpacingsAsArray
    .map(({ key, value }) => {
      return `${key}: ${value};`
    })
    .join('\n')
