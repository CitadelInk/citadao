
import { Editor } from 'slate-react';
import InsertImages from './plugins/dragAndDropImages/'
import { Value } from 'slate';

import React from 'react';
import { connect } from 'react-redux';
import initialValue from './state.json';
import { isKeyHotkey } from 'is-hotkey';
import actions from '../../actions';
import { RaisedButton } from 'material-ui';
import styles from './composeRichText.css';
import classNames from 'classnames/bind';
import PasteLink from './plugins/pasteLink';
import PasteRef from './plugins/pasteRef';
import Post from '../post/post';

const {
	setWalletData,
  submitPost,
  submitRevision,
  submitBio
} = actions;

let cx = classNames.bind(styles);

// Add the plugin to your set of plugins...
const plugins = [
  InsertImages({
    insertImage: (transform, file, editor) => {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        var res = reader.result;
        transform.insertBlock({
          type: 'image',
          isVoid: true,
          data: { res }
        })
        editor.onChange(transform)
      })
      reader.readAsDataURL(file)      
    }
  }),
  PasteRef({
    type: 'ref',
    collapseTo: 'end',
    collapseWhat: 'next'
  }),
  PasteLink({
    type: 'link',
    hrefProperty: 'url',
    collapseTo: 'end'
  })  
]

/**
 * Define the default node type.
 *
 * @type {String}
 */

const DEFAULT_NODE = 'paragraph'

/**
 * Define hotkey matchers.
 *
 * @type {Function}
 */

const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')
const isCodeHotkey = isKeyHotkey('mod+`')

/**
 * The rich text example.
 *
 * @type {Component}
 */

class ComposeRichText extends React.Component {

  /**
   * Deserialize the initial editor value.
   *
   * @type {Object}
   */

   state = {
     value : Value.fromJSON(initialValue)
   }
  componentWillMount = () => {
    this.setState({value: this.getState()});
  }

  componentWillUnmount = () => {
   var state = this.state.value;
   if (this.props.bio) {
     this.props.dispatch(setWalletData({bioTextInput : state}));
   } else if (this.props.submission) {
     this.props.dispatch(setWalletData({reviseSubmissionInput : state}));
   } else {
     this.props.dispatch(setWalletData({postTextInput : state}));
   }
  }

  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasMark = (type) => {
    const { value } = this.state
    if (value && value.activeMarks) {
      return value.activeMarks.some(mark => mark.type == type)
    }
  }

  /**
   * Check if the any of the currently selected blocks are of `type`.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasBlock = (type) => {
    const { value } = this.state
    if (value && value.activeMarks) {
      return value.blocks.some(node => node.type == type)
    }
  }

  /**
   * On change, save the new `value`.
   *
   * @param {Change} change
   */

  onChange = ({ value }) => {
    this.setState({ value })
  }

  /**
   * On key down, if it's a formatting command toggle a mark.
   *
   * @param {Event} event
   * @param {Change} change
   * @return {Change}
   */

  onKeyDown = (event, change) => {
    let mark

    if (isBoldHotkey(event)) {
      mark = 'bold'
    } else if (isItalicHotkey(event)) {
      mark = 'italic'
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined'
    } else if (isCodeHotkey(event)) {
      mark = 'code'
    } else {
      return
    }

    event.preventDefault()
    change.toggleMark(mark)
    return true
  }

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickMark = (event, type) => {
    event.preventDefault()
    const { value } = this.state
    const change = value.change().toggleMark(type)
    this.onChange(change)
  }

  /**
   * When a block button is clicked, toggle the block type.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickBlock = (event, type) => {
    event.preventDefault()
    const { value } = this.state
    const change = value.change()
    const { document } = value

    // Handle everything but list buttons.
    if (type != 'bulleted-list' && type != 'numbered-list') {
      const isActive = this.hasBlock(type)
      const isList = this.hasBlock('list-item')

      if (isList) {
        change
          .setBlock(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      }

      else {
        change
          .setBlock(isActive ? DEFAULT_NODE : type)
      }
    }

    // Handle the extra wrapping required for list buttons.
    else {
      const isList = this.hasBlock('list-item')
      const isType = value.blocks.some((block) => {
        return !!document.getClosest(block.key, parent => parent.type == type)
      })

      if (isList && isType) {
        change
          .setBlock(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else if (isList) {
        change
          .unwrapBlock(type == 'bulleted-list' ? 'numbered-list' : 'bulleted-list')
          .wrapBlock(type)
      } else {
        change
          .setBlock('list-item')
          .wrapBlock(type)
      }
    }

    this.onChange(change)
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    return (
      <div className={styles.richTextContainer}>
        {this.renderToolbar()}
        {this.renderEditor()}
      </div>
    )
  }

  /**
   * Render the toolbar.
   *
   * @return {Element}
   */

