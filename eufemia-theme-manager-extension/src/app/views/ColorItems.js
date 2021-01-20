import React from 'react'
import classnames from 'classnames'
import styled from '@emotion/styled'
import { TwitterPicker, SketchPicker } from 'react-color'
import Color from 'color'
import {
  Space,
  Switch,
  FormRow,
  Button,
  Icon,
  Number,
  FormStatus,
} from 'dnb-ui-lib/components'
import { H3, P, Hr } from 'dnb-ui-lib/elements'
import { arrow_right } from 'dnb-ui-lib/icons'
import { useTheme, useAppStore } from '../core/Store'
import {
  originalColorsAsArray,
  fillRemaningColors,
} from '../../shared/ColorController'
import { applyFilter } from '../core/Utils'
import { useScrollPosition } from '../hooks/Window'

const originalPickerColors = originalColorsAsArray.map(({ value }) => value)
const originalPickerColorsWithTitle = originalColorsAsArray.map(
  ({ key, value }) => ({ color: value, title: key })
)

export default function ColorItems({ cacheKey = 'colors' } = {}) {
  useScrollPosition()
  const { getHostData, getFilter } = useAppStore()
  const { selectedThemeId } = getHostData()
  const { colorsList, useColorTools } = useTheme(selectedThemeId)
  const { setColor, resetColor, changeColor } = useColorTools()

  if (['dnb-ui', 'blue-test', '2x-test'].includes(selectedThemeId)) {
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
  const colors = applyFilter(
    filter,
    fillRemaningColors(originalColorsAsArray, colorsList)
  )

  return (
    <List>
      {colors.length === 0 && (
        <Item key="empty">
          <ItemLayout>Noting found 🤷‍♂️</ItemLayout>
        </Item>
      )}

      {colors.map((params) => {
        const { key, value, name, change, useCustomColor } = params
        const contrastValue = change
          ? Color(value).contrast(Color(change))
          : null

        const enabled = change ? true : false

        return (
          <Item key={key} className={classnames(enabled && 'is-enabled')}>
            <ItemLayout>
              <ColorArea right="1rem" bottom="1rem">
                <H3 bottom="0.5rem" size="small">
                  {name}
                </H3>

                <ColorAreaHorizontal>
                  <OriginalColor
                    style={{ color: value }}
                    aria-label={`Original Color ${value}`}
                  >
                    {value}
                  </OriginalColor>

                  <P>
                    <Icon right="0.25rem" icon={arrow_right} />
                    {contrastValue && (
                      <span className="dnb-p--x-small" title="Contrast">
                        <Number decimals={1}>{contrastValue}</Number>
                      </span>
                    )}
                  </P>

                  <NewColor
                    style={{ color: change || value }}
                    aria-label={`New Color ${value}`}
                  >
                    {enabled ? (
                      change || value
                    ) : (
                      <svg>
                        <line x1="0" y1="100%" x2="100%" y2="0" />
                        <line x1="0" y1="0" x2="100%" y2="100%" />
                      </svg>
                    )}
                  </NewColor>
                </ColorAreaHorizontal>
              </ColorArea>

              <FormRow direction="vertical">
                <SimpleColorPicker>
                  {useCustomColor ? (
                    <SketchPicker
                      // width="16rem"
                      width="21rem"
                      color={change || value}
                      presetColors={originalPickerColorsWithTitle}
                      disableAlpha={true}
                      onChange={({ hex }) => setColor(key, hex, params)}
                    />
                  ) : (
                    <TwitterPicker
                      // width="28.5rem"
                      width="22rem"
                      color={change || value}
                      colors={originalPickerColors}
                      triangle="hide"
                      onChange={({ hex }) => setColor(key, hex, params)}
                    />
                  )}
                </SimpleColorPicker>

                <FormRow top="0.5rem" centered direction="horizontal">
                  <Switch
                    label="Custom color"
                    label_position="left"
                    checked={useCustomColor}
                    on_change={({ checked }) => {
                      changeColor(key, { useCustomColor: checked })
                    }}
                  />
                  {enabled && (
                    <Button
                      text="Reset color"
                      variant="tertiary"
                      icon="close"
                      icon_position="left"
                      left="1rem"
                      size="small"
                      on_click={() => {
                        resetColor(key)
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

const SimpleColorPicker = styled(Space)`
  /** Works best on CirclePicker and TwitterPicker */
  span div {
    border: 1px solid var(--color-black-8);
  }
`

const OriginalColor = styled.section`
  width: 4rem;
  height: 4rem;

  border-radius: 0.5rem;
  border: 1px solid var(--color-black-20);
  background-color: currentColor;
  color: #e9e9e9;
`
const NewColor = styled(OriginalColor)`
  background-color: transparent;
  .is-enabled & {
    background-color: currentColor;
  }

  svg {
    width: 100%;
    height: 100%;
    padding: 0.5rem;
  }
  svg line {
    stroke: var(--color-black-20);
    stroke-width: 1;
  }
`
const List = styled.ul`
  padding: 0 var(--spacing-small);
  list-style: none;
`
const Item = styled.li`
  margin-bottom: var(--spacing-x-small);

  /* opacity: 0.6; */
  /* &.is-enabled {
    opacity: 1;
  } */
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
const ColorArea = styled(Space)`
  display: flex;
  flex-direction: column;
  /* align-items: space-evenly; */

  min-width: 13.5rem;
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
const ColorAreaHorizontal = styled(Space)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`
