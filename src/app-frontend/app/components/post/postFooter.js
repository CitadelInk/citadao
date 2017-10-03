import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';
import { CardText } from 'material-ui';
import ReactionButton from './reactionButton';

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

		var authorg = this.props.auths[this.props.authorg];
		if (authorg) {
			var submissions = authorg.submissions;
			if (submissions) {
				var submission = submissions[this.props.submission];
				if (submission) {
					var revisions = submission.revisions;
					if (revisions) {
						var revision = revisions[this.props.revision];
						if (revision) {
							mentions = revision.refCount + " - mentions";
						}
						if (revision.reactions) {
							mentions += " / " + revision.reactionCount + " - reactions";
							
							if (this.props.focusedPost) {
								reactionButtons = revision.reactions.map(reaction => {
									var buttonText = this.props.approvedReactions.get(reaction.reactionHash) + " - " + reaction.reactionReactors;
									return (<ReactionButton authorg={this.props.authorg} submission={this.props.submission} revision={this.props.revision} reactionValue={reaction.reactionHash} text={buttonText} />)
								})
							}
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
  const { wallet, approvedReactions, auths } = state.core;

  return {wallet, approvedReactions, auths };
}

export default connect(mapStateToProps)(PostFooter)
