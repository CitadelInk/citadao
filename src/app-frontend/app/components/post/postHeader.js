import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';

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
			name = authorg.name;
			var submissions = authorg.submissions;
			if (submissions) {
				var submission = submissions[this.props.submission];
				if (submission) {
					var revisions = submission.revisions;
					if (revisions) {
						var revision = revisions[this.props.revision];
						if (revision) {
							console.log("timestamp: " + revision.timestamp);
							var date = new Date(revision.timestamp * 1000);
							time = date.toDateString();
						}
					}					
				}			
			}		
		}
			
		return (			
			<div style={this.props.headerStyle}>
				<span value={this.props.authorg} onClick={this.authorgNameClicked} style={{fontSize:'12pt', fontWeight:'bold', position:'absolute', left:'10'}}>{name} - {time}</span>
				<span onClick={this.infoButtonClicked} style={{fontSize:'8pt', position:'absolute', right:'10'}}>info...</span>
				<br />
				{this.state.showDetails && 
					<div>
						<span style={{fontSize:'8pt'}}>{this.props.authorg}</span><br />
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
  const { wallet, auths } = state;

  return {wallet, auths };
}

export default connect(mapStateToProps)(PostHeader)
