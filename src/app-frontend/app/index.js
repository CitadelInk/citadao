import React from 'react'
import ReactDOM from 'react-dom'
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reducers from './reducers';
import { AppContainer } from 'react-hot-loader';
import App from './components/app';
import Router from './router';
import actions from './actions';


window.addEventListener('load', () => { 
  const middleware = [ thunk ];

  const {
    setupWeb3 
  } = actions;

  const store = createStore(
    reducers,
    applyMiddleware(...middleware)
  );

  store.dispatch(setupWeb3());
  
  const router = new Router({store: store});
  router.history.start();
  
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );  
})
