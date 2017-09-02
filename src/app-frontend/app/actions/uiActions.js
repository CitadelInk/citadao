import {
  getAccounts, 
  getAccountBioData,
  getAccountBioRevisions,
  getAccountBioRevision,
  getEthBalance
} from '../api/getAccounts';

import {
  setWalletData,
  setSelectedBioRevision,
  loadPost
} from './contractPublicData'

export const NAVIGATE_PAGE = "NAVIGATE_PAGE";

export const gotoUserPage  = (user) => dispatch =>  {
  dispatch(navigatePage({page:'user',route:'\/user\/' + user})); 
  return dispatch(getUserPageBios(user)) 
}

export const gotoPost = (revHash) => dispatch => {
  dispatch(loadPost(revHash));
  return dispatch(navigatePage({page:'post',route:'\/post\/' + revHash}))
}

export const getUserPageBios = (user) => dispatch => {
  return Promise.all([
        getAccountBioRevisions(user)
    ]).then(([bioRevisions]) => {
      var revisions = bioRevisions.bioRevisions;
      if(revisions.length > 0) {
        dispatch(setSelectedBioRevision(revisions[revisions.length - 1])); // most recent
      }
      return dispatch(setWalletData({...bioRevisions}))
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
  gotoPost
};
