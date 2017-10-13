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
				<PostHeader embeded={this.props.embeded} bio={this.props.bio} authorg={this.props.authorg} submission={this.props.submission} revision={this.props.revision} timestamp={this.props.timestamp} focusedPost={this.props.focusedPost} />
				<PostBody  bio={this.props.bio} authorg={this.props.authorg} submission={this.props.submission} revision={this.props.revision} sectionIndex={this.props.sectionIndex} focusedPost={this.props.focusedPost} />
				<PostFooter  bio={this.props.bio} authorg={this.props.authorg} submission={this.props.submission} revision={this.props.revision} focusedPost={this.props.focusedPost} />
				{this.props.children}
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, submissions } = state.core;

  return {wallet, submissions };
}

export default connect(mapStateToProps)(Post)
