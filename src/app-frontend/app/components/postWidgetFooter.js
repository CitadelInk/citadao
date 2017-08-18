import React, { Component } from 'react';
import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'
import { connect } from 'react-redux';


class PostWidgetFooter extends Component {
	 constructor(props) {
		 super(props);
	}


	render() {
		const style = {
				height: '40px',  
				background:'#707B7c',
				width:'100%',
				borderBottomLeftRadius: '15px',
				borderBottomRightRadius: '15px'
		}
			
		console.log("submission - " + this.props.submission)
		return (			
			<div style={style}>
 				<span>likes all over the place wassup<br /></span>
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, submissions } = state;

  return {wallet, submissions };
}

export default connect(mapStateToProps)(PostWidgetFooter)
