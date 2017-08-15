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

class Home extends Component {
	 constructor(props) {
		 super(props);
			// can't run this in mist as of yet as we are not deployed to a public network
			// SOON! Test against local browser to see if this works! Should see account - 1000 or whatever was reflected in the deplpoy
			if (typeof mist === "undefined") {
				props.dispatch(initializeContract());
			}

			props.dispatch(initializeAccounts());

			this.handleSubmit = this.handleSubmit.bind(this);
			this.handleSubmitBio = this.handleSubmitBio.bind(this);
			this.handleApproveClicked = this.handleApproveClicked.bind(this);
			this.handleChange = this.handleChange.bind(this);	
			this.handleBioChange = this.handleBioChange.bind(this);
			this.handleEtherSendChange = this.handleEtherSendChange.bind(this);
			this.handleChangeBuyPrice = this.handleChangeBuyPrice.bind(this);
			this.handleSetBuyPrice = this.handleSetBuyPrice.bind(this);
			this.handleBuySubmit = this.handleBuySubmit.bind(this);
	}

	isOwner() {
		return this.props.wallet.get('account') !== null &&
			this.props.wallet.get('tokenOwnerAccount') !== null &&
			this.props.wallet.get('account') === this.props.wallet.get('tokenOwnerAccount');
	}

	render() {
		const ownerSection = (
			<div>
				<input onChange={this.handleChangeBuyPrice} value={this.props.wallet.get('newBuyPrice')} />
				<button onClick={this.handleSetBuyPrice}> Update Buy Price </button>
			</div>
		);

		const hasCitaSection = (
			<div>
				<input onChange={this.handleBioChange} value={this.props.wallet.get('bioInput')} />
				<button onClick={this.handleSubmitBio}>Submit Bio</button>
			</div>
		);

		const style = {
				height: '10000px',
				background:'#FFFFFF',
				width:'100%',
				margin:'0px auto',
				position:'fixed',
				top:'100px'
		}

		return (
			
				<div className="App">
    			<Header /><br />
				<div style={style}>
				<p className="App-intro">
					Address = {this.props.wallet.get('account')}<br />
					My ETH Balance = {this.props.wallet.get('ethBalance')}<br />
					My CITA balance = {this.props.wallet.get('citaBalance')}<br />
					CITA Buy Price = {this.props.wallet.get('citaBuyPrice')}<br />
					Total Supply = {this.props.wallet.get('tokenSupply')}<br />
					CITA token owner = {this.props.wallet.get('tokenOwnerAccount')}<br />
					CITA token address = {this.props.wallet.get('tokenAddress')}<br />
					Token Citadel Comptroller = {this.props.wallet.get('tokenCitadelComptroller')}<br />
					Citadel Comptroller = {this.props.wallet.get('citadelComptrollerAccount')}<br />
					Citadel address = {this.props.wallet.get('citadelAddress')}<br />
					Citadel wallet address (should match CITA token address) = {this.props.wallet.get('citadelWalletAddress')}<br />
					Selected Bio Revision Value - {this.props.wallet.get('selectedBioRevisionValue')}<br />
				</p>
				
				{this.isOwner() && ownerSection}

				<input onChange={this.handleEtherSendChange} value={this.props.wallet.get('etherToSend')} />
				<button onClick={this.handleBuySubmit}>Send WEI to buy 1 CITA / {this.props.wallet.get('citaBuyPrice')} WEI</button><br />	
				
				{(this.props.wallet.get('citaBalance') !== 0) && hasCitaSection}
				</div>
			</div>
		);
	}

	handleSubmitBio(e) {
		this.props.dispatch(submitBio());
	}

	handleSubmit(e) {
		this.props.dispatch(handleSubmit());
	}

	handleApproveClicked(e) {
		this.props.dispatch(handleApproveClicked());
	}

	handleChange(e) {
		this.props.dispatch(setWalletData({newName : e.target.value}));	
	}

	handleBioChange(e) {
		this.props.dispatch(setWalletData({bioInput : e.target.value}));
	}

	handleEtherSendChange(e) {
		this.props.dispatch(setWalletData({etherToSend : e.target.value}));
	}

	handleChangeBuyPrice(e) {
		this.props.dispatch(setWalletData({newBuyPrice : e.target.value}))
	}

	handleSetBuyPrice(e) {
		this.props.dispatch(setBuyPrice());
	}

	handleBuySubmit(e) {
		this.props.dispatch(handleBuySubmit());
	}
}

const mapStateToProps = state => {
  const { wallet } = state;

  return {wallet};
}

export default connect(mapStateToProps)(Home)
