// @flow
import axios from 'axios'
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import type { Action } from './types'
import {
  SET_USER,
  SET_TASKS,
  SET_PROFILES,
  SET_PROXIES
} from './actions'

function user(state: object = {}, action: Action) {
  switch (action.type) {
    case SET_USER:
      if (action.data && action.data.token) {
        axios.defaults.headers['Authorization'] = `JWT ${ action.data.token }`
      } else {
        axios.defaults.headers['Authorization'] = undefined
      }
      if (action.data && action.data.purchases) {
        Object.assign(action.data, {
          purchases: action.data.purchases.map(purchase => {
            if (typeof purchase.expiration === 'string') {
              purchase.expiration = new Date(purchase.expiration)
            }
            return purchase
          })
        })
      }
      return action.data || {};
    default:
      return state;
  }
}

function arrayReducer(actionName) {
  return (state: array = [], action: Action) => {
    switch (action.type) {
      case actionName:
        return action.data || []
      default:
        return state
    }
  }
}

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    user,
    tasks: arrayReducer(SET_TASKS),
    profiles: arrayReducer(SET_PROFILES),
    proxies: arrayReducer(SET_PROXIES)
  });
}
