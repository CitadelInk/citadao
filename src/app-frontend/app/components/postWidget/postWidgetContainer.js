import React, { Component } from 'react';
import { connect } from 'react-redux';
import Post from '../post/post';
import { Card } from 'material-ui';


class PostWidgetContainer extends Component {
	 constructor(props) {
		 super(props);
	}


	render() {
		const style = {
				maxHeight: '280px',
				background:'#FFFFFF',
				position:'relative',
				width:'90%',
				margin:'10px'
		}

		const postStyle = {
				position:'relative',
				background:'#FFFFFF',
				width:'100%',
				overflow:'hidden',
				maxHeight: '280px',
		}

		const headerStyle = {
			width:'100%',
			position:'relative',
			top:'0px'
		}

		const bodyStyle = {
			background:'#FFFFFF',
			position:'relative',
			overflow:'hidden',
			width:'90%',
			maxHeight:'170px'
		}

		const footerStyle = {
			position:'relative',
			bottom:'5px',
			height: '40px',  
			width:'100%'
		}

			
		return (			
			<div style={style}>
				<Card>
 				<Post style={postStyle} headerStyle={headerStyle} footerStyle={footerStyle} bodyStyle={bodyStyle} authorg={this.props.authorg} submission={this.props.submission} revision={this.props.revision} focusedPost={false} />
				</Card>
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet } = state;

  return {wallet };
}

export default connect(mapStateToProps)(PostWidgetContainer)
