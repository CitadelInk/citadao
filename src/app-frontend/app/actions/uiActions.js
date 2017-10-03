import {
  getAccounts, 
  getAccountBioData,
  getEthBalance
} from '../api/getAccounts';

import {
  setWalletData,
  setSelectedBioRevision
} from './contractPublicData';

import {
  loadPost,
  loadUserData,
  initializeTestTypedRevisions
} from './getPostData';

import {
  getAccountInfo,
  getAccountBioRevisions,
  getAccountBioRevision,
} from '../api/getInkPostData';


export const NAVIGATE_PAGE = "NAVIGATE_PAGE";

export const gotoUserPage  = (user) => dispatch =>  {  
  console.log("gotoUserPage - user: " + user);
  dispatch(loadUserData(user));
  return dispatch(navigatePage({page:'user', route:'user\/' + user}));
}

export const gotoPost = (authorg, subHash, revHash) => (dispatch) => {
  return dispatch(navigatePage({page:'post',route:'post\/authorg\/' + authorg + '\/sub\/' + subHash + '\/rev\/' + revHash}))
}

export const gotoHomePage = () => dispatch => {
  dispatch(initializeTestTypedRevisions());
  return dispatch(navigatePage({page:'home', route:'\/'}));
}

export const getUserPageBios = (user) => dispatch => {
  console.log("get user page bios")
  return Promise.all([
        getAccountBioRevisions(user)
    ]).then(([bioRevisions]) => {
      var revisions = bioRevisions.bioRevisions;
      /*if(revisions.length > 0) {
        dispatch(setSelectedBioRevision(revisions[revisions.length - 1])); // most recent
      }
      return dispatch(setWalletData({...bioRevisions}))*/
  });
} 

export const setBuyMore = (active) => dispatch => {
  return dispatch(
    setWalletData({
      buyMoreActive: active
    })
  );
}

export const navigatePage = (data) => {
  return {
    type: NAVIGATE_PAGE,
    data
  };
};

export default {
  NAVIGATE_PAGE,
  navigatePage,
  gotoUserPage,
  getUserPageBios,
  setBuyMore,
  gotoPost,
  gotoHomePage
};
