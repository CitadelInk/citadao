import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';
import { CardText } from 'material-ui';
import { RaisedButton } from 'material-ui';

const {
	submitReaction,
	setWalletData
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
		this.props.dispatch(setWalletData({selectedReactionHash : this.props.reactionValue}))
		e.stopPropagation();
	}
}

const mapStateToProps = state => {
  const {  } = state.core;

  return { };
}

export default connect(mapStateToProps)(ReactionButton)
