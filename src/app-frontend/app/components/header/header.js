import React, { Component } from 'react';
import localWeb3 from "./web3Helper"
import appContracts from 'app-contracts'

class Header extends Component {
	 constructor() {
		 super();

			this.state = {
				accounts : [],
				accountIndex: 0,
				citaBalance: 0,
				ethBalance: 0,
				citaBuyPrice: 0.0,
				etherToSend: 0,
				citadelName: ''
			};
			
			this.updateEverything = this.updateEverything.bind(this);
			this.updateCitaBalance = this.updateCitaBalance.bind(this);
			this.updateBuyPrice = this.updateBuyPrice.bind(this);
			this.updateName = this.updateName.bind(this);

			this.updateEverything();
	}

	updateEverything() {
		// can't run this in mist as of yet as we are not deployed to a public network
		// SOON! Test against local browser to see if this works! Should see account - 1000 or whatever was reflected in the deplpoy
		if (typeof(mist) === "undefined") {
			appContracts.setProvider(localWeb3.currentProvider)			
			this.updateBuyPrice();

			var accountIndex = this.state.accountIndex;
			localWeb3.eth.getAccounts((error, accounts) => {
				if (accounts) {
					this.setState({accounts : accounts});
					localWeb3.eth.defaultAccount = accounts[accountIndex];					
					this.setState({ ethBalance : localWeb3.fromWei(localWeb3.eth.getBalance(accounts[accountIndex]), 'ether').toString()})
					this.updateName();					
					this.updateCitaBalance();					
				}
			});			
		}
	}

	updateCitaBalance() {
		appContracts.MyAdvancedToken.deployed()
		.then((instance) => instance)
		.then((data) => data.balanceOf(this.state.accounts[this.state.accountIndex]))
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
		.then((instance) => instance.getName(this.state.accounts[this.state.accountIndex]))
		.then((data) => this.setState({citadelName : data}))
	}

	render() {
		var accounts = this.state.accounts != null;
		var test = ['a', 'b', 'c', 'd']
		return (
			<div id="header" className="Header">
				<center><h1 id="headerCitadel">CITADEL</h1></center>		
				{accounts && <span id="accountsDropdown"><select>				
					{
						this.state.accounts.map(function(account) {
							return (<option>{account}</option>)
						})
					}				
				</select></span>
				}
				<span id="currencies">CITA - {this.state.citaBalance} --- ETH - {this.state.ethBalance}</span>	
			<hr />
			</div>
		);
	}

}

export default Header