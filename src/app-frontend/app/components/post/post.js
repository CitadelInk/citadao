import React, { Component } from 'react';
import { connect } from 'react-redux';
import PostHeader from './postHeader';
import PostBody from './postBody';
import PostFooter from './postFooter';
import styles from './post.css';

class Post extends Component {
	 constructor(props) {
		 super(props);
	}


	render() {	
		return(
			<div {...this.props.attributes} className={styles.style}>
				<PostHeader revisionHashes={this.props.revisionHashes} 
							text={this.props.text} 
							authorgAvatar={this.props.authorgAvatar} 
							authorgName={this.props.authorgName} 
							embeded={this.props.embeded} 
							bio={this.props.bio} 
							responseMap={this.props.responseMap} 
							authorg={this.props.authorg} 
							submission={this.props.submission} 
							revision={this.props.revision} 
							timestamp={this.props.timestamp} 
							focusedPost={this.props.focusedPost} />
				<PostBody authorgAvatar={this.props.authorgAvatar} 
							revisionHashes={this.props.revisionHashes}
							timestamp={this.props.timestamp} 
							authorgName={this.props.authorgName} 
							embededPostTextMap={this.props.embededPostTextMap} 
							text={this.props.text} 
							responseMap={this.props.responseMap} 
							embeded={this.props.embeded} 
							bio={this.props.bio} 
							authorg={this.props.authorg} 
							submission={this.props.submission} 
							revision={this.props.revision} 
							sectionIndex={this.props.sectionIndex} 
							focusedPost={this.props.focusedPost} />
				{!this.props.embeded && 
				<PostFooter  bio={this.props.bio} 
							authorg={this.props.authorg} 
							submission={this.props.submission} 
							revision={this.props.revision} 
							focusedPost={this.props.focusedPost} 
							submissionValue={this.props.submissionValue} />}
				{this.props.children}
			</div>
		);
	}
}


export default (Post)
