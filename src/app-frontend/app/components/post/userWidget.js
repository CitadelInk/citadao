import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';
import { Avatar } from 'material-ui';
import styles from './userWidget.css';
import { Link, push } from 'redux-little-router';
import placeholder from '../../images/placeholderprof.jpg';

const {
	gotoUserPage
} = actions;


class UserWidget extends Component {
	 constructor(props) {
		super(props);
		this.authorgNameClicked = this.authorgNameClicked.bind(this);
		this.state = {showDetails : false};
	}


	render() {
		var name = "loading...";
		var time = "...";
		var authorg = this.props.auths[this.props.authorg];
		var avatar = placeholder;

		if (authorg) {
			if(authorg.bioSubmission) {
				var bioSubmission = authorg.bioSubmission;
				var bioRevHashes = bioSubmission.revisions;
				var revHash = "1";
				if (bioRevHashes.length > 0) {
					revHash = bioRevHashes[bioRevHashes.length - 1];
				}
				var bioRevision = bioSubmission[revHash];
				if (bioRevision) {
					name = bioRevision.name;
					if (bioRevision.image) {
						avatar = bioRevision.image;
					}
				}
			}
					
		}

		return (			
			<div className={styles.div}>
				<div className={styles.basicInfo}>
					<div className={styles.avatarContainer}>
						<Avatar src={avatar}/>
					</div>
					<div className={styles.nameAndTimeContainer}>
						<span className={styles.name}>
							<Link href = {"/user/" + this.props.authorg} onClick = {this.authorgNameClicked}>
								{name}
							</Link>
						</span>
					</div>
				</div>
 			</div>
		);
	}

	authorgNameClicked(e) {
		e.stopPropagation();
		this.props.dispatch(gotoUserPage(this.props.authorg));
	}
}

const mapStateToProps = state => {
  const { wallet, auths } = state.core;

  return {wallet, auths };
}

export default connect(mapStateToProps)(UserWidget)
