import React, { Component } from 'react';
import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import actions from '../actions';

const {
	setSelectedBioRevision
} = actions;

class BioRevisionSelector extends Component {
	 constructor(props) {
		super(props);
		this.handleBioRevisionSelected = this.handleBioRevisionSelected.bind(this);
	}

	render() {
		console.log("bios = " + this.props.wallet.get('bioRevisions'));
		const accountsDropDown = (
			<select onChange={this.handleBioRevisionSelected}>
			{
				this.props.wallet.get('bioRevisions').map(function(bioRevision) {
 							return (<option value={bioRevision}>{bioRevision}</option>)
 				})
			}
			</select>
		);

		return (
			<div className="header">
				{accountsDropDown}
			</div>
		)
	}

	handleBioRevisionSelected(e) {
		console.log("revision selected - " + e.target.value)
		this.props.dispatch(setSelectedBioRevision(e.target.value));
	}
}

const mapStateToProps = state => {
  const { wallet } = state;

  return {wallet};
}

export default connect(mapStateToProps)(BioRevisionSelector)
