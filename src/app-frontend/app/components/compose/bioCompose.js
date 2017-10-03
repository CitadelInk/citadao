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

class BioCompose extends Component {
	constructor(props) {
		super(props);
		this.handleBioNameChange = this.handleBioNameChange.bind(this);
		this.avatarImageChanged = this.avatarImageChanged.bind(this);	
		this.state = { image : null };
	}


	render() {
		return(
			<div className={styles.compose}>
				<input placeholder="Name..." onChange={this.handleBioNameChange} value={this.props.wallet.get('bioNameInput')} /><br />
				<div className={styles.avatarContainer}><Avatar src={this.props.wallet.get('bioAvatarImage')}/><input type="file" onChange={this.avatarImageChanged}/></div><br/>
				<ComposeRichText bio={true}/>
			</div>
		);
	}

	avatarImageChanged(e) {
		var reader = new FileReader();
		var instance = this;
        reader.onloadend = function() {
			instance.props.dispatch(setWalletData({bioAvatarImage : reader.result}))
        }
		reader.readAsDataURL(e.target.files[0]);
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
