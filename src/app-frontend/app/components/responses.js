import React, { Component } from 'react';
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import PostWidget from './postWidget';


class Responses extends Component {
	 constructor(props) {
		 super(props);
	}


	render() {
		const style = {
				height: '100%',
				background:'#FFFFFF',
				width:'33%',				
				margin: 'auto', 
				position: 'absolute',
				left:'0',
				right: '0',
				top: '0',
				bottom: '0',
		}
		console.log("RESPONSES 1");
		var instance = this;
		var posts = this.props.responses.map(function(responseHash) {
			console.log("RESPONSE 2")
			var submission = instance.props.submissions.get(responseHash);
			if (submission) {
				console.log("RESPONSE 3")
				return (<PostWidget key={submission.submissionHash} submission={submission} />)
			} else {
				console.log("RESPONSE 4")
				return ("loading...");
			}
		})
		return (
			
			<div style={style} className="Responses">
			Responses:	<br />
			{posts}
			
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, submissions } = state;

  return {wallet, submissions };
}

export default connect(mapStateToProps)(Responses)
