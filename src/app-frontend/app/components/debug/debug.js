import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';
import Header from '../header/header';

const {
	initializeContract,
	initializeAccount,
	initializeAccounts,
	updateCitaBalance,
	setWalletData,
	setBuyPrice,
	submitBio,
	handleBuySubmit,
	addNewApprovedReaction,
	submitPost,
	giveEther
} = actions;

class Debug extends Component {
	 constructor(props) {
		 super(props);
			this.handleChange = this.handleChange.bind(this);	
			this.handleEtherSendChange = this.handleEtherSendChange.bind(this);
			this.handleChangeBuyPrice = this.handleChangeBuyPrice.bind(this);
			this.handleSetBuyPrice = this.handleSetBuyPrice.bind(this);
			this.handleBuySubmit = this.handleBuySubmit.bind(this);


			this.handleBioNameChange = this.handleBioNameChange.bind(this);
			this.handleBioTextChange = this.handleBioTextChange.bind(this);
			this.handleSubmitBio = this.handleSubmitBio.bind(this);

			this.handlePostTitleChange = this.handlePostTitleChange.bind(this);
			this.handlePostTextChange = this.handlePostTextChange.bind(this);
			this.handleSubmitPost = this.handleSubmitPost.bind(this);

			this.handleChangeNewReaction = this.handleChangeNewReaction.bind(this);
			this.handleAddNewReaction = this.handleAddNewReaction.bind(this);
			this.handleGiveEther = this.handleGiveEther.bind(this);
	}

	isOwner() {
		return this.props.wallet.get('account') !== null &&
			this.props.wallet.get('tokenOwnerAccount') !== null &&
			this.props.wallet.get('account') === this.props.wallet.get('tokenOwnerAccount');
	}

	render() {

		const ethDebug = (
			<div>
				<button onClick={this.handleGiveEther}> Give 5 ether </button><br />
			</div>
		);

		const ownerSection = (
			<div>
				<input onChange={this.handleChangeBuyPrice} value={this.props.wallet.get('newBuyPrice')} />
				<button onClick={this.handleSetBuyPrice}> Update Buy Price </button><br />
				<input onChange={this.handleChangeNewReaction} value={this.props.wallet.get('newReaction')} />
				<button onClick={this.handleAddNewReaction}> Add New Reaction </button><br />
			</div>
		);

		const hasCitaSection = (
			<div>
				SUBMIT NEW BIO<br />
				New Name: <input onChange={this.handleBioNameChange} value={this.props.wallet.get('bioNameInput')} /><br />
				<textarea onChange={this.handleBioTextChange} value={this.props.wallet.get('bioTextInput')} rows="30" cols="100"/><br />
				<button onClick={this.handleSubmitBio}>Submit Bio</button><br /><br />

				SUBMIT NEW BIO<br />
				Post Title: <input onChange={this.handlePostTitleChange} value={this.props.wallet.get('postTitleInput')} /><br />
				<textarea onChange={this.handlePostTextChange} value={this.props.wallet.get('postTextInput')} rows="30" cols="100"/><br />
				<button onClick={this.handleSubmitPost}>Submit Post</button>
			</div>
		);

		const style = {
				height: '10000px',
				background:'#FFFFFF',
				width:'100%',
				margin:'0px auto',
				top:'100px'
		}

		var approvedReactions = this.props.approvedReactions;

		return (
			
			<div className="App">
				<div style={style}>
				<p className="App-intro">
					Address = {this.props.wallet.get('account')}<br />
					My ETH Balance = {this.props.wallet.get('ethBalance')}<br />
					My INK balance = {this.props.wallet.get('inkBalance')}<br />
					INK Buy Price = {this.props.wallet.get('inkBuyPrice')}<br />
					Total Supply = {this.props.wallet.get('tokenSupply')}<br />
					INK token owner = {this.props.wallet.get('tokenOwnerAccount')}<br />
					INK token address = {this.props.wallet.get('tokenAddress')}<br />
					Token Citadel Comptroller = {this.props.wallet.get('tokenInkComptroller')}<br />
					Ink Comptroller = {this.props.wallet.get('inkComptrollerAccount')}<br />
					Ink address = {this.props.wallet.get('inkAddress')}<br />
					Ink wallet address (should match INK token address) = {this.props.wallet.get('inkWalletAddress')}<br />
					Selected Bio Revision Value - {this.props.wallet.get('selectedBioRevisionValue')}<br />
					Approved Reactions - {Array.from(approvedReactions.keys()).forEach(function(value) {
						return (value + " - " + approvedReactions.get(value) + "  -  ")
					})}<br /><br />
				</p>
				{ethDebug}

				{this.isOwner() && ownerSection}

				<input onChange={this.handleEtherSendChange} value={this.props.wallet.get('etherToSend')} />
				<button onClick={this.handleBuySubmit}>Send WEI to buy 1 CITA / {this.props.wallet.get('inkBuyPrice')} WEI</button><br />	
				
				{(this.props.wallet.get('inkBalance') !== 0) && hasCitaSection}


				</div>
			</div>
		);
	}

	handleChange(e) {
		this.props.dispatch(setWalletData({newName : e.target.value}));	
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

	handleChangeNewReaction(e) {
		this.props.dispatch(setWalletData({newReaction : e.target.value}));
	}

	handleAddNewReaction(e) {
		this.props.dispatch(addNewApprovedReaction());
	}

	handleBuySubmit(e) {
		this.props.dispatch(handleBuySubmit());
	}


	handleBioNameChange(e) {
		this.props.dispatch(setWalletData({bioNameInput : e.target.value}));
	}
		
	handleBioTextChange(e) {
		this.props.dispatch(setWalletData({bioTextInput : e.target.value}));
	}

	handleSubmitBio(e) {
		this.props.dispatch(submitBio());
	}


	handlePostTitleChange(e) {
		this.props.dispatch(setWalletData({postTitleInput : e.target.value}));
	}
		
	handlePostTextChange(e) {
		this.props.dispatch(setWalletData({postTextInput : e.target.value}));
	}

	handleSubmitPost(e) {
		this.props.dispatch(submitPost());
	}

	handleGiveEther(e) {
		this.props.dispatch(giveEther(5));
	}
}

const mapStateToProps = state => {
  const { wallet, approvedReactions } = state.core;

  return {wallet, approvedReactions };
}

export default connect(mapStateToProps)(Debug)
