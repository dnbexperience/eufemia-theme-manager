import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
// import reportWebVitals from './app/reportWebVitals'

import 'dnb-ui-lib/style'
import stylisPlugin from 'dnb-ui-lib/style/stylis'
import { Provider as EufemiaProvider } from 'dnb-ui-lib/shared'

import { CacheProvider } from '@emotion/react'
import createEmotionCache from '@emotion/cache'

const emotionCache = createEmotionCache({
  key: 'extension',
  stylisPlugins: [stylisPlugin],
})

ReactDOM.render(
  <React.StrictMode>
    <CacheProvider value={emotionCache}>
      <EufemiaProvider locale="en-GB">
        <App />
      </EufemiaProvider>
    </CacheProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
