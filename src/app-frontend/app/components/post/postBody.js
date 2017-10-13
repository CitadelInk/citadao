import React, { Component } from 'react';
import { connect } from 'react-redux';
import PostSection from './postSection';
import {State} from 'slate';
import styles from './postBody.css';
import classNames from 'classnames/bind';
let cx = classNames.bind(styles);


class PostBody extends Component {


	constructor(props) {
		super(props);
	}


	render() {		
		var bodyClassName = styles.unfocusedBody;
		if (this.props.focusedPost) {
			bodyClassName = styles.focusedBody;
		}

		var authorg = this.props.auths[this.props.authorg];
		var text = ["loading"];
		var responseMap;
		
		
		
		if (authorg) {
			var revisions;
			
			if (this.props.bio) {
				var submission = authorg.bioSubmission;
				revisions = submission;
			} else {
				var submissions = authorg.submissions;
				if (submissions) {
					submission = submissions[this.props.submission];
					if (submission) {
						revisions = submission.revisions;
					}
				}
			}
			
			if (revisions) {
				var revision = revisions[this.props.revision];
				if (revision) {
					if (revision.text) {
						text = revision.text;
						if (revision.sectionRefKeyMap) {
							responseMap = revision.sectionRefKeyMap;
						}
					}
				}					
			}			
		}		

		var state = State.fromJSON(text);
		
		var body = "loading";
		var responses = [];
		var focusedPost = this.props.focusedPost;

		if(revision) {
			if (this.props.sectionIndex) {
				if (this.props.sectionIndex) {
					var nodeArray = Array.from(state.document.nodes);
					text = nodeArray[this.props.sectionIndex];
				}
				if (text) {
					if (responseMap) {
						responses = responseMap.get(this.props.sectionIndex);
					}
					if (!responses) {
						responses = [];
					}
					body = <PostSection sectionResponses={responses} section={text} sectionIndex={this.props.sectionIndex} authorg={this.props.authorg} submissionHash={this.props.submission} revisionHash={this.props.revision} focusedPost={focusedPost}/>
				}
			} else {		
				if (state.document && state.document.nodes) {
				
					var instance = this;
					body = state.document.nodes.map((section, i) => {		
						if (responseMap) {
							responses = responseMap.get(i);
						}		
									
						return (<PostSection sectionResponses={responses} section={section} sectionIndex={i} authorg={instance.props.authorg} submissionHash={instance.props.submission} revisionHash={instance.props.revision} focusedPost={focusedPost}/>);	
						
					});
				}
			}
		}

		return (			
			<div className={bodyClassName}>{body}</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, auths } = state.core;

  return {wallet, auths };
}

export default connect(mapStateToProps)(PostBody)
