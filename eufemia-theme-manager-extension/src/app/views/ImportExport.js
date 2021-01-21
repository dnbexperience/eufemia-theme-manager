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
import { useThemeStore } from '../core/Store'

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
  const { getThemes } = useThemeStore()

  const [exportContent] = React.useState(() => {
    const exportContent = { ...getThemes() }
    delete exportContent['dnb-ui']
    delete exportContent['blue-test']
    delete exportContent['2x-test']
    return exportContent
  })

  return (
    <Textarea stretch rows="10">
      {JSON.stringify(exportContent, null, 2)}
    </Textarea>
  )
}

function ImportContent() {
  const [content, contentSet] = React.useState(null)
  const [overwrite, overwriteSet] = React.useState(false)
  const { importJSON } = useThemeStore()

  return (
    <FormSet
      on_submit={() => {
        if (content) {
          importJSON(content, { overwrite })
        }
      }}
      prevent_submit={true}
    >
      <FormRow direction="vertical">
        <Textarea
          placeholder="Paste JSON data ..."
          stretch
          rows="10"
          value={content}
          on_change={({ value }) => {
            contentSet(value)
          }}
        />
        <FormRow direction="horizontal" centered>
          <Button type="submit" text="Import" top="0.5rem" right />
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
