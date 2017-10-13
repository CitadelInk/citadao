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
    'paragraph': (props) => {
      return <p {...props.attributes}>{props.children}</p>
    },
    'block-quote': props => <blockquote {...props.attributes}>{props.children}</blockquote>,
    'bulleted-list': props => <ul {...props.attributes}>{props.children}</ul>,
    'heading-one': props => <h1 {...props.attributes}>{props.children}</h1>,
    'heading-two': props => <h2 {...props.attributes}>{props.children}</h2>,
    'list-item': props => <li {...props.attributes}>{props.children}</li>,
    'numbered-list': props => <ol {...props.attributes}>{props.children}</ol>,
    link: (props) => {
        return (
          <a {...props.attributes} href={props.node.data.get('url')}>
            {props.children}
          </a>
        )
			},
			ref: (props) => {

				var value = {authorg : props.node.data.get('authorg'), submission : props.node.data.get('submission'), revision : props.node.data.get('revision')};
				
        return (
					<div width="100%" className={styles.embededPostStyle}>
						<Post width="100%" {...props.attributes} 
						embeded={true}
						authorg={props.node.data.get('authorg')} 
						submission={props.node.data.get('submission')} 
						revision={props.node.data.get('revision')} 
						sectionIndex={props.node.data.get('index')} />
					</div>
        )
      }
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

		var text = "";
		var reference;

		try {
			if(state.document && state.document.text && state.document.text !== "" && state.document.text.trim() != "") {
				text = state.document.text;
			} else {
				var authorg = this.props.section.data.get("authorg");
				var submission = this.props.section.data.get("submission");
				var revision = this.props.section.data.get("revision");
				var index = this.props.section.data.get("index");

				if(authorg) {
					reference = {authorg:authorg, submission:submission, revision:revision, index:index}
				}	
				showActions = false;

			}
		} catch(e) {
			//console.error("error while checking reference")
		}

		var section = (<div onClick={() => this.widgetClicked(reference)} className={styles.editor}><Editor readonly state={state} schema={schema} /></div>);
		var actions = (<PostSectionActions sectionResponses={this.props.sectionResponses} authorg={this.props.authorg} submissionHash={this.props.submissionHash} revisionHash={this.props.revisionHash} sectionIndex={this.props.sectionIndex} />);
		
		if (reference || !this.props.focusedPost) {
			showActions = false;
		}

		return (			
			<div  className={styles.sectionDiv}>
				{section}
				{showActions && 
					actions
				}
			</div>
		);
	}

	widgetClicked(value) {
		if (value && this.props.focusedPost) {
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
