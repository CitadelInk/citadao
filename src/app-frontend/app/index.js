import React from 'react'
import ReactDOM from 'react-dom'
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { initializeCurrentLocation, routerForBrowser } from 'redux-little-router';
import { Provider } from 'react-redux';
import rootReducer  from './reducers';
import { AppContainer } from 'react-hot-loader';
import App from './components/app';
import { routes } from './router';
import actions from './actions';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { green300, white } from 'material-ui/styles/colors';

const muiTheme = getMuiTheme({
  raisedButton: {
    secondaryColor: green300,
    secondaryTextColor: white,
    primaryTextColor: white,
    textColor: white,
  }
});

window.addEventListener('load', () => { 
  const {
    setupWeb3 
  } = actions;


  const {
    reducer,
    middleware,
    enhancer
  } = routerForBrowser({routes})

  const middlewares = [thunk, middleware];

  const composeEnhancers = compose;
  const store = createStore(
       combineReducers({core: rootReducer, router: reducer}),
       composeEnhancers(enhancer, applyMiddleware(...middlewares)),
  );

  const initialLocation = store.getState().router;
  if (initialLocation) {
    store.dispatch(initializeCurrentLocation(initialLocation));
  }

  console.log(store.getState())

  const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  const hasMetamask = typeof web3 !== 'undefined'

  if (hasMetamask && isChrome) {
    store.dispatch(setupWeb3());
  }

  const app = (
    <Provider store={store}>
      <MuiThemeProvider muiTheme={muiTheme}>
        <App />
      </MuiThemeProvider>
    </Provider>
  );
  
  ReactDOM.render(
    app,
    document.getElementById('root')
  );  
})
