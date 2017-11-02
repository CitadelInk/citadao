import React, { PureComponent as Component } from 'react';
import { findDOMNode } from 'react-dom';

import { connect } from 'react-redux';
import PostSectionActions from './postSectionActions';
import Post from './post';
import { Editor } from 'slate-react';
import { State, Document, Data, Block } from 'slate';
import initialState from './state.json';
import { List } from 'immutable';
import styles from './postSection.css';
import { Card } from 'material-ui';
import { push } from 'redux-little-router';

import actions from '../../actions';

const {
	gotoPost
} = actions;

const isMouseOverElement = ({ elem, e }) => {
  const { pageY, pageX } = e
  const { left, right, bottom, top } = elem.getBoundingClientRect()

  return pageX > left && pageX < right && pageY > top && pageY < bottom
}

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
      return <p className={styles.p} {...props.attributes}>{props.children}</p>
    },
    'block-quote': props => <blockquote className={styles.blockquote} {...props.attributes}>{props.children}</blockquote>,
    'bulleted-list': props => <ul {...props.attributes}>{props.children}</ul>,
    'heading-one': props => <h1 className={styles.h1} {...props.attributes}>{props.children}</h1>,
    'heading-two': props => <h2 className={styles.h2} {...props.attributes}>{props.children}</h2>,
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
						authorgName={props.node.data.get('authorgName')}
						authorgAvatar={props.node.data.get('authorgAvatar')}
						embeded={true}
						text={props.node.data.get('text')}
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
		 this.state = {
			 isHoveringOver: true
		 }
	}


	render() {
		var reference = false;

		var node = this.props.section;
		if (node.data.get)  {
			var authorg = node.data.get("authorg");
			var submission = node.data.get("submission");
			var revision = node.data.get("revision");

			var index = node.data.get("index");

			if (authorg && submission && revision) {
				var embKey = authorg + "-" + submission + "-" + revision;
				if (this.props.embededPostTextMap) {
					var embText = this.props.embededPostTextMap.get(embKey).text;
					var embAuthorgName = this.props.embededPostTextMap.get(embKey).name;
					var embAuthorgAvatar = this.props.embededPostTextMap.get(embKey).avatar;

					if (embText) {
						var newState = State.fromJSON(embText);
						if (newState.document && newState.document.nodes) {
							var embNodeText = newState.document.nodes.get(index);
							
			
							var nodeData = node.data.set('text', embNodeText);
							nodeData = nodeData.set('authorgName', embAuthorgName);
							nodeData = nodeData.set('authorgAvatar', embAuthorgAvatar);

							node = node.set('data', nodeData);
						}
						
					}
				}
			}
		}

		var nodesList = List([node])
		var state = new State({
			document: new Document({
				nodes: nodesList
			})
		});
		var showActions = true;

		var text = "";
		var reference;

		var section = (<div onClick={() => this.widgetClicked(reference)} className={styles.editor}><Editor readOnly state={state} schema={schema} /></div>);
		var actions = (<PostSectionActions showClipboard={this.state.isHoveringOver} section={this.props.section} authorgName={this.props.authorgName} authorgAvatar={this.props.authorgAvatar} sectionResponses={this.props.sectionResponses} authorg={this.props.authorg} submissionHash={this.props.submissionHash} revisionHash={this.props.revisionHash} sectionIndex={this.props.sectionIndex} />);
		if(this.props.focusedPost){
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
	
		} else {
			showActions = false;
		}

		return (			
			<div ref={el => this.decoratedComponent = el} className={styles.sectionDiv}>
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
  return { };
}

export default connect(mapStateToProps)(PostSection)
