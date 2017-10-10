import appContracts from 'app-contracts';
import localWeb3 from "../helpers/web3Helper";
import { State } from 'slate';

import {
  getRevisionFromSwarm,
  getAccountInfo,
  getPostKey,
  getTotalPostCount,
  getNumReferences,
  getReferenceKey,
  getAccountPostKeyCount,
  getAuthorgPostKey,
  getRevisionTime,
  getSubmissionRevisions
} from '../api/getInkPostData'

import {
  getRevisionReactions,
  getAuthorgBioReactions,
  getAuthorgsFollowing,
  getFollowers
} from '../api/getCitadelPostData'

import {
  setWalletData
} from './contractPublicData'

export const ADD_POST_KEY = "ADD_POST_KEY";
export const addPostKey = (authorgAddress, submissionHash, revisionHash, timestamp) => {
  return {
    type: ADD_POST_KEY,
    data: {authAdd : authorgAddress, submissionHash, revisionHash, timestamp}
  }
}

export const SET_SUBMISSIONS = "SET_SUBMISSIONS";
export const setSubmissions = (data) => {
  return {
    type: SET_SUBMISSIONS,
    data: data
  }
}

export const SET_REVISION_SWARM_DATA = "SET_REVISION_SWARM_DATA";
export const setRevisionSwarmData = (authAdd, subHash, revHash, swarmRevTitle, swarmRevText) => {
  return {
    type: SET_REVISION_SWARM_DATA,
    data: {authAdd, subHash, revHash, swarmRevTitle, swarmRevText}
  }
}

export const SET_REFERENCE = "SET_REFERENCE";
export const setReference = (authAdd, subHash, revHash, refAuthAdd, refSubHash, refRevHash, index) => {
  return {
    type: SET_REFERENCE,
    data: {authAdd : authAdd, subHash : subHash, revHash : revHash, index : index, refKey: {authorgAddress : refAuthAdd, submissionHash : refSubHash, revisionHash : refRevHash}}
  }
}

export const SET_AUTHORG_INFO = "SET_AUTHORG_INFO";
export const setAuthorgInfo = (authAdd, bioRevisionHashes, bioRevisionTimestamps, bioLoadedIndex, revisionBio) => {  
  return {
    type: SET_AUTHORG_INFO,
    data: {authAdd : authAdd, bioRevisionHashes : bioRevisionHashes, bioRevisionTimestamps : bioRevisionTimestamps, bioLoadedIndex : bioLoadedIndex, bioRevision : revisionBio}
  }
}

export const SET_LOAD_STARTED = "SET_LOAD_STARTED";
export const setLoadStarted = (authAdd, subHash, revHash) => {
  return {
    type: SET_LOAD_STARTED,
    data: {authAdd: authAdd, subHash: subHash, revHash: revHash}
  }
}
export const SET_NAME_LOAD_STARTED = "SET_NAME_LOAD_STARTED";
export const setNameLoadStarted = (authAdd) => {
  return {
    type: SET_NAME_LOAD_STARTED,
    data: {authAdd: authAdd}
  }
}

export const SET_AUTH_SUB_REV_REFERENCE_COUNT = "SET_AUTH_SUB_REV_REFERENCE_COUNT";
export const setAuthSubRevReferenceCount = (authAdd, subHash, revHash, count) => {
  return {
    type: SET_AUTH_SUB_REV_REFERENCE_COUNT,
    data: {authAdd: authAdd, subHash: subHash, revHash: revHash, refCount:count}
  }
}

export const SET_AUTH_SUB_REV_REF_KEY = "SET_AUTH_SUB_REV_REF_KEY";
export const addAuthSubRevRefKey = (authAdd, subHash, revHash, refAuthAdd, refSubHash, refRevHash, timestamp) => {
  return {
    type: SET_AUTH_SUB_REV_REF_KEY,
    data: {authAdd: authAdd, subHash: subHash, revHash: revHash, refKey: {authAdd : refAuthAdd, submissionHash : refSubHash, revisionHash : refRevHash, timestamp : timestamp}}
  }
}

export const SET_REVISION_AUTHORG_NAME = "SET_REVISION_AUTHORG_NAME";
export const setRevisionAuthorgName = (authAdd, subHash, revHash, name) => {
  return {
    type: SET_REVISION_AUTHORG_NAME,
    data: {authAdd : authAdd, subHash : subHash, revHash : revHash, name: name}
  }
}

export const SET_REVISION_REACTIONS = "SET_REVISION_REACTIONS";
export const setRevisionReactions = (authAdd, subHash, revHash, reactions, count) => {
  return {
    type: SET_REVISION_REACTIONS,
    data: {authAdd : authAdd, subHash : subHash, revHash : revHash, reactions : reactions, reactionCount : count}
  }
}

