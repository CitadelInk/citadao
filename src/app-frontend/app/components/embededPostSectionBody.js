import React, { Component } from 'react';
import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'
import { connect } from 'react-redux';


class EmbededPostSectionBody extends Component {
	 constructor(props) {
		 super(props);
	}


	render() {
		const style = {
			maxHeight: '10em',
			lineHeight: '1em',
			background:'#F0F0F0',
			width:'100%',
			overflow: 'hidden',
			textAlign:'left'
		}

		var text = "loading..."
		if (this.props.submission) {
			text = this.props.submission.text
		}
			
		return (			
			<div style={style}>
				{text}
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, submissions } = state;

  return {wallet, submissions };
}

export default connect(mapStateToProps)(EmbededPostSectionBody)
