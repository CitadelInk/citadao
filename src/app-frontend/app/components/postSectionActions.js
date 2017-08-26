import React, { Component } from 'react';
import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import actions from '../actions';

const {
	setWalletData
} = actions;

class PostSectionActions extends Component {
	 constructor(props) {
		 super(props);
		  this.onSectionActionsButtonClicked = this.onSectionActionsButtonClicked.bind(this);
	}


	render() {
		return (			
			<button onClick={this.onSectionActionsButtonClicked}>respond</button>
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
}

const mapStateToProps = state => {
  const { wallet, submissions } = state;

  return {wallet, submissions };
}

export default connect(mapStateToProps)(PostSectionActions)
