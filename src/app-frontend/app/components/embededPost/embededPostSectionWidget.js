import React, { Component } from 'react';
import { connect } from 'react-redux';
import EmbededPostSectionHeader from './embededPostSectionHeader'
import EmbededPostSectionBody from './embededPostSectionBody'
import EmbededPostSectionFooter from './embededPostSectionFooter'
import actions from '../../actions';

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
			
		const authorg = this.props.authorg;
		const submission = this.props.submissionHash;
		const revision = this.props.revisionHash;
		var content = (<div>"loading"</div>);

		if (submission) {
			content = (<div onClick={this.widgetClicked} style={style}>
				<EmbededPostSectionHeader authorg={authorg} submission={submission} revision={revision}/>
				<EmbededPostSectionBody  authorg={authorg} submission={submission} revision={revision} sectionIndex={this.props.sectionIndex} />
				<EmbededPostSectionFooter  authorg={authorg} submission={submission} revision={revision}/>
				</div>)
		}

		return content;
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
