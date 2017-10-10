
import { Editor } from 'slate-react';
import { State } from 'slate';
import React from 'react';
import { connect } from 'react-redux';
import initialState from './state.json';
import styles from './composeRichText.css';
import classNames from 'classnames/bind';
import actions from '../../actions';
import { RaisedButton } from 'material-ui';

const {
	setWalletData,
  submitPost,
  submitBio
} = actions;

let cx = classNames.bind(styles);

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

/**
 * The rich text example.
 *
 * @type {Component}
 */

class ComposeRichText extends React.Component {

  /**
   * Deserialize the initial editor state.
   *
   * @type {Object}
   */

   constructor(props) {
     super(props);
     this.state = {input : this.getState()}
	  this.hasMark = this.hasMark.bind(this);
	  this.hasBlock = this.hasBlock.bind(this);
	  this.onChange = this.onChange.bind(this);
	  this.onKeyDown = this.onKeyDown.bind(this);
	  this.onClickMark = this.onClickMark.bind(this);
	  this.onClickBlock = this.onClickBlock.bind(this);
	  this.renderToolbar = this.renderToolbar.bind(this);
	  this.renderMarkButton = this.renderMarkButton.bind(this);
	  this.renderBlockButton = this.renderBlockButton.bind(this);
	  this.renderEditor = this.renderEditor.bind(this);
	  this.getState = this.getState.bind(this);
	  this.renderSubmitPostButton = this.renderSubmitPostButton.bind(this);
	  this.handleSubmitPost = this.handleSubmitPost.bind(this);
   }
 

  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasMark(type) {
    const state = this.state.input;
    return state.activeMarks.some(mark => mark.type == type)
  }

  /**
   * Check if the any of the currently selected blocks are of `type`.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasBlock(type) {
	const state = this.state.input;
	if (state) {
		return state.blocks.some(node => node.type == type)
	} else {

	}
  }

  /**
   * On change, save the new `state`.
   *
   * @param {Change} change
   */

  onChange({ state }) {
    this.state.input = state;
    if (this.props.bio) {
      this.props.dispatch(setWalletData({bioTextInput : state}));
    } else {
      this.props.dispatch(setWalletData({postTextInput : state}));
    }
  }

  /**
   * On key down, if it's a formatting command toggle a mark.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   * @return {Change}
   */

  onKeyDown(e, data, change) {
    if (!data.isMod) return
    let mark

    switch (data.key) {
      case 'b':
        mark = 'bold'
        break
      case 'i':
        mark = 'italic'
        break
      case 'u':
        mark = 'underlined'
        break
      case '`':
        mark = 'code'
        break
      default:
        return
    }

    e.preventDefault()
    change.toggleMark(mark)
    return true
  }

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} e
   * @param {String} type
   */

  onClickMark(e, type) {
    e.preventDefault()
    const state = this.state.input;
    const change = state.change().toggleMark(type)
    this.onChange(change)
  }

  /**
   * When a block button is clicked, toggle the block type.
   *
   * @param {Event} e
   * @param {String} type
   */

  onClickBlock(e, type) {
    e.preventDefault()
    const state = this.state.input;
    const change = state.change()
    const { document } = state

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
      const isType = state.blocks.some((block) => {
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

  renderToolbar() {
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

  renderSubmitPostButton() {
    var btnText = "Submit Post";
    if(this.props.bio) {
      btnText = "Submit Bio";
    } 
	  return (<RaisedButton primary className={styles.raisedButton} onClick={this.handleSubmitPost} label={btnText}/>);
  }


	handleSubmitPost(e) {
    if(this.props.bio) {
      this.props.dispatch(submitBio());
    } else { 
      this.props.dispatch(submitPost());
    }
	}

  /**
   * Render a mark-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderMarkButton(type, icon) {
    const isActive = this.hasMark(type)
    const onMouseDown = e => this.onClickMark(e, type)

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

  renderBlockButton(type, icon) {
    const isActive = this.hasBlock(type)
    const onMouseDown = e => this.onClickBlock(e, type)

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

  renderEditor() {
    return (
      <div className={styles.editorContainer}>
        <Editor
          state={this.getState()}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          schema={schema}
          placeholder={'Compose post...'}
          spellCheck
        />
      </div>
    )
  }

  getState() {
    var input;
    if(this.props.bio) {
      input = this.props.wallet.get('bioTextInput');
    } else { 
      input = this.props.wallet.get('postTextInput');
    }
	  return input;
  }

}

const mapStateToProps = state => {
	const { wallet } = state.core;
  
	return { wallet };
}
  
export default connect(mapStateToProps)(ComposeRichText)