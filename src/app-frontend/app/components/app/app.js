import React, { Component } from 'react';
import localWeb3 from "./web3Helper"
import appContracts from 'app-contracts'

class App extends Component {
	 constructor() {
		 super();

			this.state = {
				account: null,
				tokenSupply: 0
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
				}
			});
	}

	render() {
		return (
			<div className="App">
				<p className="App-intro">
					{this.state.account} - {this.state.tokenSupply}
				</p>
			</div>
		);
	}
}

export default App