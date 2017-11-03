import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './bioCompose.css';
import ComposeRichText from './composeRichText';
import actions from '../../actions';
import { Avatar } from 'material-ui';
import placeholder from '../../images/placeholderprof.jpg';
import UserWidget from '../post/userWidget';

const {
	setWalletData
} = actions;

class ReviseSubmissionCompose extends Component {
	constructor(props) {
		super(props);
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
		var height = this.state.height - 220; //total height - header + tabs + name + file picker height
		
		var outerStyle = {
			"height" : "10px"
		}
		var reviseStyle = {
			"fontSize" : "10px"
		}
		return(
			<div className={styles.compose}>
				<UserWidget authorg={this.props.wallet.get('account')}/>
				<div style={reviseStyle}><span>Revise: {this.props.submission}</span></div>
				<ComposeRichText height={height} submission={this.props.submission}/>
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet } = state.core;

  return {wallet };
}

export default connect(mapStateToProps)(ReviseSubmissionCompose)
