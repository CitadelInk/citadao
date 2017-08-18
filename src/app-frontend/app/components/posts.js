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

		var posts = this.props.submissions.map(function(submission) {
			return (<PostWidget key={submission.hash} submission={submission} />)
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
  const { wallet, submissions } = state;

  return {wallet, submissions };
}

export default connect(mapStateToProps)(Posts)
