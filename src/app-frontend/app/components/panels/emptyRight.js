import React, { Component } from 'react';
import { connect } from 'react-redux';

class EmptyRight extends Component {
	 constructor(props) {
		 super(props);
	}


	render() {
		const style = {
				background:'#FFFFFF',
				minWidth:'33%',
				top: '100px',
				float:'left'
		}
			

		return(
			<div style={style}>
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, auths } = state.core;

  return {wallet, auths };
}

export default connect(mapStateToProps)(EmptyRight)
