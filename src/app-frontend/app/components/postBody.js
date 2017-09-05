import React, { Component } from 'react';
import appContracts from 'app-contracts'
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
		var stateHeight = parseInt(this.state.height);
		var remainingHeight = stateHeight - 200;
		const calcheight = remainingHeight + 'px';
		const style = {
				background:'#F0F0F0',
				height:calcheight,
				top:'60px',
				//bottom:'40px',
				position:'absolute',
				overflow:'scroll'
		}
			
		if(this.props.submission) {
			console.log("post: " + this.props.submission.text)
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

export default connect(mapStateToProps)(PostBody)
