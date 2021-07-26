import React, { useState } from "react"

// Import Constants
import { errorMessage, loader } from "../../utils/constants.util"

// Import Services
import serLisCommerce from "../../services/ListCommerce/ListCommerce.services"

// Import Store
import store from "../../store/index"
import { SETFUNCTION, SETSTORAGE } from "../../store/actionTypes"

export default function useListCommerce() {
    const [Info, setInfo] = useState({})
    const { global } = store.getState()

    const configureComponent = async () => {
        try {
            loader(true)

            const data = await serLisCommerce()
            setInfo(data)

            const dataStorage = {
                ...global,
                infowallet: data,
            }

            store.dispatch({ type: SETSTORAGE, payload: dataStorage })
        } catch (error) {
            errorMessage(error.toString())
        } finally {
            loader(false)
        }
    }

    return {
        configureComponent,
        Info,
    }
}
