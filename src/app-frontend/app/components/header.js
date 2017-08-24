import React, { Component } from 'react';
import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import actions from '../actions';
import { List } from 'immutable';
import BuyMoreWidget from './buyMoreWidget';

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
	setSelectedAccount,
	navigatePage,
	gotoUserPage,
	setBuyMore
} = actions;

class Header extends Component {
	 constructor(props) {
		super(props);
		this.handleAccountSelected = this.handleAccountSelected.bind(this);
		this.gotoAccountPageClicked = this.gotoAccountPageClicked.bind(this);
		this.gotoDebugPageClicked = this.gotoDebugPageClicked.bind(this);
		this.handleBuyMoreClicked = this.handleBuyMoreClicked.bind(this);
		this.handleClickDiv = this.handleClickDiv.bind(this);
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
			position:'absolute',
			top:'50px',
			left:'10px'
		}
		const citaBalanceDivStyle = {
			position:'absolute',
			top:'60px',
			right:'10px'
		}
		const accountsDropDown = (
			<select style={dropDownStyle} onChange={this.handleAccountSelected}>
			{
				this.props.wallet.get('accounts').zip(this.props.wallet.get('accountNames')).map((item,) =>{
					return (<option value={item[0]} key={item[0]}> {item[1]} - {item[0]} </option>);
				})
			}			
			</select>			
		);
		const gotoAccountPage = (
			<span onClick={this.gotoAccountPageClicked}>View This Account Page</span>
		);
		const gotoDebugPage = (
			<span onClick={this.gotoDebugPageClicked}>View Debug Page</span>
		);
		
		const citaBalance = (
			<div style={citaBalanceDivStyle}>
				<button onClick={this.handleBuyMoreClicked}>Buy More</button>
			<span>{this.props.wallet.get('citaBalance')} CITA</span><br />
			</div>
		)

		return (
			<div style={divStyle} className="header" onClick={this.handleClickDiv}>				
				<h1 style={headerStyle}>C I T A D E L</h1>
				{accountsDropDown}
				{citaBalance}
				{gotoAccountPage} - {gotoDebugPage}
			</div>
		)
	}

	handleClickDiv(e) {
		console.log("div clicked");
		this.props.dispatch(setBuyMore(false));
	}

	handleBuyMoreClicked(e) {
		console.log("button clicked");
		this.props.dispatch(setBuyMore(true));
		e.stopPropagation();
	}

	handleAccountSelected(e) {
		console.log("account selected - " + e.target.value)
		this.props.dispatch(setSelectedAccount(e.target.value));
	}

	gotoAccountPageClicked(e) {
		this.props.dispatch(gotoUserPage(this.props.wallet.get('account')));
	}

	gotoDebugPageClicked(e) {
		this.props.dispatch(navigatePage({page:'debug', route:'\/debug'}));
	}
}

const mapStateToProps = state => {
  const { wallet } = state;

  return {wallet};
}

export default connect(mapStateToProps)(Header)
