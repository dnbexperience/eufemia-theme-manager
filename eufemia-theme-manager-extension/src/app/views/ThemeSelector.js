import React from 'react'
import styled from '@emotion/styled'
import { Dropdown, Switch, FormRow } from '@dnb/eufemia/components'
import { useThemeStore, useAppStore } from '../core/Store'

export default function ThemeSelector(props) {
  return (
    <FormRow {...props}>
      <ThemePicker right="1rem" />
      <ToggleEnabled right="1rem" />
    </FormRow>
  )
}

export function ThemePicker(props) {
  const { getThemes } = useThemeStore()
  const { getHostData, setCurrentThemeId } = useAppStore()
  const { currentThemeId } = getHostData()

  const themesList = Object.entries(getThemes()).map(([key]) => key)

  return (
    <StyledDropdown
      skip_portal
      label="Theme in use:"
      title="Used theme:"
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

export function ToggleEnabled(props) {
  const { setEnabled, getHostData } = useAppStore()
  const { enabled, currentThemeId } = getHostData()
  return (
    <Switch
      label="Enabled"
      label_position="left"
      checked={enabled}
      disabled={!currentThemeId}
      on_change={({ checked }) => setEnabled(checked)}
      {...props}
    />
  )
}
