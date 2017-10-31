import React, { Component } from 'react';
import { connect } from 'react-redux';
import PostWidgetContainer from '../postWidget/postWidgetContainer';


class Posts extends Component {
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

		var postos = this.props.postKeys;
		var selectedResponses = this.props.wallet.get('selectedResponses');
		if (this.props.isResponses && selectedResponses) {
			postos = selectedResponses;
		}
			
		var posts = postos.map(function(key) {
			var key2 = key.authAdd + "-" + key.submissionHash + "-" + key.revisionHash;
			return (<PostWidgetContainer key={key2} authorg={key.authAdd} submission={key.submissionHash} revision={key.revisionHash} timestamp={key.timestamp}/>)
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

export default connect(mapStateToProps)(Posts)
