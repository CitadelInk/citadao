import React, { Component } from 'react';
import { connect } from 'react-redux';
import Home from './home';
import User from './user';

class App extends Component {
  render() {
    let page;
    switch (this.props.ui.get('page')) {
      case 'user':
        page = <User/>
        break;
      default:
        page = <Home/>
        break;
    }
    return (
      <div className="app">
        {page}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { ui } = state;

  return {ui};
};

export default connect(mapStateToProps)(App);
