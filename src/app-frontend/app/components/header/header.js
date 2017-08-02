import React, { Component } from 'react';
import {connect	} from 'react-redux'
import localWeb3 from "./web3Helper"
import appContracts from 'app-contracts'
import {resetErrorMessage, selectAccount} from '../../actions'

class Header extends Component {
	 constructor() {
		 super();

		this.state = {
			accounts : [],
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
		this.onAccountSelected = this.onAccountSelected.bind(this);
		this.onStoreChange = this.onStoreChange.bind(this);
		this.getSelectedAccount = this.getSelectedAccount.bind(this);

		// can't run this in mist as of yet as we are not deployed to a public network
		// SOON! Test against local browser to see if this works! Should see account - 1000 or whatever was reflected in the deplpoy
		if (typeof(mist) === "undefined") {
			appContracts.setProvider(localWeb3.currentProvider)	
			localWeb3.eth.getAccounts((error, accounts) => {
				if (accounts) {
					this.setState({accounts : accounts});
					this.props.store.dispatch(selectAccount(this.state.accounts[0]));
				}
			});
		}
	}

	componentWillMount() {
		this.props.store.subscribe(this.onStoreChange)
	}

	onStoreChange(c) {
		this.updateEverything()
	}

	getSelectedAccount() {
		return this.props.store.getState().selectedAccount;
	}

	updateEverything() {
		var account = this.getSelectedAccount();
		if(this.props != null && this.props.store != null && account != null) {
			localWeb3.eth.defaultAccount = account;					
			this.setState({ ethBalance : localWeb3.fromWei(localWeb3.eth.getBalance(account), 'ether').toString()})
			this.updateName();					
			this.updateCitaBalance();		
		}		
	}

	updateCitaBalance() {
		appContracts.MyAdvancedToken.deployed()
		.then((instance) => instance)
		.then((data) => data.balanceOf(this.props.store.getState().selectedAccount))
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
		.then((instance) => instance.getName(this.props.store.getState().selectedAccount))
		.then((data) => this.setState({citadelName : data}))
	}


	onAccountSelected(e) {
		console.log('dropdown onChange=' + e.target.value);
		this.props.store.dispatch(selectAccount(e.target.value));
	}


	render() {
		var accounts = this.state.accounts != null;
		return (
			<div id="header" className="Header">
				<center><h1 id="headerCitadel">CITADEL</h1></center>		
				{accounts && <span id="accountsDropdown"><select onChange={this.onAccountSelected}>				
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