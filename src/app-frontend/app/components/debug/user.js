import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../header/header';
import BioRevisionSelector from './bioRevisionSelector';
import BioRevision from './bioRevision';
import BioRevisionInput from './bioRevisionInput';

class User extends Component {

  render() {
    const style = {
				height: '10000px',
				background:'#FFFFFF',
				width:'100%',
				margin:'0px auto',
				position:'fixed',
				top:'100px'
    }
      
    return (
      <div style={style} className="userpage">
          <BioRevisionSelector /><br />
          <BioRevision /><br />
          {(this.props.router.params["account"] === this.props.wallet.get('account')) && 
            <BioRevisionInput />
          }
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { wallet, ui } = state.core;
  const { router } = state;
  return {wallet, ui, router};
}

export default connect(mapStateToProps)(User);
