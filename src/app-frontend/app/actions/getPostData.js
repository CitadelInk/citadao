import appContracts from 'app-contracts';
import localWeb3 from "../helpers/web3Helper";
import { Value } from 'slate';

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
  getSubmissionRevisions,
  //getAllReferences
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

import {
  loadPostResponseRequests,
  loadResponseRequestsCreated,
  loadResponseRequestsReceived
} from './responseRequestActions'

export const ADD_POST_KEY = "ADD_POST_KEY";
export const addPostKey = (authorgAddress, submissionHash, revisionHash, timestamp) => {
  return {
    type: ADD_POST_KEY,
    data: {authAdd : authorgAddress, submissionHash, revisionHash, timestamp}
  }
}

export const SET_FOCUSED_POST_LOAD_BEGIN = "SET_FOCUSED_POST_LOAD_BEGIN";
export const setFocusedPostLoadBegin = (authAdd, subHash, revHash) => {
  return {
    type: SET_FOCUSED_POST_LOAD_BEGIN,
    data: {authAdd, subHash, revHash}
  }
}

export const SET_FOCUSED_POST_LOAD_FINISHED = "SET_FOCUSED_POST_LOAD_FINISHED";
export const setFocusedPostLoadFinished = (authAdd, subHash, revHash) => {
  return {
    type: SET_FOCUSED_POST_LOAD_FINISHED,
    data: {authAdd, subHash, revHash}
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
    data: {authAdd : authAdd, subHash : subHash, revHash : revHash, index : index, refKey: {authAdd : refAuthAdd, submissionHash : refSubHash, revisionHash : refRevHash}}
  }
}

export const SET_EMBEDED_POST_KEYS = "SET_EMBEDED_POST_KEYS";
export const setEmbededPostKeys = (authAdd, subHash, revHash, embPostKeys) => {
  return {
    type: SET_EMBEDED_POST_KEYS,
    data: {authAdd, subHash, revHash, embPostKeys}
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
    data: {authAdd, subHash, revHash, timestamp : revisionTime}
  }
}

export const SET_REVISION_HASHES = "SET_REVISION_HASHES";
export const setRevisionHashes = (authAdd, subHash, revisionHashes) => {
  return {
    type: SET_REVISION_HASHES,
    data: {authAdd : authAdd, subHash : subHash, revisionHashes : revisionHashes}
  }
}

export const SET_SELECTED_RESPONSES = "SET_SELECTED_RESPONSES";
export const setSelectedResponses = (responses) => {
  return {
    type: SET_SELECTED_RESPONSES,
    data: {responses}
  }
}

export const ADD_EMBEDED_POST_KEY_MAPPING = "ADD_EMBEDED_POST_KEY_MAPPING";
export const addEmbededPostMapping = (authAdd, subHash, revHash, embKey, embResult) => {
  return {
    type: ADD_EMBEDED_POST_KEY_MAPPING,
    data: {authAdd, subHash, revHash, embKey, embResult}
  }
}

export const initializeNeededPosts = () => (dispatch, getState) => {
  const {ui} = getState().core;
  const {router} = getState();
  if(router.result.title === 'Home') {
    return dispatch(initializeTestTypedRevisions());
  } else if (router.result.title === 'Post') {
    if (Object.keys(router.params).length == 3) {
      return dispatch(doFocusedLoad(router.params["authorg"], router.params["subHash"], router.params["revHash"], undefined, true));
    }
  } else if (router.result.title === 'Account') {
    return dispatch(loadUserData(router.params["account"], true, false, router.params["revHash"]));
  } else {
    return dispatch(initializeTestTypedRevisions());
  }
}

