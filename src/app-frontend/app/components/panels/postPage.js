import React, { Component } from 'react';
import { connect } from 'react-redux';
import Post from '../post/post';
import Compose from '../compose/compose';
import Posts from './posts';
import styles from './postPage.css';
import { Card } from 'material-ui'

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

		const postStyle = {
				position:'relative',
				background:'#FFFFFF',
				minWidth:'33%',
				maxWidth:'34%',
				overflow:'hidden',
				bottom:'0px'
		}

		const headerStyle = {
			position:'relative',
			top:'0px'
		}

		const bodyStyle = {
			background:'#FFFFFF',
			position:'relative',
			overflow:'auto'
		}

		const footerStyle = {
			position:'relative',
			bottom:'0',
			height: '40px'
		}

		const authorg = this.props.authorg;
		const submission = this.props.submission;
		const revision = this.props.revision;
		var post = "loading...";

		if (submission) {
			post = (			
				<div className={styles.post}>
					<Card>
						<Post 
							headerStyle={headerStyle} 
							bodyStyle={bodyStyle} 
							footerStyle={footerStyle} 
							authorg={authorg} 
							submission={submission} 
							revision={revision} 
							focusedPost={true} />
					</Card>
				</div>
			);
		}


		var authorgData = this.props.auths[this.props.authorg];
		var keys = [];
		if (authorgData) {
			var submissionsData = authorgData.submissions;
			if (submissionsData) {
				var submissionData = submissionsData[this.props.submission];
				if (submissionData) {
					var revisionsData = submissionData.revisions;
					if (revisionsData) {
						var revisionData = revisionsData[this.props.revision];
						if (revisionData) {
							if (revisionData.refKeys) {
								keys = revisionData.refKeys;
							}
						}
					}					
				}			
			}		
		}

		var responses = "no responses... yet!";
		if (keys.length > 0) {
			responses = (			
				<Posts postKeys={keys} />
			)
		}
		

		return(
			<div className={styles.page}>
				<div className={styles.compose}>
				<Compose />
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
  const { wallet, auths } = state;

  return {wallet, auths };
}

export default connect(mapStateToProps)(PostPage)
