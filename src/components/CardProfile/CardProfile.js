import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'

// Import constants
import { RFValue, Colors, readFile, http, getHeaders, showNotification } from '../../utils/constants.util'
import _ from "lodash"

// Import Components
import Loader from '../Loader/Loader'
import Container from '../Container/Container'

// import assets 
import avatar from "../../assets/img/ecommerce-avatar.png"

// Import redux store
import store from '../../store'
import { SETFUNCTION } from '../../store/actionTypes'


const CadProfile = () => {
    const [source, setSource] = useState(null)
    const [information, setInformation] = useState(false)

    const informationCommerce = async () => {
        try {

            const { data } = await http.get('/ecommerce/info', getHeaders())
            setInformation(data)

        } catch (error) {
            showNotification(error.toString())
        }
    }

    // Funcion que permite extraer la imagen para visualizarla
    const read = async () => {
        const blog = information.profile_picture

        // verificamos si hay foto
        if (blog) {
            const file = await readFile(blog)

            console.log('file', file)
            setSource(file)
        }
    }

    useEffect(() => {
        read()
        informationCommerce()

        store.dispatch({
            type: SETFUNCTION,
            payload: {
                reloadWallets: informationCommerce
            }
        })
    }, [])

    return (
            <View style={styles.card}>
                <Image source={source === null ? avatar : { uri: source }} style={styles.logo} />

                <View style={styles.cardInformation}>
                    <View style={styles.headerTableTitle}>
                        <Text style={styles.textHeaderTableTitle}>{information.name}</Text>
                    </View>

                    <View style={styles.lineTitle} />

                    <View style={styles.dataDetailsInfoContainer}>
                        <View style={styles.headerTable}>
                            <Text style={styles.textRowTable}>{information.physical_address}</Text>

                            <Text style={[styles.textHeaderTable, { alignSelf: "flex-start" }]}>Dirección</Text>
                        </View>
                        <View style={styles.bodyRowTable}>
                            <Text style={styles.textRowTable}>{_.floor(information.amount_wallet, 2)}<Text style={{ fontSize: RFValue(9) }}>{information.symbol_wallet}</Text></Text>
                            <Text style={styles.textHeaderTable}>Saldo total</Text>
                        </View>

                    </View>
                </View>
            </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.$colorBlack,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.2)",
        marginHorizontal: RFValue(10),
        padding: RFValue(10),
        flexDirection: 'row',
    },
    logo: {
        borderRadius: 10,
        height: RFValue(80),
        resizeMode: "cover",
        overflow: "hidden",
        marginRight: RFValue(10),
        width: RFValue(80),
    },
    cardInformation: {
        flexDirection: 'column',
        justifyContent: "center",
        flex: 1,
    },
    headerTableTitle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    headerTable: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        width: "50%",
    },
    textHeaderTableTitle: {
        fontSize: RFValue(14),
        color: Colors.$colorYellow

    },
    textHeaderTable: {
        textAlign: 'right',
        fontSize: RFValue(10),
        color: Colors.$colorYellow
    },
    bodyRowTable: {
        flexDirection: "column",
        justifyContent: 'flex-end',
    },
    textRowTable: {
        color: "#FFF",
        fontSize: RFValue(13),
    },
    lineTitle: {
        borderBottomColor: Colors.$colorYellow,
        borderBottomWidth: 1,
        marginVertical: RFValue(10),
        width: "100%",
    },
    dataDetailsInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
})

export default CadProfile