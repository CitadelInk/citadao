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
  SET_BUY_MORE
} = actions;

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
  buyMoreActive: false
}), action) => {
  console.log("ACTION HAPPENING: action.type: " + action.type)
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
      console.log("SET BUY MORE 2 - action.active: " + action.data);
      return state.set("buyMoreActive", action.data)
    case SET_WALLET_DATA:
      return state.merge(action.data);
    default:
      return state;
  }
};

const submissions = (state = [], action) => {
  switch (action.type) {
    case SET_SUBMISSIONS:
      return action.data;
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
  approvedReactions
});

export default rootReducer;
