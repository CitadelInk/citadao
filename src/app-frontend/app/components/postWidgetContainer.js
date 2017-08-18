import React, { Component } from 'react';
import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'
import { connect } from 'react-redux';


class PostWidgetContainer extends Component {
	 constructor(props) {
		 super(props);
	}


	render() {
		const style = {
				height: '200px',
				background:'#F0F0F0',
				width:'100%'
		}
			
		console.log("submission - " + this.props.submission)
		return (			
			<div style={style}>
 				<PostWidget submission={this.props.submission} />
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, submissions } = state;

  return {wallet, submissions };
}

export default connect(mapStateToProps)(PostWidgetContainer)
