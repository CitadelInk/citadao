import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';
import { Block, State, Text } from 'slate';
import styles from './postSectionActions.css';
import Clipboard from 'clipboard';
import {CopyToClipboard} from 'react-copy-to-clipboard';

const {
	setWalletData,
	handleViewResponses
} = actions;

class PostSectionActions extends Component {
	 constructor(props) {
		super(props);
		//this.onSectionActionsButtonClicked = this.onSectionActionsButtonClicked.bind(this);
		this.onSectionViewReferencingPostsClicked = this.onSectionViewReferencingPostsClicked.bind(this);
	}



	render() {
		var mentions = (<span> </span>);
		if(this.props.sectionResponses && this.props.sectionResponses.length > 0) {
			mentions = (<span className={styles.mentionsStyle} onClick={this.onSectionViewReferencingPostsClicked}>{this.props.sectionResponses.length} Mentions. view...</span>)
		}
		var referenceJson = {
			"reference" : {
				"authorg" : this.props.authorg,
				"submissionHash" : this.props.submissionHash,
				"revisionHash" : this.props.revisionHash,
				"sectionIndex" : this.props.sectionIndex,
				"text" : this.props.section,
				"name" : this.props.authorgName,
				"avatar" : this.props.authorgAvatar,
				"timestamp" : this.props.timestamp,
				"revHashes" : this.props.revisionHashes
			}
		}
	
		var referenceString = JSON.stringify(referenceJson);
		const clippy = (
			<CopyToClipboard text={referenceString}
				onCopy={() => this.setState({copied: true})}>
				<span className={styles.responseStyle}>Copy reference to clipboard</span>
			</CopyToClipboard>
		)
		return (	
			<div className={styles.actionsStyle}>		
				{mentions}
				{this.props.showClipboard && clippy}				
			</div>
		);
	}


	onSectionViewReferencingPostsClicked(e) {
		var sectionResponses = this.props.sectionResponses;
		this.props.dispatch(handleViewResponses(sectionResponses))
	}

}

const mapStateToProps = state => {
  const { wallet } = state.core;

  return {wallet };
}

export default connect(mapStateToProps)(PostSectionActions)
