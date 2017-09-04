import React, { Component } from 'react';
import { connect } from 'react-redux';
import PostSectionActions from './postSectionActions';
import Post from './post';

class PostSection extends Component {
	 constructor(props) {
		 super(props);
	}


	render() {
		const style = {
			background:'#F0F0F0',
			paddingBottom:'2px',
			paddingTop:'2px',
			width:'100%',
			position:'relative'
		}

		const postStyle = {
				position:'relative',
				background:'#FFFFFF',
				height:'200px',
				width:'80%',
				overflow:'hidden',
				left:'10%'
		}

		const headerStyle = {
			height:'40px',
			background:'#7FDBFF',
			borderTopLeftRadius: '15px',
			borderTopRightRadius: '15px',
			width:'100%',
			position:'absolute',
			top:'0'
		}


		const bodyStyle = {
			background:'#FFFFFF',
			position:'absolute',
			overflow:'hidden',
			width:'100%',
			top:'40px'
		}

		const footerStyle = {
			position:'absolute',
			bottom:'0',
			height: '20px',  
			background:'#707B7c',
			borderBottomLeftRadius: '15px',
			borderBottomRightRadius: '15px',
			width:'100%'
		}

			

		var reference = false;
		var section = this.props.section;
		console.log("postSection section: " + section);
		try {
			var json = JSON.parse(section);
			if(json) {
				var reference = json.reference;
				if (reference) {
					console.log("reference: authorg: " + reference.authorg + " - submissionHas: " + reference.submissionHash + " - revisionHash: " + reference.revisionHash);
					section = <Post style={postStyle} headerStyle={headerStyle} bodyStyle={bodyStyle} footerStyle={footerStyle} authorg={reference.authorg} submission={reference.submissionHash} revision={reference.revisionHash} sectionIndex={reference.sectionIndex} />
					reference = true;
				}
			}		
		} catch(e) {

		}

		console.log("section post: " + this.props.focusedPost);
		var actions = (<PostSectionActions sectionResponses={this.props.sectionResponses} authorg={this.props.authorg} submissionHash={this.props.submissionHash} revisionHash={this.props.revisionHash} sectionIndex={this.props.sectionIndex} />);
		if (reference || !this.props.focusedPost) {
			actions = ''
		}

		return (			
			<div style={style}>
				{section}
				<br />
				{actions}
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, submissions } = state;

  return {wallet, submissions };
}

export default connect(mapStateToProps)(PostSection)
