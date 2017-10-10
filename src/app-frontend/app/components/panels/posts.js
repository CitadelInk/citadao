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
			
		var posts = this.props.postKeys.map(function(key) {
			var key2 = key.authAdd + "-" + key.submissionHash + "-" + key.revisionHash;
			//console.log("key2: " + key2);
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
