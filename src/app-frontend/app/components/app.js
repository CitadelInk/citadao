import React, { Component } from 'react';
import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import actions from '../actions';

const {initializeContract, initializeAccount} = actions;

class App extends Component {
	 constructor(props) {
		 super(props);
			// can't run this in mist as of yet as we are not deployed to a public network
			// SOON! Test against local browser to see if this works! Should see account - 1000 or whatever was reflected in the deplpoy
			if (typeof mist === "undefined") {
				props.dispatch(initializeContract());
			}

			const accountIndex = props.wallet.get('accountIndex');
			const selectedBioRevisionIndex = props.wallet.get('selectedBioRevisionIndex');
			props.dispatch(initializeAccount(accountIndex, selectedBioRevisionIndex));					
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

	isOwner() {
		return this.props.wallet.get('account') !== null &&
			this.props.wallet.get('tokenOwnerAccount') !== null &&
			this.props.wallet.get('account') === this.props.wallet.get('tokenOwnerAccount');
	}

	render() {

		return (
			<div className="App">
				<p className="App-intro">
					Name = {this.props.wallet.get('citadelName')}<br />
					Address = {this.props.wallet.get('account')}<br />
					My ETH Balance = {this.props.wallet.get('ethBalance')}<br />
					My CITA balance = {this.props.wallet.get('citaBalance')}<br />
					CITA Buy Price = {this.props.wallet.get('citaBuyPrice')}<br />
					Total Supply = {this.props.wallet.get('tokenSupply')}<br />
					CITA token owner = {this.props.wallet.get('tokenOwnerAccount')}<br />
					CITA token address = {this.props.wallet.get('tokenAddress')}<br />
					Citadel Comptroller = {this.props.wallet.get('citadelComptrollerAccount')}<br />
					Citadel address = {this.props.wallet.get('citadelAddress')}<br />
					Citadel wallet address (should match CITA token address) = {this.props.wallet.get('citadelWalletAddress')}<br />
					Bio Revisions Length = {this.props.wallet.get('bioRevisions').length}<br />
					Selected Bio Revision Index - {this.props.wallet.get('selectedBioRevisionIndex')}<br />
					Selected Bio Revision Value - {this.props.wallet.get('selectedBioRevision')}<br />
				</p>
				
				<form>
					{this.isOwner() && 
						<input onChange={this.handleChangeBuyPrice} value={this.props.wallet.get('newBuyPrice')} />
					}
					{this.isOwner() &&
						<button onClick={this.handleSetBuyPrice}> Update Buy Price </button>
					}
					{this.isOwner() &&
						<br />
					}

					<input onChange={this.handleEtherSendChange} value={this.props.wallet.get('etherToSend')} />
					<button onClick={this.handleBuySubmit}>Send WEI to buy 1 CITA / {this.props.wallet.get('citaBuyPrice')} WEI</button><br />	
					
					{(this.props.wallet.get('citaBalance') !== 0) &&
						<button onClick={this.handleApproveClicked}>Approve Citadel Contract to spend CITA for you</button>
					}
					{(this.props.wallet.get('citaBalance') !== 0) &&
						<br />
					}
					{(this.props.wallet.get('citaBalance') !== 0) &&
						<input onChange={this.handleChange} value={this.props.wallet.get('newName')} />
					}
					{(this.props.wallet.get('citaBalance') !== 0) &&
						<button onClick={this.handleSubmit}>{`Update Name - ${this.props.wallet.get('nameChangeCostInCita')} CITA`}</button>
					}
					{(this.props.wallet.get('citaBalance') !== 0) &&
						<br />
					}

					{(this.props.wallet.get('citaBalance') !== 0) &&
					<input onChange={this.handleBioChange} value={this.props.wallet.get('bioInput')} />
					}
					{(this.props.wallet.get('citaBalance') !== 0) &&
					<button onClick={this.handleSubmitBio}>Submit Bio</button>
					}
				</form>
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
