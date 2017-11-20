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
		this.state = { image: null, width: '0', height: '0' };
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
		}
	
	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
	}

	updateWindowDimensions() {
		this.setState({ width: window.innerWidth, height: window.innerHeight });
	}


	render() {
		// hack - walker please fix.
		var height = this.state.height - 245; //total height - header + tabs + name + file picker height
		return (
			<div className={styles.compose}>
				<div className={styles.name}>
					<input placeholder="Name..." onChange={this.handleBioNameChange} value={this.props.wallet.get('bioNameInput')} />
				</div>
				<div className={styles.name}>
					<div className={styles.avatarContainer}>
						<Avatar src={this.props.wallet.get('bioAvatarImage')} /><input type="file" onChange={this.avatarImageChanged} />
					</div>
				</div>
				<div className={styles.richTextContainer}>
					<ComposeRichText 
						value={this.props.value}
                  		callback={this.props.callback}
					  onPostComplete={this.props.onPostComplete}
					  	bio={true} 
						height={height} />
				</div>
			</div>
		);
	}

	avatarImageChanged(e) {
		var reader = new FileReader();
		var instance = this;
		reader.onloadend = function () {
			instance.props.dispatch(setWalletData({ bioAvatarImage: reader.result }))
		}
		reader.readAsDataURL(e.target.files[0]);
	}

	handleBioNameChange(e) {
		this.props.dispatch(setWalletData({ bioNameInput: e.target.value }));
	}
}

const mapStateToProps = state => {
	const { wallet } = state.core;

	return { wallet };
}

export default connect(mapStateToProps)(BioCompose)
