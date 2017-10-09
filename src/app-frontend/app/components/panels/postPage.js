import React, { Component } from 'react';
import { connect } from 'react-redux';
import Post from '../post/post';
import ComposePanel from '../compose/composePanel';
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
		var timestamp = undefined;
		

		var authorgData = this.props.auths[authorg];
		var keys = [];
		if (authorgData) {
			var submissionsData = authorgData.submissions;
			if (submissionsData) {
				var submissionData = submissionsData[submission];
				if (submissionData) {
					var revisionsData = submissionData.revisions;
					if (revisionsData) {
						var revisionData = revisionsData[revision];
						if (revisionData) {
							timestamp = revisionData.timestamp;
							if (revisionData.refKeys) {
								keys = revisionData.refKeys;
							}
						}
					}					
				}			
			}		
		}

		if (submission) {
			post = (			
				<div className={styles.post}>
					<Card>
						<Post 
							authorg={authorg} 
							submission={submission} 
							revision={revision} 
							timestamp={timestamp}
							focusedPost={true} />
					</Card>
				</div>
			);
		}

		var responses = "no responses... yet!";
		if (keys.length > 0) {
			responses = (			
				<Posts postKeys={keys.slice().reverse()} />
			)
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
					{responses}
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
