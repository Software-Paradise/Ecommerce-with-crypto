import React, { useState, useEffect, useReducer } from "react"
import { View, StyleSheet } from "react-native"

// Import Components
import Container from "../../components/Container/Container"
import Switch from "../../components/Switch/Switch"
import Send from "../Send/Send"
import Payment from "../Payment/Payment"
import History from "../History/History"
import ItemComerce from "../../components/ItemCommerce/ItemCommerce.component"

// Import Constants
import {
    reducer,
    RFValue,
    http,
    getHeaders,
    loader,
    errorMessage,
} from "../../utils/constants.util"

// store and actionTypes from redux
import store from "../../store/index"
import { SETWALLET } from "../../store/actionTypes"

const switchItems = [
    {
        text: "Facturar",
        state: "PAYMENT",
    },

    {
        text: "Enviar",
        state: "SEND",
    },

    {
        text: "Historial",
        state: "HISTORY",
    },
]

const initialState = {
    history: [],
    wallet: "",
    information: null,

    loader: true,
}

const WalletCommerce = ({ route }) => {
    const { walletInfo } = store.getState()
    const [state, dispatch] = useReducer(reducer, initialState)
    const [stateView, setStateView] = useState(switchItems[0].state)

    // Params passed from router
    const { params } = route

    console.log("state", state.information)
    /**
     * Funcion que se encarga de configurar el componente
     */
    const configurateComponent = async () => {
        try {
            loader(true)

            const { data } = await http.get(
                `/ecommerce/wallets/details/${params.item.id}`,
                getHeaders(),
            )

            console.log("Data", data)

            if (data.error) {
                throw String(data.message)
            }

            store.dispatch({
                type: SETWALLET,
                payload: { ...data, reloadInfo: configurateComponent },
            })

            // Guardamos la direccion wallet
            dispatch({ type: "wallet", payload: data.wallet })

            // Guardamos ek historial de transacciones
            dispatch({ type: "history", payload: data.history })

            // Guardamos informacion general de la wallet
            dispatch({ type: "information", payload: data.information })
        } catch (error) {
            errorMessage(error.toString())
        } finally {
            loader(false)
        }
    }

    useEffect(() => {
        configurateComponent()
    }, [])

    return (
        <Container showLogo onRefreshEnd={configurateComponent}>
            <View style={styles.containerWallet}>
                <ItemComerce
                    walletInfoData={
                        state.information === null ? params : state.information
                    }
                    children={true}
                    disabled
                />
            </View>

            <Switch onSwitch={setStateView} items={switchItems} />

            {state.information !== null && (
                <>
                    {
                        //Verificamos si la ventana de facturar esta lista
                        stateView === switchItems[0].state && (
                            <Payment data={state.information} />
                        )
                    }

                    {stateView === switchItems[1].state && (
                        <Send
                            dataInfo={state.information}
                            onCompleteTransaction={configurateComponent}
                        />
                    )}

                    {stateView === switchItems[2].state && (
                        <History data={state.history} />
                    )}
                </>
            )}
        </Container>
    )
}

const styles = StyleSheet.create({
    containerWallet: {
        margin: RFValue(10),
    },
})

export default WalletCommerce
