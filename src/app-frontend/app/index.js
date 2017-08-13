import React from 'react'
import ReactDOM from 'react-dom'
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reducers from './reducers';
import { AppContainer } from 'react-hot-loader';
import appContracts from 'app-contracts';
import App from './components/app';
import localWeb3 from "./helpers/web3Helper"

const middleware = [ thunk ];

const store = createStore(
  reducers,
  applyMiddleware(...middleware)
);

appContracts.setProvider(localWeb3.currentProvider);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);