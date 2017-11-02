import React, { Component } from 'react';
import { connect } from 'react-redux';
import PostWidgetContainer from '../postWidget/postWidgetContainer';


class Posts extends Component {
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

		var postos = this.props.postKeys;
		var selectedResponses = this.props.wallet.get('selectedResponses');
		if (this.props.isResponses && selectedResponses) {
			postos = selectedResponses;
		}
			
		var auths = this.props.auths;

		var posts = postos.map(function(key) {
			var key2 = key.authAdd + "-" + key.submissionHash + "-" + key.revisionHash;
			var authorg = auths[key.authAdd];
			var text = ["loading"];
			var submission;
			var responseMap;
			var embededPostTextMap;		
			var authorgName = "";
			var authorgAvatar;
			
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
					submission = submissions[key.submissionHash];
					if (submission) {
						revisions = submission.revisions;
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
					}					
				}			
			}

			return (<PostWidgetContainer authorgName={authorgName} authorgAvatar={authorgAvatar} submissionValue={submission} embededPostTextMap={embededPostTextMap} text={text} responseMap={responseMap} key={key2} authorg={key.authAdd} submission={key.submissionHash} revision={key.revisionHash} timestamp={key.timestamp}/>)
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
