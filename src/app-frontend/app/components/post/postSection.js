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

import actions from '../../actions';

const {
	gotoPost
} = actions;

const isMouseOverElement = ({ elem, e }) => {
  const { pageY, pageX } = e
  const { left, right, bottom, top } = elem.getBoundingClientRect()

  return pageX > left && pageX < right && pageY > top && pageY < bottom
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
					var embTimestamp = this.props.embededPostTextMap.get(embKey).timestamp;
					var embRevHashes = this.props.embededPostTextMap.get(embKey).revisionHashes;

					if (embText) {
						var newState = Value.fromJSON(embText);
						if (newState.document && newState.document.nodes) {
							var embNodeText = newState.document.nodes.get(index);
							
			
							var nodeData = node.data.set('text', embNodeText);
							nodeData = nodeData.set('name', embAuthorgName);
							nodeData = nodeData.set('avatar', embAuthorgAvatar);
							nodeData = nodeData.set('timestamp', embTimestamp);
							nodeData = nodeData.set('revHashes', embRevHashes);
							node = node.set('data', nodeData);
						}
						
					}
				}
			}
		}


		var nodesList = List([node])
		var state = new Value({
			document: new Document({
				key: '123',
				nodes: nodesList
			})
		});
		//var state = Value.create(node);
		var showActions = true;

		var text = "";
		var reference;

		var section = (
			<div onClick={() => this.widgetClicked(reference)} className={styles.editor}>
				<Editor 
					//readOnly 
					value={state} 
          renderNode={this.renderNode}
          renderMark={this.renderMark} />
			</div>);
		var actions = (<PostSectionActions 
							showClipboard={this.state.isHoveringOver} 
							section={this.props.section} 
							timestamp={this.props.timestamp} 
							revisionHashes={this.props.revisionHashes}
							authorgName={this.props.authorgName} 
							authorgAvatar={this.props.authorgAvatar} 
							sectionResponses={this.props.sectionResponses} 
							authorg={this.props.authorg} 
							submissionHash={this.props.submissionHash} 
							revisionHash={this.props.revisionHash} 
							sectionIndex={this.props.sectionIndex} />);
		
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




	/**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderNode = (props) => {
    const { attributes, children, node } = props
    switch (node.type) {
      case 'block-quote': return <blockquote {...attributes}>{children}</blockquote>
      case 'bulleted-list': return <ul {...attributes}>{children}</ul>
      case 'heading-one': return <h1 {...attributes}>{children}</h1>
      case 'heading-two': return <h2 {...attributes}>{children}</h2>
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
		  revisionHashes={props.node.data.get('revHashes')}/>
          </div>
        )
      }
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