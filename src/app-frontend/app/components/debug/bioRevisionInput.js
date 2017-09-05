import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';
import Header from '../header/header';

const {
	initializeContract,
	initializeAccount,
	initializeAccounts,
	updateCitaBalance,
	setWalletData,
	setBuyPrice,
	submitBio,
	handleBuySubmit,
} = actions;

class BioRevisionInput extends Component {
	 constructor(props) {
		 super(props);
		this.handleSubmitBio = this.handleSubmitBio.bind(this);
		this.handleBioNameChange = this.handleBioNameChange.bind(this);
		this.handleBioTextChange = this.handleBioTextChange.bind(this);
	}

	render() {
		const style = {
				height: '10000px',
				background:'#FFFFFF',
				width:'100%',
				margin:'0px auto',
				top:'300px'
		}

		return (
			
			<div style={style} className="BioRevisionInput">
				<input onChange={this.handleBioNameChange} value={this.props.wallet.get('bioNameInput')} /><br />
				<textarea onChange={this.handleBioTextChange} value={this.props.wallet.get('bioTextInput')} rows="30" cols="100"/><br />
				<button onClick={this.handleSubmitBio}>Submit Bio</button>			
			</div>
		);
	}

	handleSubmitBio(e) {
		this.props.dispatch(submitBio());
	}

	handleBioTextChange(e) {
		this.props.dispatch(setWalletData({bioTextInput : e.target.value}));
	}

	handleBioNameChange(e) {
		this.props.dispatch(setWalletData({bioNameInput : e.target.value}));
	}
}

const mapStateToProps = state => {
  const { wallet } = state;

  return {wallet};
}

export default connect(mapStateToProps)(BioRevisionInput)
