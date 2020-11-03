import {combineReducers} from 'redux';

import {global} from './global';

import {functions} from './functions.reducer';

const reducers = combineReducers({
  global,
  functions,
});

export default reducers;
