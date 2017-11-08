import { combineReducers } from 'redux';
import { Map, List } from 'immutable';
import actions from '../actions';
import initialState from '../components/compose/state.json';
import { Value } from 'slate';
import landing from '../landingPage/reducers';
const {
  SET_WALLET_DATA,
  NAVIGATE_PAGE,
  SET_SUBMISSIONS,
  SET_APPROVED_REACTIONS,
  SET_APPROVED_AUTHORG_REACTIONS,
  SET_REVISION_SWARM_DATA,
  SET_REVISION_AUTHORG_NAME,
  SET_REVISION_REACTIONS,
  SET_AUTHORG_BIO_REVISION_REACTIONS,
  SET_REVISION_SECTION_RESPONSES,
  SET_REFERENCE,
  ADD_POST_KEY,
  SET_AUTHORG_INFO,
  SET_AUTH_SUB_REV_REFERENCE_COUNT,
  SET_AUTH_SUB_REV_REF_KEY,
  WEB_SETUP_COMPLETE,
  SET_LOAD_STARTED,
  SET_NAME_LOAD_STARTED,
  SET_AUTHORG_BIO_REVISIONS,
  SET_AUTHORG_POST_KEY_COUNT,
  SET_AUTHORG_POST_KEYS_LOADED_COUNT,
  SET_AUTHORG_FOLLOWS_AUTHORG,
  SET_AUTHORG_FOLLOWS_AUTHORGS,
  SET_AUTHORG_FOLLOWERS,
  SET_REVISION_TIME,
  SET_REVISION_HASHES,
  SET_REVISION_REQUEST_RESPONSE_KEYS,
  SET_REVISION_REQUEST_RESPONSE_RECEIPT,
  SET_USER_RESPONSE_REQUESTS_CREATED,
  SET_USER_RESPONSE_REQUESTS_RECEIVED,
  SET_SELECTED_RESPONSES,
  ADD_EMBEDED_POST_KEY_MAPPING,
  SET_FOCUSED_POST_LOAD_FINISHED,
  SET_FOCUSED_POST_LOAD_BEGIN
} = actions;

const network = (state = Map({
  web3: undefined,
  isConnected: false
}), action) => {
  switch (action.type) {
    case WEB_SETUP_COMPLETE:
      return {
        ...state,
        web3: action.data,
        isConnected: true
      };
    default:
      return state;
  }
};


const wallet = (state = Map({
  account: null,
  tokenSupply: 0,
  inkBalance: 0,
  ethBalance: 0,
  inkBuyPrice: 1.0,
  tokenOwnerAccount: null,
  inkComptrollerAccount: null,
  tokenAddress: null,
  inkAddress: null,
  inkWalletAddress: null,
  bioRevisions: [],
  bioRevisionsByAccount: {},
  bioNameInput: '',
  bioTextInput: Value.fromJSON(initialState),
  bioAvatarImage: null,
  tokenCitadelComptroller: '',
  postTextInput: Value.fromJSON(initialState),
  selectedResponses: null,
  totalPostCount:0,
  numPostsLoaded:0,
  selectedTabIndex: 0,
  selectedUserTabIndex: 0,
  selectedHomeTabIndex:0,
  selectedReactionHash:'',
  reviseSubmissionHash:null,
  reviseSubmissionInput:Value.fromJSON(initialState)
}), action) => {
  switch (action.type) {
    case SET_SELECTED_RESPONSES:
      return state.set('selectedResponses', action.data.responses)
    case SET_WALLET_DATA:
      return state.merge(action.data);
    default:
      return state;
  }
};

const postKeys = (state = [], action) => {
  switch(action.type) {
    case ADD_POST_KEY:
      var shouldAdd = true;
      for(var i = 0; i < state.length; i++) {
        if (state[i].authAdd == action.data.authAdd) {
          if (state[i].submissionHash == action.data.submissionHash) {
            if (state[i].revisionHash == action.data.revisionHash) {
              shouldAdd = false;
            }
          }
        }
      }
      if (shouldAdd) {
        return [...state, action.data].sort(function(a,b) {
          return b.timestamp - a.timestamp;
        });
      } else {
        return state;
      }
    default:
      return state;
  }
}

