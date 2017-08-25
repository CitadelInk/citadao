import React, { Component } from 'react';
import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'
import { connect } from 'react-redux';


class PostSectionActions extends Component {
	 constructor(props) {
		 super(props);
	}


	render() {
		return (			
				<button onClick={this.onSectionActionsButtonClicked}>respond</button>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, submissions } = state;

  return {wallet, submissions };
}

export default connect(mapStateToProps)(PostSectionActions)
