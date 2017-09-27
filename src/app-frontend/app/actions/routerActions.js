import { push } from 'redux-little-router';

export const redirect = href => dispatch => {
  dispatch(push(href));
};