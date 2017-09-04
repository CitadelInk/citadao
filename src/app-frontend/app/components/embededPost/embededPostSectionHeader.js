import React, { Component } from 'react';
import { connect } from 'react-redux';


import actions from '../../actions';

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

		var authorgName = "loading...";
		var authorgHash = this.props.authorg;
		var submissionHash = this.props.submission;
		var revisionHash = this.props.revision;

		var auth = this.props.auths[this.props.authorg];
		var text = ["loading"];
		var title = "loading";
		if (auth) {
			authorgName = auth.name;			
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
  const { wallet, auths } = state;

  return {wallet, auths };
}

export default connect(mapStateToProps)(EmbededPostSectionHeader)
