import React, { Component } from 'react';
import { connect } from 'react-redux';
import Post from '../post/post';
import Compose from '../compose/compose';
import Responses from './responses'

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
		/*const style = {
			top: '100px'
				background:'#FFFFFF',
				position:'fixed',
				width:'100%',
				
				display:'flex',
				height:'100%',
				maxHeight:'100%',
				overflow:'hidden'
		}*/

		const style = {
				//height: '100%',
				background:'#FFFFFF',
				width:'100%',
				//position: 'fixed',
				top:'100px',
				bottom:'0px',
				zIndex:'900',
				display:'flex'
		}

		var stateHeight = parseInt(this.state.height);
		var remainingHeight = stateHeight - 200;
		const calcheight = remainingHeight + 'px';
			
			
		const authorg = this.props.authorg;
		const submission = this.props.submission;
		const revision = this.props.revision;
		var post = "loading...";
		const postStyle = {
				position:'relative',
				background:'#FFFFFF',
				width:'33%',
				//height:'100%',
				overflow:'hidden',
				/*top:'0',
				bottom:'0',
				left:'0',*/
				top:'100px',
				bottom:'0px',
				float:'left'
		}

		const headerStyle = {
			height:'60px',
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
			overflow:'scroll',
			width:'100%',
			height:calcheight
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

		var responses = "responses..."
		if (this.props.wallet.get('selectedResponses')) {
			var responseSubmissions = this.props.wallet.get('selectedResponses')
			responses = (
				<Responses responses={responseSubmissions} />
			)
		}

		return(
			<div style={style}>
				{post}
				{responses}
				<Compose />
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, auths } = state;

  return {wallet, auths };
}

export default connect(mapStateToProps)(PostPage)
