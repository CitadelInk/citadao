import isUrl from 'is-url'
import toPascal from 'to-pascal-case'

/**
 * A Slate plugin to add soft breaks on return.
 *
 * @param {Object} options
 *   @property {String} type
 *   @property {String} hrefProperty
 *   @property {String} collapseTo
 * @return {Object}
 */

function PasteLink(options = {}) {
  const {
    type = 'link',
    hrefProperty = 'href',
  } = options

  function hasLinks(state) {
    return state.inlines.some(inline => inline.type == type)
  }

  function unwrapLink(change) {
    change.unwrapInline(type)
  }

  function wrapLink(change, href) {
    change.wrapInline({
      type,
      data: { [hrefProperty]: href },
    })
  }

  return {
    onPaste(e, paste, change) {
      const { state } = change
      if (paste.type !== 'text' && paste.type !== 'html') return
      if (!isUrl(paste.text)) return
      console.log("yes is paste");
      const { text } = paste

      if (state.isCollapsed) {
        const { startOffset } = state
        change.insertText(text).moveOffsetsTo(startOffset, startOffset + text.length)
      }

      else if (hasLinks(state)) {
        change.call(unwrapLink)
      }

      change.call(wrapLink, text)

      if (options.collapseTo) {
        change[`collapseTo${toPascal(options.collapseTo)}`]()
      }

      return change
    }
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default PasteLink