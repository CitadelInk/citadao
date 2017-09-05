import React, { Component } from 'react';
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import actions from '../actions';

const {
	submitReaction
} = actions;


class PostWidgetFooter extends Component {
	 constructor(props) {
		 super(props);
		  this.reactionClicked = this.reactionClicked.bind(this);
	}


	render() {
		const style = {
				height: '40px',  
				background:'#707B7c',
				width:'100%',
				borderBottomLeftRadius: '15px',
				borderBottomRightRadius: '15px'
		}
			
		var reactions = "loading...";
		
		if(this.props.submission.revisionReactionReactors) {
			reactions = this.props.submission.revisionReactionReactors.map(reaction => {
			  return (<span key={reaction.reactionHash}><button value={reaction.reactionHash} onClick={this.reactionClicked}>{reaction.reactionValue} - {reaction.reactionReactors.length}</button></span>);
			})
		} 
		return (			
			<div style={style}>
 				{reactions}
			</div>
		);
	}

	reactionClicked(e) {
		const sub = this.props.submission;
		this.props.dispatch(submitReaction(sub.submissionAuthorg, sub.submissionHash, sub.revisionHash, e.target.value));
		e.stopPropagation();
	}
}

const mapStateToProps = state => {
  const { wallet, approvedReactions } = state;

  return {wallet, approvedReactions };
}

export default connect(mapStateToProps)(PostWidgetFooter)
