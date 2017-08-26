import React, { Component } from 'react';
import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import EmbededPostSectionHeader from './embededPostSectionHeader'
import EmbededPostSectionBody from './embededPostSectionBody'
import EmbededPostSectionFooter from './embededPostSectionFooter'
import actions from '../actions';

const {
	gotoPost
} = actions;

class EmbededPostSectionWidget extends Component {
	 constructor(props) {
		 super(props);
		  this.widgetClicked = this.widgetClicked.bind(this);
	}


	render() {
		const style = {
				background:'#F0F0F0',
				width:'80%',
				margin:'auto'
		}
			
		const submission = this.props.submissions.get(this.props.submissionHash);
		return (	
			<div onClick={this.widgetClicked} style={style}>
				<EmbededPostSectionHeader submission={submission}/>
				<EmbededPostSectionBody submission={submission} />
				<EmbededPostSectionFooter submission={submission} />
			</div>
		);
	}

	widgetClicked(e) {
		this.props.dispatch(gotoPost(this.props.submission.submissionHash, this.props.submission.revisionHash));
		e.stopPropagation();
	}
}

const mapStateToProps = state => {
  const { wallet, submissions } = state;

  return {wallet, submissions };
}

export default connect(mapStateToProps)(EmbededPostSectionWidget)
