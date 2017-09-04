import React, { Component } from 'react';
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
				overflow:'hidden',
				right:'0',
				top:'100px',
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
  const { wallet } = state;

  return {wallet };
}

export default connect(mapStateToProps)(Compose)
