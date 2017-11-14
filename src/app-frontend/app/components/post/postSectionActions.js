import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';
import { Block, State, Text } from 'slate';
import styles from './postSectionActions.css';
import Clipboard from 'clipboard';

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
		
		const clippy = (
			<span className={`${styles.responseStyle} ${this.props.className}`}>Click to copy reference to clipboard</span>
		)
		return (	
			<div className={styles.actionsStyle}>		
				{mentions}
				{clippy}				
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
