import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';
import { CardText } from 'material-ui';
import { RaisedButton } from 'material-ui';

const {
	submitReaction
} = actions;

import styles from './reactionButton.css';


class ReactionButton extends Component {
	 constructor(props) {
		 super(props);
		  this.reactionClicked = this.reactionClicked.bind(this);
	}


	render() {	
		return (<RaisedButton secondary className={styles.button} labelPosition="before" label={this.props.text} onClick={this.reactionClicked} />)					
	}

	reactionClicked(e) {
		this.props.dispatch(submitReaction(this.props.authorg, this.props.submission, this.props.revision, this.props.reactionValue));
		e.stopPropagation();
	}
}

const mapStateToProps = state => {
  const { wallet, approvedReactions, auths } = state.core;

  return {wallet, approvedReactions, auths };
}

export default connect(mapStateToProps)(ReactionButton)
