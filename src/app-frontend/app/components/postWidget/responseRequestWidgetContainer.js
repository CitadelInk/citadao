import React, { Component } from 'react';
import { connect } from 'react-redux';
import Post from '../post/post';
import { Card } from 'material-ui';
import RaisedButton from 'material-ui/RaisedButton';	
import actions from '../../actions';
import { push } from 'redux-little-router';
import UserWidget from '../post/userWidget';
const {
	gotoPost,
	collectResponseRequestBounty,
	withdrawResponseRequestBounty,
	checkIfUserReferencesPost,
	checkCitadelIfUserReferencesPost,
	checkCitadelResponseRequestInkAddress
} = actions;
import styles from './responseRequestWidgetContainer.css';


class ResponseRequestWidgetContainer extends Component {
	 constructor(props) {
		 super(props);
		 this.collectBounty = this.collectBounty.bind(this);
		 this.withdrawBounty = this.withdrawBounty.bind(this);
		 this.checkIfUserReferencesPost = this.checkIfUserReferencesPost.bind(this);
		 this.embededPostClicked = this.embededPostClicked.bind(this);
	}

	embededPostClicked(e) {
		this.props.dispatch(gotoPost(this.props.postUser, this.props.postSubmission, this.props.postRevision));
	}

	collectBounty(e) {
		this.props.dispatch(collectResponseRequestBounty(this.props.offerer, this.props.postUser, this.props.postSubmission, this.props.postRevision));
	}

	withdrawBounty(e) {
		this.props.dispatch(withdrawResponseRequestBounty(this.props.recipient, this.props.postUser, this.props.postSubmission, this.props.postRevision));
	}


	checkIfUserReferencesPost(e) {
		this.props.dispatch(checkCitadelIfUserReferencesPost(this.props.recipient, this.props.postUser, this.props.postSubmission, this.props.postRevision));
	}

	render() {
		var authorgData = this.props.auths[this.props.postUser];
		var exists = false;
		var bounty = 0;
		var timestamp = 0;
		var collected = false;
		var completed = false;
		var withdrawn = false;

		var createdAtTime;
		var endsAtTime;
		var expired = false;

		var canCollect = false;
		var canWithdraw = false;

		var isCurrentUserOfferer = this.props.offerer === this.props.wallet.get('account');
		var isCurrentUserRecipient = this.props.recipient === this.props.wallet.get('account');

		var endTimeString = "";

		if (authorgData) {
			var submissionsData = authorgData.submissions;
			if (submissionsData) {
				var submissionData = submissionsData[this.props.postSubmission];
				if (submissionData) {
					var revisionsData = submissionData.revisions;
					if (revisionsData) {
						var revisionData = revisionsData[this.props.postRevision];
						if (revisionData) {
							//timestamp = revisionData.timestamp;
							if (revisionData.offerersToRecipients) {
								var recipientMap = revisionData.offerersToRecipients[this.props.offerer];
								if (recipientMap) {
									var receipt = recipientMap[this.props.recipient];
									if (receipt) {
										exists = receipt.exists;
										bounty = receipt.bounty + "";
										timestamp = receipt.timestamp;
										collected = receipt.collected;
										completed = receipt.completed;
										withdrawn = receipt.withdrawn;

										var now = new Date();
										createdAtTime = new Date(timestamp * 1000);
										endsAtTime = new Date((timestamp * 1000) + (24 * 60 * 60 * 1000)); // bounty 2 minutes long 
										expired = (now > endsAtTime);

										endTimeString = endsAtTime.toLocaleDateString() + " - " + endsAtTime.toLocaleTimeString();

										if(completed && !expired && !collected && isCurrentUserRecipient) {
											canCollect = true;
										} else if (!withdrawn && expired && isCurrentUserOfferer) {
											canWithdraw = true;
										}
									}
								}
							}
						}
					}					
				}			
			}		
		}

		var embededPost = (<div className={styles.embededPostStyle} onClick={this.embededPostClicked}>
							<Post 
								embeded={true}
								authorg={this.props.postUser} 
								submission={this.props.postSubmission} 
								revision={this.props.postRevision} />
							</div>)

		const offersString = "offers";
		const youOfferString = "You offer";
		const youString = " you";

		return (			
			<div className={styles.style}>
				<Card>
 				<div>
					{!isCurrentUserOfferer && <UserWidget secondary={true} authorg={this.props.offerer}/>}
					{!isCurrentUserOfferer && offersString}
					{isCurrentUserOfferer && youOfferString}
					{!isCurrentUserRecipient && <UserWidget secondary={true} authorg={this.props.recipient}/>}
					{isCurrentUserRecipient && youString}
					{!this.props.showPost && <span>{bounty} ETH to repond to the current post.<br/></span>}
					{this.props.showPost && <span>{bounty} ETH to repond to:<br/><br/></span>}
					{this.props.showPost && embededPost}
					{ !expired && endsAtTime && <span>Bounty Expires: {endTimeString}</span> }
					{ expired && <span>Bounty Expired.</span> }
					{ collected && <RaisedButton disabled label="Collected"/> }
					{ withdrawn && <RaisedButton disabled label="Withdrawn"/> }
					{ canCollect && <RaisedButton primary label="Collect" onClick={this.collectBounty}/> }
					{ canWithdraw && <RaisedButton primary label="Withdraw" onClick={this.withdrawBounty}/> }
				 </div>
				</Card>
			</div>
		);
	}

}

const mapStateToProps = state => {
  const { wallet, auths } = state.core;

  return {wallet, auths };
}

export default connect(mapStateToProps)(ResponseRequestWidgetContainer)
