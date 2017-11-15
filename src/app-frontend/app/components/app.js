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
import initialState from '../components/compose/state.json';
import { Value } from 'slate';

const {
	initializeContract,
  initializeAccounts  
} = actions;

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
        standardPost : Value.fromJSON(initialState),
        bioPost : Value.fromJSON(initialState),
        revisionPost : Value.fromJSON(initialState)
      }
      this.onStandardPostChanged = this.onStandardPostChanged.bind(this);
      this.onBioPostChanged = this.onBioPostChanged.bind(this);
      this.onRevisionPostChanged = this.onRevisionPostChanged.bind(this);
  }

  onStandardPostChanged(value) {
    this.setState({standardPost : value})
  }

  onBioPostChanged(value) {
    this.setState({bioPost : value})
  }

  onRevisionPostChanged(value) {
    this.setState({revisionPost : value})
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
                <Home 
                  standardPostValue={this.state.standardPost}
                  standardPostCallback={this.onStandardPostChanged}
                  bioPostValue={this.state.bioPost}
                  bioPostCallback={this.onBioPostChanged}
                  revisionPostValue={this.state.revisionPost}
                  revisionPostCallback={this.onRevisionPostChanged}
                />
              </div>
            </Fragment>   
            <Fragment forRoute="/debug">
              <div>
                <Header />      
                <Debug/>
              </div>
            </Fragment>
            <Fragment forRoute="/user/:account/rev/:revHash">
              <div>
                <Header />         
                <User 
                  standardPostValue={this.state.standardPost}
                  standardPostCallback={this.onStandardPostChanged}
                  bioPostValue={this.state.bioPost}
                  bioPostCallback={this.onBioPostChanged}
                  revisionPostValue={this.state.revisionPost}
                  revisionPostCallback={this.onRevisionPostChanged}
                />
              </div>
            </Fragment>
            <Fragment forRoute="/user/:account">
              <div>
                <Header />         
                <User 
                  standardPostValue={this.state.standardPost}
                  standardPostCallback={this.onStandardPostChanged}
                  bioPostValue={this.state.bioPost}
                  bioPostCallback={this.onBioPostChanged}
                  revisionPostValue={this.state.revisionPost}
                  revisionPostCallback={this.onRevisionPostChanged}
                />
              </div>
            </Fragment>
            <Fragment forRoute="/post/authorg/:authorg/sub/:subHash/rev/:revHash">
              <div>
                <Header />
                <PostPage 
                  standardPostValue={this.state.standardPost}
                  standardPostCallback={this.onStandardPostChanged}
                  bioPostValue={this.state.bioPost}
                  bioPostCallback={this.onBioPostChanged}
                  revisionPostValue={this.state.revisionPost}
                  revisionPostCallback={this.onRevisionPostChanged}
                />          
              </div>
            </Fragment>
            <Fragment forRoute="/landing">
              <Landing />
            </Fragment>
            <Fragment forRoute="/whitepaper">
            </Fragment>
          </div>
        </Fragment>
      );
    } else {
      return (
        <Fragment forRoute="/">
          <div className="app">  
            <Fragment forRoute="/landing">
                <Landing />
            </Fragment>
            <Fragment forRoute="/whitepaper">
            </Fragment>
            <Fragment forNoMatch>
              <Landing showMetaMaskOnLoad={true} />
            </Fragment>
          </div>
        </Fragment>
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
