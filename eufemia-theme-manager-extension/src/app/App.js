import React from 'react'
import { css, Global } from '@emotion/react'
import styled from '@emotion/styled'
import { H2, P } from 'dnb-ui-lib/elements'
import { ScrollView } from 'dnb-ui-lib/fragments'
import { Space } from 'dnb-ui-lib/components'
import Header from './views/Header'
import ThemeSelector from './views/ThemeSelector'
import { generateThemeIgnoreColors } from '../shared/ColorController'
import Toolbar from './views/Toolbar'
import ColorItems from './views/ColorItems'
import { useRehydrationMiddleware } from './hooks/StoreUtils'
import { useCompilerListener } from '../shared/Compiler'
import { getHost } from '../shared/Bridge'
import { waitForPromise } from './core/Utils'
import { useHostStore } from './core/Store'

export default function App() {
  return (
    <ColorThemeIgnore>
      <GlobalStyles />

      <React.Suspense fallback={<Indicator />}>
        <Content />
      </React.Suspense>
    </ColorThemeIgnore>
  )
}

const useAsyncHost = waitForPromise(getHost())
const Content = () => {
  window.EXTENSION_HOST = useAsyncHost()

  useCompilerListener()
  useRehydrationMiddleware()

  // const { getHostData } = useThemeStore()
  const { selectedThemeId } = useHostStore().getHostData()

  return (
    <Layout>
      <Header />
      <ThemeSelector left="1rem" />
      <Toolbar />
      <Main>
        {/* <Space no_collapse top="0.5rem">
          <Hr light />
        </Space> */}
        <Space no_collapse top="1rem">
          <H2 align="center" size="medium">
            {selectedThemeId}
          </H2>
        </Space>
        <ScrollView>
          <ScrollViewInner>
            <ColorItems />
          </ScrollViewInner>
        </ScrollView>
      </Main>
    </Layout>
  )
}

function GlobalStyles() {
  const [dnbColorThemeIgnore__willBeReplaced] = React.useState(() =>
    generateThemeIgnoreColors()
  )

  return (
    <Global
      styles={css`
        :root {
          --extension-width: 40rem; /* max 800px (50rem) */
          --extension-height: 37rem; /* max 600px */
        }

        html,
        body {
          min-height: var(--extension-height);
        }

        body {
          overflow-y: scroll;
          overscroll-behavior-x: none;
        }

        .dnb-color-theme-ignore__willBeReplaced {
          ${dnbColorThemeIgnore__willBeReplaced}
        }
      `}
    />
  )
}

const Layout = styled.div`
  width: var(--extension-width);
  /* border: 1px solid var(--color-black-80); */
`

const ScrollViewInner = styled.div`
  min-height: var(--extension-height);
  padding-bottom: 4rem;
`

const Main = styled.main`
  padding: 0 var(--spacing-x-small);
`

const IndicatorArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: var(--extension-width);
  min-height: var(--extension-height);
`

function Indicator() {
  return (
    <IndicatorArea>
      <P>Booting up ...</P>
    </IndicatorArea>
  )
}

function ColorThemeIgnore({ children }) {
  return (
    <div className="dnb-color-theme-ignore__willBeReplaced">{children}</div>
  )
}