export const SET_AUTHORG_BIO_REVISION_REACTIONS = "SET_AUTHORG_BIO_REVISION_REACTIONS";
export const setAuthorgBioRevisionReactions = (authAdd, revHash, reactions, count) => {
  return {
    type: SET_AUTHORG_BIO_REVISION_REACTIONS,
    data: {authAdd : authAdd, revHash : revHash, reactions : reactions, reactionCount : count}
  }
}

export const SET_REVISION_SECTION_RESPONSES = "SET_REVISION_SECTION_RESPONSES";
export const setRevisionSectionResponses = (authAdd, subHash, revHash, sectionIndex, responses) => {
  return {
    type: SET_REVISION_SECTION_RESPONSES,
    data: {authAdd : authAdd, subHash : subHash, revHash : revHash, sectionIndex : sectionIndex, responses : responses}
  }
}

export const SET_AUTHORG_POST_KEY_COUNT = "SET_AUTHORG_POST_KEY_COUNT";
export const setAuthorgPostKeyCount = (authAdd, count) => {
  return {
    type: SET_AUTHORG_POST_KEY_COUNT,
    data: {authAdd, count}
  }
}

export const SET_AUTHORG_POST_KEYS_LOADED_COUNT = "SET_AUTHORG_POST_KEYS_LOADED_COUNT";
export const setAuthorgPostKeysLoadedCount = (authAdd, loadedCount) => {
  return {
    type: SET_AUTHORG_POST_KEYS_LOADED_COUNT,
    data: {authAdd, loadedCount}
  }
}

export const SET_AUTHORG_FOLLOWS_AUTHORGS = "SET_AUTHORG_FOLLOWS_AUTHORGS";
export const setAuthorgFollowsAuthorgs = (authAdd, authorgs) => {
  //console.log("set authorg follows authorgs - " + authorgs);
  return {
    type: SET_AUTHORG_FOLLOWS_AUTHORGS,
    data: {authAdd, authorgs}
  }
}

export const SET_AUTHORG_FOLLOWERS = "SET_AUTHORG_FOLLOWERS";
export const setAuthorgFollowers = (authAdd, followers) => {
  return {
    type: SET_AUTHORG_FOLLOWERS,
    data: {authAdd, followers}
  }
}

export const SET_REVISION_TIME = "SET_REVISION_TIME";
export const setRevisionTime = (authAdd, subHash, revHash, revisionTime) => {
   return {
    type: SET_REVISION_TIME,
    data: {authAdd : authAdd, subHash : subHash, revHash : revHash, timestamp : revisionTime}
  }
}

export const SET_REVISION_HASHES = "SET_REVISION_HASHES";
export const setRevisionHashes = (authAdd, subHash, revisionHashes) => {
  console.log("setRevisionHashes");
  return {
    type: SET_REVISION_HASHES,
    data: {authAdd : authAdd, subHash : subHash, revisionHashes : revisionHashes}
  }
}

export const initializeNeededPosts = () => (dispatch, getState) => {
  const {ui} = getState().core;
  const {router} = getState();
  if(router.result.title === 'Home') {
    dispatch(initializeTestTypedRevisions());
  } else if (router.result.title === 'Post') {
    if (Object.keys(router.params).length == 3) {
      dispatch(loadPost(router.params["authorg"], router.params["subHash"], router.params["revHash"], undefined, true, true));
    }
  } else if (router.result.title === 'Account') {
    dispatch(loadUserData(router.params["account"], true, false, router.params["revHash"]));
  }
}


