import React, { Component } from 'react';
import { connect } from 'react-redux';
import Post from './panels/post';
import Compose from './compose/compose';
import Responses from './panels/responses'

class PostPage extends Component {
	 constructor(props) {
		 super(props);
	}


	render() {
		const style = {
				background:'#FFFFFF',
				position:'fixed',
				width:'100%',
				top: '100px',
				display:'flex',
				height:'100%',
				maxHeight:'100%',
				overflow:'hidden'
		}
			
			
		const authorg = this.props.authorg;
		const submission = this.props.submission;
		const revision = this.props.revision;
		var post = "loading...";
		if (submission) {
			post = (			
				<Post authorg={authorg} submission={submission} revision={revision} />
			);
		}

		var responses = "responses..."
		if (this.props.wallet.get('selectedResponses')) {
			var responseSubmissions = this.props.wallet.get('selectedResponses')
			responses = (
				<Responses responses={responseSubmissions} />
			)
		}

		return(
			<div style={style}>
				{post}
				{responses}
				<Compose />
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, auths } = state;

  return {wallet, auths };
}

export default connect(mapStateToProps)(PostPage)
