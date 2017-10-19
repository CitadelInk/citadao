import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserWidget from '../post/userWidget';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import UserList from './userList';
const {
	submitResponseRequest
} = actions;
import actions from '../../actions'


class ResponseRequestModal extends Component {
	constructor(props) { 
		super(props);
		this.state = {
			open: false,
			innerOpen: false,
			selectedUser: undefined,
			bountyValue: .01
		};
		this.handleOpen = this.handleOpen.bind(this);
		this.handleInnerOpen = this.handleInnerOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.setPickedUser = this.setPickedUser.bind(this);
		this.handleBountyValueChanged = this.handleBountyValueChanged.bind(this);
	}

	handleOpen(e) {
		this.setState({open: true});
		e.stopPropagation();
	};

	handleInnerOpen(e) {
		this.setState({innerOpen: true});
		e.stopPropagation();
	}

	handleClose(e) {
		this.setState({open: false, innerOpen: false});
	};

	handleSubmit(e) {
		if (this.state.selectedUser) {
			this.props.dispatch(submitResponseRequest(this.state.selectedUser, this.props.postAuthorg, this.props.postSubmission, this.props.postRevision, this.state.bountyValue))
			this.handleClose(e);
		}
	};

	handleBountyValueChanged(e) {
		try {
			var num = Number.parseFloat(e.target.value);
			this.setState({bountyValue : num});
		} catch(e) {

		}
	}

	setPickedUser(value) {
		this.setState({innerOpen: false});
		this.setState({selectedUser : value});
	}

	render() {
		var users;
		if(this.props.users){
			var instance = this;
			users = Array.from(this.props.users.values()).map(function(key) {
				return (<UserWidget secondary={true} key={key} authorg={key} value={key} onClick={instance.setPickedUser}/>)
			})
		}
		
		const actions = [
			<RaisedButton
			label="submit"
			primary={true}
			keyboardFocused={true}
			onClick={this.handleSubmit}
			/>,
		];


		return (
			<div>
			<span onClick={this.handleOpen} >Request Response</span>
			<Dialog
				title="Request Response to Post"
				actions={actions}
				modal={false}
				open={this.state.open}
				onRequestClose={this.handleClose}
			>
			<div>
				{ this.state.selectedUser && <UserWidget key={this.state.selectedUser} authorg={this.state.selectedUser} />}
				{ this.state.selectedUser && <TextField floatingLabelText="Bounty in ETH" id="selectedUserBountyValue" value={this.state.bountyValue} onChange={this.handleBountyValueChanged}/>}
				<FlatButton label="Pick User" onClick={this.handleInnerOpen} />
				<Dialog
					title="Pick user to ask for response"
					modal={false}
					open={this.state.innerOpen}
					onRequestClose={this.handleClose}
				>
					<div>
						This list includes users you follow, users that follow you, and users mentioned in the post.
						{users}		
					</div>
				</Dialog>
			</div>
			</Dialog>
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, auths } = state.core;

  return { wallet, auths };
}

export default connect(mapStateToProps)(ResponseRequestModal)