  renderToolbar = () => {
    var menu = styles.menu;
    var toolbarMenu = styles.toolbarMenu;
    var classNames = cx({
      menu: true,
      toolbarMenu:true
    })
    return (
      <div className={styles.toolbarContainer}>
        <div className={classNames}>
          {this.renderMarkButton('bold', 'format_bold')}
          {this.renderMarkButton('italic', 'format_italic')}
          {this.renderMarkButton('underlined', 'format_underlined')}
          {this.renderMarkButton('code', 'code')}
          {this.renderBlockButton('heading-one', 'looks_one')}
          {this.renderBlockButton('heading-two', 'looks_two')}
          {this.renderBlockButton('block-quote', 'format_quote')}
          {this.renderBlockButton('numbered-list', 'format_list_numbered')}
          {this.renderBlockButton('bulleted-list', 'format_list_bulleted')}
        </div>
        <div className={styles.postButton}>
          {this.renderSubmitPostButton()}
        </div>
      </div>
    )
  }


  renderSubmitPostButton = () => {
    var btnText = "Submit Post";
    if(this.props.bio) {
      btnText = "Submit Bio";
    } else if (this.props.submission) {
      btnText = "Revise Post";
    }
	  return (<RaisedButton primary className={styles.raisedButton} onClick={this.handleSubmitPost} label={btnText}/>);
  }


	handleSubmitPost = (e) => {
    var input = this.state.value;
    if(input) {
      console.log("input: " + input);
      console.log(JSON.stringify(input));
      if(this.props.bio) {
        this.props.dispatch(submitBio(input));
      } else if(this.props.submission) {
        this.props.dispatch(submitRevision(input, this.props.submission));
      } else { 
        this.props.dispatch(submitPost(input));
      }
    }
	}

  /**
   * Render a mark-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type)
    const onMouseDown = event => this.onClickMark(event, type)

    return (
      <span className={styles.button} onMouseDown={onMouseDown} data-active={isActive}>
        <span className="material-icons">{icon}</span>
      </span>
    )
  }

  /**
   * Render a block-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderBlockButton = (type, icon) => {
    const isActive = this.hasBlock(type)
    const onMouseDown = event => this.onClickBlock(event, type)

    return (
      <span className={styles.button} onMouseDown={onMouseDown} data-active={isActive}>
        <span className="material-icons">{icon}</span>
      </span>
    )
  }

  /**
   * Render the Slate editor.
   *
   * @return {Element}
   */

  renderEditor = () => {
    var style = {
      'maxHeight' : this.props.height,
      'position':'relative',
      'overflowY':'scroll',
      'overflowX':'hidden',
      'backgroundColor' : "#FFFFFF"
    }
    var outerStyle = {
      'height' : this.props.height,
      'backgroundColor' : "#F0F0F0"
    }
    return (
      <div style={outerStyle}>
        <div style={style}>
          <Editor
            placeholder="Enter some rich text..."
            plugins={plugins}
            value={this.state.value}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            renderNode={this.renderNode}
            renderMark={this.renderMark}
            spellCheck
          />
        </div>
      </div>
    )
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
      case 'image': {
        return <img src={node.data.get('res')}/>
      }
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

  getState = () => {
    var input;
    if(this.props.bio) {
      input = this.props.wallet.get('bioTextInput');
    } else if(this.props.submission) {
      input = this.props.wallet.get('reviseSubmissionInput');
    } else { 
      input = this.props.wallet.get('postTextInput');
    }
	  return input;
  }

}

/**
 * Export.
 */

const mapStateToProps = state => {
	const { wallet } = state.core;
  
	return { wallet };
}
  
export default connect(mapStateToProps)(ComposeRichText)
