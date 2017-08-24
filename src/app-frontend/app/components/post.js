import React, { Component } from 'react';
import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import PostHeader from './postHeader'
import PostBody from './postBody'
import PostFooter from './postFooter'

class Post extends Component {
	 constructor(props) {
		 super(props);
	}


	render() {
		const style = {
				background:'#F0F0F0',
				position:'relative',	
				width:'50%',
				top: '100px'
		}
			
		console.log("submission updated")
		const submission = this.props.submissions.get(this.props.submissionHash);
		var post = "loading...";
		if (submission) {
			post = (	
				<div>			
				<PostHeader submission={submission} />
				<PostBody submission={submission} />
				<PostFooter submission={submission} />
				</div>
			);
		}
		return(
			<div style={style}>
				{post}
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, submissions } = state;

  return {wallet, submissions };
}

export default connect(mapStateToProps)(Post)
