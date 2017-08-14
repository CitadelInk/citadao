import React, { Component } from 'react';
import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import actions from '../actions';
import { List } from 'immutable';

const {
	initializeContract,
	updateCitaBalance,
	setWalletData,
	setBuyPrice,
	submitBio,
	setName,
	handleSubmit,
	handleBuySubmit,
	handleApproveClicked,
	setSelectedAccount
} = actions;

class Header extends Component {
	 constructor(props) {
		super(props);
		this.handleAccountSelected = this.handleAccountSelected.bind(this);
	}

	render() {
		var accounts = this.props.wallet.get('accounts')
		var accountsArray = accounts.toArray();
		console.log("accounts[0]=" + accounts[0])
		var names = this.props.wallet.get('accountNames').toArray();
		var nameMap = new Map()
		console.log("accounts.length = " + accounts.size)
		if (accounts.size > 0) {
			console.log("YES 0")
			if(accounts.size === names.size) {
				console.log("YES 1")
				for(var i = 0; i < accounts.size; i++) {
					console.log("YES 2 - accounts[i]=" + accounts[i] + " - names[i]=" + names[i]);
					nameMap[accounts[i]] = names[i];
				}
			}
		}
		console.log("type of accounts = " + typeof(accounts))
		console.log("HEADER - accounts = " + accounts);
		console.log("HEADER - names = " + names);
		console.log("HEADER options - " + nameMap)

		const accountsDropDown = (
			<select onChange={this.handleAccountSelected}>
			{
				accounts.map(function(account) {
 					return (<option value={account}>{nameMap[account]} - {account}</option>)
 				})
			}			
			</select>
			
		);

		return (
			<div className="header">
				{accountsDropDown}
				<br />(names={this.props.wallet.get('accountNames')})
			</div>
		)
	}

	handleAccountSelected(e) {
		console.log("account selected - " + e.target.value)
		this.props.dispatch(setSelectedAccount(e.target.value));
	}
}

const mapStateToProps = state => {
  const { wallet } = state;

  return {wallet};
}

export default connect(mapStateToProps)(Header)
