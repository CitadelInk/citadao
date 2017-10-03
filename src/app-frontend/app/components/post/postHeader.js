import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';
import { CardHeader } from 'material-ui';
import styles from './postHeader.css';

const {
	gotoUserPage
} = actions;


class PostHeader extends Component {
	 constructor(props) {
		super(props);
		this.authorgNameClicked = this.authorgNameClicked.bind(this);
		this.infoButtonClicked = this.infoButtonClicked.bind(this);
		this.state = {showDetails : false};
	}


	render() {
		var name = "loading...";
		var time = "...";
		var authorg = this.props.auths[this.props.authorg];

		if (authorg) {
			if(authorg.bioSubmission) {
				console.log("yes bioSubmission");
				var bioSubmission = authorg.bioSubmission;
				console.log("header - bioSubmission: " + bioSubmission);
				var bioRevHashes = bioSubmission.revisions;
				console.log("header - bioRevHashes: " + bioRevHashes)
				var revHash = "1";
				console.log("header - revHash 1: " + revHash);
				console.log("header - bio rev hashes length: " + bioRevHashes.length)
				if (bioRevHashes.length > 0) {
					console.log("header thing: " - bioRevHashes[bioRevHashes.length - 1]);
					revHash = bioRevHashes[bioRevHashes.length - 1];
				}
				console.log("header - revHash 2: " + revHash);
				var bioRevision = bioSubmission[revHash];
				name = bioRevision.revision.name;
			}

			var submission;
			
			if (this.props.bio) {
				console.log("yes bio")
				submission = authorg.bioSubmission;
			} else {
				var submissions = authorg.submissions;
				if (submissions) {
					submission = submissions[this.props.submission];
				}
			}
			
			if (submission) {
				console.log("yes submission");
				var revisions = submission.revisions;
				if (revisions) {
					var revision = revisions[this.props.revision];
					if (revision) {
						if (revision.timestamp && revision.timestamp > 0) {
							var date = new Date(revision.timestamp * 1000);
							time = date.toDateString();
						}
					}
				}					
			}			
					
		}

		return (			
			<div className={styles.div}>
				<span className={styles.name}>{name}</span><br/>
				<span className={styles.time}>{time}</span>
				<span onClick={this.infoButtonClicked} style={{fontSize:'8pt', position:'relative', top:'5px', right:'200px'}}>info...</span>
				{this.state.showDetails && 
					<div>
						<span style={{fontSize:'8pt'}}>authorg address - {this.props.authorg}</span><br />
						<span style={{fontSize:'8pt'}}>submission hash - {this.props.submission}</span><br />
						<span style={{fontSize:'8pt'}}>revision hash - {this.props.revision}</span><br />
					</div>
				 }
 			</div>
		);
	}

	authorgNameClicked(e) {
		this.props.dispatch(gotoUserPage(e.target.value));
		e.stopPropagation();
	}

	infoButtonClicked(e) {
		e.stopPropagation();
		this.setState(previousState => {
        return { showDetails: !previousState.showDetails };
      });
	}
}

const mapStateToProps = state => {
  const { wallet, auths } = state.core;

  return {wallet, auths };
}

export default connect(mapStateToProps)(PostHeader)
