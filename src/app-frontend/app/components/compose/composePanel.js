import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './composePanel.css';
import Compose from './compose';
import BioCompose from './bioCompose';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import actions from '../../actions'
const {
	setWalletData
} = actions;

import classNames from 'classnames/bind';
let cx = classNames.bind(styles);

class ComposePanel extends Component {
	constructor(props) {
		 super(props);
	}


	render() {
		var selectedIndex = this.props.wallet.get('selectedTabIndex');

		var tabNames = ["New Post", "UpdateBio"];
		return(
			<Tabs selectedIndex={selectedIndex} onSelect={tabIndex => this.props.dispatch(setWalletData({selectedTabIndex : tabIndex}))}>
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
					<Compose  />
				</TabPanel>
				<TabPanel>
					<BioCompose />
				</TabPanel>
			</Tabs>
		);
	}
}

const mapStateToProps = state => {
  const { wallet } = state.core;

  return {wallet };
}

export default connect(mapStateToProps)(ComposePanel)
