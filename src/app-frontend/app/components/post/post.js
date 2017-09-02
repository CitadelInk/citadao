import React, { Component } from 'react';
import { connect } from 'react-redux';
import PostHeader from './postHeader';
import PostBody from './postBody';
import PostFooter from './postFooter';
import Compose from '.././compose';

class Post extends Component {
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
				top:'0',
				bottom:'0',
				left:'0'
		}
			
		return(
			<div style={style}>			
				<PostHeader submission={this.props.submission} />
				<PostBody submission={this.props.submission} />
				<PostFooter submission={this.props.submission} />
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, submissions } = state;

  return {wallet, submissions };
}

export default connect(mapStateToProps)(Post)
