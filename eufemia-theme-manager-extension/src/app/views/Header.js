import React from 'react'
import styled from '@emotion/styled'
import { H1 } from '@dnb/eufemia/elements'
import ThemeSelector from './ThemeSelector'
import ImportExport from './ImportExport'

export default function Header() {
  return (
    <HeaderArea>
      <H1 className="dnb-sr-only" size="medium">
        Eufemia Theme Manager
      </H1>
      <ThemeSelector />
      <ImportExport left="1rem" />
    </HeaderArea>
  )
}

const HeaderArea = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  min-height: 4rem;

  padding: 0 1rem;

  .dnb-form-row__fieldset {
    width: auto;
  }
  h1 {
    white-space: nowrap;
  }

  &,
  label {
    color: var(--color-white);
  }

  background: var(--color-black-80);
`
