import React, { Component } from 'react';
import { connect } from 'react-redux';
import Home from './home';
import User from './user';
import Header from './header';
import Debug from './debug';
import PostPage from './postPage';
import actions from '../actions';
import BuyMoreWidget from './buyMoreWidget'

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
    if (this.props.network.isConnected) {
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
          if(splitRoute.length === 5) {
            page = <PostPage submissionHash={splitRoute[2]} revisionHash={splitRoute[4]} />;
          }
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

    return (
      <div>
        Connecting.....
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { ui, wallet, network } = state;

  return {ui, wallet, network};
};

export default connect(mapStateToProps)(App);
