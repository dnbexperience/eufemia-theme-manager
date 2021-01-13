import React from 'react'
import styled from '@emotion/styled'
import { Dropdown, Switch } from 'dnb-ui-lib'
import { useThemeStore, useHostStore } from '../core/Store'
import { FormRow } from 'dnb-ui-lib'

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
  const { getHostData, setCurrentThemeId } = useHostStore()
  const { currentThemeId } = getHostData()

  const themesList = Object.entries(getThemes()).map(([key]) => key)

  return (
    <StyledDropdown
      skip_portal
      // label="In use:"
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
