import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';
import { List } from 'immutable';
import BuyMoreWidget from './buyMoreWidget';
import QuickStartWidget from './quickStartWidget';
import { Link, push } from 'redux-little-router';

const {
	initializeContract,
	updateCitaBalance,
	setWalletData,
	setBuyPrice,
	submitBio,
	handleBuySubmit,
	setSelectedAccount,
	navigatePage,
	gotoUserPage,
	setBuyMore,
	gotoHomePage,
	redirect
} = actions;

class Header extends Component {
	 constructor(props) {
		super(props);
		this.handleAccountSelected = this.handleAccountSelected.bind(this);
		this.gotoAccountPageClicked = this.gotoAccountPageClicked.bind(this);
		this.gotoDebugPageClicked = this.gotoDebugPageClicked.bind(this);
		this.gotoLandingPageClicked = this.gotoLandingPageClicked.bind(this);
		this.handleBuyMoreClicked = this.handleBuyMoreClicked.bind(this);
		this.handleClickDiv = this.handleClickDiv.bind(this);
		this.handleHomeClicked = this.handleHomeClicked.bind(this);
	}

	render() {
		const divStyle = {
			height: '60px',
			background:'#F0F0F0',
			width:'100%',
			position:'fixed',
			left:'0px',
			right:'0px',
			top:'0px',
			zIndex:'1000'
		}
		const headerStyle = {
			fontFamily: 'sans-serif',
			textAlign: 'center',
			fontSize:'24pt',
			width:'100%',
			margin:'auto',
			position:'relative'
		}
		const dropDownStyle = {
			position:'absolute',
			top:'2px',
			left:'5px'
		}
		const inkBalanceDivStyle = {
			position:'absolute',
			top:'22px',
			left:'5px'
		}

		const debugStyle = {
			position:'absolute',
			top:'42px',
			left:'5px'
		}

		const pStyle = {
			maxWidth:'500px'
		}

		var accountsDropDown = "";
		var account = this.props.wallet.get('account');
		if (account) {
			accountsDropDown = <b>Account: {account} </b>;
		} else {
			accountsDropDown = <p style={pStyle}>No account found. Please unlock MetaMask, set network to 'Custom RPC' URL = "http://104.236.160.22:8545/" then refresh the page.</p>
		}


		const gotoAccountPage = (
			<span><Link 
				href = {"/user/" + account}
				onClick = {this.gotoAccountPageClicked}
			><u>View This Account</u></Link> - </span>
		);
		/*const gotoDebugPage = (
			<span><Link href="/debug"><u>View Debug Page</u></Link></span>
		);*/
		const gotoLandingPage = (
			<span><Link href="/landing"><u>What is C I T A D E L.ink?</u></Link></span>
		);
		var ethBalanceVal = this.props.wallet.get('ethBalance');
		const ethBalance = (
			<div style={inkBalanceDivStyle}>
			<span>Balance: <b>{ethBalanceVal} ETH</b></span><br />
			</div>
		)
		
		return (
			<div style={divStyle} className="header" onClick={this.handleClickDiv}>			
				<div style={headerStyle} onClick={this.handleHomeClicked}>C I T A D E L - P R O T O T Y P E</div>		
				<div style={dropDownStyle}>
				{accountsDropDown}
				</div>
				{account && ethBalance}
				<div style={debugStyle}>
				{account && gotoAccountPage} {gotoLandingPage}	
				</div>
				<QuickStartWidget />
			</div>
		)
	}

	handleHomeClicked(e) {
		this.props.dispatch(gotoHomePage());
	}

	handleClickDiv(e) {
		this.props.dispatch(setBuyMore(false));
	}

	handleBuyMoreClicked(e) {
		this.props.dispatch(setBuyMore(true));
		e.stopPropagation();
	}

	handleAccountSelected(e) {
		this.props.dispatch(setSelectedAccount(e.target.value));
	}

	gotoAccountPageClicked(e) {
		this.props.dispatch(gotoUserPage(this.props.wallet.get('account')));
	}

	gotoDebugPageClicked(e) {
		this.props.dispatch(navigatePage({page:'debug', route:'\/debug'}));
	}
	gotoLandingPageClicked(e) {
		this.props.dispatch(navigatePage({page:'landing', route:'\/landing'}));
	}
}

const mapStateToProps = state => {
  const { router } = state;
  const { wallet, network } = state.core;

  return {wallet, network, router};
}

export default connect(mapStateToProps)(Header)
