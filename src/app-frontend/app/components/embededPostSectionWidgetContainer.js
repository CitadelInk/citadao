import React, { Component } from 'react';
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import EmbededPostSectionWidget from './embededPostSectionWidget'

class EmbededPostSectionWidgetContainer extends Component {
	 constructor(props) {
		 super(props);
	}


	render() {
		const style = {
				background:'#F0F0F0',
				width:'100%',
				textAlign:'center'
		}
			
		return (			
			<div style={style}>
 				<EmbededPostSectionWidget  submissionHash={this.props.submissionHash} revisionHash={this.props.revisionHash} sectionIndex={this.props.sectionIndex} />
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, submissions } = state;

  return {wallet, submissions };
}

export default connect(mapStateToProps)(EmbededPostSectionWidgetContainer)
