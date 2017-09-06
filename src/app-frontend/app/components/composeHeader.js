import React, { Component } from 'react';
import appContracts from 'app-contracts'
import { connect } from 'react-redux';


import actions from '../actions';

const {
	gotoUserPage,
	setWalletData
} = actions;


class ComposeHeader extends Component {
	 constructor(props) {
		 super(props);
		  this.handlePostTitleChange = this.handlePostTitleChange.bind(this);
	}


	render() {
		const style = {
				height: '60px',
				background:'#7FDBFF',
				width:'100%',
				position:'absolute',
				top:'0'
		}
			
		return (			
			<div style={style}>
				Title: <input onChange={this.handlePostTitleChange} value={this.props.wallet.get('postTitleInput')} />
 			</div>
		);
	}



	handlePostTitleChange(e) {
		this.props.dispatch(setWalletData({postTitleInput : e.target.value}));
	}
}

const mapStateToProps = state => {
  const { wallet } = state;

  return {wallet };
}

export default connect(mapStateToProps)(ComposeHeader)
