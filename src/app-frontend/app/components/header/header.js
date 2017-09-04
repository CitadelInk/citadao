import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';
import { List } from 'immutable';
import BuyMoreWidget from './buyMoreWidget';

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
			top:'0px',
			zIndex:'1000'
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
		const inkBalanceDivStyle = {
			position:'absolute',
			top:'60px',
			right:'250px'
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
		
		const inkBalance = (
			<div style={inkBalanceDivStyle}>
			<span>{this.props.wallet.get('inkBalance')} INK</span><br />
			</div>
		)

		return (
			<div style={divStyle} className="header" onClick={this.handleClickDiv}>				
				<h1 style={headerStyle}>C I T A D E L</h1>
				{accountsDropDown}
				{inkBalance}
				{gotoAccountPage} - {gotoDebugPage}				
				<BuyMoreWidget />
			</div>
		)
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
}

const mapStateToProps = state => {
  const { wallet } = state;

  return {wallet};
}

export default connect(mapStateToProps)(Header)
