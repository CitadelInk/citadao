import React, { Component } from 'react';
import { connect } from 'react-redux';
import Home from './home';
import User from './user';
import Header from './header';
import Debug from './debug';
import actions from '../actions';

const {
	initializeContract,
  initializeAccounts,
  initializeTestSubmissions
} = actions;

class App extends Component {
  constructor(props) {
      super(props);
        // can't run this in mist as of yet as we are not deployed to a public network
        // SOON! Test against local browser to see if this works! Should see account - 1000 or whatever was reflected in the deplpoy
        if (typeof mist === "undefined") {
          props.dispatch(initializeContract());
        }

        props.dispatch(initializeAccounts());
        props.dispatch(initializeTestSubmissions());
  }

  render() {
    let page;
    switch (this.props.ui.get('page')) {
      case 'user':
        page = <User/>
        break;
      case 'debug':
        page = <Debug/>
        break;
      default:
        page = <Home/>
        break;
    }	
	return (
	<div className="app">
    		<Header />
        {page}
      </div>
	)
  }
}

const mapStateToProps = state => {
  const { ui } = state;

  return {ui};
};

export default connect(mapStateToProps)(App);
