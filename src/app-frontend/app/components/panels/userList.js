import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserWidget from '../post/userWidget';


class UserList extends Component {
	 constructor(props) {
		 super(props);
	}


	render() {
		var users;
		if(this.props.users){
			users = this.props.users.map(function(key) {
				return (<UserWidget key={key} authorg={key} />)
			})
		}
		return (
			
			<div>
				{users}		
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, auths } = state.core;

  return { wallet, auths };
}

export default connect(mapStateToProps)(UserList)
