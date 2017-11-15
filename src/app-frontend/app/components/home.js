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
		this.state = { width: '0', height: '0' };
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
	}

	componentDidMount() {
		if (this.scrollDiv) {
			this.scrollDiv.addEventListener('scroll', this.handleAllPostsScroll);
		} 

		if (this.streamScrollDiv) {
			this.streamScrollDiv.addEventListener('scroll', this.handleStreamScroll);
		} 
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
	}

	componentWillUnmount() {
		if (this.scrollDiv) {
			this.scrollDiv.removeEventListener('scroll', this.handleAllPostsScroll);
		} 

		if (this.streamScrollDiv) {
			this.streamScrollDiv.removeEventListener('scroll', this.handleStreamScroll);
		} 
		window.removeEventListener('resize', this.updateWindowDimensions);
	}

	updateWindowDimensions() {
		this.setState({ width: window.innerWidth, height: window.innerHeight });
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
		var height = 0;
		if (this.tabListDiv) {
			height = this.state.height - this.tabListDiv.clientHeight - 60;
		}
		var postListStyle = {
			'position':'relative',
			'maxHeight':height,
			'overflowY':'scroll',
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
					<Tabs selectedIndex={selectedIndex} onSelect={tabIndex => this.props.dispatch(setWalletData({selectedHomeTabIndex : tabIndex}))}>
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
							<div style={postListStyle} ref={el => this.scrollDiv = el}>										
								<Posts postKeys={this.props.postKeys} onScroll={this.handleAllPostsScroll}/>	
							</div>
						</TabPanel>
						<TabPanel>
							<div style={postListStyle} ref={el => this.streamScrollDiv = el}>
								<Posts postKeys={followingAuthorgPostKeys} onScroll={this.handleStreamScroll}/>	
							</div>
						</TabPanel>
						<TabPanel>
							<div style={postListStyle} >
								<UserResponseRequests user={thisUserAccount} received />
							</div>
						</TabPanel>
						<TabPanel>
						<div style={postListStyle} >
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
