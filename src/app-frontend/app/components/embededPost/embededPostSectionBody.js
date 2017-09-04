import React, { Component } from 'react';
import { connect } from 'react-redux';


class EmbededPostSectionBody extends Component {
	 constructor(props) {
		 super(props);
	}


	render() {
		const style = {
			maxHeight: '10em',
			lineHeight: '.5em',
			background:'#F0F0F0',
			width:'100%',
			overflow: 'hidden',
			textAlign:'left'
		}

		var auth = this.props.auths[this.props.authorg];
		var text = ["loading"];
		var title = "loading";
		if (auth) {
			var submissions = auth.submissions;
			if (submissions) {
				var submission = submissions[this.props.submission];
				if (submission) {
					var revisions = submission.revisions;
					if (revisions) {
						var revision = revisions[this.props.revision];
						if (revision) {
							text = revision.text;
							title = revision.title;
						}
					}					
				}			
			}			
		}
			
		return (			
			<div style={style}>
				<span style={{fontSize:'6pt'}}>{text[this.props.sectionIndex]}</span>
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, auths } = state;

  return {wallet, auths };
}

export default connect(mapStateToProps)(EmbededPostSectionBody)
