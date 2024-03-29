import React, { Component } from 'react';
import { connect } from 'react-redux';
import PostWidgetContainer from '../postWidget/postWidgetContainer';


class Posts extends Component {
	 constructor(props) {
		 super(props);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (this.props.postKeys !== nextProps.postKeys)
	}

	render() {
		const style = {
			position:'relative',
			background:'#FFFFFF',
			width:'100%',
			margin:'auto'
		}

		var postos = this.props.postKeys;
		var selectedResponses = this.props.wallet.get('selectedResponses');
		if (this.props.isResponses && selectedResponses) {
			postos = selectedResponses;
		}
			
		var auths = this.props.auths;

		var posts = postos.map(function(key) {
			var key2 = key.authAdd + "-" + key.submissionIndex + "-" + key.revisionHash;
			var authorg = auths[key.authAdd];
			var text = ["loading"];
			var submission;
			var responseMap;
			var embededPostTextMap;		
			var authorgName = "";
			var authorgAvatar;
			var revisionHashes;
			var show = false;
			var reactionCount = 0;
			var reactions;
			var mentionCount = 0;
			var bountyCount = 0;
			
			if (authorg) {


				if(authorg.bioSubmission) {
					var bioSubmission = authorg.bioSubmission;
					var bioRevHashes = bioSubmission.revisions;
					var revHash = "1";
					if (bioRevHashes && bioRevHashes.length > 0) {
						revHash = bioRevHashes[bioRevHashes.length - 1];
					}
					var bioRevision = bioSubmission[revHash];
					if (bioRevision) {
						authorgName = bioRevision.name;
						if (bioRevision.image) {
							authorgAvatar = bioRevision.image;
						}
					}
				}

				var revisions;
				var submissions = authorg.submissions;
				if (submissions) {
					submission = submissions[key.submissionIndex];
					if (submission) {
						revisions = submission.revisions;
						revisionHashes = revisions.revisionHashes;

						// only show latest revisions in list
						if (key.revisionHash === revisionHashes[revisionHashes.length - 1]) {
							show = true;
						}
					}
				}		
				
				if (revisions) {
					var revision = revisions[key.revisionHash];
					if (revision) {
						if (revision.text) {
							text = revision.text;

							if (revision.sectionRefKeyMap) {
								responseMap = revision.sectionRefKeyMap;
							}
							if (revision.embededPostTextMap) {
								embededPostTextMap = revision.embededPostTextMap;
							}
						}
						reactionCount = revision.reactionCount;
						reactions = revision.reactions;
						mentionCount = revision.refCount;
					}					
				}			
			}
			if (show) {
				return (<PostWidgetContainer 
							revisionHashes={revisionHashes} 
							authorgName={authorgName} 
							authorgAvatar={authorgAvatar} 
							submissionValue={submission} 
							embededPostTextMap={embededPostTextMap} 
							text={text} 
							/*responseMap={responseMap}*/ 
							key={key2} 
							authorg={key.authAdd} 
							submission={key.submissionIndex} 
							revision={key.revisionHash} 
							timestamp={key.timestamp}
							reactionCount={reactionCount}
							reactions={reactions}
							mentionCount={mentionCount}
							bountyCount={bountyCount}/>)
			} else {
				return (<div/>);
			}
		})
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

export default connect(mapStateToProps)(Posts)
