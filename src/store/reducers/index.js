import { combineReducers } from "redux"

import { global } from "./global"
import { walletInfo } from "./walletInfo"

import { functions } from "./functions.reducer"

const reducers = combineReducers({
    global,
    functions,
    walletInfo,
})

export default reducers