export const doBasicLoad = (authorgAddress, submissionHash, revisionHash, timestamp = undefined, firstLevel = true) => (dispatch, getState) => {
  const {network} = getState().core;

  return new Promise((res, rej) => {
    getSubmissionRevisions(authorgAddress, submissionHash).then((revHashResult) => {
    var revisionHashes = revHashResult.revisionHashes;
      getRevisionFromSwarm(revisionHash, network.web3).then(result => {
        var resJson = result.revisionSwarmText;
        // backwards compatibility with old Slate format
        if (resJson.kind === "state") {
          resJson.kind = "value";
          if (resJson.document.nodes) {
            resJson.document.nodes.forEach(function(node, index) {
              if (node.nodes) {
                node.nodes.forEach(function(innerNode, index) {
                  if (innerNode.kind === "text") {
                    if (innerNode.ranges) {
                      innerNode.ranges.forEach(function(range, index) {
                        range.kind = "leaf";
                      })
                      innerNode.leaves = innerNode.ranges;
                    }
                  }
                })
              }
            })
          }
        }

        var document = Value.fromJSON(resJson)
        if(document) {        

          var references = [];
          var refLoadPromises = [];
          document.document.nodes.forEach(function(section) {   
            var refAuthorg = section.data.get("authorg");
            var refSubmission = section.data.get("submission");
            var refRevision = section.data.get("revision");
            var index = section.data.get("index");
            if(refAuthorg && refSubmission && refRevision) {
              references.push({refAuthorg, refSubmission, refRevision, index});
              if (firstLevel) {
                refLoadPromises.push(dispatch(doUnfocusedLoad(refAuthorg, refSubmission, refRevision, undefined, false, false)));
              }           
            }  
          })
          Promise.all(refLoadPromises).then((results) => {
          
            var timePromise = [];
            if (!timestamp) {
              timePromise.push(getRevisionTime(authorgAddress, submissionHash, revisionHash))
            }
            Promise.all(timePromise).then((time) => {
              if (time && time.length > 0) {
                timestamp = time[0].timestamp;
              }

              dispatch(loadMiniUserData(authorgAddress)).then((userResult) => {
                dispatch(setRevisionSwarmData(authorgAddress, 
                  submissionHash, 
                  revisionHash, 
                  result.revisionSwarmTitle, 
                  resJson));
                dispatch(setRevisionTime(authorgAddress, submissionHash, revisionHash, timestamp));
                references.forEach(function(ref) {
                  dispatch(setReference(ref.refAuthorg, ref.refSubmission, ref.refRevision, authorgAddress, submissionHash, revisionHash, ref.index));
                })
                if (results) {
                  results.forEach(function(promiseResult) {
                    dispatch(addEmbededPostMapping(authorgAddress, submissionHash, revisionHash, promiseResult.postKey, {text : promiseResult.result.revisionSwarmText, name : promiseResult.userResult.name, avatar : promiseResult.userResult.avatar, timestamp : promiseResult.timestamp, revisionHashes : promiseResult.revisionHashes}))
                  })
                }
                res({result, userResult, revisionHashes, references, timestamp})
              })
            })
          })
        }       
      })
    })
  })
}

export const doUpdateLoad = (authorgAddress, submissionHash, revisionHash, timestamp = undefined, firstLevel = true) => (dispatch, getState) => {
  const {approvedReactions} = getState().core;
  var promiseList = [];
  return new Promise((res, rej) => {
    Promise.all([
      dispatch(getReactions(authorgAddress, submissionHash, revisionHash, approvedReactions)),
      dispatch(loadSubmissionRevisionHashList(authorgAddress, submissionHash)),
      getNumReferences(authorgAddress, submissionHash, revisionHash)
    ]).then((refs) => {
      dispatch(setAuthSubRevReferenceCount(authorgAddress, submissionHash,revisionHash, refs[2].count));
      res({count : refs.count});
    })
  })
}

var unfocusedLoadPromises = new Map();

export const doUnfocusedLoad = (authorgAddress, submissionHash, revisionHash, timestamp = undefined, firstLevel = true) => (dispatch, getState) => {
  var key = authorgAddress +"-"+ submissionHash + "-" + revisionHash;
  if (unfocusedLoadPromises.has(key)) {
    console.log("doUnfocusedLoad already in progress/complete.")
    return unfocusedLoadPromises.get(key);
  }
  var promise = new Promise((res, rej) => {

    var promiseList = [];
    promiseList.push(dispatch(doBasicLoad(authorgAddress, submissionHash, revisionHash, timestamp, firstLevel)));
    promiseList.push(dispatch(doUpdateLoad(authorgAddress, submissionHash, revisionHash, timestamp, firstLevel)));

    Promise.all(
     [...promiseList]
    ).then(([basicResult, updateResult]) => {
      //TODO: get rev hashes via doUpdateLoad instead of crap I added to doBasicLoad
      res({result : basicResult.result, userResult : basicResult.userResult, postKey : key, timestamp : basicResult.timestamp, revisionHashes : basicResult.revisionHashes})
    })
  })
  unfocusedLoadPromises.set(key, promise);
  return promise;
}

