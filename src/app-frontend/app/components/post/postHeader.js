import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';
import { Avatar, FlatButton } from 'material-ui';
import styles from './postHeader.css';
import { Link, push } from 'redux-little-router';
import placeholder from '../../images/placeholderprof.jpg';
import {State} from 'slate';

const {
	gotoUserPage,
	gotoUserPageRev,
	gotoPost,
	setWalletData
} = actions;


class PostHeader extends Component {
	 constructor(props) {
		super(props);
		this.authorgNameClicked = this.authorgNameClicked.bind(this);
		this.infoButtonClicked = this.infoButtonClicked.bind(this);
		this.navigateNextRev = this.navigateNextRev.bind(this);
		this.navigatePreviousRev = this.navigatePreviousRev.bind(this);
		this.getRevisionHashes = this.getRevisionHashes.bind(this);
		this.onReviseClicked = this.onReviseClicked.bind(this);
		this.getSubmission = this.getSubmission.bind(this);
		this.getRevision = this.getRevision.bind(this);

		this.state = {showDetails : false};
	}


	render() {
		var name = "loading...";
		var time = "...";
		var authorg = this.props.auths[this.props.authorg];
		var avatar = placeholder;
		var timestamp = this.props.timestamp;
		var revText = "";

		if (authorg) {

			var submission;
			var revisions;

			var revisionHashes = [];
			var notFirst = false;
			var notLast = false;
			var canRevise = false;
			var revHash;

			if (this.props.bio) {
				submission = authorg.bioSubmission;
				revisions = submission;
				if (revisions) {
					revisionHashes = revisions.revisions;
				}
			} else {
				var submissions = authorg.submissions;
				if (submissions) {
					submission = submissions[this.props.submission];
					if (submission) {
						revisions = submission.revisions;
						if(revisions) {
							revisionHashes = revisions.revisionHashes;
						}
					}
				}
			}
			
			if (submission) {

				if (revisionHashes) {					
					var index = revisionHashes.length - 1;
					if(this.props.revision) {
						index = revisionHashes.indexOf(this.props.revision)
					}
					revText = "rev " + (index + 1) + " of " + revisionHashes.length;
					notFirst = (index !== 0);
					notLast = (index !== (revisionHashes.length - 1));

					if(!notLast && this.props.authorg === this.props.wallet.get('account')) {
						canRevise = true;
					}

					if (!timestamp) {
						var revision = revisions[revisionHashes[index]];
						if (revision) {
							timestamp = revision.timestamp;
						}
					}


					if(authorg.bioSubmission) {
						var bioSubmission = authorg.bioSubmission;
						var bioRevHashes = bioSubmission.revisions;
						revHash = "1";
						if (bioRevHashes.length > 0) {
							revHash = bioRevHashes[bioRevHashes.length - 1];
						}
						if (this.props.bio) {
							if(this.props.revision) {
								revHash = this.props.revision;
							}
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

				if (timestamp) {
					var date = new Date(timestamp * 1000);
					time = date.toLocaleDateString() + " - " + date.toLocaleTimeString();
				} 
			}
					
		}

		var details;

		if (this.props.bio) {
			details = (<div>
				<span style={{fontSize:'8pt'}}>authorg address - {this.props.authorg}</span><br />
				<span style={{fontSize:'8pt'}}>bio revision hash - {this.props.revision}</span><br />
			</div>);
		} else {
			details = (<div>
				<span style={{fontSize:'8pt'}}>authorg address - {this.props.authorg}</span><br />
				<span style={{fontSize:'8pt'}}>submission hash - {this.props.submission}</span><br />
				<span style={{fontSize:'8pt'}}>revision hash - {this.props.revision}</span><br />
			</div>);
		}

		var detailText = "more info...";

		if (this.state.showDetails) {
			detailText = "hide info...";
		}
		

		return (			
			<div className={styles.div}>
				<div className={styles.basicInfo}>
					<div className={styles.avatarContainer}>
						<Avatar size={60} src={avatar}/>
					</div>
					<div className={styles.nameAndTimeContainer}>
						<span className={styles.name}>
							<Link href = {"/user/" + this.props.authorg} onClick = {this.authorgNameClicked}>
								{name}
							</Link>
						</span><br/>
						<span className={styles.time}>{time}</span>
						<div className={styles.revInfoDiv}>
							{ (this.props.focusedPost && notFirst) && <div className={styles.arrow}><span onClick={this.navigatePreviousRev} className="material-icons">navigate_before</span></div>}
							<span className={styles.revText}>{revText}</span>
							{ (this.props.focusedPost && notLast) && <span onClick={this.navigateNextRev} className="material-icons">navigate_next</span>}
						</div>
					</div>
				</div>
				<div className={styles.reviseDiv}>
					{ canRevise && <FlatButton onClick={this.onReviseClicked} label="REVISE"/>}
				</div>				
				<div className={styles.infoTextDiv}>
					<span className={styles.infoText} onClick={this.infoButtonClicked}>{detailText}</span>
				</div>
				{ 
					this.state.showDetails && 
						details
				 }
 			</div>
		);
	}

	authorgNameClicked(e) {
		e.stopPropagation();
		this.props.dispatch(gotoUserPage(this.props.authorg));
	}

	infoButtonClicked(e) {
		e.stopPropagation();
		this.setState(previousState => {
        return { showDetails: !previousState.showDetails };
      });
	}

	navigatePreviousRev(e) {
		var revisionHashes = this.getRevisionHashes();
		var index = revisionHashes.length - 1;
		if(this.props.revision) {
			index = revisionHashes.indexOf(this.props.revision)
		}
		if (index > 0) {
			if (this.props.bio) {
				this.props.dispatch(gotoUserPageRev(this.props.authorg, revisionHashes[index-1]));
			} else {
				this.props.dispatch(gotoPost(this.props.authorg, this.props.submission, revisionHashes[index-1]))
			}
			e.stopPropagation();
		}
	}

	navigateNextRev(e) {
		var revisionHashes = this.getRevisionHashes();
		var index = revisionHashes.length - 1;
		if(this.props.revision) {
			index = revisionHashes.indexOf(this.props.revision)
		}
		if (index < revisionHashes.length - 1) {
			if (this.props.bio) {
				this.props.dispatch(gotoUserPageRev(this.props.authorg, revisionHashes[index+1]));
			} else {
				this.props.dispatch(gotoPost(this.props.authorg, this.props.submission, revisionHashes[index+1]))
			}
			e.stopPropagation();
		}
	}

	onReviseClicked(e) {
		var revision = this.getRevision();
		this.props.dispatch(setWalletData({reviseSubmissionHash : this.props.submission, reviseSubmissionInput : State.fromJSON(revision.text), selectedTabIndex : 2}));
		e.stopPropagation();
	}

	getRevision() {
		var submission = this.getSubmission();
		var revisionHashes = this.getRevisionHashes();
		var index = revisionHashes.length - 1;
		if(this.props.revision) {
			index = revisionHashes.indexOf(this.props.revision)
		}

		return submission.revisions[revisionHashes[index]];		
	}

	getSubmission() {
		var authorg = this.props.auths[this.props.authorg];
		var submission;
		var revisions;

		var revisionHashes = [];
		var notFirst = false;
		var notLast = false;

		if (this.props.bio) {
			submission = authorg.bioSubmission;
			revisions = submission;
			if (revisions) {
				revisionHashes = revisions.revisions;
			}
		} else {
			var submissions = authorg.submissions;
			if (submissions) {
				submission = submissions[this.props.submission];
			}
		}

		return submission;
	}

	getRevisionHashes() {
		var submission = this.getSubmission();
		var revisionHashes;
		var revisions;
		if (submission) {
			revisions = submission.revisions;
			if(revisions) {
				revisionHashes = revisions.revisionHashes;
			}
		}

		return revisionHashes;
	}
}

const mapStateToProps = state => {
  const { wallet, auths } = state.core;

  return {wallet, auths };
}

export default connect(mapStateToProps)(PostHeader)
