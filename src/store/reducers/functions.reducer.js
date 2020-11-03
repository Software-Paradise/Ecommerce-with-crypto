import {SETFUNCTION} from '../actionTypes';

const INITIAL_STATE = {};

export const functions = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SETFUNCTION: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default: {
      return state;
    }
  }
};
