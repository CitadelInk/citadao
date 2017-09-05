import contractPublicData from "./contractPublicData.js";
import uiActions from './uiActions';
import getPostData from './getPostData';
import setPostData from './setPostData';

export default {
  ...uiActions,
  ...contractPublicData,
  ...getPostData,
  ...setPostData
};