import React, { Component } from 'react';
import { connect } from 'react-redux';

class EmptyLeft extends Component {
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
				left
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, auths } = state;

  return {wallet, auths };
}

export default connect(mapStateToProps)(EmptyLeft)
