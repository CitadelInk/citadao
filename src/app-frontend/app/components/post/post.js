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
			<div className={styles.style}>
				<PostHeader authorg={this.props.authorg} submission={this.props.submission} revision={this.props.revision} focusedPost={this.props.focusedPost} />
				<PostBody authorg={this.props.authorg} submission={this.props.submission} revision={this.props.revision} sectionIndex={this.props.sectionIndex} focusedPost={this.props.focusedPost} />
				<PostFooter authorg={this.props.authorg} submission={this.props.submission} revision={this.props.revision} focusedPost={this.props.focusedPost} />
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, submissions } = state;

  return {wallet, submissions };
}

export default connect(mapStateToProps)(Post)
