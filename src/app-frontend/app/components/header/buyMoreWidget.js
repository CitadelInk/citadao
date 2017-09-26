import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';
import styles from './buyMoreWidget.css';
import { RaisedButton } from 'material-ui';

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
		const submission = this.props.submission;
		const approximateInk = this.props.wallet.get('etherToSend') / this.props.wallet.get('inkBuyPrice');
		
		return (			
			<div className={styles.buyMoreWidget}>
				<div className={styles.text}>
				<span>- Buy INK - Price: {this.props.wallet.get('inkBuyPrice')} WEI = 1 INK</span><br />
				<span>WEI: <input className={styles.input} onChange={this.handleEtherSendChange} value={this.props.wallet.get('etherToSend')}/> &asymp; {approximateInk} INK </span>
				</div>
				<RaisedButton primary className={styles.button} onClick={this.handleBuySubmit} label="Send WEI" />	
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
