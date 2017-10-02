import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './bioCompose.css';
import ComposeRichText from './composeRichText';
import actions from '../../actions';

const {
	setWalletData
} = actions;

class BioCompose extends Component {
	constructor(props) {
		 super(props);
		 this.handleBioNameChange = this.handleBioNameChange.bind(this);
	}


	render() {
		return(
			<div className={styles.compose}>
				Name:<br/>
				<input onChange={this.handleBioNameChange} value={this.props.wallet.get('bioNameInput')} /><br />
				Bio:<br/>
				<ComposeRichText bio={true}/>
			</div>
		);
	}

	handleBioNameChange(e) {
		this.props.dispatch(setWalletData({bioNameInput : e.target.value}));
	}
}

const mapStateToProps = state => {
  const { wallet } = state.core;

  return {wallet };
}

export default connect(mapStateToProps)(BioCompose)
