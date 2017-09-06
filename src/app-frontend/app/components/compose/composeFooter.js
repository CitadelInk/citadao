import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';

const {
	submitPost
} = actions;


class ComposeFooter extends Component {
	 constructor(props) {
		 super(props);
		  this.handleSubmitPost = this.handleSubmitPost.bind(this);
	}


	render() {
		const style = {
				height: '25px',  
				background:'#707B7c',
				width:'100%',
				position:'absolute',
				bottom:'0'
		}
					
		const buttonStyle = {
			position:'relative',
			top:'2px',
			width:'80%',
			height:'20px'
		}
		return (			
			<div style={style}>
				<center>
 				<button style={buttonStyle} onClick={this.handleSubmitPost}>Submit Post</button>
				 </center>
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
