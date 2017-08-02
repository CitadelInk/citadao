import React, { Component } from 'react';
import localWeb3 from "./web3Helper"
import appContracts from 'app-contracts'
import Redux from 'redux'


class App extends Component {
	componentWillMount() {
		this.props.store.subscribe(this.onStoreChange)
	}

	onStoreChange() {
		console.log('something changed')
		this.updateEverything()
	}

	getSelectedAccount() {
		return this.props.store.getState().selectedAccount;
	}

	 constructor() {
		 super();

			this.state = {
				tokenSupply: 0,
				citaBalance: 0,
				ethBalance: 0,
				citaBuyPrice: 0.0,
				etherToSend: 0,
				newBuyPrice: 0,
				nameChangeCostInCita: 0,
				citadelName: '',
				newName: '',
				tokenOwnerAccount: null,
				citadelComptrollerAccount: null,
				tokenAddress: null,
				citadelAddress: null,
				citadelWalletAddress: null
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
				
				this.updateBuyPrice();

				appContracts.MyAdvancedToken.deployed()
				.then((instance) => instance)
				.then((data) => data.owner())
				.then((p) => this.setState({tokenOwnerAccount : p}));	

				appContracts.MyAdvancedToken.deployed()
				.then((instance) => instance.address)
				.then(address => this.setState({tokenAddress : address}));

				appContracts.Citadel.deployed()
				.then((instance) => instance.address)
				.then(address => this.setState({citadelAddress : address}));

				appContracts.Citadel.deployed()
				.then((instance) => instance)
				.then((data) => data.cost_name_update_in_cita())
				.then((p) => this.setState({nameChangeCostInCita : p}));	

				appContracts.Citadel.deployed()
				.then((instance) => instance.citadel_comptroller())
				.then((data) => this.setState({citadelComptrollerAccount : data}));
				appContracts.Citadel.deployed()
				.then((instance) => instance.wallet_address())
				.then((data) => this.setState({citadelWalletAddress : data}));
			}
			
			this.updateEverything();

			localWeb3.bzz.put("test file", (error, hash) => {
				console.log(hash);
			});

					


			this.handleChange = this.handleChange.bind(this);
			this.handleSubmit = this.handleSubmit.bind(this);
			this.handleNameChangeSuccess = this.handleNameChangeSuccess.bind(this);

			this.updateCitaBalance = this.updateCitaBalance.bind(this);
			this.updateBuyPrice = this.updateBuyPrice.bind(this);
			this.updateName = this.updateName.bind(this);
			this.updateEverything = this.updateEverything.bind(this);
			this.onStoreChange = this.onStoreChange.bind(this);
			
			this.handleEtherSendChange = this.handleEtherSendChange.bind(this);
			this.handleBuySubmit = this.handleBuySubmit.bind(this);
			this.handleBuyCitaSuccess = this.handleBuyCitaSuccess.bind(this);

			this.handleChangeBuyPrice = this.handleChangeBuyPrice.bind(this);
			this.handleSetBuyPriceSuccess = this.handleSetBuyPriceSuccess.bind(this);
			this.handleSetBuyPrice = this.handleSetBuyPrice.bind(this);

			this.handleApproveClicked = this.handleApproveClicked.bind(this);
			this.handleTestTransfer = this.handleTestTransfer.bind(this);

			this.getSelectedAccount = this.getSelectedAccount.bind(this);
	}

	updateEverything() {
		localWeb3.eth.getAccounts((error, accounts) => {
				if (accounts) {
					if(this.props != null && this.props.store != null) {
						var account = this.getSelectedAccount();
						if (account != null) {
							localWeb3.eth.defaultAccount = account;
							
							this.setState({ ethBalance : localWeb3.fromWei(localWeb3.eth.getBalance(account), 'ether').toString()})

							appContracts.Citadel.deployed()
							.then((instance) => instance.getName(account))
							.then((data) => this.setState({citadelName : data}))
							
							this.updateCitaBalance();
						}
					}
				}
		});
	}

	updateCitaBalance() {
		appContracts.MyAdvancedToken.deployed()
		.then((instance) => instance)
		.then((data) => data.balanceOf(this.getSelectedAccount()))
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
		.then((instance) => instance.getName(this.getSelectedAccount()))
		.then((data) => this.setState({citadelName : data}))
	}

