import React, { Component } from 'react';
import { connect } from 'react-redux';
import Post from '../post/post';


class PostWidgetContainer extends Component {
	 constructor(props) {
		 super(props);
	}


	render() {
		const style = {
				height: '220px',
				background:'#FFFFFF',
				position:'relative'
		}

		const postStyle = {
				position:'relative',
				background:'#FFFFFF',
				height:'200px',
				width:'100%',
				overflow:'hidden'
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
			overflow:'hidden',
			width:'100%'
			//top:'0px',
			//bottom:'40px'
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

			
		return (			
			<div style={style}>
 				<Post style={postStyle} headerStyle={headerStyle} footerStyle={footerStyle} bodyStyle={bodyStyle} authorg={this.props.authorg} submission={this.props.submission} revision={this.props.revision} focusedPost={false} />
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet } = state;

  return {wallet };
}

export default connect(mapStateToProps)(PostWidgetContainer)
