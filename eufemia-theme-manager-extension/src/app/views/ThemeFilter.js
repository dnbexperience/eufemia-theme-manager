import React from 'react'
import styled from '@emotion/styled'
import { Input, Switch } from 'dnb-ui-lib'
import { useHostStore } from '../core/Store'
import { FormRow } from 'dnb-ui-lib'

export default function ThemeFilter(props) {
  return (
    <ThemeFilterArea>
      <FormRow {...props}>
        <ThemePicker right="1rem" />
        <ToggleEnabled right="1rem" />
      </FormRow>
    </ThemeFilterArea>
  )
}

let timeout
export function ThemePicker(props) {
  const { setFilter, getHostData } = useHostStore()
  const { filter } = getHostData()
  const [value, setValue] = React.useState(filter?.value)

  return (
    <Input
      label="Filter:"
      placeholder="Search value ..."
      value={value}
      on_change={({ value }) => {
        setValue(value)
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          setFilter({ value })
        }, 300)
      }}
      {...props}
    />
  )
}

const ThemeFilterArea = styled.div`
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
  const { setFilter, getHostData } = useHostStore()
  const { filter } = getHostData()
  return (
    <Switch
      label="Changed values"
      // label_position="left"
      checked={filter?.active}
      on_change={({ checked }) => setFilter({ active: checked })}
      {...porps}
    />
  )
}
