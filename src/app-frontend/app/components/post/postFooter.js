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
		var reactions = "loading"
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
							reactions = revision.refCount + " - mentions";
						}
					}					
				}			
			}		
		}
		
		return (			
			<div style={this.props.footerStyle}>
 				{reactions}
			</div>
		);
	}

	reactionClicked(e) {
		const sub = this.props.submission;
		this.props.dispatch(submitReaction(sub.submissionAuthorg, sub.submissionHash, sub.revisionHash, e.target.value));
		e.stopPropagation();
	}
}

const mapStateToProps = state => {
  const { wallet, approvedReactions, auths } = state;

  return {wallet, approvedReactions, auths };
}

export default connect(mapStateToProps)(PostFooter)
