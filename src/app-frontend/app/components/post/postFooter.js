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
		if (this.props.bio) {
			approvedReactions = this.props.approvedAuthorgReactions;
		} else { 
			approvedReactions = this.props.approvedReactions; 
		}

		mentions = this.props.mentionsCount + " - mentions";
		mentions += " / " + this.props.reactionCount + " - reactions";
	
		if (this.props.reactions && this.props.focusedPost) {
			reactionButtons = this.props.reactions.map(reaction => {
				var reactionFocused = this.props.wallet.get('selectedReactionHash') === reaction.reactionHash;
				var buttonText = approvedReactions.get(reaction.reactionHash) + " - " + reaction.reactionReactors.length;
				return (<div key={"reaction-div-" + reaction.reactionHash} className={styles.singleButton}>
					{
						reactionFocused && <ReactionList key={"reaction-list-" + reaction.reactionHash} bio={this.props.bio} users={reaction.reactionReactors} timestamps={reaction.reactionReactorsTimestamps} text={approvedReactions.get(reaction.reactionHash)} authorg={this.props.authorg} submission={this.props.submission} revision={this.props.revision} reactionValue={reaction.reactionHash}/>
					}
						<ReactionButton key={"reaction-" + reaction.reactionHash} bio={this.props.bio} authorg={this.props.authorg} submission={this.props.submission} revision={this.props.revision} reactionValue={reaction.reactionHash} text={buttonText} key={reaction.reactionHash}/>
					</div>
				)
			})
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
  const { wallet, approvedReactions, approvedAuthorgReactions } = state.core;

  return {wallet, approvedReactions, approvedAuthorgReactions };
}

export default connect(mapStateToProps)(PostFooter)
