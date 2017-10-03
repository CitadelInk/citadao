import React, { Component } from 'react';
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import Posts from './panels/posts';
import EmptyLeft from './panels/emptyLeft';
import EmptyRight from './panels/emptyRight';
import BioCompose from './compose/bioCompose';
import Post from './post/post';
import styles from './home.css';

import actions from '../actions';

const {
	getNext10Posts
} = actions;

class User extends Component {
	 constructor(props) {
		super(props);this.handleScroll = this.handleScroll.bind(this);
	}

	componentDidMount() {
		this.scrollDiv.addEventListener('scroll', this.handleScroll);
	}

	render() {
		const user = this.props.router.params["account"];
		//console.log("user: " + user);
		const auth = this.props.auths[user];
		//console.log("auth: " + auth);

		var bioSubHash;
		if (auth) {
			bioSubHash = auth.bioSubmission.revisions[auth.bioSubmission.revisions.length - 1];
		}

		return (
			<div className={styles.page}>
				<div className={styles.compose}>
					<BioCompose />		
				</div>
				<div className={styles.posts} ref={el => this.scrollDiv = el}>
				{bioSubHash && 	<Post bio={true} authorg={user} revision={bioSubHash} focusedPost={true}/>	}
				</div>				
				<div className={styles.posts} ref={el => this.scrollDiv = el}>
				</div>
			</div>
		);

		//<Posts postKeys={this.props.postKeys} onScroll={this.postsScrolled}/>	
	}

	handleScroll(e) {
		var clientHeight = this.scrollDiv.clientHeight;
		var divPos = this.scrollDiv.scrollTop;
		var scrollHeight = this.scrollDiv.scrollHeight;
		
		var maxHeight = scrollHeight - clientHeight;

		
		if(divPos >= maxHeight - 200) {
			this.props.dispatch(getNext10Posts());
		}
		
	}
}

const mapStateToProps = state => {
  const { wallet, auths, postKeys } = state.core;
  const { router } = state;

  return {wallet, auths, postKeys, router };
}

export default connect(mapStateToProps)(User)
