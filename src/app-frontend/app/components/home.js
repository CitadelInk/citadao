import React, { Component } from 'react';
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import Posts from './panels/posts';
import EmptyLeft from './panels/emptyLeft';
import EmptyRight from './panels/emptyRight';
import ComposePanel from './compose/composePanel';
import styles from './home.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import classNames from 'classnames/bind';
let cx = classNames.bind(styles);

import actions from '../actions';

const {
	getNext10Posts,
	setWalletData
} = actions;

class Home extends Component {
	 constructor(props) {
		super(props);this.handleScroll = this.handleScroll.bind(this);
	}

	componentDidMount() {
		this.scrollDiv.addEventListener('scroll', this.handleScroll);
	}

	render() {
		var selectedIndex = this.props.wallet.get('selectedHomeTabIndex');
		var tabNames = ["All Posts", "Stream"];

		var followingAuthorgPostKeys = [];
		var thisAccount = this.props.auths[this.props.wallet.get('account')];
		var instance = this;
		if (thisAccount) {
			var following = thisAccount.authorgsFollowed;
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
		
		return (
			<div className={styles.page}>
				<div className={styles.compose}>
					<ComposePanel />		
				</div>
				<div className={styles.posts} ref={el => this.scrollDiv = el}>
					<Tabs selectedIndex={selectedIndex} onSelect={tabIndex => this.props.dispatch(setWalletData({selectedHomeTabIndex : tabIndex}))}>
						<TabList className={styles.tabList} >
							<div className={styles.tabListDiv}>
							{
							tabNames.map(function(name, index) {
								var selected = cx({
									[styles.tab]:true,
									[styles.tabSelected]: (index === selectedIndex)
								})
								return (<Tab  className={selected}>{name}</Tab>);
							})
						}
							</div>
						</TabList>

						<TabPanel>							
							<Posts postKeys={this.props.postKeys} onScroll={this.postsScrolled}/>	</TabPanel>
						<TabPanel>
							<Posts postKeys={followingAuthorgPostKeys} onScroll={this.postsScrolled}/>	
						</TabPanel>
					</Tabs>
				</div>				
				<div className={styles.empty}>
					<EmptyRight />
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
  const { wallet, postKeys, auths } = state.core;

  return { wallet, postKeys, auths };
}

export default connect(mapStateToProps)(Home)
