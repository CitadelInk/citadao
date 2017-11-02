import React, { Component } from 'react';
import { connect } from 'react-redux';
import Post from '../post/post';
import { Card } from 'material-ui';
import actions from '../../actions';
import { push } from 'redux-little-router';

const {
	gotoPost
} = actions;
import styles from './postWidgetContainer.css';


class PostWidgetContainer extends Component {
	 constructor(props) {
		 super(props);
		 this.widgetClicked = this.widgetClicked.bind(this);
	}


	render() {
		return (			
			<div className={styles.style} onClick={this.widgetClicked}>
				<Card>
 				<Post authorgName={this.props.authorgName} authorgAvatar={this.props.authorgAvatar} submissionValue={this.props.submissionValue} embededPostTextMap={this.props.embededPostTextMap} text={this.props.text} responseMap={this.props.responseMap} authorg={this.props.authorg} submission={this.props.submission} revision={this.props.revision} timestamp={this.props.timestamp} focusedPost={false} />
				</Card>
			</div>
		);
	}

	
	widgetClicked(e) {
		this.props.dispatch(
			gotoPost(this.props.authorg, this.props.submission, this.props.revision)
		);
		e.stopPropagation();
	}
}

const mapStateToProps = state => {
  const { } = state.core;

  return { };
}

export default connect(mapStateToProps)(PostWidgetContainer)
