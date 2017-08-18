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
				height: '40px',
				background:'#85C1E9',
				width:'100%',
				borderTopLeftRadius: '15px',
				borderTopRightRadius: '15px'
		}
			
		console.log("submission - " + this.props.submission)
		return (			
			<div style={style}>
 				<span>{this.props.submission.hash} <br /> 
				 {this.props.submission.title}<br /></span>
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, submissions } = state;

  return {wallet, submissions };
}

export default connect(mapStateToProps)(PostWidgetHeader)
