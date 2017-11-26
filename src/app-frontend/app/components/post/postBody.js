import React, { Component } from 'react';
import { connect } from 'react-redux';
import PostSection from './postSection';
import {Value, Block} from 'slate';
import styles from './postBody.css';
import classNames from 'classnames/bind';
import { List } from 'immutable';
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

		var state;
		if (this.props.text) {
			if (this.props.embeded) {
				state = Block.fromJSON(this.props.text);
			} else {
				state = this.props.text;
			}
		}

		
		var body = "loading";
		var responses = null;
		var focusedPost = this.props.focusedPost;

		
		if (this.props.embeded) {
			var index = this.props.sectionIndex;
			if(!index) {
				index = 0;
			}


			if (state) {
				if (this.props.responseMap) {
					responses = this.props.responseMap.get(this.props.sectionIndex);
				}
				if (!responses) {
				//	responses = [];
				}
				body = <PostSection 
							authorgAvatar={this.props.authorgAvatar} 
							authorgName={this.props.authorgName} 
							embededPostTextMap={this.props.embededPostTextMap} 
							key={"post-body-" + this.props.sectionIndex} 
							sectionResponses={responses} 
							section={state} 
							sectionIndex={this.props.sectionIndex} 
							authorg={this.props.authorg} 
							submissionIndex={this.props.submission} 
							revisionHash={this.props.revision} 
							focusedPost={focusedPost}
							mentionCount={this.props.mentionCount}
							reactionCount={this.props.reactionCount}
							bountyCount={this.props.bountyCount}
							/>
			}
		} else {
			if(state && state.document.nodes) {	
				var instance = this;
				var nodes = state.document.nodes;

				if (!focusedPost && nodes.count() > 3) {
					nodes = nodes.slice(0, 3);
				}

				body = nodes.map((section, i) => {		
					if (focusedPost && this.props.responseMap) {
						responses = this.props.responseMap.get(i);
					}		
					return (<PostSection 
								authorgAvatar={this.props.authorgAvatar} 
								timestamp={this.props.timestamp}
								revisionHashes={this.props.revisionHashes}
								authorgName={this.props.authorgName} 
								embededPostTextMap={this.props.embededPostTextMap} 
								key={"post-body-" + i} 
								sectionResponses={responses} 
								section={section} 
								sectionIndex={i} 
								authorg={instance.props.authorg} 
								submissionIndex={instance.props.submission} 
								revisionHash={instance.props.revision} 
								focusedPost={focusedPost}
								mentionCount={this.props.mentionCount}
								reactionCount={this.props.reactionCount}
								bountyCount={this.props.bountyCount}
								bio={this.props.bio}/>);	
				});
			}
		}
		return (			
			<div className={bodyClassName}>{body}</div>
		);
	}
}

const mapStateToProps = state => {
  return { };
}

export default connect(mapStateToProps)(PostBody)
