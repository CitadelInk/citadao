import React, { Component } from 'react';
import { connect } from 'react-redux';
import Post from '../post/post';
import Compose from '../compose/compose';
import Posts from './posts'

class PostPage extends Component {
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
		const style = {
				background:'#FFFFFF',
				position:'absolute',
				width:'100%',
				top:'60px',
				bottom:'0px',
				zIndex:'900',
				display:'flex'
		}		
			
		const responsesStyle = {
			position:'relative',
			//top:'100px',
			minWidth:'33%',
			maxWidth:'34%',
			float:'left'
		}

		const composeStyle = {
			position:'relative',
			//top:'100px',
			minWidth:'33%',
			maxWidth:'34%',
			float:'right'
		}
			
		
		const postStyle = {
				position:'relative',
				background:'#FFFFFF',
				minWidth:'33%',
				maxWidth:'34%',
				overflow:'hidden',
				bottom:'0px',
				float:'left'
		}

		const headerStyle = {
			background:'#7FDBFF',
			borderTopLeftRadius: '15px',
			borderTopRightRadius: '15px',
			width:'100%',
			position:'relative',
			top:'0px'
		}

		const bodyStyle = {
			background:'#FFFFFF',
			position:'relative',
			overflow:'auto',
			width:'100%'
		}

		const footerStyle = {
			position:'absolute',
			bottom:'0',
			height: '40px',  
			background:'#707B7c',
			borderBottomLeftRadius: '15px',
			borderBottomRightRadius: '15px',
			width:'100%'
		}

		const authorg = this.props.authorg;
		const submission = this.props.submission;
		const revision = this.props.revision;
		var post = "loading...";

		if (submission) {
			post = (			
				<Post 	style={postStyle} 
						headerStyle={headerStyle} 
						bodyStyle={bodyStyle} 
						footerStyle={footerStyle} 
						authorg={authorg} 
						submission={submission} 
						revision={revision} 
						focusedPost={true} />
			);
		}


		var authorgData = this.props.auths[this.props.authorg];
		var keys = [];
		if (authorgData) {
			var submissionsData = authorgData.submissions;
			if (submissionsData) {
				var submissionData = submissionsData[this.props.submission];
				if (submissionData) {
					var revisionsData = submissionData.revisions;
					if (revisionsData) {
						var revisionData = revisionsData[this.props.revision];
						if (revisionData) {
							if (revisionData.refKeys) {
								keys = revisionData.refKeys;
							}
						}
					}					
				}			
			}		
		}

		var responses = "responses...";
		if (keys.length > 0) {
			responses = (			
				<Posts postKeys={keys} />
			)
		}
		

		return(
			<div style={style}>
				{post}
				<div style={responsesStyle}>
					{responses}
				</div>
				<div style={composeStyle}>
				<Compose />
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, auths } = state;

  return {wallet, auths };
}

export default connect(mapStateToProps)(PostPage)
