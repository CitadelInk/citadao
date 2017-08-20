import React, { Component } from 'react';
import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import PostWidgetHeader from './postWidgetHeader'
import PostWidgetBody from './postWidgetBody'
import PostWidgetFooter from './postWidgetFooter'

class Post extends Component {
	 constructor(props) {
		 super(props);
	}


	render() {
		const style = {
				height: '180px',
				background:'#F0F0F0',
				width:'100%',
				borderRadius: '15px',
				marginBottom: '15px'
		}
			
		const submission = this.props.submission;
		return (			
			<div style={style}>
				<PostWidgetHeader submission={submission}/>
				<PostWidgetBody submission={submission} />
				<PostWidgetFooter submission={submission} />
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, submissions } = state;

  return {wallet, submissions };
}

export default connect(mapStateToProps)(Post)
