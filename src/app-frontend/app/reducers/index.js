import * as ActionTypes from '../actions'
import merge from 'lodash/merge'
import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

// Updates error message to notify about the failed fetches.
const errorMessage = (state = null, action) => {
  const { type, error } = action

  if (type === ActionTypes.RESET_ERROR_MESSAGE) {
    return null
  } else if (error) {
    return error
  }

  return state
}

const selectedAccount = (state = '', action) => {
  const { type, account } = action
  if (type === ActionTypes.SELECT_ACCOUNT) {
    return account  
  } else {
      return ''
  }
}

const rootReducer = combineReducers({
  errorMessage,
  selectedAccount,
  routing
})

export default rootReducer