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
				state = Value.fromJSON(this.props.text);
			}
		}
		console.log("state: " + state);

		
		var body = "loading";
		var responses = null;
		var focusedPost = this.props.focusedPost;

		console.info("pb0")
		
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
				body = <PostSection authorgAvatar={this.props.authorgAvatar} authorgName={this.props.authorgName} embededPostTextMap={this.props.embededPostTextMap} key={"post-body-" + this.props.sectionIndex} sectionResponses={responses} section={state} sectionIndex={this.props.sectionIndex} authorg={this.props.authorg} submissionHash={this.props.submission} revisionHash={this.props.revision} focusedPost={focusedPost}/>
			}
		} else {
			console.info("pb1")
			if(state && state.document.nodes) {	
				console.info("pb2")
				var instance = this;
				var nodes = state.document.nodes;
				body = nodes.map((section, i) => {		
					console.info("pb3 - section: " + section)
					if (this.props.responseMap) {
						responses = this.props.responseMap.get(i);
					}		
								
					return (<PostSection authorgAvatar={this.props.authorgAvatar} authorgName={this.props.authorgName} embededPostTextMap={this.props.embededPostTextMap} key={"post-body-" + i} sectionResponses={responses} section={section} sectionIndex={i} authorg={instance.props.authorg} submissionHash={instance.props.submission} revisionHash={instance.props.revision} focusedPost={focusedPost}/>);	
					
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
