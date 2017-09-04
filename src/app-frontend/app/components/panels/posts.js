import React, { Component } from 'react';
import { connect } from 'react-redux';
import PostWidgetContainer from '../postWidget/postWidgetContainer';


class Posts extends Component {
	 constructor(props) {
		 super(props);
	}


	render() {
		const style = {
				height: '100%',
				background:'#FFFFFF',
				minWidth:'33%',
				maxWidth:'34%',
				float:'left'
		}
			
		var posts = this.props.postKeys.map(function(key) {
			var key2 = key.authorgAddress + "-" + key.submissionHash + "-" + key.revisionHash;
			return (<PostWidgetContainer key={key2} authorg={key.authorgAddress} submission={key.submissionHash} revision={key.revisionHash} />)
		})
		return (
			
			<div style={style} className="Posts">
				{posts}			
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, postKeys, auths } = state;

  return {wallet, postKeys, auths };
}

export default connect(mapStateToProps)(Posts)
