import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import App from './components/app'

const rootEl = document.getElementById('root')
const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    rootEl
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./components/app', () => { render(App) })
}