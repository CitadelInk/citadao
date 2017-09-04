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
  SET_AUTHORG_CURRENT_NAME
} = actions;

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
  console.log("check post keys - action.type: " + action.type + " key: " + ADD_POST_KEY);
  switch(action.type) {
    case ADD_POST_KEY:
      console.log("add post key")
      return [...state, action.data];
    default:
      return state;
  }
}

const revs = (state = {}, action) => {
  console.log("revs");
  switch (action.type) {
    case SET_REVISION_SWARM_DATA:
      let revHash = action.data.revHash;
      console.log("set rev text: " + action.data.swarmRevText);
      return Object.assign({}, state, {
        [revHash]: Object.assign({}, state[revHash], {
          title: action.data.swarmRevTitle,
          text: action.data.swarmRevText
        })
      });
    default:
      return state;
  }
}

const subs = (state = {}, action) => {
  console.log("subs");
  switch (action.type) {
    case SET_REVISION_SWARM_DATA:
      let subHash = action.data.subHash;
      console.log("subsHash: " + subHash);
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
  console.log("auths - action.type=" + action.type + " - set revision swarm data: " + SET_REVISION_SWARM_DATA);
  if (action.data) {
    let authAdd = action.data.authAdd;
    var stateAuth = state[authAdd];
    if (!stateAuth) {
      stateAuth = {};
    
    }
    switch(action.type) {
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

/*const authSubRevs = (state = new Map(), action) => {
  switch (action.type){
    case SET_REVISION_SWARM_DATA:

    default:
      return state;
}

const authSubRevs = (state = new Map({
  authorgAddresses : [],
  authorgs: new Map({
    submissionHashes : [],
    submissions: new Map({
      revisionHashes : [],
      revisions : new Map()
    })
  })
}), action) => {
  switch (action.type) {
    case SET_REVISION_SWARM_DATA:
      console.log("set revision swarm data 1");
      var revision = {title : action.data.swarmRevTitle, text : action.data.swarmRevText};
      var authorg = state.get("authorgs").get(action.authAdd);
      var submissions = authorg.submissions;
      var submission = submissions.get(action.subHash);
      var updatedSubmission = submission.revisions.set(action.data.revHash, revision);
      var updatedSubmissions = submissions.set(action.data.subHash, updatedSubmission);
      return state.set(action.data.authAdd, { ...authorg, submissions : updatedSubmissions});
    default:
      return state;
  }
}*/

const revisions = (state = new Map({
  revisionSectionResponses : new Map()
}), action) => {
  var data = state.get(action.data.revHash);
  switch (action.type) {
    case SET_REVISION_SWARM_DATA:
      return state.set(action.data.revHash, action.data);
    case SET_REVISION_AUTHORG_NAME:
      return state.set(action.data.revHash, { ...data, authorgName: action.data.name})
    case SET_REVISION_REACTIONS:
      return state.set(action.data.revHash, { ...data, revisionReactionReactors : action.data.reactions})
    case SET_REVISION_SECTION_RESPONSES:
      var revisionSectionResponses = data.revisionSectionResponses;
      var sectionIndex = action.data.sectionIndex;   
      var sectionMap = new Map();
      var sectionMap2 = sectionMap.set(sectionIndex, action.data.responses);
      return state.set(action.data.revHash, { ...data, revisionSectionResponses : sectionMap2});
    case SET_REVISION_TIMESTAMP:
      return state.set(action.data.revHash, { ...data, timestamp : action.data.timestamp})
    default:
      return state;
  }
 }

 const submissions = (state = new Map(), action) => {
   switch (action.type) {
     case SET_SUBMISSION_REVISIONS:
      return state.set(action.data.revHash, action.data.submissions);
    default:
      return state;
   }
 }

const approvedReactions = (state = [], action) => {
  switch (action.type) {
    case SET_APPROVED_REACTIONS:
      return action.data;
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
  submissions,
  approvedReactions,
  postKeys
});

export default rootReducer;
