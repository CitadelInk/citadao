import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../actions'

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
				height: '60px',
				background:'#F0F0F0',
				width:'200px',
				borderRadius: '15px',
				position:'absolute',
				right:'10px',
				top:'0px',
				zIndex: '1100'
		}
			
		const submission = this.props.submission;
		const approximateInk = this.props.wallet.get('etherToSend') / this.props.wallet.get('inkBuyPrice');
		return (			
			<div style={style}>
				<span style={{fontSize:'10pt'}}>- Buy INK - Price: {this.props.wallet.get('inkBuyPrice')} WEI = 1 INK</span><br />
				<span style={{fontSize:'10pt'}}>WEI: <input onChange={this.handleEtherSendChange} value={this.props.wallet.get('etherToSend')} size="10" /> INK &asymp; {approximateInk}</span><br />
				<button style={{width:'180px'}} onClick={this.handleBuySubmit}>Send WEI</button>	
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
