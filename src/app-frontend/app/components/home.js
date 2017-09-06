import React, { Component } from 'react';
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import Posts from './panels/posts';
import EmptyLeft from './panels/emptyLeft';
import EmptyRight from './panels/emptyRight';
import Compose from './compose/compose';


class Home extends Component {
	 constructor(props) {
		super(props);
	}


	render() {
		const style = {
				background:'#FFFFFF',
				width:'100%',
				position: 'absolute',
				top:'60px',
				bottom:'0px',
				zIndex:'900',
				display:'flex',
				overflowX:'hidden'
		}

		const emptyStyle = {
			position:'relative',
			width:'33%',
			overflow:'scroll',
			height:'100%'
		}

		const postsStyle = {
			position:'relative',
			width:'33%',
			overflow:'scroll',
			bottom:'0px'
		}

		const composeStyle = {
			position:'relative',
			bottom:'0px',
			overflow:'hidden',
			width:'33%',
			float:'right'
		}
			
		return (
			
			<div style={style} className="Home">
				<div style={emptyStyle}>
				<EmptyLeft />
				</div>
				<div style={postsStyle}>
				<Posts postKeys={this.props.postKeys}/>	
				</div>
				<div  style={composeStyle}>
				<Compose />		
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, postKeys } = state;

  return {wallet, postKeys };
}

export default connect(mapStateToProps)(Home)
