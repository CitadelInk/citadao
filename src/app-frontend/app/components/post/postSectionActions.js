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
		if(this.props.sectionResponses) {
			mentions = (<span className={styles.mentionsStyle} onClick={this.onSectionViewReferencingPostsClicked}>{this.props.sectionResponses.length} Mentions. view...</span>)
		}
		var referenceJson = {
			"reference" : {
				"authorg" : this.props.authorg,
				"submissionHash" : this.props.submissionHash,
				"revisionHash" : this.props.revisionHash,
				"sectionIndex" : this.props.sectionIndex
			}
		}
	
		var referenceString = JSON.stringify(referenceJson);
		return (	
			<div className={styles.actionsStyle}>		
			<CopyToClipboard text={referenceString}
          		onCopy={() => this.setState({copied: true})}>
          		<span className={styles.responseStyle}>Copy reference to clipboard</span>
        		</CopyToClipboard>
			</div>
		);
	}

	//<span className={styles.responseStyle} onClick={this.onSectionActionsButtonClicked}>respond</span>

	/*onSectionActionsButtonClicked(e) {
		var currentTextInput = this.props.wallet.get('postTextInput');
		if (currentTextInput) {
			
			var currentJson = currentTextInput.toJSON();
			var referenceJson = {"reference" : 
				{
					"authorg" : this.props.authorg,
					"submissionHash" : this.props.submissionHash,
					"revisionHash" : this.props.revisionHash,
					"sectionIndex" : this.props.sectionIndex
				}
			}
			var referenceString = JSON.stringify(referenceJson);

			if(State.isState(currentTextInput)) {
				var block = Block.create({
					type:'string',
					nodes: [ Text.createFromString(referenceString) ]
				});
				var state2 = currentTextInput.change().insertBlock(block).apply();
				this.props.dispatch(setWalletData({postTextInput : state2}));
			}
		}
		e.stopPropagation();
	}*/

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
