import React, { Component } from 'react';
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import PostSection from './postSection'


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
			
		if(this.props.submission) {
			console.log("this.props.submission: " + this.props.submission)
			if (this.props.submission.text) {
				console.log("this.props.submission.text: " + this.props.submission.text)
			}
		}

		return (			
				<div style={style}>
				<center>{this.props.submission.title}</center><br />
				{this.props.submission.text.map((section, i) => {
					var responses = [];
					if (this.props.submission.revisionSectionResponses && this.props.submission.revisionSectionResponses.get(i)) {
						console.log("gotem");
						responses = this.props.submission.revisionSectionResponses.get(i);
					}
					console.log("post body responses: " + responses)
					return (<PostSection sectionResponses={responses} section={section} sectionIndex={i} authorg={this.props.submission.submissionAuthorg} submissionHash={this.props.submission.submissionHash} revisionHash={this.props.submission.revisionHash}/>);	
				})}
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, submissions } = state;

  return {wallet, submissions };
}

export default connect(mapStateToProps)(PostWidgetBody)
