import { combineReducers } from 'redux';
import { Map, List } from 'immutable';
import actions from '../actions';
const {
  SET_CITADEL_WALLET_ADRESS,
  SET_CITADEL_COMPTROLLER_ACCOUNT,
  SET_NAME_CHANGE_COST_IN_CITA,
  SET_CITADEL_ADRESS,
  SET_TOKEN_ADRESS,
  SET_TOKEN_OWNER_ACCONT,
  SET_BUY_PRICE,
  SET_TOKEN_SUPPLY,
  SET_WALLET_DATA,
  NAVIGATE_PAGE,
  SET_SUBMISSIONS,
  SET_APPROVED_REACTIONS,
  SET_BUY_MORE,
  SET_SUBMISSION,
  SET_SUBMISSION_AUTHORG_NAME,
  SET_SUBMISSION_REACTIONS,
  SET_REVISION_SECTION_RESPONSES,
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
  citaBalance: 0,
  ethBalance: 0,
  citaBuyPrice: 1.0,
  etherToSend: 0,
  newBuyPrice: 0,
  citadelName: '',
  newName: '',
  newReaction: '',
  tokenOwnerAccount: null,
  citadelComptrollerAccount: null,
  tokenAddress: null,
  citadelAddress: null,
  citadelWalletAddress: null,
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
      return state.set("citaBuyPrice", action.data);
    case SET_TOKEN_SUPPLY:
      return state.set("tokenSupply", action.data);
    case SET_CITADEL_ADRESS:
      return state.set("citadelAddress", action.data);
    case SET_NAME_CHANGE_COST_IN_CITA:
      return state.set("nameChangeCostInCita", action.data);
    case SET_CITADEL_COMPTROLLER_ACCOUNT:
      return state.set("citadelComptrollerAccount", action.data);
    case SET_CITADEL_WALLET_ADRESS:
      return state.set("citadelWalletAddress", action.data);
    case SET_BUY_MORE:
      return state.set("buyMoreActive", action.data)
    case SET_WALLET_DATA:
      return state.merge(action.data);
    default:
      return state;
  }
};

const submissions = (state = new Map({
  revisionSectionResponses : new Map()
}), action) => {
  switch (action.type) {
    case SET_SUBMISSION:
      return state.set(action.data.subHash, action.data);
    case SET_SUBMISSION_AUTHORG_NAME:
      var data = state.get(action.data.subHash);
      return state.set(action.data.subHash, { ...data, authorgName: action.data.name})
    case SET_SUBMISSION_REACTIONS:
      var data = state.get(action.data.subHash);
      return state.set(action.data.subHash, { ...data, revisionReactionReactors : action.data.reactions})
    case SET_REVISION_SECTION_RESPONSES:
      var data = state.get(action.data.revHash);
      console.log("1 data: " + data);
      var revisionSectionResponses = data.revisionSectionResponses;
      console.log("2 revisionSectionResponses: " + revisionSectionResponses);
      var sectionIndex = action.data.sectionIndex;
      console.log("3 sectionIndex: " + sectionIndex);      
      var sectionMap = new Map();
      console.log("4 sectionMap: " + sectionMap);
      var sectionMap2 = sectionMap.set(sectionIndex, action.data.responses);
      console.log("4-2 sectionMap2: " + sectionMap2);
      console.log("5 sectionMap[sectionIndex]" + sectionMap2.get(sectionIndex));

      return state.set(action.data.revHash, { ...data, revisionSectionResponses : sectionMap2});
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
  submissions,
  approvedReactions,
  network
});

export default rootReducer;
