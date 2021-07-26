import { DELETESTORAGE, SETWALLETINFO } from "../actionTypes"

const INITIAL_STATE = {}

export const walletInfo = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SETWALLETINFO: {
            return {
                ...state,
                ...action.payload,
            }
        }
        case DELETESTORAGE: {
            return INITIAL_STATE
        }
        default: {
            return state
        }
    }
}
