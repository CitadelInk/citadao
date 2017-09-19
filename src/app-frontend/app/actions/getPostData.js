import appContracts from 'app-contracts';
import localWeb3 from "../helpers/web3Helper";
import { State } from 'slate';

import {
  getRevisionFromSwarm,
  getRevisionTime,
  getAccountName,
  getPostKey,
  getTotalPostCount,
  getNumReferences,
  getReferenceKey
} from '../api/getInkPostData'

import {
  getRevisionReactions
} from '../api/getCitadelPostData'

export const ADD_POST_KEY = "ADD_POST_KEY";
export const addPostKey = (authorgAddress, submissionHash, revisionHash, index) => {
  return {
    type: ADD_POST_KEY,
    data: {authorgAddress, submissionHash, revisionHash}
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

export const SET_AUTHORG_CURRENT_NAME = "SET_AUTHORG_CURRENT_NAME";
export const setAuthorgCurrentName = (authAdd, name) => {
  return {
    type: SET_AUTHORG_CURRENT_NAME,
    data: {authAdd : authAdd, name : name}
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
export const addAuthSubRevRefKey = (authAdd, subHash, revHash, refAuthAdd, refSubHash, refRevHash) => {
  return {
    type: SET_AUTH_SUB_REV_REF_KEY,
    data: {authAdd: authAdd, subHash: subHash, revHash: revHash, refKey: {authorgAddress : refAuthAdd, submissionHash : refSubHash, revisionHash : refRevHash}}
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

export const SET_REVISION_SECTION_RESPONSES = "SET_REVISION_SECTION_RESPONSES";
export const setRevisionSectionResponses = (authAdd, subHash, revHash, sectionIndex, responses) => {
  return {
    type: SET_REVISION_SECTION_RESPONSES,
    data: {authAdd : authAdd, subHash : subHash, revHash : revHash, sectionIndex : sectionIndex, responses : responses}
  }
}

export const SET_REVISION_TIME = "SET_REVISION_TIME";
export const setRevisionTime = (authAdd, subHash, revHash, revisionTime) => {
  return {
    type: SET_REVISION_TIME,
    data: {authAdd : authAdd, subHash : subHash, revHash : revHash, timestamp : revisionTime}
  }
}

export const SET_SUBMISSION_REVISIONS = "SET_SUBMISSION_REVISIONS";

export const initializeNeededPosts = () => (dispatch, getState) => {
  const {ui} = getState();
  if(ui.get('page') === 'home') {
    dispatch(initializeTestTypedRevisions());
  } else if (ui.get('page') === 'post') {
    var route = ui.get('route');
    var splitRoute = route.split('\/'); 
    if(splitRoute.length === 7) {
     loadPost(splitRoute[2], splitRoute[4], splitRoute[6], -1, true, true);
    }
  }
}


export const loadPost = (authorgAddress, submissionHash, revisionHash, index, firstLevel = true, focusedPost = false) => (dispatch, getState) => {
  const {approvedReactions, network, auths} = getState();
  var alreadyLoaded = false;
  var nameLoaded = false;
  var authorgData =auths[authorgAddress];
  var keys = [];
  if (authorgData) {
    if (authorgData.name) {
      nameLoaded = true;
    }
    var submissionsData = authorgData.submissions;
    if (submissionsData) {
      var submissionData = submissionsData[submissionHash];
      if (submissionData) {
        var revisionsData = submissionData.revisions;
        if (revisionsData) {
          var revisionData = revisionsData[revisionHash];
          if (revisionData) {
            if (!focusedPost) { // ok to reload focusedPost again to get the new goodies
              alreadyLoaded = true;
            } 
          }
        }					
      }			
    }		
  }

  console.log("already loaded: " + alreadyLoaded);

  if (!alreadyLoaded) {
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
                  dispatch(loadPost(json.reference.authorg, json.reference.submissionHash, json.reference.revisionHash, -1, false));
                }
              }
            }
          } catch (e) {

          }
        })       
      }
      getRevisionTime(authorgAddress, submissionHash, revisionHash).then((revisionTime) => {
        dispatch(setRevisionTime(authorgAddress, submissionHash, revisionHash, revisionTime.timestamp))
      })
      if (!nameLoaded) {
        getAccountName(authorgAddress, network.web3).then((name) => {
          dispatch(setAuthorgCurrentName(authorgAddress, name.accountName));
        })
      }
      getNumReferences(authorgAddress, submissionHash, revisionHash).then((refs) => {
        dispatch(setAuthSubRevReferenceCount(authorgAddress, submissionHash,revisionHash, refs.count));
        if (focusedPost) {
          for(var i = 0; i < refs.count; i++) {
            getReferenceKey(authorgAddress, submissionHash, revisionHash, i).then((result) => {
              dispatch(addAuthSubRevRefKey(authorgAddress, submissionHash, revisionHash, result.refAuthAdd, result.refSubHash, result.refRevHash))
              dispatch(loadPost(result.refAuthAdd, result.refSubHash, result.refRevHash, -1, false));
            })
          }
        }
      })
      getRevisionReactions(authorgAddress, submissionHash, revisionHash, approvedReactions).then((reactions) => {
        dispatch(setRevisionReactions(authorgAddress, submissionHash, revisionHash, reactions.revisionReactionReactors, reactions.reactionCount))
      })
    })
  }
}

export const initializeTestTypedRevisions = () => dispatch => {
  getTotalPostCount().then((result) => {
    for(var i = 0; i < 50 && i < result.totalPostCount; i++) {
      var index = result.totalPostCount - i - 1;
      getPostKey(index).then((result) => {
        dispatch(addPostKey(result.authorgAddress, result.submissionHash, result.revisionHash, index))
        dispatch(loadPost(result.authorgAddress, result.submissionHash, result.revisionHash, index))
      })
    }
  })
}

export const setSelectedBioRevision = (selectedRevision) => (dispatch, getState) => {
  const {network} = getState();
  return getAccountBioRevision(selectedRevision, network.web3).then((revision) => {
    return dispatch(setWalletData({selectedBioRevision : selectedRevision, selectedBioRevisionValue : revision}))
  })
};

export const handleViewResponses = (responses) => (dispatch) => {
  /*responses.map((response) => {
    dispatch(loadPost(response, false))
  })*/
  return dispatch(setWalletData({selectedResponses : responses}))
}

export default {
  SET_SUBMISSIONS,
  SET_REVISION_SWARM_DATA,
  SET_REVISION_AUTHORG_NAME,
  SET_REVISION_REACTIONS,
  SET_REVISION_SECTION_RESPONSES,
  ADD_POST_KEY,
  SET_AUTHORG_CURRENT_NAME,
  SET_REVISION_TIME,
  SET_AUTH_SUB_REV_REFERENCE_COUNT,
  SET_AUTH_SUB_REV_REF_KEY,
  SET_REFERENCE,
  loadPost,
  handleViewResponses
};
