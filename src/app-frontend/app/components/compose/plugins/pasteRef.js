import isUrl from 'is-url'
import toPascal from 'to-pascal-case'

/**
 * A Slate plugin to support embedded posts
 *
 * @param {Object} options
 *   @property {String} type
 *   @property {String} authorgAddress
 *   @property {String} submissionHash
 *   @property {String} revisionHash
 *   @property {String} sectionIndex
 *   @property {String} collapseTo
 * @return {Object}
 */

function PasteRef(options = {}) {
  const {
    type = 'ref',
    authorgAddress = 'authorg',
    submissionHash = 'submission',
    revisionHash = 'revision',
    sectionIndex = 'index'
  } = options

  function unwrapRef(change) {
    change.unwrapBlock(type)
  }

  function wrapRef(change, authorg, submission, revision, index) {
    change.insertBlock({
      type,
      isVoid: true,
      data: { [authorgAddress]: authorg, [submissionHash]: submission, [revisionHash]: revision, [sectionIndex]: index },
    })
  }

  function addSpace(change) {
    change.insertText(" ")
  }

  return {
    onPaste(e, paste, change) {
      const { state } = change
      if (paste.type !== 'text' && paste.type !== 'html') return
      const { text, target } = paste

      try {
        var json = JSON.parse(text);
        if (!json.reference) return;
        change.call(wrapRef, json.reference.authorg, json.reference.submissionHash, json.reference.revisionHash, json.reference.sectionIndex);
      } catch (e) {
        console.log("caught - e: " + e);
        return;
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

export default PasteRef