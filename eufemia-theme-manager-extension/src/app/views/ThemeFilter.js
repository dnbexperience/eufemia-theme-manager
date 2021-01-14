import React from 'react'
import styled from '@emotion/styled'
import { Input, Switch } from 'dnb-ui-lib'
import { useAppStore } from '../core/Store'
import { FormRow } from 'dnb-ui-lib'

export default function ThemeFilter({ cacheKey, ...props }) {
  return (
    <ThemeFilterArea>
      <FormRow {...props}>
        <SearchInput cacheKey={cacheKey} right="1rem" />
        <ToggleActive cacheKey={cacheKey} right="1rem" />
      </FormRow>
    </ThemeFilterArea>
  )
}

let timeout
function SearchInput({ cacheKey, ...props }) {
  const { setFilter, getFilter } = useAppStore()
  const filter = getFilter(cacheKey)
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
          setFilter(cacheKey, { value })
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

function ToggleActive({ cacheKey, ...props }) {
  const { setFilter, getFilter } = useAppStore()
  const filter = getFilter(cacheKey)
  return (
    <Switch
      label="Changed values"
      // label_position="left"
      checked={filter?.active}
      on_change={({ checked: active }) => setFilter(cacheKey, { active })}
      {...props}
    />
  )
}
