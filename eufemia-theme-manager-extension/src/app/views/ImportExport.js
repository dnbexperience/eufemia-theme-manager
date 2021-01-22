import React from 'react'
import {
  Modal,
  Button,
  Checkbox,
  FormSet,
  FormRow,
  Textarea,
} from 'dnb-ui-lib/components'
import { download, send } from 'dnb-ui-lib/icons'
import { useThemeStore, useAppStore, useErrorStore } from '../core/Store'
import { getModificationsFromContentAsync } from '../../shared/Bridge'

export default function ImportExport(props) {
  return (
    <FormRow {...props}>
      <Modal
        title="Export"
        size="small"
        right="x-small"
        trigger_icon={send}
        on_click={() => {}}
      >
        {() => <ExportContent />}
      </Modal>
      <Modal
        title="Import"
        size="small"
        trigger_icon={download}
        on_click={() => {}}
      >
        {() => <ImportContent />}
      </Modal>
    </FormRow>
  )
}

function ExportContent() {
  const { hosts } = useAppStore()
  const { themes } = useThemeStore()
  const ref = React.useRef()

  const [data, setData] = React.useState(async () => {
    const { modifications } = await getModificationsFromContentAsync()

    setData({ themes, modifications, hosts })

    return 'Preparing data ...'
  })

  return (
    <Textarea
      readOnly
      stretch
      rows="10"
      inner_ref={ref}
      onMouseDown={() => {
        if (ref?.current) {
          ref?.current.select()
        }
      }}
    >
      {JSON.stringify(data, null, 2)}
    </Textarea>
  )
}

function ImportContent() {
  const [json, jsonSet] = React.useState(null)
  const [overwrite, overwriteSet] = React.useState(false)
  const { importThemes } = useThemeStore()
  const { importAppData } = useAppStore()

  return (
    <FormSet
      on_submit={() => {
        if (json) {
          try {
            const data = JSON.parse(json)
            importThemes(data.themes, { overwrite })
            importAppData(data.hosts, { overwrite })
          } catch (e) {
            useErrorStore.getState().setError(e.message)
          }
        }
      }}
      prevent_submit={true}
    >
      <FormRow direction="vertical">
        <Textarea
          placeholder="Paste JSON data ..."
          stretch
          rows="10"
          value={json}
          on_change={({ value }) => {
            jsonSet(value)
          }}
        />
        <FormRow direction="horizontal" centered top="0.5rem">
          <Button type="submit" text="Import" right />
          <Checkbox
            checked={overwrite}
            on_change={({ checked }) => {
              overwriteSet(checked)
            }}
            label="Replace current Data"
          />
        </FormRow>
      </FormRow>
    </FormSet>
  )
}
