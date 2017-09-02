import React, { Component } from 'react';
import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import PostWidgetHeader from './postWidgetHeader'
import PostWidgetBody from './postWidgetBody'
import PostWidgetFooter from './postWidgetFooter'
import actions from '../actions';

const {
	gotoPost
} = actions;

class PostWidget extends Component {
	 constructor(props) {
		 super(props);
		  this.widgetClicked = this.widgetClicked.bind(this);
	}


	render() {
		const style = {
				background:'#F0F0F0',
				width:'100%',
				borderRadius: '15px',
				marginBottom: '15px'
		}
			
		const authorg = this.props.authorg;
		const submission = this.props.submission;
		const revision = this.props.revision;
		var content = (<div>"loading"</div>);

		if (submission) {
			content = (<div onClick={this.widgetClicked} style={style}>
				<PostWidgetHeader authorg={authorg} submission={submission} revision={revision}/>
				<PostWidgetBody  authorg={authorg} submission={submission} revision={revision}/>
				<PostWidgetFooter  authorg={authorg} submission={submission} revision={revision}/>
				</div>)
		}
		return (	
			<div>		
			{content}
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

export default connect(mapStateToProps)(PostWidget)
