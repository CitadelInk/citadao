import isUrl from 'is-url'
import toPascal from 'to-pascal-case'
import { Block } from 'slate';
import { getEventTransfer } from 'slate-react'

/**
 * A Slate plugin to support embedded posts
 *
 * @param {Object} options
 *   @property {String} type
 *   @property {String} authorgAddress
 *   @property {String} submissionIndex
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
    submissionIndex = 'submission',
    revisionHash = 'revision',
    sectionIndex = 'index',
    sectionText = 'text',
    authorgName = 'name',
    authorgAvatar = 'avatar',
    postTimestamp = 'timestamp',
    revisionHashes = 'revHashes'
  } = options

  function unwrapRef(change) {
    change.unwrapBlock(type)
  }

  function wrapRef(change, 
                  authorg, 
                  submission, 
                  revision, 
                  index, 
                  text, 
                  name, 
                  avatar, 
                  timestamp,
                  revHashes) {
    change.insertBlock({
      type,
      isVoid: true,
      data: { [authorgAddress]: authorg, 
        [submissionIndex]: submission, 
        [revisionHash]: revision, 
        [sectionIndex]: index, 
        [sectionText]: text, 
        [authorgName]: name, 
        [authorgAvatar]: avatar, 
        [postTimestamp]: timestamp,
        [revisionHashes]: revHashes },
    })
  }

  function addSpace(change) {
    change.insertText(" ")
  }

  return {
    onPaste(event, change, editor) {
      const transfer = getEventTransfer(event)
      const { text, target } = transfer

      try {
        var json = JSON.parse(text);
        if (!json.reference) return;
        var section = json.reference.text;
        change.call(wrapRef, 
          json.reference.authorg, 
          json.reference.submissionIndex, 
          json.reference.revisionHash, 
          json.reference.sectionIndex, 
          Block.create(section), 
          json.reference.name, 
          json.reference.avatar,
          json.reference.timestamp,
          json.reference.revHashes);
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