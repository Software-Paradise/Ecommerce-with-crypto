import React, { useState, useEffect } from "react"
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native"

// Import Component
import Container from "../../components/Container/Container"
import ItemComerce from "../../components/ItemCommerce/ItemCommerce.component"
import Loader from "../../components/Loader/Loader"

// Import Constanst
import { errorMessage, http, getHeaders } from "../../utils/constants.util"

// Import Seriveces

// Import Hooks
import useStyles from "../../Hooks/useStyles.hook"
import useListCommerce from "../../Hooks/ListCommerce/useListCommerce"

// Import Styles
import { ListCommerceStyle } from "../../styles/Views/index"

// Import Stort
import store from "../../store/index"
import { SETSTORAGE, SETFUNCTION } from "../../store/actionTypes"

const ListCommerce = () => {
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

    // const { configureComponent, Info } = useListCommerce()

    useEffect(() => {
        configureComponent()

        store.dispatch({
            type: SETFUNCTION,
            payload: {
                reloadInfoWallets: configureComponent,
            },
        })
    }, [])
    // console.log("Global", global.wallets)

    return (
        // <View style={classes.main}>
        <Container showLogo onRefreshEnd={configureComponent}>
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
        // </View>
    )
}

export default ListCommerce
