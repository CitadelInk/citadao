import React, { Component } from 'react';
import { connect } from 'react-redux';
import PostHeader from '../post/postHeader';
import PostBody from '../post/postBody';
import PostFooter from '../post/postFooter';
import Compose from '../compose/compose';

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
				<PostHeader authorg={this.props.authorg} submission={this.props.submission} revision={this.props.revision} />
				<PostBody authorg={this.props.authorg} submission={this.props.submission} revision={this.props.revision}/>
				<PostFooter authorg={this.props.authorg} submission={this.props.submission} revision={this.props.revision}/>
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, submissions } = state;

  return {wallet, submissions };
}

export default connect(mapStateToProps)(Post)
