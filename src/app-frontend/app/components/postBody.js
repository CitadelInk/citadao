import React, { Component } from 'react';
import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import PostSection from './postSection';


class PostBody extends Component {
	 constructor(props) {
		 super(props);
	}


	render() {
		const style = {
				background:'#F0F0F0'
		}
			
		console.log("submission text length: " + this.props.submission.text.length);

		return (			
			<div style={style}>
				<center>{this.props.submission.title}</center><br />
				{this.props.submission.text.map(section => {
					return (<PostSection section={section} />);	
				})}
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, submissions } = state;

  return {wallet, submissions };
}

export default connect(mapStateToProps)(PostBody)
