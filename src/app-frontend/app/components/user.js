import React, { Component } from 'react';
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import Posts from './panels/posts';
import UserResponseRequests from './panels/userResponseRequests';
import EmptyLeft from './panels/emptyLeft';
import EmptyRight from './panels/emptyRight';
import ComposePanel from './compose/composePanel';
import Post from './post/post';
import styles from './user.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import actions from '../actions';
import classNames from 'classnames/bind';
import { RaisedButton } from 'material-ui';
import UserList from './panels/userList';

let cx = classNames.bind(styles);

const {
	getNext10Posts,
	setWalletData,
	follow
} = actions;

class User extends Component {
	 constructor(props) {
		super(props);this.handleScroll = this.handleScroll.bind(this);
		this.onFollowClicked = this.onFollowClicked.bind(this);
	}

	componentDidMount() {
		this.scrollDiv.addEventListener('scroll', this.handleScroll);
	}

	componentWillUnmount() {
		this.scrollDiv.removeEventListener('scroll', this.handleScroll);
	}

	onFollowClicked() {
		const user = this.props.router.params["account"];
		this.props.dispatch(follow(user));
	}

	render() {
		const user = this.props.router.params["account"];
		const auth = this.props.auths[user];

		const usingUser = this.props.wallet.get('account');
		const usingAuth = this.props.auths[usingUser];
		var flabel = "";
		var followButton;
		var followedUsers;
		var followers;
		var numFollowedUsers = 0;
		var numFollowers = 0;

		if (auth) {
			followedUsers = auth.authorgsFollowed;
			if (followedUsers) {
				numFollowedUsers = followedUsers.length;
			}
			followers = auth.followers;
			if (followers) {
				numFollowers = followers.length;
			}
		}

		if (followers) {
			if (user && !followers || (followers && !followers.includes(usingUser))) {
				flabel = "Follow User";
				followButton = <RaisedButton secondary label={flabel} onClick={this.onFollowClicked}/>;
			} else if (user && followedUsers) {
				flabel = "Following User";
				followButton = <RaisedButton disabled label={flabel}/>;
			}
		}
		
		var showButton = user !== usingUser;

		var postKeys = [];

		var bioSubHash;
		if (auth) {
			if (auth.bioSubmission && auth.bioSubmission.revisions && auth.bioSubmission.revisions.length > 0) {
				bioSubHash = auth.bioSubmission.revisions[auth.bioSubmission.revisions.length - 1];

				if(this.props.router.params["revHash"]) {
					bioSubHash = this.props.router.params["revHash"];
				}
			}
			if (auth.postKeys) {
				postKeys = auth.postKeys;
			}
		}

		var selectedIndex = this.props.wallet.get('selectedUserTabIndex');

		var tabNames = ["Bio", "Posts", "RR Received", "RR Created", "Followers - " + numFollowers, "Follows - " + numFollowedUsers];



		return (
			<div className={styles.page}>
				<div className={styles.compose}>
					<ComposePanel />		
				</div>

				<div className={styles.posts} ref={el => this.scrollDiv = el}>
					{showButton && <center>{followButton}</center>}
					<Tabs selectedIndex={selectedIndex} onSelect={tabIndex => this.props.dispatch(setWalletData({selectedUserTabIndex : tabIndex}))}>
						<TabList className={styles.tabList} >
							<div className={styles.tabListDiv}>
							{
							tabNames.map(function(name, index) {
								var selected = cx({
									[styles.tab]:true,
									[styles.tabSelected]: (index === selectedIndex)
								})
								return (<Tab key={name} className={selected}>{name}</Tab>);
							})
						}
							</div>
						</TabList>

						<TabPanel>
							<Post bio={true} authorg={user} revision={bioSubHash} focusedPost={true}/>
						</TabPanel>
						<TabPanel>
							<Posts postKeys={postKeys} onScroll={this.postsScrolled}/>	
						</TabPanel>
						<TabPanel>
							<UserResponseRequests user={user} received />
						</TabPanel>
						<TabPanel>
							<UserResponseRequests user={user} created />
						</TabPanel>
						<TabPanel>
							<UserList users={followers}/>
						</TabPanel>
						<TabPanel>
							<UserList users={followedUsers}/>
						</TabPanel>
					</Tabs>

				</div>
			</div>
		);

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
