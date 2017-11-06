
import { Editor } from 'slate-react';
import { Block, State } from 'slate';
import React from 'react';
import { connect } from 'react-redux';
import initialState from './state.json';
import styles from './composeRichText.css';
import classNames from 'classnames/bind';
import actions from '../../actions';
import { RaisedButton } from 'material-ui';
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

/**
 * Define the default node type.
 */

const DEFAULT_NODE = 'paragraph'

const defaultBlock = {
  type: DEFAULT_NODE,
  isVoid: false,
  data: {}
}

/**
 * Define a schema.
 *
 * @type {Object}
 */

const schema = {
  document: {
    nodes: [
      { types: ['paragraph',
                'image',
                'ref', 
                'list-item',
                'heading-one',
                'heading-two',
                'numbered-list', 
                'block-quote',
                'bulleted-list']}
    ]
  },
  blocks: [{
    'paragraph': (props) => {
      return <p className={styles.p} {...props.attributes}>{props.children}</p>
    },
    'block-quote': props => <blockquote className={styles.blockquote} {...props.attributes}>{props.children}</blockquote>,
    'bulleted-list': props => <ul {...props.attributes}>{props.children}</ul>,
    'heading-one': props => <h1 className={styles.h1} {...props.attributes}>{props.children}</h1>,
    'heading-two': props => <h2 className={styles.h2}  {...props.attributes}>{props.children}</h2>,
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
        sectionIndex={props.node.data.get('index')}/>
        </div>
      )
    }
  }],
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

const plugins = [
  PasteRef({
    type: 'ref',
    authorgAddress: 'authorg',
    submissionHash: 'submission',
    revisionHash: 'revision',
    authorgName: 'name',
    authorgAvatar: 'avatar',
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
 * The rich text example.
 *
 * @type {Component}
 */

class ComposeRich3Text extends React.Component {

  /**
   * Deserialize the initial editor state.
   *
   * @type {Object}
   */

   constructor(props) {
     super(props);
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

   componentWillMount() {
     this.setState({input: this.getState()});
   }

   componentWillUnmount() {
    var state = this.state.input;
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

  hasMark(type) {
    const state = this.state.input;
    if (state && state.activeMarks) {
      return state.activeMarks.some(mark => mark.type == type)
    }
  }

  /**
   * Check if the any of the currently selected blocks are of `type`.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasBlock(type) {
	  const state = this.state.input;
	  if (state && state.blocks) {
	  	return state.blocks.some(node => node.type == type)
	  } 
  }

  /**
   * On change, save the new `state`.
   *
   * @param {Change} change
   */
  onChange({ state }) {
    this.setState({input : state});
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
    if (state) {
      const change = state.change().toggleMark(type)
      this.onChange(change)
    }
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
    if (state && state.blocks) {
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
    } else if (this.props.submission) {
      btnText = "Revise Post";
    }
	  return (<RaisedButton primary className={styles.raisedButton} onClick={this.handleSubmitPost} label={btnText}/>);
  }


	handleSubmitPost(e) {
    var input = this.state.input;
    if(input) {
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
            state={this.state.input}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            schema={schema}
            placeholder={'Compose post...'}
            plugins={plugins}
            spellCheck
          />
        </div>
      </div>
    )
  }

  getState() {
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

const mapStateToProps = state => {
	const { wallet } = state.core;
  
	return { wallet };
}
  
export default connect(mapStateToProps)(ComposeRich3Text)