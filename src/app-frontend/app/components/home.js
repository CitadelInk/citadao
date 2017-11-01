import React, { Component } from 'react';
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import Posts from './panels/posts';
import UserResponseRequests from './panels/userResponseRequests';
import EmptyLeft from './panels/emptyLeft';
import EmptyRight from './panels/emptyRight';
import ComposePanel from './compose/composePanel';
import styles from './home.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import classNames from 'classnames/bind';
let cx = classNames.bind(styles);

import actions from '../actions';

const {
	getNext10PostsWrapper,
	setWalletData
} = actions;

class Home extends Component {
	 constructor(props) {
		super(props);
		this.handleAllPostsScroll = this.handleAllPostsScroll.bind(this);
		this.handleStreamScroll = this.handleStreamScroll.bind(this);
	}

	componentDidMount() {
		if (this.scrollDiv) {
			this.scrollDiv.addEventListener('scroll', this.handleAllPostsScroll);
		} 

		if (this.streamScrollDiv) {
			this.streamScrollDiv.addEventListener('scroll', this.handleStreamScroll);
		} 
	}

	componentWillUnmount() {
		if (this.scrollDiv) {
			this.scrollDiv.removeEventListener('scroll', this.handleAllPostsScroll);
		} 

		if (this.streamScrollDiv) {
			this.streamScrollDiv.removeEventListener('scroll', this.handleStreamScroll);
		} 
	}

	render() {
		var selectedIndex = this.props.wallet.get('selectedHomeTabIndex');

		var followingAuthorgPostKeys = [];
		var thisUserAccount = this.props.wallet.get('account');
		var thisUser = this.props.auths[thisUserAccount];
		var instance = this;
		var bountiesCreatedCount = 0;
		var bountiesReceivedCount = 0;
		if (thisUser) {
			if (thisUser.responseRequestsReceivedKeys) {
				bountiesReceivedCount = thisUser.responseRequestsReceivedKeys.length;
			}
			if (thisUser.responseRequestsCreatedKeys) {
				bountiesCreatedCount = thisUser.responseRequestsCreatedKeys.length;
			}
			var following = thisUser.authorgsFollowed;   
			if (following) {
				following.forEach(function(authorg) {
					var followingAuthorg = instance.props.auths[authorg];
					var posts = [];
					if (followingAuthorg) {
						posts = followingAuthorg.postKeys;
						if (posts) {
							followingAuthorgPostKeys.push(...posts);
						}
					}
				})
			}
		}

		var tabNames = ["All Posts", "Stream", "Bounties Received - " + bountiesReceivedCount, "Bounties Created - " + bountiesCreatedCount];
		
		return (
			<div className={styles.page}>
				<div className={styles.compose}>
					<ComposePanel />		
				</div>
				<div className={styles.posts}>
					<Tabs selectedIndex={selectedIndex} onSelect={tabIndex => this.props.dispatch(setWalletData({selectedHomeTabIndex : tabIndex}))}>
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
							<div className={styles.postList} ref={el => this.scrollDiv = el}>										
								<Posts postKeys={this.props.postKeys} onScroll={this.handleAllPostsScroll}/>	
							</div>
						</TabPanel>
						<TabPanel>
							<div className={styles.postList} ref={el => this.streamScrollDiv = el}>
								<Posts postKeys={followingAuthorgPostKeys} onScroll={this.handleStreamScroll}/>	
							</div>
						</TabPanel>
						<TabPanel>
							<div className={styles.postList} >
								<UserResponseRequests user={thisUserAccount} received />
							</div>
						</TabPanel>
						<TabPanel>
						<div className={styles.postList} >
								<UserResponseRequests user={thisUserAccount} created />
							</div>
						</TabPanel>
					</Tabs>	
				</div>	
				<div className={styles.empty}>
					<EmptyRight />
				</div>
			</div>
		);
	}

	handleAllPostsScroll(e) {
		var clientHeight = this.scrollDiv.clientHeight;
		var divPos = this.scrollDiv.scrollTop;
		var scrollHeight = this.scrollDiv.scrollHeight;
		
		var maxHeight = scrollHeight - clientHeight;

		
		if(divPos >= maxHeight - 200) {
			this.props.dispatch(getNext10PostsWrapper());
		}		
	}

	handleStreamScroll(e) {
		var clientHeight = this.streamScrollDiv.clientHeight;
		var divPos = this.streamScrollDiv.scrollTop;
		var scrollHeight = this.streamScrollDiv.scrollHeight;
		
		var maxHeight = scrollHeight - clientHeight;

		
		if(divPos >= maxHeight - 200) {
			this.props.dispatch(getNextFollowingPosts());
		}		
	}
}

const mapStateToProps = state => {
  const { wallet, postKeys, auths } = state.core;

  return { wallet, postKeys, auths };
}

export default connect(mapStateToProps)(Home)
