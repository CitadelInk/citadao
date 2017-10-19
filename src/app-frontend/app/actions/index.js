import contractPublicData from "./contractPublicData.js";
import uiActions from './uiActions';
import getPostData from './getPostData';
import setPostData from './setPostData';
import setupWeb3 from './networkActions';
import router from './routerActions';
import responseRequestActions from './responseRequestActions';

export default {
  ...uiActions,
  ...contractPublicData,
  ...getPostData,
  ...setPostData,
  ...setupWeb3,
  ...router,
  ...responseRequestActions
};