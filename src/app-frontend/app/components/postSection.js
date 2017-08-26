import React, { Component } from 'react';
import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import PostSectionActions from './postSectionActions';

class PostSection extends Component {
	 constructor(props) {
		 super(props);
	}


	render() {
		const style = {
			background:'#F0F0F0',
			display:'flex',
			paddingBottom:'5px'
		}

		const innerStyle1 = {
			flexGrow:'1'
		}
		const innerStyle2 = {
			width:'100px'
		}

		return (			
			<div style={style}>
				<div style={innerStyle1}>
					{this.props.section}
				</div>
				<div style={innerStyle2}>
					<PostSectionActions authorg={this.props.authorg} submissionHash={this.props.submissionHash} revisionHash={this.props.revisionHash} sectionIndex={this.props.sectionIndex} />
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, submissions } = state;

  return {wallet, submissions };
}

export default connect(mapStateToProps)(PostSection)
