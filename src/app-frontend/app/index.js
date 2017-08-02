import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import Root from './containers/Root'
import configureStore from './store/configureStore'

const store = configureStore();

ReactDOM.render(
  <Root store={store}/>,
  document.getElementById('root')
);