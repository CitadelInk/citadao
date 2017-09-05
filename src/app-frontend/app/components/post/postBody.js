import React, { Component } from 'react';
import { connect } from 'react-redux';
import PostSection from './postSection';


class PostBody extends Component {


	constructor(props) {
		super(props);
		this.state = { width: '0', height: '0' };
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
	}

	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
	}

	updateWindowDimensions() {
		this.setState({ width: window.innerWidth, height: window.innerHeight });
	}



	render() {		
		var authorg = this.props.auths[this.props.authorg];
		var text = ["loading"];
		var title = "loading";
		if (authorg) {
			var submissions = authorg.submissions;
			if (submissions) {
				var submission = submissions[this.props.submission];
				if (submission) {
					var revisions = submission.revisions;
					if (revisions) {
						var revision = revisions[this.props.revision];
						if (revision) {
							text = revision.text;
							title = revision.title;
						}
					}					
				}			
			}			
		}

		if (this.props.sectionIndex) {
			text = [text[this.props.sectionIndex]];
		}
		var body = "loading";
		var responses = [];

		if (this.props.sectionIndex) {
			body = <PostSection sectionResponses={responses} section={text} sectionIndex={this.props.sectionIndex} authorg={this.props.authorg} submissionHash={this.props.submission} revisionHash={this.props.revision} focusedPost={this.props.focusedPost}/>
		} else {
			body = text.map((section, i) => {
				/*if (this.props.submission.revisionSectionResponses && this.props.submission.revisionSectionResponses.get(i)) {
					console.log("gotem");
					responses = this.props.submission.revisionSectionResponses.get(i);
				}*/
				return (<PostSection sectionResponses={responses} section={section} sectionIndex={i} authorg={this.props.authorg} submissionHash={this.props.submission} revisionHash={this.props.revision} focusedPost={this.props.focusedPost}/>);	
			});
		}

		return (			
			<div style={this.props.bodyStyle}>
				<center>{title}</center>

						{body}
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, auths } = state;

  return {wallet, auths };
}

export default connect(mapStateToProps)(PostBody)
