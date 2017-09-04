import React, { Component } from 'react';
import { connect } from 'react-redux';
import Post from '../post/post';


class Responses extends Component {
	 constructor(props) {
		 super(props);
	}


	render() {
		const style = {
				position: 'relative',
				//height: '100%',
				background:'#FFFFFF',
				width:'33%',	
				float:'left',
				bottom:'0'
		}
		var instance = this;
		var posts = this.props.responses.map(function(responseHash) {
			var submission = instance.props.submissions.get(responseHash);
			if (submission) {
				return (<Post key={submission.submissionHash} submission={submission} />)
			} else {
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
