import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './bioCompose.css';
import ComposeRichText from './composeRichText';
import actions from '../../actions';
import { Avatar } from 'material-ui';
import placeholder from '../../images/placeholderprof.jpg';

const {
	setWalletData
} = actions;

class ReviseSubmissionCompose extends Component {
	constructor(props) {
		super(props);
		this.state = { image : null };
	}


	render() {
		return(
			<div className={styles.compose}>
				<span>Revise: {this.props.submission}</span><br/>
				<ComposeRichText submission={this.props.submission}/>
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet } = state.core;

  return {wallet };
}

export default connect(mapStateToProps)(ReviseSubmissionCompose)
