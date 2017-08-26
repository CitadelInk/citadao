import React, { Component } from 'react';
import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import actions from '../actions';

const {
	submitReaction
} = actions;


class ComposeFooter extends Component {
	 constructor(props) {
		 super(props);
		  this.handleSubmitPost = this.handleSubmitPost.bind(this);
	}


	render() {
		const style = {
				height: '40px',  
				background:'#707B7c',
				width:'100%',
				position:'fixed', //hack, right?
				bottom:'0'
		}
					
		return (			
			<div style={style}>
 				<button onClick={this.handleSubmitPost}>Submit Post</button>
			</div>
		);
	}

	handleSubmitPost(e) {
		this.props.dispatch(submitPost());
	}

}

const mapStateToProps = state => {
  const { wallet, approvedReactions } = state;

  return {wallet, approvedReactions };
}

export default connect(mapStateToProps)(ComposeFooter)
