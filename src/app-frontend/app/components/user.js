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
		this.state = { image: null, width: '0', height: '0' };
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
	}


	updateWindowDimensions() {
		this.setState({ width: window.innerWidth, height: window.innerHeight });
	}


	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
		if (this.scrollDiv) {
			console.warn("ADD")
			this.scrollDiv.addEventListener('scroll', this.handleScroll);
		}
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
		if (this.scrollDiv) {
			this.scrollDiv.removeEventListener('scroll', this.handleScroll);
		}
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
		var bioRevisionHashes = [];
		var bioTimestamp;
		var bioAuthorgName;
		var bioAuthorgAvatar;
		var bioText;
		if (auth) {
			if (auth.bioSubmission && auth.bioSubmission.revisions && auth.bioSubmission.revisions.length > 0) {
				bioSubHash = auth.bioSubmission.revisions[auth.bioSubmission.revisions.length - 1];
				bioRevisionHashes = auth.bioSubmission.revisions;
				if(this.props.router.params["revHash"]) {
					bioSubHash = this.props.router.params["revHash"];
				}
				bioTimestamp = auth.bioSubmission[bioSubHash].timestamp;
				bioAuthorgName = auth.bioSubmission[bioSubHash].name;
				bioAuthorgAvatar = auth.bioSubmission[bioSubHash].image;
				bioText = auth.bioSubmission[bioSubHash].text;
			}
			if (auth.postKeys) {
				postKeys = auth.postKeys;
			}
		}

		var selectedIndex = this.props.wallet.get('selectedUserTabIndex');

		var tabNames = ["Bio", "Posts", "Bounties Received", "Bounties Created", "Followers - " + numFollowers, "Follows - " + numFollowedUsers];

		var height = 0;
		if (this.tabListDiv) {
			height = this.state.height - this.buttonDiv.clientHeight - this.tabListDiv.clientHeight - 60;
		}

		var postsStyle = {
			'position' : 'relative',
			'height' : height,
			'overflowY' : 'scroll',
			'overflowX' : 'hidden'
		}

		var postsButtonStyle = {
			'position' : 'relative',
			'width' : '100%'
		}

		return (
			<div className={styles.page}>
				<div className={styles.compose}>
					<ComposePanel 
						standardPostValue={this.props.standardPostValue}
						standardPostCallback={this.props.standardPostCallback}
						bioPostValue={this.props.bioPostValue}
						bioPostCallback={this.props.bioPostCallback}
						revisionPostValue={this.props.revisionPostValue}
						revisionPostCallback={this.props.revisionPostCallback}
					/>		
				</div>

				
				<div className={styles.posts}>
				<div ref={el => this.buttonDiv = el}>
					{showButton && <center>{followButton}<br/></center>}
				</div>
					<Tabs selectedIndex={selectedIndex} onSelect={tabIndex => this.props.dispatch(setWalletData({selectedUserTabIndex : tabIndex}))}>
						<TabList className={styles.tabList} >
							<div className={styles.tabListDiv} ref={el => this.tabListDiv = el}>
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
						<div style={postsStyle}>
							<Post 	bio={true} 
									revisionHashes={bioRevisionHashes}
									authorgAvatar={bioAuthorgAvatar}
									authorgName={bioAuthorgName}
									//submissionValue={bioSubmissionData}
									text={bioText}
									//embededPostTextMap={embededPostTextMap}
									//responseMap={responseMap}
									authorg={user} 
									//submission={submission} 
									revision={bioSubHash} 
									timestamp={bioTimestamp}
									focusedPost={true} 
									//revisionPostCallback={this.props.revisionPostCallback}
							/>
						</div>
						</TabPanel>
						<TabPanel>
						<div style={postsStyle} ref={el => this.scrollDiv = el}>
							<Posts postKeys={postKeys} onScroll={this.postsScrolled}/>	
						</div>
						</TabPanel>
						<TabPanel>
						<div style={postsStyle}>
							<UserResponseRequests user={user} received />	
						</div>
						</TabPanel>
						<TabPanel>
						<div style={postsStyle}>
							<UserResponseRequests user={user} created />	
						</div>
						</TabPanel>
						<TabPanel>
						<div style={postsStyle}>
							<UserList users={followers}/>	
						</div>
						</TabPanel>
						<TabPanel>
						<div style={postsStyle}>
							<UserList users={followedUsers}/>	
						</div>
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
