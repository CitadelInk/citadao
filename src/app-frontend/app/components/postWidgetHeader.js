import React, { Component } from 'react';
import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'
import { connect } from 'react-redux';


import actions from '../actions';

const {
	gotoUserPage
} = actions;


class PostWidgetHeader extends Component {
	 constructor(props) {
		 super(props);
		  this.authorgNameClicked = this.authorgNameClicked.bind(this);
	}


	render() {
		const style = {
				height: '60px',
				background:'#85C1E9',
				width:'100%',
				borderTopLeftRadius: '15px',
				borderTopRightRadius: '15px',
		}
			
		console.log("submission - " + this.props.submission)
		console.log("authorgName = " + this.props.submission.authorgName)
		return (			
			<div style={style}>
				<button value={this.props.submission.submissionAuthorg} onClick={this.authorgNameClicked}><span style={{fontSize:'14pt'}}>{this.props.submission.authorgName}</span> - <span style={{fontSize:'8pt'}}>{this.props.submission.submissionAuthorg}</span></button><br />
 				<span style={{fontSize:'8pt'}}>submission hash - {this.props.submission.submissionHash}</span><br />
 				<span style={{fontSize:'8pt'}}>revision hash - {this.props.submission.revisionHash}</span><br />
 			</div>
		);
	}

	authorgNameClicked(e) {
		console.log("name clicked: " + e.target.value);
		this.props.dispatch(gotoUserPage(e.target.value));
		e.stopPropagation();
	}
}

const mapStateToProps = state => {
  const { wallet } = state;

  return {wallet };
}

export default connect(mapStateToProps)(PostWidgetHeader)
