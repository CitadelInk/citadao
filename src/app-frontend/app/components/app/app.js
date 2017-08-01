import React, { Component } from 'react';
import localWeb3 from "./web3Helper"
import appContracts from 'app-contracts'

class App extends Component {
	 constructor() {
		 super();

			this.state = {
				account: null,
				tokenSupply: 0,
				citaBalance: 0,
				ethBalance: 0,
				citaBuyPrice: 0,
				etherToSend: 0,
				newBuyPrice: 0,
				citadelName: '',
				newName: '',
				tokenOwnerAccount: null,
				citadelComptrollerAccount: null
			};
			// can't run this in mist as of yet as we are not deployed to a public network
			// SOON! Test against local browser to see if this works! Should see account - 1000 or whatever was reflected in the deplpoy
			if (typeof(mist) === "undefined") {
				appContracts.setProvider(localWeb3.currentProvider)
				appContracts.MyAdvancedToken.deployed()
				.then((instance) => instance)
				.then((data) => data.totalSupply())
				.then((p) => parseInt(p.toString())) // stupid BigNumber
				.then((p) => this.setState({tokenSupply: p}));	
				
				appContracts.MyAdvancedToken.deployed()
				.then((instance) => instance)
				.then((data) => data.buyPrice())
				.then((p) => parseInt(p.toString()))
				.then((p) => this.setState({citaBuyPrice : p}));	

				appContracts.MyAdvancedToken.deployed()
				.then((instance) => instance)
				.then((data) => data.owner())
				.then((p) => this.setState({tokenOwnerAccount : p}));	
			}

			localWeb3.eth.getAccounts((error, accounts) => {
				if (accounts) {
					localWeb3.eth.defaultAccount = accounts[0];
					
					this.setState({account: accounts[0]});
					//localWeb3.personal.unlockAccount(this.state.account, '7b1fcfd05569450eccb37e6e9c976775752db53da1ff4e38fc7cd93b1184c178', 1500)
					appContracts.Citadel.deployed()
					.then((instance) => instance.getName(accounts[0]))
					.then((data) => this.setState({citadelName : data}))
					
					this.updateCitaBalance();
					
				}
			});

			this.handleChange = this.handleChange.bind(this);
			this.handleSubmit = this.handleSubmit.bind(this);
			this.handleNameChangeSuccess = this.handleNameChangeSuccess.bind(this);

			this.updateCitaBalance = this.updateCitaBalance.bind(this);

			this.handleEtherSendChange = this.handleEtherSendChange.bind(this);
			this.handleBuySubmit = this.handleBuySubmit.bind(this);
			this.handleBuyCitaSuccess = this.handleBuyCitaSuccess.bind(this);

			this.handleChangeBuyPrice = this.handleChangeBuyPrice.bind(this);
			this.handleSetBuyPriceSuccess = this.handleSetBuyPriceSuccess.bind(this);
			this.handleSetBuyPrice = this.handleSetBuyPrice.bind(this);
	}

	updateCitaBalance() {
		appContracts.MyAdvancedToken.deployed()
		.then((instance) => instance)
		.then((data) => data.balanceOf(this.state.account))
		.then((p) => parseInt(p.toString()))
		.then((p) => this.setState({citaBalance : p}));	
	}

	render() {
		var isOwner =  this.state.account != null && this.state.tokenOwnerAccount != null && this.state.account == this.state.tokenOwnerAccount;	
		console.log('isOwner=' + isOwner);
		
		return (
			<div className="App"><p className="App-intro">
						Name = {this.state.citadelName}<br />
						Address = {this.state.account}<br />
						My ETH Balance = {this.state.ethBalance}<br />
						My CITA balance = {this.state.citaBalance}<br />
						CITA Buy Price = {this.state.citaBuyPrice}<br />
						Total Supply = {this.state.tokenSupply}<br />
						CITA token owner = {this.state.tokenOwnerAccount}<br />
				

				{isOwner && 
					<input onChange={this.handleChangeBuyPrice} value={this.state.newBuyPrice} />
				}
				{isOwner &&
					<button onClick={this.handleSetBuyPrice}>{'Update Buy Price'}</button>
				}
				{isOwner &&
					<br />
				}

				<input onChange={this.handleChange} value={this.state.newName} />
				<button onClick={this.handleSubmit}>{'Update Name'}</button><br /><br />

				<input onChange={this.handleEtherSendChange} value={this.state.etherToSend} />
				<button onClick={this.handleBuySubmit}>{'Send Ether to buy CITA / 1 ETH'}</button><br /><br />				
			</p>
			</div>
		);
	}

	handleSubmit(e) {
		var name = this.state.newName;
		var account = this.state.account;
		var appInstance = this;
		appContracts.Citadel.deployed()
		.then((instance) => instance.setName.sendTransaction(name, {from : this.state.account})).then(function(tx_id) {
			appInstance.handleNameChangeSuccess(tx_id)
		}).catch(function(e) {
			alert("error - " + e);
		})
	}

	handleNameChangeSuccess(tx_id) {
		alert("Transaction successful - name is updated");
		appContracts.Citadel.deployed()
		.then((instance) => instance.getName(this.state.account))
		.then((data) => this.setState({citadelName : data}))
	}

	handleChange(e) {
		this.setState({newName : e.target.value});	
	}

	handleEtherSendChange(e) {
		this.setState({etherToSend : e.target.value});
	}

	handleChangeBuyPrice(e) {
		this.setState({newBuyPrice : e.target.value})
	}

	handleSetBuyPrice(e) {
		var newBuyPrice = localWeb3.toBigNumber(this.state.newBuyPrice);
		var appInstance = this;
		console.log('account = ' + this.state.account + ' newBuyPrice = ' + newBuyPrice);
		appContracts.MyAdvancedToken.deployed()
		.then((instance) => instance.setPrices.sendTransaction(localWeb3.toBigNumber('0'), newBuyPrice, {from : this.state.account})).then(function(tx_id) {
			appInstance.handleSetBuyPriceChangeSuccess(tx_id)
		}).catch(function(e) {
			alert("error - " + e);
		})
	}

	handleBuySubmit(e) {
		var ethToSend = this.state.etherToSend;
		var account = this.state.account;
		var appInstance = this;
		appContracts.Citadel.deployed()
		.then((instance) => instance.sendTransaction(ethToSend, {from : this.state.account})).then(function(tx_id) {
			appInstance.handleNameChangeSuccess(tx_id)
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

export default App