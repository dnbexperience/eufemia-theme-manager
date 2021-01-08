import styled from '@emotion/styled'
import ThemeManager from './ThemeManager'

export default function Toolbar() {
  return (
    <ToolbarArea>
      <ThemeManager />
    </ToolbarArea>
  )
}

const ToolbarArea = styled.footer`
  display: flex;
  align-items: center;

  position: fixed;
  z-index: 10;
  bottom: 0;
  left: 0;
  right: 0;
  padding-left: var(--spacing-small);

  width: var(--extension-width);
  min-height: 4rem;

  background: var(--color-white);
  box-shadow: 0 -1px 6px rgba(0, 0, 0, 0.16);
  /* border-bottom: 1px solid var(--color-black-80); */
  border-top: none;
`