const bio = (state = {}, action) => {
  var bioRevHash = action.data.revHash;
  var bioRevisionHashes = action.data.bioRevisionHashes;
  
  switch (action.type) {
    case SET_AUTHORG_INFO:
      if (action.data.bioRevisionTimestamps && action.data.bioRevisionTimestamps.length > 0) {
        bioRevHash = action.data.bioRevisionHashes[action.data.bioLoadedIndex];
        return Object.assign({}, state, {
          revisions : bioRevisionHashes,
          [bioRevHash]: Object.assign({}, state[bioRevHash], {
            name : action.data.bioRevision.name,
            text : action.data.bioRevision.text,
            image : action.data.bioRevision.image,
            timestamp : action.data.bioRevisionTimestamps[action.data.bioLoadedIndex]
          })
        })
      } else {
        return state;
      }
    case SET_AUTHORG_BIO_REVISION_REACTIONS:   
      return Object.assign({}, state, {        
        [bioRevHash]: Object.assign({}, state[bioRevHash], {
          reactions : action.data.reactions
        })
      })
    default:
      return state;
  }
}

const revs = (state = {}, action) => {
  let revHash = action.data.revHash;
  switch (action.type) {
    case SET_REVISION_TIME:
      return Object.assign({}, state, {
        [revHash]: Object.assign({}, state[revHash], {
          timestamp: action.data.timestamp
        })
      });
    case SET_REVISION_SWARM_DATA:
      var test = Value.fromJSON(action.data.swarmRevText);
      return Object.assign({}, state, {
        [revHash]: Object.assign({}, state[revHash], {
          title: action.data.swarmRevTitle,
          text: action.data.swarmRevText,
          finishedLoading: true
        })
      });
    case SET_AUTH_SUB_REV_REFERENCE_COUNT:
      return Object.assign({}, state, {
        [revHash]: Object.assign({}, state[revHash], {
          refCount: action.data.refCount
        })
      });
    case SET_AUTH_SUB_REV_REF_KEY:
    //TODO: refactor to use a set so we don't have to do stupid check
      let refKeys = state[revHash].refKeys;
      if (!refKeys) {
        refKeys = [];
      }
      var shouldAddKey = true;
      for(var i = 0; i < refKeys.length; i++) {
        if(refKeys[i].authAdd == action.data.refKey.authAdd) {
          if(refKeys[i].submissionHash == action.data.refKey.submissionHash) {
            if(refKeys[i].revisionHash == action.data.refKey.revisionHash) {
              shouldAddKey = false;
              break;
            } 
          }
        }
      }

      var newKeys = refKeys;
      if(shouldAddKey) {
        newKeys = [...refKeys, action.data.refKey];
      }

      return Object.assign({}, state, {
        [revHash]: Object.assign({}, state[revHash], {
          refKeys: newKeys
        })
      });
    case SET_REVISION_REACTIONS:
      return Object.assign({}, state, {
        [revHash]: Object.assign({}, state[revHash], {
          reactions: action.data.reactions,
          reactionCount: action.data.reactionCount
        })
      });
    case SET_REVISION_REQUEST_RESPONSE_KEYS:
      return Object.assign({}, state, {
        [revHash]: Object.assign({}, state[revHash], {
          requestResponseOfferers: action.data.requestResponseOfferers,
          requestResponseRecipients: action.data.requestResponseRecipients
        })
      });
    case SET_REVISION_REQUEST_RESPONSE_RECEIPT:
      var offerer = action.data.offerer;
      var recipient = action.data.recipient;

      var stateOfferersToRecipients;
      if(state[revHash]){ 
        stateOfferersToRecipients = state[revHash].offerersToRecipients;
      }
      if (!stateOfferersToRecipients) {
        stateOfferersToRecipients = new Map();
      }

      var offererOffers = stateOfferersToRecipients.get(offerer);
      if (!offererOffers) {
        offererOffers = new Map();
      }
      offererOffers = offererOffers.set(recipient, action.data.receipt);
      stateOfferersToRecipients = stateOfferersToRecipients.set(offerer, offererOffers);


      return Object.assign({}, state, {
        [revHash]: Object.assign({}, state[revHash], {
          offerersToRecipients: stateOfferersToRecipients
        })
      });
    case SET_LOAD_STARTED:
      return Object.assign({}, state, {
        [revHash]: Object.assign({}, state[revHash], {
          loadStarted: true
        })
      });
    case SET_REFERENCE:
      var sectionRefKeyMap;
      var refsLoaded;
      var refKeySet;
      if(state[revHash]){ 
        sectionRefKeyMap = state[revHash].sectionRefKeyMap;
        refsLoaded = state[revHash].sectionRefKeyPostsLoaded;
        refKeySet = state[revHash].refKeySet;
      }
      if (!sectionRefKeyMap) {
        sectionRefKeyMap = new Map();
      }
      if (!refsLoaded) {
        refsLoaded = 0;
      }
      if (!refKeySet) {
        refKeySet = new Set();
      }

      // TODO: refactor this to be a set so we don't have to do this stupid loop
      var existingReferences = [];
      var alreadyReferenced = false;
      if (sectionRefKeyMap.get(action.data.index)) {
        existingReferences = sectionRefKeyMap.get(action.data.index);
        for(var i = 0; i < existingReferences.length; i++) {
          if (existingReferences[i].authAdd == action.data.refKey.authAdd) {
            if (existingReferences[i].submissionHash == action.data.refKey.submissionHash) {
              if (existingReferences[i].revisionHash == action.data.refKey.revisionHash) {
                alreadyReferenced = true;
              } 
            } 
          }
        }
      }
      
      if (!alreadyReferenced) {
        existingReferences.push(action.data.refKey);
      }
      var setKey = action.data.refKey.authAdd + "-" + action.data.refKey.submissionHash + "-" + action.data.refKey.revisionHash;
      if (!refKeySet.has(setKey)) {
        refKeySet.add(setKey);
        refsLoaded = refsLoaded + 1;
      }

      var sectionMap = sectionRefKeyMap.set(action.data.index, existingReferences);
      return Object.assign({}, state, {
        [revHash]: Object.assign({}, state[revHash], {
          sectionRefKeyMap: sectionMap,
          sectionRefKeyPostsLoaded : refsLoaded,
          refKeySet : refKeySet
        })
      });
    case ADD_EMBEDED_POST_KEY_MAPPING:
      var embededPostMap;
      if(state[revHash]) { 
        embededPostMap = state[revHash].embededPostTextMap;
      }
      if (!embededPostMap) {
        embededPostMap = new Map();
      }
      var newMap = embededPostMap.set(action.data.embKey, action.data.embResult )
      return Object.assign({}, state, {
        [revHash]: Object.assign({}, state[revHash], {
          embededPostTextMap: newMap
        })
      });
    case SET_FOCUSED_POST_LOAD_BEGIN:
      console.log("set focused post load begin. revHash: " + revHash)
      return Object.assign({}, state, {
        [revHash]: Object.assign({}, state[revHash], {
          focusedLoadDone: false
        })
      });
    case SET_FOCUSED_POST_LOAD_FINISHED:
    console.log("set focused post load finished. revHash: " + revHash)
        return Object.assign({}, state, {
          [revHash]: Object.assign({}, state[revHash], {
            focusedLoadDone: true
          })
        });
    case SET_REVISION_HASHES:
      return Object.assign({}, state, {
        revisionHashes: action.data.revisionHashes
      });
    default:
      return state;
  }
}

