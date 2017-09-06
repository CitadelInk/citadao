import React, { Component } from 'react';
import { connect } from 'react-redux';
import PostHeader from './postHeader';
import PostBody from './postBody';
import PostFooter from './postFooter';
import actions from '../../actions';

const {
	gotoPost
} = actions;

class Post extends Component {
	 constructor(props) {
		 super(props);
		  this.widgetClicked = this.widgetClicked.bind(this);
	}


	render() {	
		return(
			<div style={this.props.style} onClick={this.widgetClicked}>			
				<PostHeader headerStyle={this.props.headerStyle} authorg={this.props.authorg} submission={this.props.submission} revision={this.props.revision} />
				<PostBody bodyStyle={this.props.bodyStyle} authorg={this.props.authorg} submission={this.props.submission} revision={this.props.revision} sectionIndex={this.props.sectionIndex} focusedPost={this.props.focusedPost} />
				<PostFooter footerStyle={this.props.footerStyle} authorg={this.props.authorg} submission={this.props.submission} revision={this.props.revision}/>
			</div>
		);
	}

	widgetClicked(e) {
		this.props.dispatch(gotoPost(this.props.authorg, this.props.submission, this.props.revision));
		e.stopPropagation();
	}
}

const mapStateToProps = state => {
  const { wallet, submissions } = state;

  return {wallet, submissions };
}

export default connect(mapStateToProps)(Post)
