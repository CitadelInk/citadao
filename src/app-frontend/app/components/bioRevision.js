import React, { Component } from 'react';
import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'
import { connect } from 'react-redux';


class BioRevision extends Component {

	render() {		
		return (
			<div className="BioRevision">
				<p className="App-intro">					
					Selected Bio Revision Value - {this.props.wallet.get('selectedBioRevisionValue')}<br />
				</p>
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet } = state;

  return {wallet};
}

export default connect(mapStateToProps)(BioRevision)
