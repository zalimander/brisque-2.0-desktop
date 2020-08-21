// @flow
import type { Dispatch } from './types';

export const SET_USER = 'SET_USER';
export const SET_TASKS = 'SET_TASKS';
export const SET_PROFILES = 'SET_PROFILES';
export const SET_PROXIES = 'SET_PROXIES';

const setValue = type => data => (dispatch: Dispatch) => dispatch({ type, data })

export const setUser = setValue(SET_USER)
export const setTasks = setValue(SET_TASKS)
export const setProfiles = setValue(SET_PROFILES)
export const setProxies = setValue(SET_PROXIES)

export const actionFromName = name => {
  switch (name) {
    case 'account':
      return setUser
    case 'tasks':
      return setTasks
    case 'profiles':
      return setProfiles
    case 'proxies':
      return setProxies
  }
}
