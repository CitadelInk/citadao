import React, { Component } from 'react';
import { connect } from 'react-redux';
import PostSectionActions from './postSectionActions';
import Post from './post';
import { Editor } from 'slate-react';
import { State, Document } from 'slate';
import initialState from './state.json';
import { List } from 'immutable';
import styles from './postSection.css';
import { Card } from 'material-ui';
import { push } from 'redux-little-router';

import actions from '../../actions';
const {
	gotoPost
} = actions;

/**
 * Define the default node type.
 */

const DEFAULT_NODE = 'paragraph'

/**
 * Define a schema.
 *
 * @type {Object}
 */

const schema = {
  nodes: {
    'block-quote': props => <blockquote {...props.attributes}>{props.children}</blockquote>,
    'bulleted-list': props => <ul {...props.attributes}>{props.children}</ul>,
    'heading-one': props => <h1 {...props.attributes}>{props.children}</h1>,
    'heading-two': props => <h2 {...props.attributes}>{props.children}</h2>,
    'list-item': props => <li {...props.attributes}>{props.children}</li>,
    'numbered-list': props => <ol {...props.attributes}>{props.children}</ol>,
  },
  marks: {
    bold: {
      fontWeight: 'bold'
    },
    code: {
      fontFamily: 'monospace',
      backgroundColor: '#eee',
      padding: '3px',
      borderRadius: '4px'
    },
    italic: {
      fontStyle: 'italic'
    },
    underlined: {
      textDecoration: 'underline'
    }
  }
}

class PostSection extends Component {
	 constructor(props) {
		 super(props);
		 this.widgetClicked = this.widgetClicked.bind(this);
	}


	render() {
		var reference = false;

		var nodesList = List([this.props.section])
		var state = new State({
			document: new Document({
				nodes: nodesList
			})
		});
		var showActions = true;
		var section = (<div className={styles.editor}><Editor readonly state={state} schema={schema} /></div>);
		var text = "";
		try {
			if(state.document && state.document.text && state.document.text !== "" && state.document.text.trim() != "") {
				text = state.document.text;
				var json = JSON.parse(state.document.text);
				if(json) {
					var reference = json.reference;
					if (reference) {
						var value = {authorg : reference.authorg, submission : reference.submissionHash, revision : reference.revisionHash};
						section = (<div onClick={() => this.widgetClicked(value)} value={value} className={styles.embededPostStyle}><Post authorg={reference.authorg} submission={reference.submissionHash} revision={reference.revisionHash} sectionIndex={reference.sectionIndex} /></div>)
						reference = true;
					}
				}	
			} else {
				showActions = false;
			}
		} catch(e) {
			//console.error("error while checking reference")
		}

		var actions = (<PostSectionActions sectionResponses={this.props.sectionResponses} authorg={this.props.authorg} submissionHash={this.props.submissionHash} revisionHash={this.props.revisionHash} sectionIndex={this.props.sectionIndex} />);
		
		if (reference || !this.props.focusedPost) {
			showActions = false;
		}

		//console.log("showActions: " + showActions + " - text: " + text + " - actions: " + actions);

		return (			
			<div className={styles.sectionDiv}>
				{section}
				{showActions && 
					actions
				}
			</div>
		);
	}

	widgetClicked(value) {
		if (this.props.focusedPost) {
			this.props.dispatch(
				gotoPost(value.authorg, value.submission, value.revision)
			);
		}
	}
}

const mapStateToProps = state => {
  const { wallet, auths } = state.core;

  return {wallet, auths };
}

export default connect(mapStateToProps)(PostSection)
