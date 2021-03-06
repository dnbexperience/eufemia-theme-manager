import React from 'react'
import classnames from 'classnames'
import styled from '@emotion/styled'
import {
  Space,
  FormRow,
  Button,
  Icon,
  Slider,
  Dropdown,
  FormStatus,
} from '@dnb/eufemia/components'
import { H3, Hr } from '@dnb/eufemia/elements'
import { arrow_right } from '@dnb/eufemia/icons'
import { useTheme, useAppStore } from '../core/Store'
import {
  originalSpacingsAsArray,
  fillRemaningSpacings,
} from '../../shared/SpacingController'
import { applyFilter } from '../core/Utils'
import { useScrollPosition } from '../hooks/Window'

const originalPickerSpacingsWithTitle = originalSpacingsAsArray.map(
  ({ key, name, value }) => ({
    content: `${name} (${value})`,
    key,
    value,
  })
)

originalPickerSpacingsWithTitle.unshift({
  content: 'Custom Spacing',
  key: 'custom-spacing',
  value: '16px',
})

export default function SpacingTools({ cacheKey = 'spacing' } = {}) {
  useScrollPosition()
  const { getHostData, getFilter } = useAppStore()
  const { selectedThemeId } = getHostData()
  const { spacingsList, useSpacingTools } = useTheme(selectedThemeId)
  const { setSpacing, resetSpacing } = useSpacingTools()

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
  const spacings = applyFilter(
    filter,
    fillRemaningSpacings(originalSpacingsAsArray, spacingsList)
  )

  return (
    <List>
      {spacings.length === 0 && (
        <Item key="empty">
          <ItemLayout>Noting found 🤷‍♂️</ItemLayout>
        </Item>
      )}

      {spacings.map((params) => {
        const { key, value, name, change } = params

        const enabled = change ? true : false

        return (
          <Item key={key} className={classnames(enabled && 'is-enabled')}>
            <ItemLayout>
              <SpacingArea right="1rem" bottom="1rem">
                <H3 bottom="0.5rem" size="small">
                  {name}
                </H3>

                <SpacingAreaHorizontal>
                  <OriginalSpacing aria-label={`Original Spacing ${value}`}>
                    {value}
                  </OriginalSpacing>

                  <Icon right="0.25rem" icon={arrow_right} />

                  <NewSpacing aria-label={`New Spacing ${value}`}>
                    {enabled ? (
                      change || value
                    ) : (
                      <svg>
                        <line x1="0" y1="100%" x2="100%" y2="0" />
                        <line x1="0" y1="0" x2="100%" y2="100%" />
                      </svg>
                    )}
                  </NewSpacing>
                </SpacingAreaHorizontal>
              </SpacingArea>

              <FormRow direction="vertical">
                <SimpleSpacingPicker>
                  {change && change.endsWith('px') ? (
                    <SpacingSlider
                      value={parseFloat(change) || 16}
                      onDoubleClick={() => resetSpacing(key)}
                      on_change={({ value }) => {
                        setSpacing(key, `${value}px`, params)
                      }}
                    />
                  ) : (
                    <StyledDropdown
                      title="Choose a spacing"
                      skip_portal
                      value={originalPickerSpacingsWithTitle.findIndex(
                        ({ value }) => value === change
                      )}
                      data={originalPickerSpacingsWithTitle}
                      on_change={({ data: { key: _key, value: _value } }) => {
                        if (_key === 'custom-spacing') {
                          const v = parseFloat(value)
                          if (v > 0) {
                            _value = `${v * 16}px`
                          }
                        }
                        setSpacing(key, _value, params)
                      }}
                    />
                  )}
                </SimpleSpacingPicker>

                <FormRow top="0.5rem" centered direction="horizontal">
                  {enabled && (
                    <Button
                      text="Reset spacing"
                      variant="tertiary"
                      icon="close"
                      icon_position="left"
                      size="small"
                      on_click={() => {
                        resetSpacing(key)
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

const SpacingSlider = (props) => (
  <Slider
    stretch
    min={2}
    max={256}
    step={1}
    title="Set custom spacing"
    {...props}
  />
)

const StyledDropdown = styled(Dropdown)`
  --dropdown-width: 14rem;
`

const SimpleSpacingPicker = styled(Space)`
  /** Works best on CirclePicker and TwitterPicker */
  span div {
    border: 1px solid var(--color-black-8);
  }
`

const OriginalSpacing = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 5rem;
  height: 2rem;

  border-radius: 0.5rem;
  border: 1px solid var(--color-black-20);
`
const NewSpacing = styled(OriginalSpacing)`
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
  padding: 0 var(--spacing-small);
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
const SpacingArea = styled(Space)`
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
const SpacingAreaHorizontal = styled(Space)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`