export const doDetailLoad = (authorgAddress, submissionHash, revisionHash, timestamp = undefined, firstLevel = true, focusedPost = false) => (dispatch, getState) => {
  return new Promise((res, rej) =>{
    getNumReferences(authorgAddress, submissionHash, revisionHash).then((refs) => {
      dispatch(setAuthSubRevReferenceCount(refs));
      var refPromises = [];
      for(var i = 0; i < refs.count; i++) {
        refPromises.push(dispatch(asyncLoadRef(authorgAddress, submissionHash, revisionHash, i)));
      }
      Promise.all([...refPromises, dispatch(loadPostResponseRequests(authorgAddress, submissionHash, revisionHash))])
      .then(() => {
        console.log("doDetailLoad result.")
        res({done : true})
      })
    })    
  }) 
}

export const doFocusedLoad = (authorgAddress, submissionHash, revisionHash, timestamp = undefined, firstLevel = true) => (dispatch, getState) => {
  console.info("doFocusedLoad - user: " + authorgAddress + " - subHash: " + submissionHash + " - revHash: " + revisionHash);
  dispatch(setFocusedPostLoadBegin(authorgAddress, submissionHash, revisionHash));
  return new Promise((res, rej) => {
    var promiseList = [];
    promiseList.push(dispatch(doBasicLoad(authorgAddress, submissionHash, revisionHash, timestamp, true)));
    promiseList.push(dispatch(doUpdateLoad(authorgAddress, submissionHash, revisionHash, timestamp, true)));
    promiseList.push(dispatch(doDetailLoad(authorgAddress, submissionHash, revisionHash, timestamp, true)))

    Promise.all(
      promiseList
    ).then(() => {
      dispatch(setFocusedPostLoadFinished(authorgAddress, submissionHash, revisionHash));
      res({done : true})
    })
  })
  
}

export const asyncLoadRef = (authorgAddress, submissionHash, revisionHash, index) => (dispatch) => {
  return new Promise((res,rej) => {
    getReferenceKey(authorgAddress, submissionHash, revisionHash, index).then((result) => {
      dispatch(doUnfocusedLoad(result.refAuthAdd, result.refSubHash, result.refRevHash, result.timestamp, true, false)).then(() => {
        dispatch(addAuthSubRevRefKey(authorgAddress, submissionHash, revisionHash, result.refAuthAdd, result.refSubHash, result.refRevHash, result.timestamp))
        res({done:true})
      })
    })
  });
}

export const loadSubmissionRevisionHashList = (authorgAddress, submissionHash) => (dispatch) => {
  return getSubmissionRevisions(authorgAddress, submissionHash).then((result) => {
    dispatch(setRevisionHashes(authorgAddress, submissionHash, result.revisionHashes))
  })
}

export const getReactions = (authorgAddress, submissionHash, revisionHash, approvedReactions) => (dispatch) => {
  return getRevisionReactions(authorgAddress, submissionHash, revisionHash, approvedReactions).then((reactions) => {
    dispatch(setRevisionReactions(authorgAddress, submissionHash, revisionHash, reactions.revisionReactionReactors, reactions.reactionCount))
  })
}

export const loadAuthorgBioReactions = (authorgAddress, revisionHash, approvedAuthorgReactions) => (dispatch) => {
  return getAuthorgBioReactions(authorgAddress, revisionHash, approvedAuthorgReactions).then((reactions) => {
    dispatch(setAuthorgBioRevisionReactions(authorgAddress, revisionHash, reactions.revisionReactionReactors))
  })
}

var loadMiniUserDataPromises = new Map();

export const loadMiniUserData = (authorgAddress) => (dispatch, getState) => {
  if (loadMiniUserDataPromises.has(authorgAddress + "")) {
    console.info("loadMiniUserData already in progress/complete")
    return loadMiniUserDataPromises.get(authorgAddress + "");
  }
  const {network, approvedAuthorgReactions} = getState().core;

  var promise = new Promise((res, rej) => {
      console.info("loadUserData authorgAddress: " + authorgAddress);
      getAccountInfo(authorgAddress, network.web3).then((info) => {
        dispatch(setAuthorgInfo(authorgAddress, info.bioRevisionHashes, info.bioRevisionTimestamps, info.bioLoadedIndex, info.revisionBio));
        res({name : info.revisionBio.name, avatar : info.revisionBio.image})
      });    
  })
  loadMiniUserDataPromises.set(authorgAddress +"", promise);
  return promise;
}

