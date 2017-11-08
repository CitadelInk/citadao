import React, { Component } from 'react';
import { connect } from 'react-redux';
import Post from '../post/post';
import ComposePanel from '../compose/composePanel';
import PostExtrasPanel from './postExtrasPanel';
import Posts from './posts';
import styles from './postPage.css';
import { Card } from 'material-ui';

class PostPage extends Component {
	 constructor(props) {
		 super(props);
		this.state = { width: '0', height: '0' };
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
	}

	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
	}

	updateWindowDimensions() {
		this.setState({ width: window.innerWidth, height: window.innerHeight });
	}

	render() {
		const authorg = this.props.router.params["authorg"];
		const submission = this.props.router.params["subHash"];
		const revision = this.props.router.params["revHash"];
		var post = "loading...";
		var text;
		var timestamp = undefined;
		var responseMap = null;
		var embededPostTextMap;	
		var submissionData;
		var authorgData = this.props.auths[authorg];
		var keys = null;
		var authorgName = "";
		var authorgAvatar;
		var focusedLoadDone = false;
		var revisionHashes;

		if (authorgData) {
			if(authorgData.bioSubmission) {
				var bioSubmission = authorgData.bioSubmission;
				var bioRevHashes = bioSubmission.revisions;
				var revHash = "1";
				if (bioRevHashes && bioRevHashes.length > 0) {
					revHash = bioRevHashes[bioRevHashes.length - 1];
				}
				if (this.props.bio) {
					if(this.props.revision) {
						revHash = this.props.revision;
					}
				}
				var bioRevision = bioSubmission[revHash];
				if (bioRevision) {
					authorgName = bioRevision.name;
					if (bioRevision.image) {
						authorgAvatar = bioRevision.image;
					}
				}
			}
			var submissionsData = authorgData.submissions;
			if (submissionsData) {
				submissionData = submissionsData[submission];
				if (submissionData) {
					var revisionsData = submissionData.revisions;
					revisionHashes = revisionsData.revisionHashes;
					if (revisionsData) {
						var revisionData = revisionsData[revision];
						if (revisionData) {
							text = revisionData.text;
							timestamp = revisionData.timestamp;
							focusedLoadDone = revisionData.focusedLoadDone;
							console.log("focusedLoadDone: " + focusedLoadDone);
							if (revisionData.sectionRefKeyPostsLoaded == revisionData.refCount) {
								responseMap = revisionData.sectionRefKeyMap;
							} else if (revisionData.refCount && revisionData.refCount > 0) {
								console.warn("revisionData ref counts do not match. revisionData.refCount: " + revisionData.refCount + " - revisionData.sectionRefKeyPostsLoaded: " + revisionData.sectionRefKeyPostsLoaded)							
								//focusedLoadDone = false;
							}
							if (revisionData.refKeys) {
								keys = revisionData.refKeys;
							}
							if (revisionData.embededPostTextMap) {
								embededPostTextMap = revisionData.embededPostTextMap;
							}
						}
					}					
				}			
			}		
		}

		if (submission && focusedLoadDone) {
			post = (			
				<div className={styles.post}>
					<Card>
						<Post 
							revisionHashes={revisionHashes}
							authorgAvatar={authorgAvatar}
							authorgName={authorgName}
							submissionValue={submissionData}
							text={text}
							embededPostTextMap={embededPostTextMap}
							responseMap={responseMap}
							authorg={authorg} 
							submission={submission} 
							revision={revision} 
							timestamp={timestamp}
							focusedPost={true} />
					</Card>
				</div>
			);
		}

		

		return(
			<div className={styles.page}>
				<div className={styles.compose}>
					<ComposePanel />
				</div>
				<div className={styles.postContainer}>
					{post}
				</div>
				<div className={styles.responses}>
					<PostExtrasPanel />
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, auths } = state.core;
  const { router } = state;

  return {wallet, auths, router };
}

export default connect(mapStateToProps)(PostPage)
