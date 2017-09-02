import React, { Component } from 'react';
import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import PostSection from './post/postSection'


class PostWidgetBody extends Component {
	 constructor(props) {
		 super(props);
	}


	render() {
		const style = {
			maxHeight: '20em',
			lineHeight: '1em',
			background:'#F0F0F0',
			width:'100%',
			overflow: 'hidden'
		}

		var auth = this.props.auths[this.props.authorg];
		var text = ["loading"];
		var title = "loading";
		if (auth) {
			var submissions = auth.submissions;
			var submission = submissions[this.props.submission];
			var revisions = submission.revisions;
			var revision = revisions[this.props.revision];
			text = revision.text;
			title = revision.title;
		}
		return (			
				<div style={style}>
				<center>{title}</center><br />
				{text.map((section, i) => {
					/*var responses = [];
					if (this.props.submission.revisionSectionResponses && this.props.submission.revisionSectionResponses.get(i)) {
						console.log("gotem");
						responses = this.props.submission.revisionSectionResponses.get(i);
					}
					console.log("post body responses: " + responses)*/
					return (<PostSection sectionResponses={[]} section={section} sectionIndex={i} authorg={this.props.submission.submissionAuthorg} submissionHash={this.props.submission.submissionHash} revisionHash={this.props.submission.revisionHash}/>);	
				})}
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, auths } = state;

  return {wallet, auths };
}

export default connect(mapStateToProps)(PostWidgetBody)
