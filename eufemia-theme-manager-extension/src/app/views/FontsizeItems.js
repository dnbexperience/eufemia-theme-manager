import React from 'react'
import classnames from 'classnames'
import styled from '@emotion/styled'
import {
  Space,
  FormRow,
  Button,
  Icon,
  Hr,
  Dropdown,
  FormStatus,
  H3,
  P,
} from 'dnb-ui-lib'
import { arrow_right } from 'dnb-ui-lib/icons'
import { useTheme, useHostStore } from '../core/Store'
import {
  originalFontsizesAsArray,
  fillRemaningFontsizes,
} from '../../shared/FontsizeController'
import { applyFilter } from '../core/Utils'
import { useScrollPosition } from '../hooks/Window'

const originalPickerFontsizesWithTitle = originalFontsizesAsArray.map(
  ({ key, name, value }) => ({
    content: `${name} (${value})`,
    key,
    value,
  })
)

export default function FontsizeTools({ cacheKey = 'fontsize' } = {}) {
  useScrollPosition()
  const { getHostData, getFilter } = useHostStore()
  const { selectedThemeId } = getHostData()
  const { fontsizesList, useFontsizeTools } = useTheme(selectedThemeId)
  const { setFontsize, resetFontsize } = useFontsizeTools()

  if (['dnb-ui', 'blue-test'].includes(selectedThemeId)) {
    return (
      <>
        <Hr fullscreen top="1rem" />
        <FormStatus top="1rem" state="info">
          The Theme <b>{selectedThemeId}</b> can't be chnaged. Create another
          one.
        </FormStatus>
      </>
    )
  }

  const filter = getFilter(cacheKey)
  const fontsizes = applyFilter(
    filter,
    fillRemaningFontsizes(originalFontsizesAsArray, fontsizesList)
  )

  return (
    <List>
      {fontsizes.length === 0 && (
        <Item key="empty">
          <ItemLayout>Noting found</ItemLayout>
        </Item>
      )}

      {fontsizes.map((params) => {
        const { key, value, name, change } = params

        const enabled = change ? true : false

        return (
          <Item key={key} className={classnames(enabled && 'is-enabled')}>
            <ItemLayout>
              <FontsizeArea right="1rem" bottom="1rem">
                <H3 bottom="0.5rem" size="small">
                  {name}
                </H3>

                <FontsizeAreaHorizontal>
                  <OriginalFontsize aria-label={`Original Fontsize ${value}`}>
                    {value}
                  </OriginalFontsize>

                  <P>
                    <Icon right="0.25rem" icon={arrow_right} />
                  </P>

                  <NewFontsize aria-label={`New Fontsize ${value}`}>
                    {enabled ? (
                      change || value
                    ) : (
                      <svg>
                        <line x1="0" y1="100%" x2="100%" y2="0" />
                        <line x1="0" y1="0" x2="100%" y2="100%" />
                      </svg>
                    )}
                  </NewFontsize>
                </FontsizeAreaHorizontal>
              </FontsizeArea>

              <FormRow direction="vertical">
                <SimpleFontsizePicker>
                  <StyledDropdown
                    title="Choose a font-size"
                    // label="Theme to Edit:"
                    skip_portal
                    value={originalPickerFontsizesWithTitle.findIndex(
                      ({ value }) => value === change
                    )}
                    data={originalPickerFontsizesWithTitle}
                    on_change={({ data: { value } }) => {
                      setFontsize(key, value, params)
                    }}
                  />
                </SimpleFontsizePicker>

                <FormRow top="0.5rem" centered direction="horizontal">
                  {enabled && (
                    <Button
                      text="Reset font-size"
                      variant="tertiary"
                      icon="close"
                      icon_position="left"
                      left="1rem"
                      size="small"
                      on_click={() => {
                        resetFontsize(key)
                      }}
                    />
                  )}
                </FormRow>
              </FormRow>
            </ItemLayout>
          </Item>
        )
      })}
    </List>
  )
}

const StyledDropdown = styled(Dropdown)`
  --dropdown-width: 14rem;
`

const SimpleFontsizePicker = styled(Space)`
  /** Works best on CirclePicker and TwitterPicker */
  span div {
    border: 1px solid var(--color-black-8);
  }
`

const OriginalFontsize = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 5rem;
  height: 2rem;

  border-radius: 0.5rem;
  border: 1px solid var(--color-black-20);
`
const NewFontsize = styled(OriginalFontsize)`
  svg {
    width: 2rem;
    height: 2rem;
    padding: 0.5rem;
  }
  svg line {
    stroke: var(--color-black-20);
    stroke-width: 1;
  }
`
const List = styled.ul`
  padding: 0;
  list-style: none;
`
const Item = styled.li`
  margin-bottom: var(--spacing-x-small);
`
const ItemLayout = styled(Space)`
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  padding: var(--spacing-small);

  border-radius: 0.5rem;
  border: 1px solid var(--color-black-8);
  background-color: var(--color-black-3);
`
const FontsizeArea = styled(Space)`
  display: flex;
  flex-direction: column;

  min-width: 16rem;
  padding: var(--spacing-small);

  border-radius: 0.5rem;
  border: 1px solid var(--color-black-8);
  background-color: var(--color-white);

  *[class*='dnb-h--'] {
    white-space: nowrap;
    margin-top: 0;
    text-align: center;
  }
`
const FontsizeAreaHorizontal = styled(Space)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`