	render() {
		var isOwner =  this.getSelectedAccount() != null && this.state.tokenOwnerAccount != null && this.getSelectedAccount() == this.state.tokenOwnerAccount;	
		console.log('isOwner=' + isOwner);
		
		return (
			<div>
			<div id="app" className="App"><p className="App-intro">
						Name = {this.state.citadelName}<br />
						Address = {this.getSelectedAccount()}<br />
						My ETH Balance = {this.state.ethBalance}<br />
						My CITA balance = {this.state.citaBalance}<br />
						CITA Buy Price = {this.state.citaBuyPrice}<br />
						Total Supply = {this.state.tokenSupply}<br />
						CITA token owner = {this.state.tokenOwnerAccount}<br />
						CITA token address = {this.state.tokenAddress}<br />
						Citadel Comptroller = {this.state.citadelComptrollerAccount}<br />
						Citadel address = {this.state.citadelAddress}<br />
						Citadel wallet address (should match CITA token address) = {this.state.citadelWalletAddress}<br />
				

				{isOwner && 
					<input onChange={this.handleChangeBuyPrice} value={this.state.newBuyPrice} />
				}
				{isOwner &&
					<button onClick={this.handleSetBuyPrice}>{'Update Buy Price'}</button>
				}
				{isOwner &&
					<br />
				}

				<input onChange={this.handleEtherSendChange} value={this.state.etherToSend} />
				<button onClick={this.handleBuySubmit}>{'Send WEI to buy 1 CITA / ' + this.state.citaBuyPrice + ' WEI'}</button><br />	
				
				{(this.state.citaBalance !== 0) &&
					<button onClick={this.handleApproveClicked}>{'Approve Citadel Contract to spend CITA for you'}</button>
				}
				{(this.state.citaBalance !== 0) &&
					<br />
				}
				{(this.state.citaBalance !== 0) &&
					<input onChange={this.handleChange} value={this.state.newName} />
				}
				{(this.state.citaBalance !== 0) &&
					<button onClick={this.handleSubmit}>{'Update Name - ' + this.state.nameChangeCostInCita + 'CITA'}</button>
				}
				{(this.state.citaBalance !== 0) &&
					<br />
				}

				<button onClick={this.handleTestTransfer}>{'Test Transfer CITA'}</button><br />
				bleah1<br />
				bleah1<br />
				bleah1<br />
				bleah1<br />
				bleah1<br />
				bleah1<br />
				bleah1<br />
				bleah1<br />
				bleah1<br />
				bleah1<br />
				bleah2<br />
				bleah2<br />
				bleah2<br />
				bleah2<br />
				bleah2<br />
				bleah2<br />
				bleah2<br />
				bleah2<br />
				bleah2<br />
				bleah2<br />
				bleah2<br />
			</p>
			</div>
			</div>
		);
	}

	handleTestTransfer(e) {
		var name = this.state.newName;
		var account = this.state.account;
		var appInstance = this;
		var testValue = localWeb3.toBigNumber('1');
		appContracts.MyAdvancedToken.deployed()
		.then((instance) => instance.transfer.sendTransaction(this.state.tokenOwnerAccount, testValue, {from : this.state.account, to : this.state.tokenAddress})).then(function(tx_id) {
			alert("successy");
		}).catch(function(e) {
			alert("error - " + e);
		})
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

	handleApproveClicked(e) {
		var name = this.state.newName;
		var account = this.state.account;
		var appInstance = this;
		appContracts.MyAdvancedToken.deployed()
		.then((instance) => instance.approve.sendTransaction(this.state.citadelAddress, this.state.citaBalance, {from : this.state.account})).then(function(tx_id) {
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
			appInstance.handleSetBuyPriceSuccess(tx_id)
		}).catch(function(e) {
			alert("error - " + e);
		})
	}

	handleBuySubmit(e) {
		var ethToSend = localWeb3.toBigNumber(this.state.etherToSend);
		var account = this.state.account;
		var appInstance = this;
		console.log("from: " + this.state.account + " - to: " + this.state.tokenOwnerAccount);
		appContracts.MyAdvancedToken.deployed()
		.then((instance) => instance.buy.sendTransaction({from : this.state.account, to : this.state.tokenOwnerAccount, value : ethToSend})).then(function(tx_id) {
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

export default App