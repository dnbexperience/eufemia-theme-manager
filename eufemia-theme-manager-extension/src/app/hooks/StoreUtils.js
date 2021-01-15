import React from 'react'

export function useRehydrationMiddleware() {
  React.useEffect(() => {
    // For dev only
    if (
      process.env.NODE_ENV === 'development' &&
      process.env.REACT_APP_EXTENSION_DEV_LOCALHOST &&
      String(window.location.host).includes('localhost')
    ) {
      import('../../extension/content')
      // import('../extension/background')
    }
  }, [])
}
