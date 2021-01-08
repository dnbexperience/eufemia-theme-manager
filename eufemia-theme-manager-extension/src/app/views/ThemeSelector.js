import React from 'react'
import styled from '@emotion/styled'
import { Dropdown, Switch } from 'dnb-ui-lib'
import { useThemeStore, useHostStore } from '../core/Store'
import { FormRow } from 'dnb-ui-lib'

export default function ThemeSelector(props) {
  return (
    <ThemeSelectorArea>
      <FormRow {...props}>
        <ThemePicker right="1rem" />
        <ToggleEnabled right="1rem" />
      </FormRow>
    </ThemeSelectorArea>
  )
}

export function ThemePicker(props) {
  const { getThemes } = useThemeStore()
  const { getHostData, setCurrentThemeId } = useHostStore()
  const { currentThemeId } = getHostData()

  const themesList = Object.entries(getThemes()).map(([key]) => key)

  return (
    <StyledDropdown
      skip_portal
      label="In use:"
      value={currentThemeId}
      data={themesList}
      on_change={({ data }) => {
        setCurrentThemeId(data)
      }}
      {...props}
    />
  )
}

const StyledDropdown = styled(Dropdown)`
  --dropdown-width: 10rem;
`

const ThemeSelectorArea = styled.div`
  position: sticky;
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;

  padding: 1rem;

  background: var(--color-white);
  border-bottom: 1px solid var(--color-black-8);

  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.16);
`

export function ToggleEnabled(porps) {
  const { setEnabled, getHostData } = useHostStore()
  const { enabled, currentThemeId } = getHostData()
  return (
    <Switch
      label="Enabled"
      label_position="left"
      checked={enabled}
      disabled={!currentThemeId}
      on_change={({ checked }) => setEnabled(checked)}
      {...porps}
    />
  )
}
