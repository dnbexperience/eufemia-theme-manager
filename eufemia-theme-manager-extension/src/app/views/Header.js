import React from 'react'
// import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { H1 } from 'dnb-ui-lib'
// import ThemeSelector from './ThemeSelector'

export default function Header() {
  return (
    <HeaderArea>
      <H1 size="medium">Eufemia Theme Manager</H1>
      {/* <ThemeSelector left="1rem" /> */}
    </HeaderArea>
  )
}

const HeaderArea = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  justify-content: center;

  min-height: 4rem;

  padding: 0 1rem;

  &,
  label {
    color: var(--color-white);
  }

  background: var(--color-black-80);
`
