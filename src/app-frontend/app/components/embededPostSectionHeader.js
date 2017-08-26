import React, { Component } from 'react';
import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'
import { connect } from 'react-redux';


import actions from '../actions';

const {
	gotoUserPage
} = actions;


class EmbededPostSectionHeader extends Component {
	 constructor(props) {
		 super(props);
		  this.authorgNameClicked = this.authorgNameClicked.bind(this);
	}


	render() {
		const style = {
				height: '50px',
				background:'#85C1E9',
				width:'100%',
				borderTopLeftRadius: '15px',
				borderTopRightRadius: '15px',
				textAlign:'left',
				lineHeight:'.5em'
		}

		var authorgName = "loading..."
		var authorgHash = "loading..."
		var submissionHash = "loading..."
		var revisionHash = "loading..."

		if(this.props.submission) {
			authorgHash = this.props.submission.submissionAuthorg;
			authorgName = this.props.submission.authorgName;
			submissionHash = this.props.submission.submissionHash;
			revisionHash = this.props.submission.revisionHash;
		}
		return (			
			<div style={style}>
				<button value={authorgHash} onClick={this.authorgNameClicked}><span style={{fontSize:'10pt'}}>{authorgName}</span> - <span style={{fontSize:'8pt'}}>{authorgHash}</span></button><br />
 				<span style={{fontSize:'6pt'}}>submission hash - {submissionHash}</span><br />
 				<span style={{fontSize:'6pt'}}>revision hash - {revisionHash}</span><br />
 			</div>
		);
	}

	authorgNameClicked(e) {
		this.props.dispatch(gotoUserPage(e.target.value));
		e.stopPropagation();
	}
}

const mapStateToProps = state => {
  const { wallet } = state;

  return {wallet };
}

export default connect(mapStateToProps)(EmbededPostSectionHeader)
