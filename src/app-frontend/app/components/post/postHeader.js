import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';
import { Avatar, FlatButton } from 'material-ui';
import styles from './postHeader.css';
import { Link, push } from 'redux-little-router';
import placeholder from '../../images/placeholderprof.jpg';
import { Value } from 'slate';
import ResponseRequestModal from '../panels/responseRequestModal';

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
		this.onReviseClicked = this.onReviseClicked.bind(this);

		this.state = {showDetails : false};
	}


	render() {
		var name = this.props.authorgName;
		var time = "...";
		var avatar = placeholder;
		if (this.props.authorgAvatar) {
			avatar = this.props.authorgAvatar;
		}
		var timestamp = this.props.timestamp;
		var revText = "";
		var submission;
		var revisions;

		var revisionHashes = this.props.revisionHashes;
		var notFirst = false;
		var notLast = false;
		var canRevise = false;
		var canRequestResponse = false;
		var revHash;
		var text;
		var responseMap;

		if (revisionHashes) {					
			var index = revisionHashes.length - 1;
			if(this.props.revision) {
				index = revisionHashes.indexOf(this.props.revision)
			}
			revText = "rev " + (index + 1) + " of " + revisionHashes.length;
			notFirst = (index !== 0);
			notLast = (index !== (revisionHashes.length - 1));
		}

		if (this.props.focusedPost) {
			if(this.props.authorg === this.props.wallet.get('account')) {
				canRevise = true;
			} 
			if (!this.props.bio) {
				canRequestResponse = true;
			}
		}
					

		/*text = revision.text;
		if (revision.sectionRefKeyMap) {
			responseMap = revision.sectionRefKeyMap;
		}*/


		if (timestamp) {
			var date = new Date(timestamp * 1000);
			time = date.toLocaleDateString() + " - " + date.toLocaleTimeString();
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

		var headerDivStyle = styles.div;
		var basicInfoStyle = styles.basicInfo;
		var avatarStyle = styles.avatar;
		var avatarContainerStyle = styles.avatarContainer;
		var nameAndTimeStyle = styles.nameAndTimeContainer;
		var nameStyle = styles.name;
		var timeStyle = styles.time;
		var infoTextDiv = styles.infoTextDiv;

		var size = 60;
		if(this.props.embeded) {
			headerDivStyle = styles.embededDiv;
			basicInfoStyle = styles.embededBasicInfo;
			avatarStyle = styles.embededAvatar;
			nameAndTimeStyle = styles.embededNameAndTimeContainer;
			nameStyle = styles.embededName;
			timeStyle = styles.embededTime;
			infoTextDiv = styles.embededInfoTextDiv;
			size = 30;
		}
		
		

		return (			
			<div className={headerDivStyle}>
				<div className={basicInfoStyle}>
					<div className={avatarContainerStyle}>
						<Avatar size={size} src={avatar}/>
					</div>
					<div className={nameAndTimeStyle}>
						<span className={nameStyle}>
							<Link href = {"/user/" + this.props.authorg} onClick = {this.authorgNameClicked}>
								{name}
							</Link>
						</span><br/>
						<span className={timeStyle}>{time}</span>
						<div className={styles.revInfoDiv}>
							{ canRevise && <FlatButton onClick={this.onReviseClicked} label="REVISE"/>}
							{ (this.props.focusedPost && notFirst) && <div className={styles.arrow}><span onClick={this.navigatePreviousRev} className="material-icons">navigate_before</span></div>}
							<span className={styles.revText}>{revText}</span>
							{ (this.props.focusedPost && notLast) && <span onClick={this.navigateNextRev} className="material-icons">navigate_next</span>}
						</div>
					</div>
				</div>
	
				<div className={styles.reviseDiv}>
				{ canRequestResponse && <ResponseRequestModal refKeys={this.props.responseMap} text={this.props.text} postAuthorg={this.props.authorg} postSubmission={this.props.submission} postRevision={this.props.revision}/>}
					</div>			
				<div className={infoTextDiv}>
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
		var revisionHashes = this.props.revisionHashes;

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
		var revisionHashes = this.props.revisionHashes;
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
		var revision = this.props.text;
		this.props.dispatch(setWalletData({reviseSubmissionHash : this.props.submission, reviseSubmissionInput : Value.fromJSON(revision), selectedTabIndex : 2}));
		e.stopPropagation();
	}
}

const mapStateToProps = state => {
  const { wallet } = state.core;

  return { wallet };
}

export default connect(mapStateToProps)(PostHeader)
