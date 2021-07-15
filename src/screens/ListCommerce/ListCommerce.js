import React, { useState, useEffect } from "react"
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native"

// Import Component
import Container from "../../components/Container/Container"
import ItemComerce from "../../components/ItemCommerce/ItemCommerce.component"
import Loader from "../../components/Loader/Loader"

// Import Seriveces

// Import Hooks
import useStyles from "../../Hooks/useStyles.hook"

// Import Styles
import { ListCommerceStyle } from "../../styles/Views/index"

// Import Stort
import store from "../../store/index"
import { SETSTORAGE } from "../../store/actionTypes"

const ListCommerce = () => {
    const classes = useStyles(ListCommerceStyle)

    const [loader, setLoader] = useState(false)

    const { global } = store.getState()

    // console.log("GlobalList", global)

    // const info = () => {
    //     try {
    //         setLoader(true)

    //         const dataStorage = {
    //             ...global,
    //             walletsCommerce: global.wallets,
    //         }

    //         console.log("GlobalList", dataStorage)

    //         store.dispatch({ type: SETSTORAGE, payload: dataStorage })
    //     } catch (error) {
    //         console.log(error)
    //     } finally {
    //         setLoader(false)
    //     }
    // }

    // useEffect(() => {
    //     info()
    // }, [])
    // console.log("Global", global.wallets)

    return (
        // <View style={classes.main}>
        <Container showLogo>
            {/* <Loader isVisible={loader} /> */}
            <View style={classes.containerTitle}>
                <Text style={classes.title}>Listado de comercios</Text>
            </View>

            <View style={classes.contentList}>
                <FlatList
                    data={global.wallets}
                    keyExtractor={(_, i) => i}
                    renderItem={(item) => <ItemComerce data={item} />}
                />
            </View>
        </Container>
        // </View>
    )
}

export default ListCommerce
