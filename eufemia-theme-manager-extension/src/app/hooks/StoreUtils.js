import React from 'react'
import { isDev } from '../../shared/Browser'

export function useRehydrationMiddleware() {
  React.useEffect(() => {
    // For dev only
    if (isDev) {
      import('../../extension/content')
      // import('../extension/background')
    }
  }, [])
}
