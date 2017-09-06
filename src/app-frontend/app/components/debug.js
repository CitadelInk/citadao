import React, { Component } from 'react';
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
	handleApproveClicked,
	addNewApprovedReaction,
	submitPost
} = actions;

class Debug extends Component {
	 constructor(props) {
		 super(props);
			this.handleSubmit = this.handleSubmit.bind(this);
			this.handleApproveClicked = this.handleApproveClicked.bind(this);
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
					Approved Reactions - {this.props.approvedReactions.map((value) => {
						return (value.reactionHash + " - " + value.reactionValue + "  -  ")
					})}<br /><br />
					Test Typed Submissions - {this.props.submissions.map((value,key) => {
						return (key + " - " + value.test)
					})}<br />
				</p>
				
				{this.isOwner() && ownerSection}

				<input onChange={this.handleEtherSendChange} value={this.props.wallet.get('etherToSend')} />
				<button onClick={this.handleBuySubmit}>Send WEI to buy 1 CITA / {this.props.wallet.get('citaBuyPrice')} WEI</button><br />	
				
				{(this.props.wallet.get('citaBalance') !== 0) && hasCitaSection}


				</div>
			</div>
		);
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
}

const mapStateToProps = state => {
  const { wallet, approvedReactions, submissions } = state;

  return {wallet, approvedReactions, submissions};
}

export default connect(mapStateToProps)(Debug)
