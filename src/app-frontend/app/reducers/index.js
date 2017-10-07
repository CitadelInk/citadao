import { combineReducers } from 'redux';
import { Map, List } from 'immutable';
import actions from '../actions';
import initialState from '../components/compose/state.json';
import {State} from 'slate';
import landing from '../landingPage/reducers';
const {
  SET_INK_WALLET_ADRESS,
  SET_INK_COMPTROLLER_ACCOUNT,
  SET_TOKEN_ADRESS,
  SET_TOKEN_OWNER_ACCONT,
  SET_BUY_PRICE,
  SET_TOKEN_SUPPLY,
  SET_WALLET_DATA,
  NAVIGATE_PAGE,
  SET_SUBMISSIONS,
  SET_SUBMISSION_REVISIONS,
  SET_APPROVED_REACTIONS,
  SET_BUY_MORE,
  SET_REVISION_SWARM_DATA,
  SET_REVISION_AUTHORG_NAME,
  SET_REVISION_REACTIONS,
  SET_REVISION_SECTION_RESPONSES,
  SET_REVISION_TIME,
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
  SET_AUTHORG_FOLLOWERS
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
  accounts: List([]),
  accountNames: List([]),
  accountIndex: 0,
  account: null,
  accounts: List([]),
  tokenSupply: 0,
  inkBalance: 0,
  ethBalance: 0,
  inkBuyPrice: 1.0,
  etherToSend: 0,
  newBuyPrice: 0,
  newName: '',
  newReaction: '',
  tokenOwnerAccount: null,
  inkComptrollerAccount: null,
  tokenAddress: null,
  inkAddress: null,
  inkWalletAddress: null,
  bioRevisions: [],
  bioRevisionsByAccount: {},
  bioNameInput: '',
  bioTextInput: State.fromJSON(initialState),
  bioAvatarImage: null,
  selectedBioRevision: null,
  selectedBioRevisionValue: null,
  tokenCitadelComptroller: '',
  allSubmissionsTest: [],
  buyMoreActive: false,
  postTextInput: State.fromJSON(initialState),
  selectedResponses: [],
  totalPostCount:0,
  numPostsLoaded:0,
  selectedTabIndex: 0,
  selectedUserTabIndex: 0,
  selectedHomeTabIndex:0
}), action) => {
  switch (action.type) {
    case SET_TOKEN_ADRESS:
      return state.set("tokenAddress", action.data);
    case SET_TOKEN_OWNER_ACCONT:
      return state.set("tokenOwnerAccount", action.data);
    case SET_BUY_PRICE:
      return state.set("inkBuyPrice", action.data);
    case SET_TOKEN_SUPPLY:
      return state.set("tokenSupply", action.data);
    case SET_INK_COMPTROLLER_ACCOUNT:
      return state.set("inkComptrollerAccount", action.data);
    case SET_INK_WALLET_ADRESS:
      return state.set("inkWalletAddress", action.data);
    case SET_BUY_MORE:
      return state.set("buyMoreActive", action.data)
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
          return b.index - a.index;
        });
      } else {
        return state;
      }
    default:
      return state;
  }
}

const bio = (state = {}, action) => {
  let bioRevHash = action.data.latestRevisionHash;
  var bioRevisionHashes = action.data.bioRevisionHashes;
  
  switch (action.type) {
    case SET_AUTHORG_INFO:
      return Object.assign({}, state, {
        revisions : bioRevisionHashes,
        [bioRevHash]: Object.assign({}, state[bioRevHash], {
          name : action.data.bioRevision.name,
          text : action.data.bioRevision.text,
          image : action.data.bioRevision.image
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
        if(refKeys[i].authorgAddress == action.data.refKey.authorgAddress) {
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
    case SET_LOAD_STARTED:
      return Object.assign({}, state, {
        [revHash]: Object.assign({}, state[revHash], {
          loadStarted: true
        })
      });
    case SET_REFERENCE:
      var sectionRefKeyMap;
      if(state[revHash]){ 
        sectionRefKeyMap = state[revHash].sectionRefKeyMap;
      }
      if (!sectionRefKeyMap) {
        sectionRefKeyMap = new Map();
      }

      // TODO: refactor this to be a set so we don't have to do this stupid loop
      var existingReferences = [];
      var alreadyReferenced = false;
      if (sectionRefKeyMap.get(action.data.index)) {
        existingReferences = sectionRefKeyMap.get(action.data.index);
        for(var i = 0; i < existingReferences.length; i++) {
          if (existingReferences[i].authorgAddress == action.data.refKey.authorgAddress) {
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
      
      var sectionMap = sectionRefKeyMap.set(action.data.index, existingReferences);
      return Object.assign({}, state, {
        [revHash]: Object.assign({}, state[revHash], {
          sectionRefKeyMap: sectionMap
        })
      });
    default:
      return state;
  }
}

const subs = (state = {}, action) => {
  switch (action.type) {
    case SET_REVISION_REACTIONS:
    case SET_AUTH_SUB_REV_REF_KEY:
    case SET_REVISION_TIME:
    case SET_AUTH_SUB_REV_REFERENCE_COUNT:
    case SET_REVISION_SWARM_DATA:
    case SET_LOAD_STARTED:
    case SET_REFERENCE:
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
  if (action.data) {
    let authAdd = action.data.authAdd;
    var stateAuth = state[authAdd];
    if (!stateAuth) {
      stateAuth = {};    
    }
    switch(action.type) {
      case SET_REVISION_REACTIONS:
      case SET_AUTH_SUB_REV_REF_KEY:
      case SET_REVISION_TIME:
      case SET_AUTH_SUB_REV_REFERENCE_COUNT:
      case SET_REVISION_SWARM_DATA:
      case SET_LOAD_STARTED:
      case SET_REFERENCE:
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
          console.log("adding post key - action.data: " + action.data);
          return {
            ...state,
            [authAdd]: {
              ...stateAuth,
              postKeys : postKeys2.sort(function(a,b) {
                return b.index - a.index;
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
  postKeys,
  network,
  landing
});

export default rootReducer;
