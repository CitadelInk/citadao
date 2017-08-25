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
			
		const submission = this.props.submission;
		return (			
			<div onClick={this.widgetClicked} style={style}>
				<PostWidgetHeader submission={submission}/>
				<PostWidgetBody submission={submission} />
				<PostWidgetFooter submission={submission} />
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
