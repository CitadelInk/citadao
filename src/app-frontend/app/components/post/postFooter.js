import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';

const {
	submitReaction
} = actions;


class PostFooter extends Component {
	 constructor(props) {
		 super(props);
		  this.reactionClicked = this.reactionClicked.bind(this);
	}


	render() {			
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
									console.log("reaction: " + reaction);
									console.log("reaction.reactionHash: " + reaction.reactionHash);
									console.log("reaction.reactionReactors: " + reaction.reactionReactors);
									console.log("this.props.approvedReactions: " + this.props.approvedReactions);
									console.log("this.props.approvedReactions[reaction.reactionHash]: " + this.props.approvedReactions.get(reaction.reactionHash));
									return (<button onClick={this.reactionClicked} value={reaction.reactionHash}>{this.props.approvedReactions.get(reaction.reactionHash)} - {reaction.reactionReactors + ""}</button>)
								})
							}
						}
					}					
				}			
			}		
		}

		
		
		return (			
			<div style={this.props.footerStyle}>
				<center>
 				{mentions}
				 </center>
				 {reactionButtons}
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
