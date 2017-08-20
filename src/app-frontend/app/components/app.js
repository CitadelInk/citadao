import React, { Component } from 'react';
import { connect } from 'react-redux';
import Home from './home';
import User from './user';
import Header from './header';
import Debug from './debug';
import Post from './post';
import actions from '../actions';
import BuyMoreWidget from './buyMoreWidget'

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
      case 'post':
        page = <Post/>
        break;
      default:
        page = <Home/>
        break;
    }	
	return (
	<div className="app">
    		<Header />
			{this.props.wallet.get("buyMoreActive") && <BuyMoreWidget />}
        {page}
      </div>
	)
  }
}

const mapStateToProps = state => {
  const { ui, wallet } = state;

  return {ui, wallet};
};

export default connect(mapStateToProps)(App);
