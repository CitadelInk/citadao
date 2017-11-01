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
  }
}

export const doBasicLoad = (authorgAddress, submissionHash, revisionHash, timestamp = undefined, firstLevel = true) => (dispatch, getState) => {
  const {network} = getState().core;
  console.warn("load post. revHash: " + revisionHash);
  alreadyLoadedSet.add(authorgAddress + "-" + submissionHash + "-" + revisionHash);

  return new Promise((res, rej) => {
    getRevisionFromSwarm(revisionHash, network.web3).then(result => {
      var document = State.fromJSON(result.revisionSwarmText)
      if(document) {
        dispatch(setRevisionSwarmData(authorgAddress, 
          submissionHash, 
          revisionHash, 
          result.revisionSwarmTitle, 
          result.revisionSwarmText));

        var references = [];
        var refLoadPromises = [];
        document.document.nodes.forEach(function(section) {   
          var refAuthorg = section.data.get("authorg");
          var refSubmission = section.data.get("submission");
          var refRevision = section.data.get("revision");
          var index = section.data.get("index");
          if(refAuthorg && refSubmission && refRevision) {
            dispatch(setReference(refAuthorg, refSubmission, refRevision, authorgAddress, submissionHash, revisionHash, index));
            references.push({refAuthorg, refSubmission, refRevision, index});
            if (firstLevel && !alreadyLoadedSet.has(refAuthorg + "-" + refSubmission + "-" + refRevision)) {
              refLoadPromises.push(dispatch(doUnfocusedLoad(refAuthorg, refSubmission, refRevision, undefined, false, false)));
            }           
          }  
        })
        Promise.all(refLoadPromises).then(() => {
          var timePromise = [];
          if (!timestamp) {
            timePromise.push(getRevisionTime(authorgAddress, submissionHash, revisionHash))
          }
          Promise.all(timePromise).then((time) => {
            if (time && time.length > 0) {
              timestamp = time[0].timestamp;
            }
            dispatch(setRevisionTime(authorgAddress, submissionHash, revisionHash, timestamp));

            var userPromise = [];
            if (!userLoadStartedSet.has(authorgAddress + "")) {
              userPromise.push(dispatch(loadMiniUserData(authorgAddress)));
            }
            Promise.all(userPromise).then(() => {
              res({result, references, time})
            })
          })
        })
      }       
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
      console.warn("doUpdateLoad: " + refs[2]);
      dispatch(setAuthSubRevReferenceCount(authorgAddress, submissionHash,revisionHash, refs[2].count));
      res({count : refs.count});
    })
  })
}

export const doUnfocusedLoad = (authorgAddress, submissionHash, revisionHash, timestamp = undefined, firstLevel = true) => (dispatch, getState) => {
  return new Promise((res, rej) => {

    var promiseList = [];
    if (!alreadyLoadedSet.has(authorgAddress + "-" + submissionHash + "-" + revisionHash)) {
      promiseList.push(dispatch(doBasicLoad(authorgAddress, submissionHash, revisionHash, timestamp, firstLevel)));
      promiseList.push(dispatch(doUpdateLoad(authorgAddress, submissionHash, revisionHash, timestamp, firstLevel)));
    }

    Promise.all(
     promiseList
    ).then(() => {
      console.log("all done?")
      res({done : true})
    })
  })
  
}
var alreadyLoadedSet = new Set();

export const doDetailLoad = (authorgAddress, submissionHash, revisionHash, timestamp = undefined, firstLevel = true, focusedPost = false) => (dispatch, getState) => {
  return new Promise((res, rej) =>{
    getNumReferences(authorgAddress, submissionHash, revisionHash).then((refs) => {
      var refPromises = [];
      for(var i = 0; i < refs.count; i++) {
        refPromises.push(dispatch(asyncLoadRef(authorgAddress, submissionHash, revisionHash, i)));
      }
      Promise.all([...refPromises, dispatch(loadPostResponseRequests(authorgAddress, submissionHash, revisionHash))])
      .then(() => {
        res({done : true})
      })
    })    
  }) 
}

export const doFocusedLoad = (authorgAddress, submissionHash, revisionHash, timestamp = undefined, firstLevel = true) => (dispatch, getState) => {
  return new Promise((res, rej) => {
    getNumReferences(authorgAddress, submissionHash, revisionHash).then((refCount) => {
      var promiseList = [];
      if (!alreadyLoadedSet.has(authorgAddress + "-" + submissionHash + "-" + revisionHash)) {
        promiseList.push(dispatch(doBasicLoad(authorgAddress, submissionHash, revisionHash, timestamp, true)));
      }
      promiseList.push(dispatch(doUpdateLoad(authorgAddress, submissionHash, revisionHash, timestamp, true)));
      promiseList.push(dispatch(doDetailLoad(authorgAddress, submissionHash, revisionHash, timestamp, true)))
  
      Promise.all(
       promiseList
      ).then(() => {
        console.log()
        res({done : true})
      })
    })    
  })
  
}

export const asyncLoadRef = (authorgAddress, submissionHash, revisionHash, index) => (dispatch) => {
  return getReferenceKey(authorgAddress, submissionHash, revisionHash, index).then((result) => {
    dispatch(addAuthSubRevRefKey(authorgAddress, submissionHash, revisionHash, result.refAuthAdd, result.refSubHash, result.refRevHash, result.timestamp))
    if(!alreadyLoadedSet.has(result.refAuthAdd + "-" + result.refSubHash + "-" + result.refRevHash)) {
      dispatch(doUnfocusedLoad(result.refAuthAdd, result.refSubHash, result.refRevHash, result.timestamp, true, false));
    }
  })
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
var userLoadStartedSet = new Set();

export const loadMiniUserData = (authorgAddress) => (dispatch, getState) => {
  userLoadStartedSet.add(authorgAddress + "");
  const {network, approvedAuthorgReactions} = getState().core;

  return new Promise((res, rej) => {
      console.warn("loadUserData authorgAddress: " + authorgAddress);
      getAccountInfo(authorgAddress, network.web3).then((info) => {
        dispatch(setAuthorgInfo(authorgAddress, info.bioRevisionHashes, info.bioRevisionTimestamps, info.bioLoadedIndex, info.revisionBio));
        dispatch(loadAuthorgBioReactions(authorgAddress, info.bioRevisionHashes[info.bioLoadedIndex], approvedAuthorgReactions));
        res({done : true})
      });    
  })
}

export const loadUserData = (authorgAddress, focusedUser , userAccount = false, specificRev = undefined) => (dispatch, getState) => {
  userLoadStartedSet.add(authorgAddress + "");
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
          console.log("post loaded - references: " + result2.references)
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
  doFocusedLoad,
  doUnfocusedLoad,
  handleViewResponses,
  getReactions,
  getNextXPosts,
  getNext10PostsWrapper
};
