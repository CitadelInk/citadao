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
		const divStyle = {
			height: '100px',
			background:'#F0F0F0',
			width:'100%',
			position:'fixed',
			top:'0px'
		}
		const headerStyle = {
			fontFamily: 'sans-serif',
			textAlign: 'center'
		}
		const dropDownStyle = {
			position:'fixed',
			top:'50px',
			left:'10px'
		}
		const citaBalanceDivStyle = {
			position:'fixed',
			top:'60px',
			right:'10px'
		}
		const accountsDropDown = (
			<select style={dropDownStyle} onChange={this.handleAccountSelected}>
			{
				this.props.wallet.get('accounts').zip(this.props.wallet.get('accountNames')).map((item,) =>{
					return (<option value={item[0]} key={item[0]}> {item[1]}-{item[0]} </option>);
				})
			}			
			</select>			
		);
		const citaBalance = (
			<div style={citaBalanceDivStyle}>
			<span>{this.props.wallet.get('citaBalance')} CITA</span>
			</div>
		)

		return (
			<div style={divStyle} className="header">				
				<h1 style={headerStyle}>C I T A D E L</h1>
				{accountsDropDown}
				{citaBalance}
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
