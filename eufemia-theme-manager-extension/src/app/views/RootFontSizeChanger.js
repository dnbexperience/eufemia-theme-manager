import React from 'react'
import styled from '@emotion/styled'
import {
  Space,
  FormRow,
  Button,
  Icon,
  Hr,
  Slider,
  FormStatus,
  H3,
} from 'dnb-ui-lib'
import { arrow_right } from 'dnb-ui-lib/icons'
import { useTheme, useAppStore } from '../core/Store'
import { useScrollPosition } from '../hooks/Window'

export default function FontsizeTools({ cacheKey = 'fontsize' } = {}) {
  useScrollPosition()
  const { getHostData } = useAppStore()
  const { selectedThemeId } = getHostData()
  const { fontsizesList, useFontsizeTools } = useTheme(selectedThemeId)
  const { setRootFontsize } = useFontsizeTools()

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

  const rootFontSizeOrig =
    fontsizesList?.find(({ key }) => key === 'root-font-size')?.value || null
  const rootFontSize = rootFontSizeOrig || 16

  return (
    <List>
      <Item key="font-size">
        <ItemLayout>
          <FontsizeArea right="1rem" bottom="1rem">
            <FontsizeAreaHorizontal>
              <H3 size="small">Root font-size</H3>

              <Icon right="0.25rem" icon={arrow_right} />

              <NewFontsize aria-label={`Root Font-size ${rootFontSize}`}>
                {rootFontSize}px
              </NewFontsize>
            </FontsizeAreaHorizontal>
          </FontsizeArea>

          <FormRow direction="vertical">
            <Slider
              stretch
              min={8}
              max={64}
              step={1}
              value={rootFontSize}
              // label="Root font-size:"
              onDoubleClick={() => setRootFontsize(null)}
              on_change={({ value }) => {
                setRootFontsize(value)
              }}
            />
            <FormRow top="0.5rem" centered direction="horizontal">
              {rootFontSizeOrig && (
                <Button
                  text="Reset font-size"
                  variant="tertiary"
                  icon="close"
                  icon_position="left"
                  // left="1rem"
                  size="small"
                  on_click={() => {
                    setRootFontsize(null)
                  }}
                />
              )}
            </FormRow>
          </FormRow>
        </ItemLayout>
      </Item>
    </List>
  )
}

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
