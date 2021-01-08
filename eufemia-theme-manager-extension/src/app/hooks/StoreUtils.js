import React from 'react'
import { postRehydrationMiddleware } from '../core/Store'

export function useRehydrationMiddleware() {
  React.useEffect(() => {
    postRehydrationMiddleware()
    if (
      process.env.NODE_ENV === 'development' &&
      String(window.location.host).includes('localhost')
    ) {
      import('../../extension/content')
      // import('../extension/background')
    }
  }, [])
}
