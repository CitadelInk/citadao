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
		console.log("authorgName = " + this.props.submission.authorgName)
		return (			
			<div style={style}>
				<span>authorg name - {this.props.submission.authorgName}</span><br />
 				<span>submission hash - {this.props.submission.submissionHash}</span><br />
 				<span>revision hash - {this.props.submission.revisionHash}</span><br />
 				<span>authorg address - {this.props.submission.submissionAuthorg}</span><br />
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet } = state;

  return {wallet };
}

export default connect(mapStateToProps)(PostWidgetHeader)
