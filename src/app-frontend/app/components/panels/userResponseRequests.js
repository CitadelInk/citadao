import React, { Component } from 'react';
import { connect } from 'react-redux';
import ResponseRequestWidgetContainer from '../postWidget/responseRequestWidgetContainer';


class UserResponseRequests extends Component {
	 constructor(props) {
		 super(props);
	}


	render() {
		const style = {
			position:'relative',
			background:'#FFFFFF',
			//float:'left',
			width:'100%',
			margin:'auto'
		}
			
		var userAccount = this.props.user;
		var user = this.props.auths[userAccount];
		var posts;

		//console.log("user response requests.")
		if (this.props.received) {

			var receipts = user.responseRequestsReceivedKeys;
			
			if (receipts){
				posts = receipts.map(function(key, index) {
					var key2 = key + "-" + key.offerer + "-" + key.postUser + "-" + key.postSubmission + "-" + key.postRevision;
					return (<ResponseRequestWidgetContainer 
							showPost={true}
							key={key2} 
							postUser={key.postUser} 
							postSubmission={key.postSubmission} 
							postRevision={key.postRevision} 
							offerer={key.offerer}
							recipient={userAccount}/>)
				})
			}
		} else {

			var receipts = user.responseRequestsCreatedKeys;
			
			if (receipts){
				posts = receipts.map(function(key, index) {
					var key2 = key.recipient + "-" + key.postUser + "-" + key.postSubmission + "-" + key.postRevision + "-" + userAccount;
					return (<ResponseRequestWidgetContainer 
							showPost={true}
							key={key2} 
							postUser={key.postUser} 
							postSubmission={key.postSubmission} 
							postRevision={key.postRevision} 
							offerer={userAccount}
							recipient={key.recipient}/>)
				})
			}
		}
		return (
			
			<div style={style} className="Posts">
				{posts}		
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, auths } = state.core;

  return { wallet, auths };
}

export default connect(mapStateToProps)(UserResponseRequests)
