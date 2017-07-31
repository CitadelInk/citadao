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
				citadelName: '',
				newName: ''
			};
			// can't run this in mist as of yet as we are not deployed to a public network
			// SOON! Test against local browser to see if this works! Should see account - 1000 or whatever was reflected in the deplpoy
			if (typeof(mist) === "undefined") {
				appContracts.setProvider(localWeb3.currentProvider)
				appContracts.MyAdvancedToken.deployed()
				.then((instance) => instance)
				.then((data) => data.totalSupply())
				.then((p) => parseInt(p.toString())) // stupid BigNumber
				.then((p) => this.setState({tokenSupply: p}))				
			}

			localWeb3.eth.getAccounts((error, accounts) => {
				if (accounts) {
					localWeb3.eth.defaultAccount = accounts[0];
					this.setState({account: accounts[0]});

					appContracts.Citadel.deployed()
					.then((instance) => instance.getName(accounts[0]))
					.then((data) => this.setState({citadelName : data}))
					
					appContracts.MyAdvancedToken.deployed()
					.then((instance) => instance.balanceOf[accounts[0]])
					.then((data) => this.setState({citaBalance : data}))					
				}
			});

			this.handleChange = this.handleChange.bind(this);
			this.handleSubmit = this.handleSubmit.bind(this);
			this.handleNameChangeSuccess = this.handleNameChangeSuccess.bind(this);
	}

	render() {
		return (
			<div className="App">
				<p className="App-intro">
					Name = {this.state.citadelName}<br />
					Address = {this.state.account}<br />
					My ETH Balance = {this.state.ethBalance}<br />
					My CITA balance = {this.state.citaBalance}<br />
					Total Supply = {this.state.tokenSupply}<br />
				</p>

				<input onChange={this.handleChange} value={this.state.newName} />
				<button onClick={this.handleSubmit}>{'Update Name'}</button>				
			</div>
		);
	}

	handleSubmit(e) {
		var name = this.state.newName;
		var account = this.state.account;
		var instance = this;
		appContracts.Citadel.deployed()
		.then((instance) => instance.setName.sendTransaction(name, {from : this.state.account})).then(function(tx_id) {
			instance.handleNameChangeSuccess(tx_id)
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
}

export default App