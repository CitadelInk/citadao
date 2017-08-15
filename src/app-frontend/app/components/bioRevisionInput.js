import React, { Component } from 'react';
import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import actions from '../actions';
import Header from './header';

const {
	initializeContract,
	initializeAccount,
	initializeAccounts,
	updateCitaBalance,
	setWalletData,
	setBuyPrice,
	submitBio,
	setName,
	handleSubmit,
	handleBuySubmit,
	handleApproveClicked
} = actions;

class BioRevisionInput extends Component {
	 constructor(props) {
		 super(props);
		this.handleSubmitBio = this.handleSubmitBio.bind(this);
		this.handleBioChange = this.handleBioChange.bind(this);
	}

	isOwner() {
		return this.props.wallet.get('account') !== null &&
			this.props.wallet.get('tokenOwnerAccount') !== null &&
			this.props.wallet.get('account') === this.props.wallet.get('tokenOwnerAccount');
	}

	render() {
		const style = {
				height: '10000px',
				background:'#FFFFFF',
				width:'100%',
				margin:'0px auto',
				top:'300px'
		}

		return (
			
			<div style={style} className="BioRevisionInput">
				<input onChange={this.handleBioChange} value={this.props.wallet.get('bioInput')} />
				<button onClick={this.handleSubmitBio}>Submit Bio</button>			
			</div>
		);
	}

	handleSubmitBio(e) {
		this.props.dispatch(submitBio());
	}

	handleBioChange(e) {
		this.props.dispatch(setWalletData({bioInput : e.target.value}));
	}
}

const mapStateToProps = state => {
  const { wallet } = state;

  return {wallet};
}

export default connect(mapStateToProps)(BioRevisionInput)
