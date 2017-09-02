import React, { Component } from 'react';
import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import actions from '../actions'

const {
	setWalletData,
	handleBuySubmit
} = actions;

class BuyMoreWidget extends Component {
	 constructor(props) {
		 super(props);

		 this.handleBuySubmit = this.handleBuySubmit.bind(this);
		 this.handleEtherSendChange = this.handleEtherSendChange.bind(this);
	}


	render() {
		const style = {
				height: '120px',
				background:'#F0F0F0',
				width:'200px',
				borderRadius: '15px',
				position:'absolute',
				right:'20px',
				top:'20px',
				zIndex: '1100'
		}
			
		const submission = this.props.submission;
		const approximateInk = this.props.wallet.get('etherToSend') / this.props.wallet.get('inkBuyPrice');
		return (			
			<div style={style}>
				Price: {this.props.wallet.get('inkBuyPrice')} WEI = 1 INK<br />
				WEI: <input onChange={this.handleEtherSendChange} value={this.props.wallet.get('etherToSend')} size="10" /><br />
				INK &asymp; {approximateInk}<br />
				<button onClick={this.handleBuySubmit}>Send WEI</button>	
			</div>
		);
	}



	handleEtherSendChange(e) {
		this.props.dispatch(setWalletData({etherToSend : e.target.value}));
	}

	handleBuySubmit(e) {
		this.props.dispatch(handleBuySubmit());
	}
}

const mapStateToProps = state => {
  const { wallet } = state;

  return {wallet };
}

export default connect(mapStateToProps)(BuyMoreWidget)
