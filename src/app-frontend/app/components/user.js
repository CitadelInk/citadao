import React, { Component } from 'react';
import { connect } from 'react-redux';

class User extends Component {

  render() {
    return (
      <div className="userpage">
    			<Header /><br />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { wallet } = state;

  return {wallet};
}

export default connect(mapStateToProps)(User);
