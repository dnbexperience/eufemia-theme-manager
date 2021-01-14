import React from 'react'
import styled from '@emotion/styled'
import {
  Space,
  Input,
  Button,
  Checkbox,
  FormSet,
  FormRow,
  Dropdown,
} from 'dnb-ui-lib'
import { exclamation_circled } from 'dnb-ui-lib/icons'
import { useThemeStore, useHostStore } from '../core/Store'

export default function ThemeManager(props) {
  const { getThemes, createEmptyTheme, copySelectedTheme } = useThemeStore()
  const { getHostData, setSelectedThemeId } = useHostStore()
  const { selectedThemeId } = getHostData()
  const themesList = Object.entries(getThemes())
    .map(([key]) => key)
    .filter((key) => !['dnb-ui', 'blue-test'].includes(key))
  const [showInput, changeCreateInput] = React.useState(false)
  const [toggleCreateInput] = React.useState(() => () =>
    changeCreateInput((s) => !s)
  )

  return (
    <ThemeManagerArea {...props}>
      {showInput ? (
        <CreateTheme
          onSave={(themeId, { makeCopy }) => {
            if (themeId) {
              if (makeCopy) {
                copySelectedTheme(themeId)
              } else {
                createEmptyTheme(themeId)
              }
              setSelectedThemeId(themeId)
            }
            toggleCreateInput()
          }}
          onCancel={toggleCreateInput}
        ></CreateTheme>
      ) : (
        <>
          <StyledDropdown
            title="Select or create a new Theme"
            label="Theme to Edit:"
            right="1rem"
            skip_portal
            direction="top"
            value={selectedThemeId}
            data={themesList}
            on_change={({ data }) => {
              setSelectedThemeId(data)
            }}
          />
          <Button right="1rem" icon="add" on_click={toggleCreateInput} />
          <RemoveTheme />
        </>
      )}
    </ThemeManagerArea>
  )
}

const StyledDropdown = styled(Dropdown)`
  --dropdown-width: 10rem;
`

// {/* <ToggleButton.Group
//           label="Theme to Edit:"
//           value={selectedThemeId}
//           on_change={({ value }) => {
//             setSelectedThemeId(value)
//           }}
//         >
//           {themesList.map(([key]) => {
//             return <ToggleButton key={key} text={key} value={key} />
//           })}
//           <Button left="1rem" icon="add" on_click={toggleCreateInput} />
//         </ToggleButton.Group> */}

const ThemeManagerArea = styled(Space)`
  display: flex;
  align-items: center;
  min-height: 3rem;
`

function CreateTheme({ onSave, onCancel }) {
  const { getThemes } = useThemeStore()
  const themes = Object.keys(getThemes())

  const [value, setValue] = React.useState(null)
  const [errorMessage, setErrorMessage] = React.useState(null)
  const [makeCopy, setMakeCopy] = React.useState(false)

  return (
    <FormSet
      on_submit={() => {
        if (/[^a-z0-9-]/.test(value)) {
          setErrorMessage('The Theme Name has to be list-case!')
          return // stop here
        }
        if (themes.includes(value)) {
          setErrorMessage('That Theme exists already!')
          return // stop here
        }
        onSave(value, { makeCopy })
      }}
      prevent_submit={true}
    >
      <FormRow top bottom>
        <Input
          label="New Theme:"
          placeholder="Name (lisp-case)"
          right="0.5rem"
          on_change={({ value }) => {
            setValue(value)
            setErrorMessage(null)
          }}
          status={errorMessage}
        />
        <Button type="submit" text="Create" size="medium" right="0.5rem" />
        <Button
          text="Cancel"
          size="medium"
          on_click={onCancel}
          variant="secondary"
          right="0.5rem"
        />
        <Checkbox
          label="Copy"
          checked={makeCopy}
          on_change={({ checked }) => setMakeCopy(checked)}
        />
      </FormRow>
    </FormSet>
  )
}

export function RemoveTheme(props) {
  const { removeTheme } = useThemeStore()
  const { getHostData, setSelectedThemeId } = useHostStore()
  const { selectedThemeId } = getHostData()

  return ['dnb-ui', 'blue-test'].includes(selectedThemeId) ? null : (
    <StyledRemoveButton
      variant="tertiary"
      text={`Delete "${selectedThemeId}"`}
      icon={exclamation_circled}
      icon_position="left"
      on_click={() => {
        if (selectedThemeId !== 'dnb-ui') {
          setSelectedThemeId('dnb-ui')
          removeTheme(selectedThemeId)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }}
      {...props}
    />
  )
}

const StyledRemoveButton = styled(Button)`
  /* color: var(--color-fire-red); */
`
