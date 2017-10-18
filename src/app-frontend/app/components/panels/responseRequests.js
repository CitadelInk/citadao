import React, { Component } from 'react';
import { connect } from 'react-redux';
import ResponseRequestWidgetContainer from '../postWidget/responseRequestWidgetContainer';


class ResponseRequests extends Component {
	 constructor(props) {
		 super(props);
	}


	render() {
		const style = {
			position:'relative',
			background:'#FFFFFF',
			//float:'left',
			width:'100%',
			margin:'auto'
		}
			
		var recipients = this.props.recipients;
		var user = this.props.postUser;
		var submission = this.props.postSubmission;
		var revision = this.props.postRevision;

		var posts = this.props.offerers.map(function(offerer, index) {
			var key2 = offerer + "-" + recipients[index];
			return (<ResponseRequestWidgetContainer 
						key={key2} 
						postUser={user} 
						postSubmission={submission} 
						postRevision={revision} 
						offerer={offerer}
						recipient={recipients[index]}/>)
		})
		return (
			
			<div style={style} className="Posts">
				{posts}		
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, auths } = state.core;

  return { wallet, auths };
}

export default connect(mapStateToProps)(ResponseRequests)
