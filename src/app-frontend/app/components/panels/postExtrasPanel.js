import React, { Component } from 'react';
import { connect } from 'react-redux';
import Post from '../post/post';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ResponseRequests from './responseRequests';
import Posts from './posts';
import styles from './postExtrasPanel.css';

import classNames from 'classnames/bind';
let cx = classNames.bind(styles);

class PostExtrasPanel extends Component {
	 constructor(props) {
		 super(props);
		 this.state = {selectedTabIndex : 0}
	}


	render() {
		const authorg = this.props.router.params["authorg"];
		const submission = this.props.router.params["subHash"];
		const revision = this.props.router.params["revHash"];
		var post = "loading...";
		var timestamp = undefined;
		

		var authorgData = this.props.auths[authorg];
		var keys = [];
		var responseRequestOfferers = [];
		var responseRequestRecipients = [];
		if (authorgData) {
			var submissionsData = authorgData.submissions;
			if (submissionsData) {
				var submissionData = submissionsData[submission];
				if (submissionData) {
					var revisionsData = submissionData.revisions;
					if (revisionsData) {
						var revisionData = revisionsData[revision];
						if (revisionData) {
							timestamp = revisionData.timestamp;
							if (revisionData.refKeys) {
								keys = revisionData.refKeys;
							}
							if (revisionData.requestResponseOfferers) {
								responseRequestOfferers = revisionData.requestResponseOfferers;
								responseRequestRecipients = revisionData.requestResponseRecipients;
							}
						}
					}					
				}			
			}		
		}
		
		var responses = "no responses... yet!";
		if (keys.length > 0) {
			responses = (			
				<Posts isResponses={true} postKeys={keys.slice().reverse()} />
			)
		}

		var responseRequests = "no response requests... yet!";
		if (responseRequestOfferers.length > 0 && responseRequestOfferers.length === responseRequestRecipients.length) {
			responseRequests = (
				<ResponseRequests postUser={authorg} postSubmission={submission} postRevision={revision} offerers={responseRequestOfferers} recipients={responseRequestRecipients} />
			)
		}




		var selectedIndex = this.state.selectedTabIndex;

		var tabNames = ["Mentions - " + keys.length, "Bounties - " + responseRequestOfferers.length];
		
		return(
			<Tabs className={styles.tabs} selectedIndex={selectedIndex} onSelect={tabIndex => this.setState({selectedTabIndex : tabIndex})}>
				<TabList className={styles.tabList} >
					<div className={styles.tabListDiv}>
						{
							tabNames.map(function(name, index) {
								var selected = cx({
									[styles.tab]:true,
									[styles.tabSelected]: (index === selectedIndex)
								})
								return (<Tab key={"postExtrasPanel-"+index} className={selected}>{name}</Tab>);
							})
						}
					</div>
				</TabList>

				<TabPanel>
					{responses}
				</TabPanel>
				<TabPanel>
					{responseRequests}
				</TabPanel>
			</Tabs>
		);
		




	}
}

const mapStateToProps = state => {
  const { wallet, auths } = state.core;
  const { router } = state;

  return {wallet, auths, router };
}

export default connect(mapStateToProps)(PostExtrasPanel)
