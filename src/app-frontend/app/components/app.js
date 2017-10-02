import React, { Component } from 'react';
import { connect } from 'react-redux';
import Home from './home';
import User from './user';
import Header from './header/header';
import Debug from './debug/debug';
import PostPage from './panels/postPage';
import actions from '../actions';
import BuyMoreWidget from './header/buyMoreWidget'
import { Fragment } from 'redux-little-router';
import Landing from '../landingPage/components/landing';

const {
	initializeContract,
  initializeAccounts  
} = actions;

class App extends Component {
  constructor(props) {
      super(props);
  }

  render() {
    let page;
    let header;
    if (this.props.network.isConnected) {    
      return (
        <Fragment forRoute="/">
          <div className="app">
            <Fragment forRoute="/">
              <div>
                <Header />         
                <Home/>
              </div>
            </Fragment>   
            <Fragment forRoute="/debug">
              <div>
                <Header />      
                <Debug/>
              </div>
            </Fragment>
            <Fragment forRoute="/user/:account">
              <div>
                <Header />         
                <User/>
              </div>
            </Fragment>
            <Fragment forRoute="/post/authorg/:authorg/sub/:subHash/rev/:revHash">
              <div>
                <Header />
                <PostPage />          
              </div>
            </Fragment>
            <Fragment forRoute="/landing">
              <Landing />
            </Fragment>
          </div>
        </Fragment>
      );
      
    } else {
      return (
        <div className="app">         
          <Landing />
        </div>
      );
    }

    
  }
}

const mapStateToProps = state => {
  const { router } = state;
  const { ui, wallet, network } = state.core;

  return {ui, wallet, network, router};
};

export default connect(mapStateToProps)(App);
