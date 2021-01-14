import React from 'react'
import { css, Global } from '@emotion/react'
import styled from '@emotion/styled'
import { P } from 'dnb-ui-lib/elements'
import { ScrollView } from 'dnb-ui-lib/fragments'
import { Tabs } from 'dnb-ui-lib/components'
import Header from './views/Header'
import ThemeFilter from './views/ThemeFilter'
import { generateThemeIgnoreColors } from '../shared/ColorController'
import Toolbar from './views/Toolbar'
import ColorItems from './views/ColorItems'
import SpacingItems from './views/SpacingItems'
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

  return (
    <Layout>
      <Header />
      <Toolbar />
      <TabsWithContent />
    </Layout>
  )
}

function TabsWithContent() {
  const { getHostData, setSelectedTab } = useHostStore()
  const { selectedTab } = getHostData()

  return (
    <Main>
      <StyledTabs
        data={[
          { title: 'Colors', key: 'colors' },
          { title: 'Spacing', key: 'spacing' },
        ]}
        selected_key={selectedTab}
        on_change={({ selected_key }) => {
          setSelectedTab(selected_key)
        }}
        section_style="mint-green"
      >
        {{
          colors: (
            <>
              <ThemeFilter key="colors" cacheKey="colors" />
              <ScrollView>
                <ScrollViewInner>
                  <ColorItems />
                </ScrollViewInner>
              </ScrollView>
            </>
          ),
          spacing: (
            <>
              <ThemeFilter key="spacing" cacheKey="spacing" />
              <ScrollView>
                <ScrollViewInner>
                  <SpacingItems />
                </ScrollViewInner>
              </ScrollView>
            </>
          ),
        }}
      </StyledTabs>
    </Main>
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
`

const StyledTabs = styled(Tabs)`
  .dnb-tabs__button__snap:first-of-type {
    padding-left: var(--spacing-small);
  }
  .dnb-tabs__content {
    margin-top: 0;
  }
`

const ScrollViewInner = styled.div`
  min-height: var(--extension-height);
  padding: 0 var(--spacing-x-small);
  padding-bottom: 4rem;
`

const Main = styled.main`
  /* padding: 0 var(--spacing-x-small); */
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