export const loadUserData = (authorgAddress, focusedUser , userAccount = false, specificRev = undefined) => (dispatch, getState) => {
  const {network, approvedAuthorgReactions} = getState().core;

  return new Promise((res, rej) => {
      var promise1 = getAccountInfo(authorgAddress, network.web3, specificRev).then((info) => {
        dispatch(setAuthorgInfo(authorgAddress, info.bioRevisionHashes, info.bioRevisionTimestamps, info.bioLoadedIndex, info.revisionBio));
        dispatch(loadAuthorgBioReactions(authorgAddress, info.bioRevisionHashes[info.bioLoadedIndex], approvedAuthorgReactions));
      });    

      var promise2 = getAccountPostKeyCount(authorgAddress).then((result) => {
        dispatch(setAuthorgPostKeyCount(authorgAddress, result.count));
        dispatch(setAuthorgPostKeysLoadedCount(authorgAddress, 0));
        dispatch(getNext10AuthorgPosts(authorgAddress));
      })
      getFollowers(authorgAddress).then((result) => {
        dispatch(setAuthorgFollowers(authorgAddress, result.followers));
        if (result.followers) {
          result.followers.forEach(function(authorg) {
            dispatch(loadMiniUserData(authorg));
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
      dispatch(loadResponseRequestsCreated(authorgAddress));
      dispatch(loadResponseRequestsReceived(authorgAddress));
      Promise.all([promise1, promise2]).then(() => {
        res({done : true})
      })
    })
}

export const initializeTestTypedRevisions = () => dispatch => {
  return new Promise((res, rej) => {
    getTotalPostCount().then((result) => {
      numPostsLoaded = 0;
      dispatch(setWalletData({totalPostCount : result.totalPostCount}));
      dispatch(getNextXPosts(10)).then(() => {
        res({done:true})
      })
    });
  });
}

export const getNext10PostsWrapper = () => dispatch => {
  if (currentlyLoadingPosts === 0) {
    return dispatch(getNextXPosts(2));
  }
}

export const getNextFollowingPosts = () => (dispatch, getState) => {
  const {wallet} = getState().core;
  return getAuthorgsFollowing(wallet.get('account')).then((result) => {
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
        dispatch(doUnfocusedLoad(result.authorgAddress, result.submissionHash, result.revisionHash, result.timestamp)).then((result2) => {
          dispatch(addPostKey(result.authorgAddress, result.submissionHash, result.revisionHash, result.timestamp));      
        });      
      })
      postsLoaded++;
    }
  
    return dispatch(setAuthorgPostKeysLoadedCount(account, numPostsLoaded2 + postsLoaded));
}

var numPostsLoaded = 0;
var currentlyLoadingPosts = 0;

export const getNextXPosts = (count) => (dispatch, getState) => {
  console.log("getNext10Posts.")
  const {wallet, network} = getState().core;

  var totalPostCount = wallet.get('totalPostCount');
  var postsLoaded = 0;
  var postLoadPromises = [];
  for(var i = numPostsLoaded; i < (numPostsLoaded + count) && i < totalPostCount; i++) {
    currentlyLoadingPosts++;
    var index = totalPostCount - i - 1;
    postLoadPromises.push(dispatch(loadPostByIndex(index)))
    postsLoaded++;
  }
  numPostsLoaded += postsLoaded;
  return Promise.all(postLoadPromises)
}

export const loadPostByIndex = (index) => (dispatch) => {
  return new Promise((res, rej) => {
    getPostKey(index).then((result) => {
      currentlyLoadingPosts--;
      dispatch(doUnfocusedLoad(result.authorgAddress, result.submissionHash, result.revisionHash, result.timestamp)).then((result2) => {
        console.log("post loaded")
        dispatch(addPostKey(result.authorgAddress, result.submissionHash, result.revisionHash, result.timestamp));   
        res({done:true})   
      });      
    })
  })
  
}

export const handleViewResponses = (responses) => (dispatch) => {
  return dispatch(setSelectedResponses(responses))
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
  SET_SELECTED_RESPONSES,
  SET_EMBEDED_POST_KEYS,
  ADD_EMBEDED_POST_KEY_MAPPING,
  SET_FOCUSED_POST_LOAD_BEGIN,
  SET_FOCUSED_POST_LOAD_FINISHED,
  doFocusedLoad,
  doUnfocusedLoad,
  handleViewResponses,
  getReactions,
  getNextXPosts,
  getNext10PostsWrapper
};
