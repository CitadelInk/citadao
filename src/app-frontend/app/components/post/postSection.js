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
				height:'100px',
				width:'80%',
				overflow:'hidden',
				left:'10%'
		}

		const headerStyle = {
			background:'#7FDBFF',
			borderTopLeftRadius: '15px',
			borderTopRightRadius: '15px',
			width:'100%',
			position:'relative',
			top:'0'
		}


		const bodyStyle = {
			background:'#FFFFFF',
			position:'relative',
			overflow:'hidden',
			width:'100%',
			top:'0px',
			fontSize:'10px'
		}

		const footerStyle = {
			position:'absolute',
			bottom:'0px',
			height: '20px',  
			background:'#707B7c',
			borderBottomLeftRadius: '15px',
			borderBottomRightRadius: '15px',
			width:'100%'
		}

			

		var reference = false;
		var section = this.props.section;
		try {
			var json = JSON.parse(section);
			if(json) {
				var reference = json.reference;
				if (reference) {
					section = <Post style={postStyle} headerStyle={headerStyle} bodyStyle={bodyStyle} footerStyle={footerStyle} authorg={reference.authorg} submission={reference.submissionHash} revision={reference.revisionHash} sectionIndex={reference.sectionIndex} />
					reference = true;
				}
			}		
		} catch(e) {

		}

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
  const { wallet } = state;

  return {wallet };
}

export default connect(mapStateToProps)(PostSection)
