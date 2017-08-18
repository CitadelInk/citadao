import React, { Component } from 'react';
import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'
import { connect } from 'react-redux';


class PostWidgetHeader extends Component {
	 constructor(props) {
		 super(props);
	}


	render() {
		const style = {
				height: '60px',
				background:'#85C1E9',
				width:'100%',
				borderTopLeftRadius: '15px',
				borderTopRightRadius: '15px'
		}
			
		console.log("submission - " + this.props.submission)
		return (			
			<div style={style}>
 				<span>submission hash - {this.props.submission.submissionHash} <br /> </span>
 				<span>revision hash - {this.props.submission.revisionHash} <br /> </span>
 				<span>authorg address - {this.props.submission.submissionAuthorg} <br /> </span>
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, submissions } = state;

  return {wallet, submissions };
}

export default connect(mapStateToProps)(PostWidgetHeader)
