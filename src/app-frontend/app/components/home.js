import React, { Component } from 'react';
import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import Posts from './panels/posts';
import EmptyLeft from './panels/emptyLeft';
import EmptyRight from './panels/emptyRight';


class Home extends Component {
	 constructor(props) {
		super(props);
	}


	render() {
		const style = {
				background:'#FFFFFF',
				width:'100%',
				position: 'relative',
				top:'100px',
				zIndex:'900',
				display:'flex'
		}
			
		return (
			
			<div style={style} className="Home">
				<EmptyLeft />
				<Posts />	
				<EmptyRight />		
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet } = state;

  return {wallet };
}

export default connect(mapStateToProps)(Home)
