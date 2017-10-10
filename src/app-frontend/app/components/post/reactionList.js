import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';
import { Card, CardText } from 'material-ui';
import { RaisedButton } from 'material-ui';
import UserList from '../panels/userList';
import styles from './reactionList.css';
const {
	submitReaction
} = actions;



class ReactionList extends Component {
	 constructor(props) {
		 super(props);
		  this.reactionClicked = this.reactionClicked.bind(this);
	}


	render() {	
		return (
		<div className={styles.divStyle}>
			<Card className={styles.cardStyle}>
				<span>Users that reacted "{this.props.text}":</span>
				<div className={styles.userScrollList}>
					<UserList users={this.props.users}/>
				</div>
				<br/>
				<RaisedButton secondary className={styles.button} labelPosition="before" label={"Submit '"+ this.props.text +"'"} onClick={this.reactionClicked} />
			</Card>
		</div>
		)					
	}

	reactionClicked(e) {
		this.props.dispatch(submitReaction(this.props.authorg, this.props.submission, this.props.revision, this.props.reactionValue));
		e.stopPropagation();
	}
}

const mapStateToProps = state => {
  const { wallet, approvedReactions, auths } = state.core;

  return {wallet, approvedReactions, auths };
}

export default connect(mapStateToProps)(ReactionList)
