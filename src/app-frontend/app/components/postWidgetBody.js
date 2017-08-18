import React, { Component } from 'react';
import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'
import { connect } from 'react-redux';


class PostWidgetBody extends Component {
	 constructor(props) {
		 super(props);
	}


	render() {
		const style = {
				height: '100px',
				background:'#F0F0F0',
				width:'100%'
		}
			
		return (			
			<div style={style}>
				<center>{this.props.submission.title}</center><br />
				<span>{this.props.submission.text}</span>
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, submissions } = state;

  return {wallet, submissions };
}

export default connect(mapStateToProps)(PostWidgetBody)
