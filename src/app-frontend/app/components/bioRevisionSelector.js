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
		const dropDownStyle = {
			position: 'absolute', 
			left: '0',
			right: '0', 
			marginLeft: 'auto', 
			marginRight: 'auto', 
			width: '564px' /* Need a specific value to work */
		}
		const accountsDropDown = (
			<select style={dropDownStyle} onChange={this.handleBioRevisionSelected}>
			{
				this.props.wallet.get('bioRevisions').map(function(bioRevision) {
 					return (<option value={bioRevision}>{bioRevision}</option>)
 				})
			}
			</select>
		);

		return (
			<div className="bioRevisionSelector">
				{accountsDropDown}
			</div>
		)
	}

	handleBioRevisionSelected(e) {
		this.props.dispatch(setSelectedBioRevision(e.target.value));
	}
}

const mapStateToProps = state => {
  const { wallet } = state;

  return {wallet};
}

export default connect(mapStateToProps)(BioRevisionSelector)
