import React, { Component } from 'react';
import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import PostWidget from './postWidget';


class Posts extends Component {
	 constructor(props) {
		 super(props);
	}


	render() {
		const style = {
				height: '100%',
				background:'#FFFFFF',
				width:'50%',				
				margin: 'auto', 
				position: 'absolute',
				left:'0',
				right: '0',
				top: '0',
				bottom: '0',
		}
		/*var posts = this.props.submissions.map(function(submission, key) {
			return (<PostWidget key={submission.submissionHash} submission={submission} />)
		})*/
		console.log("postKeys length: " + this.props.postKeys.length);
		var posts = this.props.postKeys.map(function(key) {
			var key2 = key.authorgAddress + "-" + key.submissionHash + "-" + key.revisionHash;
			console.log("key2: " + key2);
			return (<PostWidget key={key2} authorg={key.authorgAddress} submission={key.submissionHash} revision={key.revisionHash} />)
		})
		return (
			
			<div style={style} className="Posts">
				<br />
			{posts}
			
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, postKeys, auths } = state;

  return {wallet, postKeys, auths };
}

export default connect(mapStateToProps)(Posts)
