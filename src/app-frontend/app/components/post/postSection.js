import React, { PureComponent as Component } from 'react';
import { findDOMNode } from 'react-dom';

import { connect } from 'react-redux';
import PostSectionActions from './postSectionActions';
import Post from './post';
import { Editor } from 'slate-react';
import { Value, Document, Data, Block } from 'slate';
import initialState from './state.json';
import { List } from 'immutable';
import styles from './postSection.css';
import { Card } from 'material-ui';
import { push } from 'redux-little-router';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import actions from '../../actions';

const {
	gotoPost
} = actions;

class PostSection extends Component {

	 constructor(props) {
		 super(props);
		 this.widgetClicked = this.widgetClicked.bind(this);
	}


	render() {
		var reference;

		var node = this.props.section;
		if (node.data.get)  {
			var authorg = node.data.get("authorg");
			var submission = node.data.get("submission");
			var revision = node.data.get("revision");

			var index = node.data.get("index");

			if (authorg && submission && revision) {
				reference = {authorg, submission, revision};
				var embKey = authorg + "-" + submission + "-" + revision;
				if (this.props.embededPostTextMap) {
					var embText = this.props.embededPostTextMap.get(embKey).text;
					var embAuthorgName = this.props.embededPostTextMap.get(embKey).name;
					var embAuthorgAvatar = this.props.embededPostTextMap.get(embKey).avatar;
					var embTimestamp = this.props.embededPostTextMap.get(embKey).timestamp;
					var embRevHashes = this.props.embededPostTextMap.get(embKey).revisionHashes;
					var embReactionCount = this.props.embededPostTextMap.get(embKey).reactionCount;
					var embMentionCount = this.props.embededPostTextMap.get(embKey).mentionCount;

					if (embText) {
						var newState = Value.fromJSON(embText);
						if (newState.document && newState.document.nodes) {
							var embNodeText = newState.document.nodes.get(index);
							
			
							var nodeData = node.data.set('text', embNodeText);
							nodeData = nodeData.set('name', embAuthorgName);
							nodeData = nodeData.set('avatar', embAuthorgAvatar);
							nodeData = nodeData.set('timestamp', embTimestamp);
							nodeData = nodeData.set('revHashes', embRevHashes);
							nodeData = nodeData.set('reactionCount', embReactionCount);
							nodeData = nodeData.set('mentionCount', embMentionCount);
							node = node.set('data', nodeData);
						}
						
					}
				}
			}
		}


		var nodesList = List([node])
		var state = new Value({
			document: new Document({
				key: '123', // not sure how to get a correct key, really
				nodes: nodesList
			})
		});
		var showActions = true;

		var text = "";



		var section = (
			<div onClick={() => this.widgetClicked(reference)} className={styles.editor}>
				<Editor 
					readOnly 
					value={state} 
         	renderNode={this.renderNode}
          renderMark={this.renderMark} />
			</div>);
		var actions = (<PostSectionActions
              className={styles.actionsSection}
							section={this.props.section} 
							timestamp={this.props.timestamp} 
							revisionHashes={this.props.revisionHashes}
							authorgName={this.props.authorgName} 
							authorgAvatar={this.props.authorgAvatar} 
							sectionResponses={this.props.sectionResponses} 
							authorg={this.props.authorg} 
							submissionIndex={this.props.submissionIndex} 
							revisionHash={this.props.revisionHash} 
							sectionIndex={this.props.sectionIndex} />);
		
		if(this.props.focusedPost){				
			if(this.props.section.type == "ref") {
				showActions = false;
			} else if (this.props.section.type == "paragraph") {
				if (!state.document || !state.document.text || state.document.text == "" || state.document.text.trim() == "") {
					showActions = false;
				}
			}	
		} else {
			showActions = false;
		}

		if (showActions) {
			var referenceJson = {
				"reference" : {
					"authorg" : this.props.authorg,
					"submissionIndex" : this.props.submissionIndex,
					"revisionHash" : this.props.revisionHash,
					"sectionIndex" : this.props.sectionIndex,
					"text" : this.props.section,
					"name" : this.props.authorgName,
					"avatar" : this.props.authorgAvatar,
					"timestamp" : this.props.timestamp,
					"revHashes" : this.props.revisionHashes,
					"reactionCount" : this.props.reactionCount,
					"mentionCount" : this.props.mentionCount,
					"bountyCount" : this.props.bountyCount
				}
			}		
			var referenceString = JSON.stringify(referenceJson);

			return (
			<CopyToClipboard text={referenceString}
							 onCopy={() => this.setState({copied: true})}>
				<div ref={el => this.decoratedComponent = el} className={styles.sectionDiv}>
					{section}
					{showActions && 
						actions
					}
				</div>
			</CopyToClipboard>);
		} else {
			return (			
				<div ref={el => this.decoratedComponent = el} className={styles.sectionDiv}>
					{section}
					{showActions && 
						actions
					}
				</div>
			);
		}		
	}

	widgetClicked(value) {
		if (value && this.props.focusedPost) {
			this.props.dispatch(
				gotoPost(value.authorg, value.submission, value.revision)
			);
		}
	}




	/**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderNode = (props) => {
    const { attributes, children, node } = props
    switch (node.type) {
      case 'block-quote': return <blockquote className={styles.blockquote} {...attributes}>{children}</blockquote>
      case 'bulleted-list': return <ul {...attributes}>{children}</ul>
      case 'heading-one': return <h1 className={styles.h1} {...attributes}>{children}</h1>
      case 'heading-two': return <h2 className={styles.h2} {...attributes}>{children}</h2>
      case 'list-item': return <li {...attributes}>{children}</li>
      case 'numbered-list': return <ol {...attributes}>{children}</ol>
	  case 'image': return <img src={node.data.get('res')}/>			
	  case 'link': {
        return (
          <a {...props.attributes} href={props.node.data.get('url')}>
            {props.children}
          </a>
        )
      }
      case 'ref': {
        return (
          <div className={styles.embededPostStyle}>
          <Post {...props.attributes} 
			authorgName={props.node.data.get('name')}
			authorgAvatar={props.node.data.get('avatar')}
			embeded={true}
			text={props.node.data.get('text')}
			authorg={props.node.data.get('authorg')} 
			submission={props.node.data.get('submission')} 
			revision={props.node.data.get('revision')} 
			sectionIndex={props.node.data.get('index')}
			timestamp={props.node.data.get('timestamp')}
			revisionHashes={props.node.data.get('revHashes')}
			reactionCount={props.node.data.get('reactionCount')}
			mentionCount={props.node.data.get('mentionCount')}
			bountyCount={props.node.data.get('bountyCount')}/>
          </div>
        )
	  }
	  case 'paragraph': return <p className={styles.p} {...attributes}>{children}</p>
	}
  }

  /**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderMark = (props) => {
    const { children, mark } = props
    switch (mark.type) {
      case 'bold': return <strong>{children}</strong>
      case 'code': return <code>{children}</code>
      case 'italic': return <em>{children}</em>
      case 'underlined': return <u>{children}</u>
    }
  }
}

const mapStateToProps = state => {
  return { };
}

export default connect(mapStateToProps)(PostSection)