export const loadPost = (authorgAddress, submissionHash, revisionHash, timestamp = undefined, firstLevel = true, focusedPost = false) => (dispatch, getState) => {
  const {approvedReactions, network, auths} = getState().core;
  var alreadyLoaded = false;
  var authorgData = auths[authorgAddress];
  var keys = [];
  if (authorgData) {
    var submissionsData = authorgData.submissions;
    if (submissionsData) {
      var submissionData = submissionsData[submissionHash];
      if (submissionData) {
        var revisionsData = submissionData.revisions;
        if (revisionsData) {
          var revisionData = revisionsData[revisionHash];
          if (revisionData.loadStarted) {
            if (!focusedPost) { // ok to reload focusedPost again to get the new goodies
              alreadyLoaded = true;
            } 
          }
        }					
      }			
    }		
  }


  if (!alreadyLoaded) {
    dispatch(setLoadStarted(authorgAddress, submissionHash, revisionHash));
    if (!timestamp) {
      getRevisionTime(authorgAddress, submissionHash, revisionHash).then((revisionTime) => {
        dispatch(setRevisionTime(authorgAddress, submissionHash, revisionHash, revisionTime.timestamp))
      })
    } else {
      dispatch(setRevisionTime(authorgAddress, submissionHash, revisionHash, timestamp));
    }
    dispatch(addPostKey(authorgAddress, submissionHash, revisionHash, timestamp));
    return getRevisionFromSwarm(revisionHash, network.web3).then(result => {
    dispatch(setRevisionSwarmData(authorgAddress, 
                                  submissionHash, 
                                  revisionHash, 
                                  result.revisionSwarmTitle, 
                                  result.revisionSwarmText))
    var document = State.fromJSON(result.revisionSwarmText)
    if(document) {
      document.document.nodes.forEach(function(section) {    
          try {
            var json = JSON.parse(section.text);
            if(json) {
              if(json.reference) {
                dispatch(setReference(json.reference.authorg, json.reference.submissionHash, json.reference.revisionHash, authorgAddress, submissionHash, revisionHash, json.reference.sectionIndex));
                if (firstLevel) {
                  dispatch(loadPost(json.reference.authorg, json.reference.submissionHash, json.reference.revisionHash, json.reference.timestamp, -1, false));
                }
              }
            }
          } catch (e) {
            //console.error("error while loading: " + e);
          }
        })       
      }      

      dispatch(loadUserData(authorgAddress));
      getNumReferences(authorgAddress, submissionHash, revisionHash).then((refs) => {
        dispatch(setAuthSubRevReferenceCount(authorgAddress, submissionHash,revisionHash, refs.count));
        if (focusedPost) {
          for(var i = 0; i < refs.count; i++) {
            getReferenceKey(authorgAddress, submissionHash, revisionHash, i).then((result) => {
              //console.log("addAuthSubRevRefKey timestamp: " + result.timestamp);
              dispatch(addAuthSubRevRefKey(authorgAddress, submissionHash, revisionHash, result.refAuthAdd, result.refSubHash, result.refRevHash, result.timestamp))
              dispatch(loadPost(result.refAuthAdd, result.refSubHash, result.refRevHash, result.timestamp, false));
            })
          }
        }
      })
      dispatch(getReactions(authorgAddress, submissionHash, revisionHash, approvedReactions));
      dispatch(loadSubmissionRevisionHashList(authorgAddress, submissionHash));
    })
  }
}

export const loadSubmissionRevisionHashList = (authorgAddress, submissionHash) => (dispatch) => {
  getSubmissionRevisions(authorgAddress, submissionHash).then((result) => {
    console.log("dispatch setRevisionHashes - result.revisionHashes: " + result.revisionHashes);
    dispatch(setRevisionHashes(authorgAddress, submissionHash, result.revisionHashes))
  })
}

export const getReactions = (authorgAddress, submissionHash, revisionHash, approvedReactions) => (dispatch) => {
  getRevisionReactions(authorgAddress, submissionHash, revisionHash, approvedReactions).then((reactions) => {
    dispatch(setRevisionReactions(authorgAddress, submissionHash, revisionHash, reactions.revisionReactionReactors, reactions.reactionCount))
  })
}

export const loadAuthorgBioReactions = (authorgAddress, bioSubmissionHash, approvedAuthorgReactions) => (dispatch) => {
  //console.log("loadAuthorgBioReactions - approvedAuthorgReactions " + approvedAuthorgReactions)
  getAuthorgBioReactions(authorgAddress, bioSubmissionHash, approvedAuthorgReactions).then((reactions) => {
    dispatch(setAuthorgBioRevisionReactions(authorgAddress, bioSubmissionHash, reactions.revisionReactionReactors))
  })
}

export const loadUserData = (authorgAddress, focusedUser = false, userAccount = false, specificRev = undefined) => (dispatch, getState) => {
  const {auths, network, approvedAuthorgReactions} = getState().core;
  var userLoadStarted = false;
  var authorgData = auths [authorgAddress];
  if (authorgData) {
    if (authorgData.userLoadStarted || authorgData.name) {
      userLoadStarted = true;
    }
  }

  if (!userLoadStarted || focusedUser) {
    dispatch(setNameLoadStarted(authorgAddress));
    getAccountInfo(authorgAddress, network.web3, specificRev).then((info) => {
      dispatch(setAuthorgInfo(authorgAddress, info.bioRevisionHashes, info.bioRevisionTimestamps, info.bioLoadedIndex, info.revisionBio));
      console.log("dispatch. approvedAuthorgReactions: " + approvedAuthorgReactions);
      dispatch(loadAuthorgBioReactions(authorgAddress, info.bioRevisionHashes[info.bioLoadedIndex], approvedAuthorgReactions))
    });
    if (focusedUser) {
      getAccountPostKeyCount(authorgAddress).then((result) => {
        dispatch(setAuthorgPostKeyCount(authorgAddress, result.count));
        dispatch(setAuthorgPostKeysLoadedCount(authorgAddress, 0));
        dispatch(getNext10AuthorgPosts(authorgAddress));
      })
      getFollowers(authorgAddress).then((result) => {
        dispatch(setAuthorgFollowers(authorgAddress, result.followers));
        if (result.followers) {
          result.followers.forEach(function(authorg) {
            dispatch(loadUserData(authorg));
          })
        }
      })
      getAuthorgsFollowing(authorgAddress).then((result) => {
        dispatch(setAuthorgFollowsAuthorgs(authorgAddress, result.authorgsFollowing));
        if (result.authorgsFollowing) {
          result.authorgsFollowing.forEach(function(authorg) {
            dispatch(loadUserData(authorg, userAccount));
          })
        }
      })
    }
  }
}

