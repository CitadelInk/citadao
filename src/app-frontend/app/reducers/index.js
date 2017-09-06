import { combineReducers } from 'redux';
import { Map, List } from 'immutable';
import actions from '../actions';
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
  ADD_POST_KEY,
  SET_AUTHORG_CURRENT_NAME,
  SET_AUTH_SUB_REV_REFERENCE_COUNT,
  SET_AUTH_SUB_REV_REF_KEY,
  WEB_SETUP_COMPLETE
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
  bioTextInput: '',
  selectedBioRevision: null,
  selectedBioRevisionValue: null,
  tokenCitadelComptroller: '',
  allSubmissionsTest: [],
  buyMoreActive: false,
  postTextInput: '',
  selectedResponses: []
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
      return [...state, action.data];
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
          text: action.data.swarmRevText
        })
      });
    case SET_AUTH_SUB_REV_REFERENCE_COUNT:
      return Object.assign({}, state, {
        [revHash]: Object.assign({}, state[revHash], {
          refCount: action.data.refCount
        })
      });
    case SET_AUTH_SUB_REV_REF_KEY:
      console.log("SET_AUTH_SUB_REV_REF_KEY - key: " + action.data.refKey);
      let refKeys = state[revHash].refKeys;
      if (!refKeys) {
        refKeys = [];
      }
      return Object.assign({}, state, {
        [revHash]: Object.assign({}, state[revHash], {
          refKeys: [...refKeys, action.data.refKey]
        })
      });
    case SET_REVISION_REACTIONS:
      console.log("SET_REVISION_REACTIONS - reactions: " + action.data.reactions);
      return Object.assign({}, state, {
        [revHash]: Object.assign({}, state[revHash], {
          reactions: action.data.reactions,
          reactionCount: action.data.reactionCount
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
        return {
          ...state,
          [authAdd]: {
            ...stateAuth,
            submissions : subs(stateAuth.submissions, action)
          }
        }
      case SET_AUTHORG_CURRENT_NAME:
        return {
          ...state,
          [authAdd]: {
            ...stateAuth,
            name : action.data.name
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
      if (action.data) {
        console.log("approved reactions index - action.data: " + action.data.reactions);
      }
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
  network
});

export default rootReducer;
