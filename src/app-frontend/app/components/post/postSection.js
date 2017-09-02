import React, { Component } from 'react';
import { connect } from 'react-redux';
import PostSectionActions from './postSectionActions';
import EmbededPostSectionWidgetContainer from '../embededPostSectionWidgetContainer'

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

		var section = this.props.section;
		
		try {
			var json = JSON.parse(section);
			if(json) {
				var reference = json.reference;
				if (reference) {
					section = <EmbededPostSectionWidgetContainer submissionHash={reference.submissionHash} revisionHash={reference.revisionHash} sectionIndex={reference.sectionIndex} />
				}
			}		
		} catch(e) {

		}

		return (			
			<div style={style}>
				<div style={innerStyle1}>
					{section}
				</div>
				<div style={innerStyle2}>
					<PostSectionActions sectionResponses={this.props.sectionResponses} authorg={this.props.authorg} submissionHash={this.props.submissionHash} revisionHash={this.props.revisionHash} sectionIndex={this.props.sectionIndex} />
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
