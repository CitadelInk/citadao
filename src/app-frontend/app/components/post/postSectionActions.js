import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';

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
		return (	
			<div>		
			<button onClick={this.onSectionActionsButtonClicked}>respond</button>
			<button onClick={this.onSectionViewReferencingPostsClicked}>View Responses - {this.props.sectionResponses.length}</button>
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
		this.props.dispatch(setWalletData({postTextInput : currentTextInput + "\n" + JSON.stringify(referenceJson) + "\n"}))
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
