import React, { Component } from 'react';
import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import actions from '../actions';

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
		console.log("accounts = " + this.props.wallet.get('accounts'));
		const accountsDropDown = (
			<select onChange={this.handleAccountSelected}>
			{
				this.props.wallet.get('accounts').map(function(account) {
 							return (<option value={account}>{account}</option>)
 				})
			}
			</select>
		);

		return (
			<div className="header">
				{accountsDropDown}
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
