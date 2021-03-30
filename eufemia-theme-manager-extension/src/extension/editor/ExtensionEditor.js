import React from 'react'
import ReactDOM from 'react-dom'
import styled from '@emotion/styled'

import { ToggleButton, Space, Dropdown } from 'dnb-ui-lib/components'
import { P } from 'dnb-ui-lib/elements'
import { Provider as EufemiaProvider } from 'dnb-ui-lib/shared'
import { chevron_down, chevron_up, add } from 'dnb-ui-lib/icons'

import { generateThemeIgnoreColors } from '../../shared/ColorController'
import { useEditorStore } from './EditorStore'
import { createDOMInspector, createInspectorMarker } from '../../shared/DOM'
import { getThemesAsync } from '../../shared/Bridge'

// import 'dnb-ui-lib/style/basis'
// import 'dnb-ui-lib/style/components'
// import 'dnb-ui-lib/style/themes/ui'

const Layout = styled.div`
  position: fixed;
  z-index: 10000;
  top: 1.5rem;
  bottom: 0;
  left: 2px;

  display: flex;
  flex-direction: column;

  width: var(--ete-width);
  height: 100vh;
  padding: 0.5rem;
  padding-top: 1rem;

  background-color: var(--color-black-3);
  border: 1px solid var(--color-black-8);
`

const EditorButton = styled(ToggleButton)`
  position: fixed;
  z-index: 10001;
  top: 2px;
  left: 2px;

  button {
    border-radius: 0;
    color: var(--color-white);
  }

  button[aria-pressed='false'] {
    padding: 0;
    opacity: 0.5;
    box-shadow: none;
    background-color: var(--color-black-55);
  }
  button[aria-pressed='true'] {
    width: var(--ete-width);
  }
`

const EteApp = styled.div`
  --ete-width: 10rem;
  ${generateThemeIgnoreColors()}
`

const App = () => {
  const { enabled, setEnabled } = useEditorStore()
  const [logPath, setLogPath] = React.useState(null)
  const [toggleEnabled] = React.useState(() => ({ checked }) =>
    setEnabled(checked)
  )

  return (
    <EteApp>
      <EditorButton
        title="Eufemia Theme Editor"
        id="ete-toggle-enabled"
        size="small"
        checked={enabled}
        on_change={toggleEnabled}
        icon={enabled ? chevron_up : chevron_down}
      />

      {enabled && (
        <Layout id="ete" className="dnb-core-style">
          <InspectorHandler
            onHover={({ path }) => {
              setLogPath(path)
            }}
            onCancel={() => {
              setLogPath(null)
            }}
          />
          {logPath ? (
            <Path top="1rem" modifier="x-small">
              {logPath}
            </Path>
          ) : (
            <ModificationManager top="1rem" />
          )}
        </Layout>
      )}
    </EteApp>
  )
}

function InspectorHandler({ onHover, onCancel }) {
  const { addModification } = useEditorStore()
  const [inspect, setInspect] = React.useState(false)
  const [toggleEnabled] = React.useState(() => () =>
    setInspect((s) => {
      if (s && onCancel) {
        onCancel()
      }
      return !s
    })
  )

  const [inspector] = React.useState(() =>
    createDOMInspector({
      exclude: ['#ete', '#ete-toggle-inspector'],
      onHover: ({ element, path }) => {
        if (onHover) {
          onHover({ element, path })
        }
      },
      onClick: ({ element, path }) => {
        if (onCancel) {
          onCancel({ element, path })
        }
        setInspect(false)
        addModification({ path })
      },
    })
  )

  if (inspect) {
    inspector.enable()
  } else {
    inspector.cancel()
  }

  return (
    <>
      <ToggleButton
        id="ete-toggle-inspector"
        // size="small"
        icon={add}
        icon_position="left"
        checked={inspect}
        on_change={toggleEnabled}
      >
        {inspect ? 'Cancel' : 'Inspect'}
      </ToggleButton>
    </>
  )
}

const marker = createInspectorMarker()
function hideOutline({ path }) {
  document.querySelectorAll(path)?.forEach((elem) => {
    marker.hide()
  })
}
function showOutline({ path }) {
  document.querySelectorAll(path)?.forEach((elem) => {
    marker.show(elem)
  })
}

function useThemes(themesHash) {
  const [listOfThemes, setListOfThemes] = React.useState([])

  React.useEffect(() => {
    getThemesAsync()
      .then(({ themes }) => {
        setListOfThemes(
          Object.keys(themes)
            .map((key) => key)
            .filter((key) => !['blue-test', '2x-test'].includes(key))
        )
      })
      .catch((e) => {
        console.warn(e)
      })
  }, [themesHash])

  return listOfThemes
}

function ModificationManager(props) {
  const { modifications, themesHash, setTheme, removeTheme } = useEditorStore()
  const listOfThemes = useThemes(themesHash)

  return (
    <Space {...props}>
      <List>
        {Object.entries(modifications).map(([path, { themeId }]) => {
          const dontExist = !document.querySelectorAll(path)
          return (
            <li key={path}>
              <div
                onMouseOver={() => showOutline({ path })}
                onMouseOut={() => hideOutline({ path })}
              >
                <Path
                  className={dontExist ? 'dont-exist' : ''}
                  modifier="x-small"
                >
                  {path}
                </Path>
                <StyledDropdown
                  size="small"
                  skip_portal
                  data={[
                    ...listOfThemes,
                    { content: 'Inactive', selected_key: 'inactive' },
                    { content: 'Remove', selected_key: 'remove' },
                  ]}
                  value={themeId || 'inactive'}
                  on_change={({ data }) => {
                    const themeId =
                      typeof data?.selected_key !== 'undefined'
                        ? data?.selected_key
                        : data

                    switch (themeId) {
                      case 'remove': {
                        removeTheme({ path })
                        break
                      }
                      default: {
                        setTheme({ path, themeId })
                      }
                    }
                  }}
                />
              </div>
            </li>
          )
        })}
      </List>
    </Space>
  )
}

const Path = styled(P)`
  color: var(--color-success-green);
  &.dont-exist {
    color: var(--color-fire-red);
  }
`

const StyledDropdown = styled(Dropdown)`
  display: flex;
  --dropdown-width: 8rem;
`

const List = styled.ul`
  list-style: none;
  padding: 0;

  > li {
    margin-top: 0.5rem;
    background-color: var(--color-pistachio);
  }
`

export function createThemeEditor() {
  let root = document.getElementById('eufemia-theme-editor')

  // Because of hot-reload
  // if (root) {
  //   root.remove()
  //   root = null
  // }

  if (!root) {
    root = document.createElement('div')
    root.setAttribute('id', 'eufemia-theme-editor')
    document.body.insertBefore(root, document.body.firstChild)
  }

  ReactDOM.render(
    <EufemiaProvider locale="en-GB">
      <App />
    </EufemiaProvider>,
    root
  )
}

export function removeThemeEditor() {
  const root = document.getElementById('eufemia-theme-editor')

  if (root) {
    root.remove()
  }
}
