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
	}


	render() {

		const postStyle = {
				position:'relative',
				background:'#FFFFFF',
				maxHeight:'150px',
				width:'80%',
				overflow:'hidden',
				left:'10%',
				zIndex:'10000'
		}

		const headerStyle = {
			background:'#7FDBFF',
			borderTopLeftRadius: '15px',
			borderTopRightRadius: '15px',
			width:'100%',
			position:'relative',
			top:'0'
		}


		const bodyStyle = {
			background:'#FFFFFF',
			position:'relative',
			overflow:'hidden',
			width:'100%',
			top:'0px',
			fontSize:'10px'
		}

		const footerStyle = {
			position:'absolute',
			bottom:'0px',
			height: '20px',  
			width:'100%'
		}

			

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
			if(state.document && state.document.text) {
				text = state.document.text;
				var json = JSON.parse(state.document.text);
				if(json) {
					var reference = json.reference;
					if (reference) {
						
						section = (<div style={postStyle}><Post headerStyle={headerStyle} bodyStyle={bodyStyle} footerStyle={footerStyle} authorg={reference.authorg} submission={reference.submissionHash} revision={reference.revisionHash} sectionIndex={reference.sectionIndex} /></div>)
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
}

const mapStateToProps = state => {
  const { wallet } = state.core;

  return {wallet };
}

export default connect(mapStateToProps)(PostSection)
