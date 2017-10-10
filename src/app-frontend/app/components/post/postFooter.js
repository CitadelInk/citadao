import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';
import { CardText } from 'material-ui';
import ReactionButton from './reactionButton';
import ReactionList from './reactionList';

const {
	submitReaction
} = actions;

import styles from './postFooter.css';


class PostFooter extends Component {
	 constructor(props) {
		 super(props);
	}


	render() {	
		var footerStyle = styles.unfocusedFooter;
		if (this.props.focusedPost) {
			footerStyle = styles.focusedFooter;
		}

		var buttonStyle = styles.button;

		var mentions = "loading";
		var reactionButtons = ("");

		var approvedReactions;
		var authorg = this.props.auths[this.props.authorg];
		var submission;
		var revisions;

		if (authorg) {
			var submissions;
			if (this.props.bio) {
				approvedReactions = this.props.approvedAuthorgReactions;
				submission = authorg.bioSubmission;
				revisions = submission;
			} else {
				approvedReactions = this.props.approvedReactions;
				var submissions = authorg.submissions;
				if (submissions) {
					submission = submissions[this.props.submission];
					if (submission) {
						revisions = submission.revisions;
					}
				}
			} 

			if (revisions) {
				var revision = revisions[this.props.revision];
				if (revision) {
					mentions = revision.refCount + " - mentions";
				
					if (revision.reactions) {
						mentions += " / " + revision.reactionCount + " - reactions";
						
						if (this.props.focusedPost) {
							reactionButtons = revision.reactions.map(reaction => {
								var reactionFocused = this.props.wallet.get('selectedReactionHash') === reaction.reactionHash;
								var buttonText = approvedReactions.get(reaction.reactionHash) + " - " + reaction.reactionReactors.length;
								return (<div className={styles.singleButton}>
									{
										reactionFocused && <ReactionList users={reaction.reactionReactors} timestamps={reaction.reactionReactorsTimestamps} text={approvedReactions.get(reaction.reactionHash)} authorg={this.props.authorg} submission={this.props.submission} revision={this.props.revision} reactionValue={reaction.reactionHash}/>
									}
										<ReactionButton bio={this.props.bio} authorg={this.props.authorg} submission={this.props.submission} revision={this.props.revision} reactionValue={reaction.reactionHash} text={buttonText} />
									</div>
								)
							})
						}
					}
				}
			}					
				
		}

		
		
		return (			
			<div className={footerStyle}>
 				<div className={styles.mentions}>{mentions}</div>
				<div className={styles.buttonContainer}>{reactionButtons}</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, approvedReactions, approvedAuthorgReactions, auths } = state.core;

  return {wallet, approvedReactions, approvedAuthorgReactions, auths };
}

export default connect(mapStateToProps)(PostFooter)