const subs = (state = {}, action) => {
  switch (action.type) {
    case SET_REVISION_TIME:
    case SET_REVISION_REACTIONS:
    case SET_AUTH_SUB_REV_REF_KEY:
    case SET_AUTH_SUB_REV_REFERENCE_COUNT:
    case SET_REVISION_SWARM_DATA:
    case SET_LOAD_STARTED:
    case SET_REFERENCE:
    case ADD_EMBEDED_POST_KEY_MAPPING:
    case SET_REVISION_HASHES:
    case SET_REVISION_REQUEST_RESPONSE_KEYS:
    case SET_REVISION_REQUEST_RESPONSE_RECEIPT:
    case SET_FOCUSED_POST_LOAD_BEGIN:
    case SET_FOCUSED_POST_LOAD_FINISHED:
      let subHash = action.data.subHash;
      var stateSub = state[subHash];
      if (!stateSub) {
        stateSub = {};
      }
      return {
      ...state,
      [subHash]: {
        ...stateSub,
        revisions : revs(stateSub.revisions, action)
      }
    }
  }
}

const auths = (state = {}, action) => {
  console.debug("action.type: " + action.type);
  if (action.data) {
    let authAdd = action.data.authAdd;
    var stateAuth = state[authAdd];
    if (!stateAuth) {
      stateAuth = {};    
    }
    switch(action.type) {
      case SET_REVISION_TIME:
      case SET_REVISION_REACTIONS:
      case SET_AUTH_SUB_REV_REF_KEY:
      case SET_AUTH_SUB_REV_REFERENCE_COUNT:
      case SET_REVISION_SWARM_DATA:
      case SET_LOAD_STARTED:
      case SET_REFERENCE:
      case ADD_EMBEDED_POST_KEY_MAPPING:
      case SET_REVISION_HASHES:
      case SET_REVISION_REQUEST_RESPONSE_KEYS:
      case SET_REVISION_REQUEST_RESPONSE_RECEIPT:
      case SET_FOCUSED_POST_LOAD_BEGIN:
      case SET_FOCUSED_POST_LOAD_FINISHED:
        return {
          ...state,
          [authAdd]: {
            ...stateAuth,
            submissions : subs(stateAuth.submissions, action)
          }
        }
      case SET_NAME_LOAD_STARTED:
        return {
          ...state,
          [authAdd]: {
            ...stateAuth,
            userLoadStarted: true
          }
        }
      case SET_AUTHORG_INFO:
      case SET_AUTHORG_BIO_REVISION_REACTIONS:
        return {
          ...state,
          [authAdd]: {
            ...stateAuth,
            bioSubmission : bio(stateAuth.bioSubmission, action)
          }
        }
      case ADD_POST_KEY:
        var shouldAdd = true;
        var postKeys2 = [];
        if (stateAuth.postKeys) {
          postKeys2 = stateAuth.postKeys;
          for(var i = 0; i < stateAuth.postKeys.length; i++) {
            if (stateAuth.postKeys[i].submissionHash == action.data.submissionHash) {
              if (stateAuth.postKeys[i].revisionHash == action.data.revisionHash) {
                shouldAdd = false;
              }
            }
          }
        }
        if (shouldAdd) {
          postKeys2.push(action.data);
          return {
            ...state,
            [authAdd]: {
              ...stateAuth,
              postKeys : postKeys2.sort(function(a,b) {
                return b.timestamp - a.timestamp;
              })
            }
          }
        } else {
          return state;
        }
      case SET_AUTHORG_POST_KEY_COUNT:
        return {
          ...state,
          [authAdd]: {
            ...stateAuth,
            postKeyCount: action.data.count
          }
        }
      case SET_AUTHORG_POST_KEYS_LOADED_COUNT:
        return {
          ...state,
          [authAdd]: {
            ...stateAuth,
            postKeysLoadedCount: action.data.loadedCount
          }
        }
      case SET_AUTHORG_FOLLOWS_AUTHORGS:
        return {
          ...state,
          [authAdd]: {
            ...stateAuth,
            authorgsFollowed: action.data.authorgs
          }
        }
      case SET_AUTHORG_FOLLOWERS:
          return {
            ...state,
            [authAdd]: {
              ...stateAuth,
              followers: action.data.followers
            }
          }
      case SET_AUTHORG_FOLLOWS_AUTHORG:
        var followedAuth = state[action.data.followedAuthorg];
        if (!followedAuth) {
          followedAuth = {};
        }
        return {
          ...state,
          [authAdd]: {
            ...stateAuth,
            authorgsFollowed : [...stateAuth.authorgsFollowed, action.data.followedAuthorg]
          },
          [action.data.followedAuthorg]: {
            ...followedAuth,
            followers : [...followedAuth.followers, authAdd]
          }
        }
      case SET_USER_RESPONSE_REQUESTS_RECEIVED:
        return {
          ...state,
          [authAdd]: {
            ...stateAuth,
            responseRequestsReceivedKeys : action.data.requestsReceivedKeys
          }
        }
        case SET_USER_RESPONSE_REQUESTS_CREATED:
          return {
            ...state,
            [authAdd]: {
              ...stateAuth,
              responseRequestsCreatedKeys : action.data.requestsCreatedKeys
            }
          }
      default:
        return state;
    }
  } else {
    return state;
  }
}

const approvedReactions = (state = Map(), action) => {  
  switch (action.type) {
    case SET_APPROVED_REACTIONS:
      return action.data.reactions;
    default:
      return state;
  }
}


const approvedAuthorgReactions = (state = Map(), action) => {  
  switch (action.type) {
    case SET_APPROVED_AUTHORG_REACTIONS:
      return action.data.reactions;
    default:
      return state;
  }
}


const ui = (state = Map({page: 'home', route: '/'}), action) => {
  switch (action.type) {
    case NAVIGATE_PAGE:
      return state.merge(action.data);
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  wallet,
  ui,
  auths,
  approvedReactions,
  approvedAuthorgReactions,
  postKeys,
  network,
  landing
});

export default rootReducer;