export const initializeTestTypedRevisions = () => dispatch => {
  getTotalPostCount().then((result) => {
    dispatch(setWalletData({totalPostCount : result.totalPostCount, numPostsLoaded : 0}));
    dispatch(getNext10Posts());
  });
}

export const getNextFollowingPosts = () => (dispatch, getState) => {
  const {wallet} = getState().core;
  getAuthorgsFollowing(wallet.get('account')).then((result) => {
    dispatch(getNextPostsFromUsers(result.authorgsFollowing))
  })
}

export const getNextPostsFromUsers = (accounts) => (dispatch, getState) => {
  accounts.forEach(function(authorg) {
    dispatch(getNext10AuthorgPosts(authorg));
  })
}

export const getNext10AuthorgPosts = (account) => (dispatch, getState) => {
  const {auths} = getState().core;
  
    var numPostsLoaded2 = auths[account].postKeysLoadedCount;
    var totalPostCount =  auths[account].postKeyCount;
    
    var postsLoaded = 0;
    for(var i = numPostsLoaded2; i < numPostsLoaded2 + 10 && i < totalPostCount; i++) {
      var index = totalPostCount - i - 1;
      getAuthorgPostKey(account, index).then((result) => {
        dispatch(loadPost(result.authorgAddress, result.submissionHash, result.revisionHash, result.timestamp));
      })
      postsLoaded++;
    }
  
    dispatch(setAuthorgPostKeysLoadedCount(account, numPostsLoaded2 + postsLoaded));
}

export const getNext10Posts = () => (dispatch, getState) => {
  const {wallet} = getState().core;

  var numPostsLoaded2 = wallet.get('numPostsLoaded');
  var totalPostCount = wallet.get('totalPostCount');
  
  var postsLoaded = 0;
  for(var i = numPostsLoaded2; i < numPostsLoaded2 + 10 && i < totalPostCount; i++) {
    var index = totalPostCount - i - 1;
    getPostKey(index).then((result) => {
      dispatch(loadPost(result.authorgAddress, result.submissionHash, result.revisionHash, result.timestamp))
      
    })
    postsLoaded++;
  }

  dispatch(setWalletData({numPostsLoaded : numPostsLoaded2 + postsLoaded}))
}

export const setSelectedBioRevision = (selectedRevision) => (dispatch, getState) => {
  const {network} = getState().core;
  return getAccountBioRevision(selectedRevision, network.web3).then((revision) => {
    return dispatch(setWalletData({selectedBioRevision : selectedRevision, selectedBioRevisionValue : revision}))
  })
};

export const handleViewResponses = (responses) => (dispatch) => {
  return dispatch(setWalletData({selectedResponses : responses}))
}

export default {
  SET_SUBMISSIONS,
  SET_REVISION_SWARM_DATA,
  SET_REVISION_AUTHORG_NAME,
  SET_REVISION_REACTIONS,
  SET_REVISION_SECTION_RESPONSES,
  ADD_POST_KEY,
  SET_AUTHORG_INFO,
  SET_AUTH_SUB_REV_REFERENCE_COUNT,
  SET_AUTH_SUB_REV_REF_KEY,
  SET_REFERENCE,
  SET_LOAD_STARTED,
  SET_NAME_LOAD_STARTED,
  SET_AUTHORG_POST_KEY_COUNT,
  SET_AUTHORG_POST_KEYS_LOADED_COUNT,
  SET_AUTHORG_FOLLOWS_AUTHORGS,
  SET_AUTHORG_FOLLOWERS,
  SET_REVISION_TIME,
  SET_AUTHORG_BIO_REVISION_REACTIONS,
  SET_REVISION_HASHES,
  loadPost,
  handleViewResponses,
  getReactions,
  getNext10Posts
};
