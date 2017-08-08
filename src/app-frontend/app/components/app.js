import React, { Component } from 'react';
import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import { initializeContract, initializeAccount } from '../actions';

class App extends Component {
	 constructor() {
		 super();
			// can't run this in mist as of yet as we are not deployed to a public network
			// SOON! Test against local browser to see if this works! Should see account - 1000 or whatever was reflected in the deplpoy
			if (typeof mist === "undefined") {
				this.props.dispatch(initializeContract);
			}

			const accountIndex = this.props.wallet.get('accountIndex');
			const selectedBioRevisionIndex = this.props.wallet.get('selectedBioRevisionIndex');
			this.props.dispatch(getAccounts(accountIndex, selectedBioRevisionIndex));					
	}

	updateCitaBalance() {
		appContracts.MyAdvancedToken.deployed()
		.then((instance) => instance)
		.then((data) => data.balanceOf(this.props.account))
		.then((p) => parseInt(p.toString()))
		.then((p) => this.setState({citaBalance : p}));	
	}

	updateBuyPrice() {
		appContracts.MyAdvancedToken.deployed()
		.then((instance) => instance)
		.then((data) => data.buyPrice())
		.then((p) => parseFloat(p.toString()))
		.then((p) => this.setState({citaBuyPrice : p}));	
	}

	updateName() {
		appContracts.Citadel.deployed()
		.then((instance) => instance.getName(this.props.account))
		.then((data) => this.setState({citadelName : data}))
	}

	render() {
		var isOwner =  this.props.account != null && this.props.tokenOwnerAccount != null && this.props.account == this.props.tokenOwnerAccount;	

		return (
			<div className="App"><p className="App-intro">
						Name = {this.props.citadelName}<br />
						Address = {this.props.account}<br />
						My ETH Balance = {this.props.ethBalance}<br />
						My CITA balance = {this.props.citaBalance}<br />
						CITA Buy Price = {this.props.citaBuyPrice}<br />
						Total Supply = {this.props.tokenSupply}<br />
						CITA token owner = {this.props.tokenOwnerAccount}<br />
						CITA token address = {this.props.tokenAddress}<br />
						Citadel Comptroller = {this.props.citadelComptrollerAccount}<br />
						Citadel address = {this.props.citadelAddress}<br />
						Citadel wallet address (should match CITA token address) = {this.props.citadelWalletAddress}<br />
						Bio Revisions Length = {this.props.bioRevisions.length}<br />
						Selected Bio Revision Index - {this.props.selectedBioRevisionIndex}<br />
						Selected Bio Revision Value - {this.props.selectedBioRevision}<br />
				

				{isOwner && 
					<input onChange={this.handleChangeBuyPrice} value={this.props.newBuyPrice} />
				}
				{isOwner &&
					<button onClick={this.handleSetBuyPrice}>{'Update Buy Price'}</button>
				}
				{isOwner &&
					<br />
				}

				<input onChange={this.handleEtherSendChange} value={this.props.etherToSend} />
				<button onClick={this.handleBuySubmit}>{'Send WEI to buy 1 CITA / ' + this.props.citaBuyPrice + ' WEI'}</button><br />	
				
				{(this.props.citaBalance !== 0) &&
					<button onClick={this.handleApproveClicked}>{'Approve Citadel Contract to spend CITA for you'}</button>
				}
				{(this.props.citaBalance !== 0) &&
					<br />
				}
				{(this.props.citaBalance !== 0) &&
					<input onChange={this.handleChange} value={this.props.newName} />
				}
				{(this.props.citaBalance !== 0) &&
					<button onClick={this.handleSubmit}>{'Update Name - ' + this.props.nameChangeCostInCita + 'CITA'}</button>
				}
				{(this.props.citaBalance !== 0) &&
					<br />
				}

				{(this.props.citaBalance !== 0) &&
				<input onChange={this.handleBioChange} value={this.props.bioInput} />
				}
				{(this.props.citaBalance !== 0) &&
				<button onClick={this.handleSubmitBio}>{'Submit Bio'}</button>
				}

			</p>
			</div>
		);
	}



	handleSubmitBio(e) {
		var name = this.props.newName;
		var account = this.props.account;
		var appInstance = this;
		var testValue = this.props.bioInput;
		console.log('bio value = ' + testValue);
		localWeb3.bzz.put(testValue, (error, hash) => {
			appContracts.Citadel.deployed()
			.then((instance) => instance.submitBioRevision.sendTransaction('0x' + hash, {from : this.props.account, gas : 200000})).then(function(tx_id) {
				alert("bio added to contract");
			}).catch(function(e) {
				alert("error - " + e);
			})
		});
		
	}

	handleSubmit(e) {
		var name = this.props.newName;
		var account = this.props.account;
		var appInstance = this;
		appContracts.Citadel.deployed()
		.then((instance) => instance.setName.sendTransaction(name, {from : this.props.account})).then(function(tx_id) {
			appInstance.handleNameChangeSuccess(tx_id)
		}).catch(function(e) {
			alert("error - " + e);
		})
	}

	handleApproveClicked(e) {
		var name = this.props.newName;
		var account = this.props.account;
		var appInstance = this;
		appContracts.MyAdvancedToken.deployed()
		.then((instance) => instance.approve.sendTransaction(this.props.citadelAddress, this.props.citaBalance, {from : this.props.account})).then(function(tx_id) {
			alert("Citadel Contract address approved as spender.");
		}).catch(function(e) {
			alert("error - " + e);
		})
	}

	handleNameChangeSuccess(tx_id) {
		alert("Transaction successful - name is updated");
		this.updateName();
		this.updateCitaBalance();
	}

	handleChange(e) {
		this.setState({newName : e.target.value});	
	}

	handleBioChange(e) {
		this.setState({bioInput : e.target.value})
	}

	handleEtherSendChange(e) {
		this.setState({etherToSend : e.target.value});
	}

	handleChangeBuyPrice(e) {
		this.setState({newBuyPrice : e.target.value})
	}

	handleSetBuyPrice(e) {
		var newBuyPrice = localWeb3.toBigNumber(this.props.newBuyPrice);
		var appInstance = this;
		console.log('account = ' + this.props.account + ' newBuyPrice = ' + newBuyPrice);
		appContracts.MyAdvancedToken.deployed()
		.then((instance) => instance.setPrices.sendTransaction(localWeb3.toBigNumber('0'), newBuyPrice, {from : this.props.account})).then(function(tx_id) {
			appInstance.handleSetBuyPriceSuccess(tx_id)
		}).catch(function(e) {
			alert("error - " + e);
		})
	}

	handleBuySubmit(e) {
		var ethToSend = localWeb3.toBigNumber(this.props.etherToSend);
		var account = this.props.account;
		var appInstance = this;
		console.log("from: " + this.props.account + " - to: " + this.props.tokenOwnerAccount);
		appContracts.MyAdvancedToken.deployed()
		.then((instance) => instance.buy.sendTransaction({from : this.props.account, to : this.props.tokenOwnerAccount, value : ethToSend})).then(function(tx_id) {
			appInstance.handleBuyCitaSuccess(tx_id)
		}).catch(function(e) {
			alert("error - " + e);
		})
	}

	handleBuyCitaSuccess(tx_id) {
		alert("Transaction successful - CITA bought");
		this.updateCitaBalance();
	}

	handleSetBuyPriceSuccess(tx_id) {
		alert("Transaction successful - Buy Price updated");
		this.updateBuyPrice();
	}
}

const mapStateToProps = state => {
  const { wallet } = state;

  return {wallet};
}

export default connect(mapStateToProps)(App)
