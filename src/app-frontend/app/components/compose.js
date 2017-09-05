import React, { Component } from 'react';
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import ComposeHeader from './composeHeader'
import ComposeBody from './composeBody'
import ComposeFooter from './composeFooter'

class Compose extends Component {
	 constructor(props) {
		 super(props);
	}


	render() {
		const style = {
				position:'absolute',
				background:'#FFFFFF',
				width:'33%',
				height:'100%',
				overflow:'hidden',
				right:'0',
				top:'0',
				bottom:'0'
		}

		return(
			<div style={style}>
				<ComposeHeader />
				<ComposeBody />
				<ComposeFooter />
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, submissions } = state;

  return {wallet, submissions };
}

export default connect(mapStateToProps)(Compose)
