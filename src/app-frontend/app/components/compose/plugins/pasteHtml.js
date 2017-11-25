import isUrl from 'is-url'
import toPascal from 'to-pascal-case'
import { Text } from 'slate';
import { getEventTransfer } from 'slate-react'
import Html from 'slate-html-serializer';
var url = require('is-url');

/**
 * A Slate plugin to support embedded posts
 *
 * @param {Object} options
 *   @property {String} type
 * @return {Object}
 */


/**
 * Tags to blocks.
 *
 * @type {Object}
 */
const BLOCK_TAGS = {
  p: 'paragraph',
  li: 'list-item',
  ul: 'bulleted-list',
  ol: 'numbered-list',
  blockquote: 'block-quote',
  pre: 'code',
  h1: 'heading-one',
  h2: 'heading-two',
  h3: 'heading-two',
  h4: 'heading-two',
  h5: 'heading-two',
  h6: 'heading-two'
}

/**
 * Tags to marks.
 *
 * @type {Object}
 */
const MARK_TAGS = {
  strong: 'bold',
  em: 'italic',
  u: 'underline',
  s: 'strikethrough',
  code: 'code'
}

/**
 * Serializer rules.
 *
 * @type {Array}
 */
const RULES = [
  {
    deserialize(el, next) {
      const block = BLOCK_TAGS[el.tagName.toLowerCase()]
      if (!block) return
      return {
        kind: 'block',
        type: block,
        nodes: next(el.childNodes)
      }
    }
  },
  {
    deserialize(el, next) {
      const mark = MARK_TAGS[el.tagName.toLowerCase()]
      if (!mark) return
      return {
        kind: 'mark',
        type: mark,
        nodes: next(el.childNodes)
      }
    }
  },
  {
    // Special case for code blocks, which need to grab the nested childNodes.
    deserialize(el, next) {
      if (el.tagName.toLowerCase() != 'pre') return
      const code = el.childNodes[0]
      const childNodes = code && code.tagName.toLowerCase() == 'code'
        ? code.childNodes
        : el.childNodes

      return {
        kind: 'block',
        type: 'code',
        nodes: next(childNodes)
      }
    }
  },
  {
    // Special case for images, to grab their src.
    deserialize(el, next) {
      if (el.tagName.toLowerCase() != 'img') return
      return {
        kind: 'block',
        type: 'image',
        isVoid: true,
        nodes: next(el.childNodes),
        data: {
          src: el.getAttribute('src')
        }
      }
    }
  },
  {
    // Special case for links, to grab their href.
    deserialize(el, next) {
      if (el.tagName.toLowerCase() != 'a') return
      return {
        kind: 'inline',
        type: 'link',
        nodes: next(el.childNodes),
        data: {
          href: el.getAttribute('href')
        }
      }
    }
  },
  {
    deserialize(el, next) {
      if (el.tagName.toLowerCase() != 'span') return
      console.log("el: " + el)
      var text = el.innerText      
      var textBlocks = text.split('\n');
      
      var nodes = [];
      textBlocks.forEach(function(block) {
        var textLeaves = block.split(' ');
        textLeaves.forEach(function(leaf) {
          //console.log("LEAF: " + leaf)
          if (url(leaf)) {
              nodes.push({
                  "kind":"inline",
                  "type":"link",
                  "data":{"url" : leaf},
                  "nodes":[{
                      "kind":"text",
                      "leaves":[{
                          "kind":"leaf",
                          "marks":[],
                          "text": leaf
                      }]
                  }]
              })
              nodes.push({
                  "kind":"text",
                  "leaves":[{
                      "kind":"leaf",
                      "marks":[],
                      "text": " "
                  }]
              })
          } else if (leaf.trim() !== '') {
              nodes.push({
                  "kind":"text",
                  "leaves":[{
                      "kind":"leaf",
                      "marks":[],
                      "text": leaf + " "
                  }]
              })
          }        
        })
      })      

      return {
        kind: 'inline',
        type: 'text',
        nodes: nodes
      }

    }
  }
]

/**
 * Create a new HTML serializer with `RULES`.
 *
 * @type {Html}
 */
const serializer = new Html({ rules: RULES })

function PasteHtml() {


  return {
    onPaste(event, change, editor) {
      console.log("onPaste.")
      const transfer = getEventTransfer(event)
      if (transfer.type != 'html') return
      console.log("the html is: " + transfer.html)
      const { document } = serializer.deserialize(transfer.html)
      change.insertFragment(document)
      console.log("about to return true.")
      return true
    }
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default PasteHtml