import React from 'react'
import styled from '@emotion/styled'
import { Input, Switch, FormRow } from 'dnb-ui-lib/components'
import { useAppStore } from '../core/Store'

export default function ThemeFilter({ cacheKey, ...props }) {
  return (
    <FormRowArea {...props}>
      <SearchInput cacheKey={cacheKey} right="1rem" />
      <ToggleActive cacheKey={cacheKey} right="1rem" />
    </FormRowArea>
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

const FormRowArea = styled(FormRow)`
  padding: 1rem;
  background: var(--color-white);
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
