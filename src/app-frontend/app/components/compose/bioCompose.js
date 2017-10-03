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
		console.log("image src = " + this.state.image);
		return(
			<div className={styles.compose}>
				<input placeholder="Name..." onChange={this.handleBioNameChange} value={this.props.wallet.get('bioNameInput')} /><br />
				<Avatar src={this.props.wallet.get('bioAvatarImage')}/><input type="file" onChange={this.avatarImageChanged}/><br/>
				<ComposeRichText bio={true}/>
			</div>
		);
	}

	avatarImageChanged(e) {
		console.log("file: " + e.target.files[0]);
		var reader = new FileReader();
		var instance = this;
        reader.onloadend = function() {
			console.log("ON LOADED - " + reader.result);
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
