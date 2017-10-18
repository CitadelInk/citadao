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
	checkIfUserReferencesPost,
	checkCitadelIfUserReferencesPost,
	checkCitadelResponseRequestInkAddress
} = actions;
import styles from './postWidgetContainer.css';


class ResponseRequestWidgetContainer extends Component {
	 constructor(props) {
		 super(props);
		 this.collectBounty = this.collectBounty.bind(this);
		 this.checkIfUserReferencesPost = this.checkIfUserReferencesPost.bind(this);
	}

	collectBounty(e) {
		this.props.dispatch(collectResponseRequestBounty(this.props.offerer, this.props.postUser, this.props.postSubmission, this.props.postRevision));

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

		var canCollect = false;

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
										timestamp = receipt.timestamp + "";
										collected = receipt.collected;

										if(this.props.recipient === this.props.wallet.get('account')) {
											if (!collected) {
												canCollect = true;
											}
										} 
									}
								}
							}
						}
					}					
				}			
			}		
		}
			
		return (			
			<div className={styles.style}>
				<Card>
 				<div>
					<UserWidget authorg={this.props.offerer}/>
					offerers
					<UserWidget authorg={this.props.recipient}/>
					<span>bounty - {bounty}</span><br/>
					<span>timestamp - {timestamp}</span><br/>
					<span>collected - {collected}</span><br/>
					{ canCollect && <RaisedButton primary label="Collect" onClick={this.collectBounty}/> }
					<RaisedButton primary label="Check" onClick={this.checkIfUserReferencesPost}/>
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
