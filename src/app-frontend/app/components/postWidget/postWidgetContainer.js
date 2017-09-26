import React, { Component } from 'react';
import { connect } from 'react-redux';
import Post from '../post/post';
import { Card } from 'material-ui';
import actions from '../../actions';
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
 				<Post authorg={this.props.authorg} submission={this.props.submission} revision={this.props.revision} focusedPost={false} />
				</Card>
			</div>
		);
	}

	
	widgetClicked(e) {
		this.props.dispatch(gotoPost(this.props.authorg, this.props.submission, this.props.revision));
		e.stopPropagation();
	}
}

const mapStateToProps = state => {
  const { wallet } = state;

  return {wallet };
}

export default connect(mapStateToProps)(PostWidgetContainer)
