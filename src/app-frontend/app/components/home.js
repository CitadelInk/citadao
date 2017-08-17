import React, { Component } from 'react';
import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import actions from '../actions';
import Header from './header';

const {
	initializeContract,
	initializeAccount,
	initializeAccounts,
	updateCitaBalance,
	setWalletData,
	setBuyPrice,
	submitBio,
	setName,
	handleSubmit,
	handleBuySubmit,
	handleApproveClicked
} = actions;

class Home extends Component {
	 constructor(props) {
		 super(props);
	}


	render() {
		const style = {
				height: '10000px',
				background:'#FFFFFF',
				width:'100%',
				margin:'0px auto',
				position:'fixed',
				top:'100px'
		}
			
		console.log("submissions - " + this.props.submissions)
		return (
			
			<div style={style} className="Home">
			{this.props.submissions.map(function(submission) {
 				return (<span>{submission.title} - {submission.text}<br /></span>)
 			})}
			
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, submissions } = state;

  return {wallet, submissions };
}

export default connect(mapStateToProps)(Home)
