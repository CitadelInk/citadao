import React, { Component } from 'react';
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import Posts from './posts';


class Home extends Component {
	 constructor(props) {
		super(props);
	}


	render() {
		const style = {
				height: '100%',
				background:'#FFFFFF',
				width:'100%',
				position: 'relative',
				top:'100px',
				zIndex:'900'
		}
			
		return (
			
			<div style={style} className="Home">
			<Posts />	
			
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, submissions } = state;

  return {wallet, submissions };
}

export default connect(mapStateToProps)(Home)
