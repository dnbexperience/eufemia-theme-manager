import properties from '@dnb/eufemia/style/properties'

export const originalFontsizesAsObject = getOriginalFontsizesAsObject()
export const originalFontsizesAsArray = getOriginalFontsizesAsArray()

export function fillRemaningFontsizes(
  originalFontsizesList,
  customFontsizesList
) {
  const keyRef = originalFontsizesAsObject
  const notInList = (customFontsizesList || []).filter(
    ({ key }) => !keyRef[key]
  )

  if (
    !(customFontsizesList?.findIndex(({ key }) => key === 'font-size') > -1)
  ) {
    originalFontsizesList = [
      { key: 'font-size', name: 'Set font-size', value: null, change: null },
    ].concat(originalFontsizesList)
  }

  return notInList.concat(
    originalFontsizesList
      .map((item) => ({
        ...item,
        ...(customFontsizesList || []).find(({ key }) => key === item.key),
      }))
      .filter(({ key }) => key) // should have a key
  )
}

export function getOriginalFontsizesAsArray() {
  const fontsizes = Object.entries(originalFontsizesAsObject).map(
    ([key, value]) => {
      const name = key.replace(/--font-size-/g, ' ').trim()
      return { key, name, value }
    }
  )

  return fontsizes
}

export function getOriginalFontsizesAsObject() {
  const fontsizes = Object.entries(properties)
    .filter(([name]) => name.includes('--font-size-'))
    .reduce((acc, [key, value]) => {
      acc[key] = value
      if (key.includes('--em')) delete acc[key]
      return acc
    }, {})

  return fontsizes
}

export const generateThemeIgnoreFontsizes = () =>
  originalFontsizesAsArray
    .map(({ key, value }) => {
      return `${key}: ${value};`
    })
    .join('\n')
