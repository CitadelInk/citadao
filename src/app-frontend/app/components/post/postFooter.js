import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';
import { CardText } from 'material-ui';
import { RaisedButton } from 'material-ui';

const {
	submitReaction
} = actions;

import styles from './postFooter.css';


class PostFooter extends Component {
	 constructor(props) {
		 super(props);
		  this.reactionClicked = this.reactionClicked.bind(this);
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
			name = authorg.name;
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
									return (<RaisedButton secondary className={buttonStyle} labelPosition="before" label={buttonText} onClick={this.reactionClicked} value={reaction.reactionHash} />)
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

	reactionClicked(e) {
		this.props.dispatch(submitReaction(this.props.authorg, this.props.submission, this.props.revision, e.target.value));
		e.stopPropagation();
	}
}

const mapStateToProps = state => {
  const { wallet, approvedReactions, auths } = state;

  return {wallet, approvedReactions, auths };
}

export default connect(mapStateToProps)(PostFooter)
