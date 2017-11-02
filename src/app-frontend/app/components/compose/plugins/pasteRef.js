import isUrl from 'is-url'
import toPascal from 'to-pascal-case'
import { Block } from 'slate';

/**
 * A Slate plugin to support embedded posts
 *
 * @param {Object} options
 *   @property {String} type
 *   @property {String} authorgAddress
 *   @property {String} submissionHash
 *   @property {String} revisionHash
 *   @property {String} sectionIndex
 *   @property {String} authorgName
 *   @property {String} authorgAvatar
 *   @property {String} collapseTo
 * @return {Object}
 */

function PasteRef(options = {}) {
  const {
    type = 'ref',
    authorgAddress = 'authorg',
    submissionHash = 'submission',
    revisionHash = 'revision',
    sectionIndex = 'index',
    sectionText = 'text',
    authorgName = 'name',
    authorgAvatar = 'avatar'
  } = options

  function unwrapRef(change) {
    change.unwrapBlock(type)
  }

  function wrapRef(change, authorg, submission, revision, index, text, name, avatar) {
    change.insertBlock({
      type,
      isVoid: true,
      data: { [authorgAddress]: authorg, [submissionHash]: submission, [revisionHash]: revision, [sectionIndex]: index, [sectionText]: text, [authorgName]: name, [authorgAvatar]: avatar },
    })
  }

  function addSpace(change) {
    change.insertText(" ")
  }

  return {
    onPaste(e, paste, change) {
      //console.warn("ref on paste")
      const { state } = change
      if (paste.type !== 'text' && paste.type !== 'html') return
      const { text, target } = paste

      try {
        //console.warn("try parse.")
        var json = JSON.parse(text);
        //console.warn("parsed")
        if (!json.reference) return;
        var section = json.reference.text;
        console.warn("section: " + Block.create(section))
        change.call(wrapRef, json.reference.authorg, json.reference.submissionHash, json.reference.revisionHash, json.reference.sectionIndex, Block.create(section), json.reference.name, json.reference.avatar);
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