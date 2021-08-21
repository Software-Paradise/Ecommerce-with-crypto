import React, { useState, useEffect } from "react"
import { View, Text, FlatList } from "react-native"

// Import Component
import Container from "../../components/Container/Container"
import Loader from "../../components/Loader/Loader"
import ItemComerce from "../../components/ItemCommerce/ItemCommerce.component"

// Import constants
import { http, errorMessage, getHeaders } from "../../utils/constants.util"

// Import Hooks
import useStyles from "../../Hooks/useStyles.hook"

// Import Styles
import { ListCommerceStyle } from "../../styles/Views/index"

// Import Store
import store from "../../store/index"
import { SETSTORAGE, SETFUNCTION } from "../../store/actionTypes"

const Main = () => {
    const classes = useStyles(ListCommerceStyle)
    const [Info, setInfo] = useState({})
    const [loader, setLoader] = useState(false)

    /**
     * Funcion que hace el llamado a la lista de los comercios por cada compañia
     */
    const configureComponent = async () => {
        try {
            setLoader(true)
            const { data } = await http.get("/wallets/commerces", getHeaders())

            if (data.error) {
                throw String(data.message)
            }
            setInfo(data)

            const dataStorage = {
                ...globalStorage,
                wallets: data,
            }

            store.dispatch({ type: SETSTORAGE, payload: dataStorage })
        } catch (error) {
            errorMessage(error.toSting())
        } finally {
            setLoader(false)
        }
    }

    useEffect(() => {
        configureComponent()

        store.dispatch({
            type: SETFUNCTION,
            payload: {
                reloadWallets: configureComponent,
            },
        })
    }, [])

    return (
        <Container showLogo>
            <Loader isVisible={loader} />
            <View style={classes.containerTitle}>
                <Text style={classes.title}>Listado de comercios</Text>
            </View>

            <View style={classes.contentList}>
                <FlatList
                    data={Info}
                    keyExtractor={(_, i) => i}
                    renderItem={(item) => <ItemComerce data={item} />}
                />
            </View>
        </Container>
    )
}

export default Main
