import React from 'react'
import { css, Global } from '@emotion/react'
import styled from '@emotion/styled'
import { Tabs, Space } from '@dnb/eufemia/components'
import { ScrollView } from '@dnb/eufemia/fragments'
import { P } from '@dnb/eufemia/elements'
import Header from './views/Header'
import ThemeFilter from './views/ThemeFilter'
import { generateThemeIgnoreColors } from '../shared/ColorController'
import { generateThemeIgnoreSpacings } from '../shared/SpacingController'
import { generateThemeIgnoreFontsizes } from '../shared/FontsizeController'
import Toolbar from './views/Toolbar'
import ColorItems from './views/ColorItems'
import SpacingItems from './views/SpacingItems'
import FontsizeItems from './views/FontsizeItems'
import ExtensionError from './views/ExtensionError'
import { useRehydrationMiddleware } from './hooks/StoreUtils'
import { useCompilerListener } from '../shared/Compiler'
import { getHost } from '../shared/Bridge'
import { isDev } from '../shared/Browser'
import { waitForPromise } from './core/Utils'
import { useAppStore } from './core/Store'

function GlobalStyles() {
  const [dnbThemeIgnore__willBeReplaced] = React.useState(() => {
    return [
      generateThemeIgnoreColors(),
      generateThemeIgnoreSpacings(),
      generateThemeIgnoreFontsizes(),
    ].join('')
  })

  return (
    <Global
      styles={css`
        :root {
          --extension-width: 40rem; /* max 800px (50rem) */
          --extension-height: 37.5rem; /* max 600px */

          overscroll-behavior-y: none; /* Disable smooth overscroll during an open modal  */
        }

        ${isDev ? 'html{ font-size: 100% !important; }' : ''}

        body {
          /* The extension has it's own scroller, so this helps the Modal */
          width: var(--extension-width);
          height: var(--extension-height);
          overscroll-behavior-x: none;
          overscroll-behavior-y: none;

          background-color: var(--color-white);
        }

        .dnb-theme-ignore__willBeReplaced {
          ${dnbThemeIgnore__willBeReplaced}
        }
      `}
    />
  )
}

export default function App() {
  return (
    <ThemeIgnore>
      <GlobalStyles />

      <React.Suspense fallback={<Indicator />}>
        <Content />
      </React.Suspense>
    </ThemeIgnore>
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
  const { getHostData, setSelectedTab } = useAppStore()
  const { selectedTab } = getHostData()

  return (
    <Main>
      <ErrorArea>
        <ExtensionError />
      </ErrorArea>

      <TabsArea left="small">
        <Tabs
          id="main-view"
          tabs_style="mint-green"
          data={[
            { title: 'Colors', key: 'colors' },
            { title: 'Spacing', key: 'spacings' },
            { title: 'Font Size', key: 'fontsizes' },
          ]}
          selected_key={selectedTab}
          on_change={({ selected_key }) => {
            setSelectedTab(selected_key)
          }}
        />
      </TabsArea>

      <ScrollView>
        <Tabs.Content id="main-view">
          {({ key }) => {
            const content = {
              colors: () => (
                <>
                  <StyledFilterArea key="colors" cacheKey="colors" />
                  <ColorItems />
                </>
              ),
              spacings: () => (
                <>
                  <StyledFilterArea key="spacing" cacheKey="spacing" />
                  <SpacingItems />
                </>
              ),
              fontsizes: () => (
                <>
                  <StyledFilterArea key="fontsize" cacheKey="fontsize" />
                  <FontsizeItems />
                </>
              ),
            }

            return content[key]()
          }}
        </Tabs.Content>
      </ScrollView>
    </Main>
  )
}

const ErrorArea = styled.div`
  position: fixed;
  z-index: 11;
  top: 0;
  left: 0;
  right: 0;
`

const StyledFilterArea = styled(ThemeFilter)`
  padding-top: 6rem;
  background-color: var(--color-white);
`

const TabsArea = styled(Space)`
  position: fixed;
  z-index: 10;
  top: 4rem;
  left: 0;
  right: 0;

  background-color: var(--color-white);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.16);
`

const Layout = styled.div`
  /* Fixes the Modal issues */
  width: var(--extension-width);
  height: var(--extension-height);
`

const Main = styled.main`
  /* To ensure we have a scrollbar in HTML */
  min-height: 101vh;

  padding-bottom: 6rem;
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
      <P>Booting up</P>
    </IndicatorArea>
  )
}

function ThemeIgnore({ children }) {
  return <div className="dnb-theme-ignore__willBeReplaced">{children}</div>
}
