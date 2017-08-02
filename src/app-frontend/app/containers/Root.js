import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import App from '../components/app'
import Header from '../components/header'

const Root = ({ store }) => (
  <Provider store={store}>
    <div>
      <Header store={store}/>
      <App store={store}/>
    </div>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired
}

export default Root