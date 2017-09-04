import appContracts from 'app-contracts';
import localWeb3 from "../helpers/web3Helper";

import {
  getRevisionFromSwarm,
  getRevisionTime,
  getAccountName,
  getRevisionReactions,
  getPostKey,
  getTotalPostCount,
  getNumReferences
} from '../api/getInkPostData'

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

export const SET_REVISION_AUTHORG_NAME = "SET_REVISION_AUTHORG_NAME";
export const setRevisionAuthorgName = (authAdd, subHash, revHash, name) => {
  return {
    type: SET_REVISION_AUTHORG_NAME,
    data: {authAdd : authAdd, subHash : subHash, revHash : revHash, name: name}
  }
}

export const SET_REVISION_REACTIONS = "SET_REVISION_REACTIONS";
export const setRevisionReactions = (authAdd, subHash, revHash, reactions) => {
  return {
    type: SET_REVISION_REACTIONS,
    data: {authAdd : authAdd, subHash : subHash, revHash : revHash, reactions : reactions}
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
     loadPost(splitRoute[2], splitRoute[4], splitRoute[6]);
    }
  }
}

export const loadPost = (authorgAddress, submissionHash, revisionHash, index, firstLevel = true) => (dispatch, getState) => {
  const {approvedReactions} = getState();
  return getRevisionFromSwarm(revisionHash).then(result => {
    dispatch(setRevisionSwarmData(authorgAddress, 
                                  submissionHash, 
                                  revisionHash, 
                                  result.revisionSwarmTitle, 
                                  result.revisionSwarmText))
    if (firstLevel && result.revisionSwarmText) {
      result.revisionSwarmText.map((section, i) => {        
        try {
          var json = JSON.parse(section)
          if(json) {
            if(json.reference) {
              dispatch(loadPost(json.reference.authorg, json.reference.submissionHash, json.reference.revisionHash, -1, false))
            }
          }
        } catch (e) {

        }
      })       
    }
    getRevisionTime(authorgAddress, submissionHash, revisionHash).then((revisionTime) => {
      dispatch(setRevisionTime(authorgAddress, submissionHash, revisionHash, revisionTime.timestamp))
    })
    getAccountName(authorgAddress).then((name) => {
      dispatch(setAuthorgCurrentName(authorgAddress, name.accountName));
    })
    getNumReferences(authorgAddress, submissionHash, revisionHash).then((refs) => {
      dispatch(setAuthSubRevReferenceCount(authorgAddress, submissionHash,revisionHash, refs.count));
    })
    /*getRevisionReactions(authorgAddress, submissionHash, revisionHash, approvedReactions).then((reactions) => {
      dispatch(setRevisionReactions(authorgAddress, submissionHash, revisionHash, reactions.revisionReactionReactors))
    })*/
  })
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

export const setSelectedBioRevision = (selectedRevision) => dispatch => {
  return getAccountBioRevision(selectedRevision).then((revision) => {
    return dispatch(setWalletData({selectedBioRevision : selectedRevision, selectedBioRevisionValue : revision}))
  })
};

export const handleViewResponses = (responses) => (dispatch) => {
  responses.map((response) => {
    dispatch(loadPost(response, false))
  })
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
  loadPost,
  handleViewResponses
};
