import contractPublicData from "./contractPublicData.js";
import uiActions from './uiActions';
import setupWeb3 from './networkActions'

export default {
  ...uiActions,
  ...contractPublicData,
  ...setupWeb3
};