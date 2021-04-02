import React from 'react'
import { GlobalStatus } from '@dnb/eufemia/components'
import { useErrorStore } from '../core/Store'

export default function ExtensionError(props) {
  const { error, hideError } = useErrorStore()
  return error ? (
    <GlobalStatus left show text={error} on_close={hideError} {...props} />
  ) : null
}
