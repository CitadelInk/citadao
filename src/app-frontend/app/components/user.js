import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './header';
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
    			<Header /><br />
          <BioRevisionSelector /><br />
          <BioRevision /><br />
          {(this.props.ui.get('route') === "\/user\/" + this.props.wallet.get('account')) && 
            <BioRevisionInput />
          }
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { wallet, ui } = state;

  return {wallet, ui};
}

export default connect(mapStateToProps)(User);
