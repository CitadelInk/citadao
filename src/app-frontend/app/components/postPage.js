import React, { Component } from 'react';
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import Post from './post';
import Compose from './compose';
import Responses from './responses'

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
			
		const submission = this.props.submissions.get(this.props.submissionHash);
		var post = "loading...";
		if (submission) {
			post = (			
				<Post submission={submission} />
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
  const { wallet, submissions } = state;

  return {wallet, submissions };
}

export default connect(mapStateToProps)(PostPage)
