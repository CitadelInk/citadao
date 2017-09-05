import React, { Component } from 'react';
import { connect } from 'react-redux';
import Home from './home';
import User from './debug/user';
import Header from './header/header';
import Debug from './debug/debug';
import PostPage from './panels/postPage';
import actions from '../actions';

const {
	initializeContract,
  initializeAccounts  
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
        var route = this.props.ui.get('route');
        var splitRoute = route.split('\/'); 
        if(splitRoute.length === 7) {
          page = <PostPage authorg={splitRoute[2]} submission={splitRoute[4]} revision={splitRoute[6]} />;
        }
      break;
      default:
        page = <Home/>
        break;
    }	
	return (
	<div style={{height:'100%'}} className="app">
    		<Header />
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
