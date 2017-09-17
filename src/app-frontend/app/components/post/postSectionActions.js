import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';
import { Block } from 'slate';

const {
	setWalletData,
	handleViewResponses
} = actions;

class PostSectionActions extends Component {
	 constructor(props) {
		super(props);
		this.onSectionActionsButtonClicked = this.onSectionActionsButtonClicked.bind(this);
		this.onSectionViewReferencingPostsClicked = this.onSectionViewReferencingPostsClicked.bind(this);
	}



	render() {
		const actionsStyle = {
			minHeight:'18px'
		}
		const responseStyle = {
			float:'right',
			fontSize:'8pt'
		}

		const mentionsStyle = {
			float:'left',
			fontSize:'8pt'
		}
		
		return (	
			<div style={actionsStyle}>		
			<span style={responseStyle} onClick={this.onSectionActionsButtonClicked}>respond</span>
			<span style={mentionsStyle} onClick={this.onSectionViewReferencingPostsClicked}>{this.props.sectionResponses.length} Mentions. view...</span>
			</div>
		);
	}

	onSectionActionsButtonClicked(e) {
		var currentTextInput = this.props.wallet.get('postTextInput');
		var referenceJson = {"reference" : 
			{
				"authorg" : this.props.authorg,
				"submissionHash" : this.props.submissionHash,
				"revisionHash" : this.props.revisionHash,
				"sectionIndex" : this.props.sectionIndex
			}
		}
		var referenceString = JSON.stringify(referenceJson);
		var input = {...input, document: {...input.document, nodes:{...input.document.nodes, new Block()}}}
		this.props.dispatch(setWalletData({postTextInput : currentTextInput + "\n" + referenceString + "\n"}))
	}

	onSectionViewReferencingPostsClicked(e) {
		var sectionResponses = this.props.sectionResponses;
		this.props.dispatch(handleViewResponses(sectionResponses))
	}

}

const mapStateToProps = state => {
  const { wallet } = state;

  return {wallet };
}

export default connect(mapStateToProps)(PostSectionActions)
