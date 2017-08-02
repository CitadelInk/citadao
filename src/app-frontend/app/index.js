import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import App from './components/app'
import Header from './components/header'

ReactDOM.render(
  <div>
    <Header />
    <App />
  </div>,
  document.getElementById('root')
);