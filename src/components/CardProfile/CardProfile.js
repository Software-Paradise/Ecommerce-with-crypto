import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, Image } from "react-native"

// Import constants
import { RFValue, Colors, readFile } from "../../utils/constants.util"
import _ from "lodash"

// import assets
import commerce from "../../assets/img/ecommerce-avatar.png"
import tether from "../../assets/img/tether.png"

// Import redux store
import store from "../../store"

const CadProfile = () => {
    // Estado que almacena la informacion del comercio
    const [dataInfo, setDataInfo] = useState({})
    const [Rol, setRol] = useState(0)

    useEffect(() => {
        const { walletInfo, global } = store.getState()
        // console.log("Store", store.getState())
        setRol(global.rol)

        /**
         * Identificamos que usuario es el que inicio seccion en base a su rol
         * Rol = ( 1) Dueño de comercio
         * Rol = ( 2) Administrador de comercio
         * Rol = ( 3) Cajero
         *
         */
        if (Rol === 1) {
            setDataInfo(walletInfo)
        } else {
            setDataInfo(global.info)
        }

        store.subscribe((_) => {
            const { global: newGlobal } = store.getState()
            setDataInfo(newGlobal.info)
        })
    }, [dataInfo])

    return (
        <View style={styles.card}>
            {Rol === 1 ? (
                <Image
                    source={
                        dataInfo?.profile_picture === null
                            ? commerce
                            : { uri: dataInfo?.profile_picture }
                    }
                    style={styles.logo}
                />
            ) : (
                <Image
                    source={
                        dataInfo?.picture === null
                            ? commerce
                            : { uri: dataInfo?.picture }
                    }
                    style={styles.logo}
                />
            )}

            <View style={styles.cardInformation}>
                <View style={styles.headerTableTitle}>
                    <Text style={styles.textHeaderTableTitle}>
                        {Rol === 1 ? dataInfo?.commerce_name : dataInfo?.name}
                    </Text>
                    <Image source={tether} style={styles.icon} />
                </View>

                <View style={styles.lineTitle} />

                <View style={styles.dataDetailsInfoContainer}>
                    <View style={styles.headerTable}>
                        <Text
                            style={[
                                styles.textHeaderTable,
                                { alignSelf: "flex-start" },
                            ]}>
                            Dirección
                        </Text>
                        <Text style={styles.textRowTable}>
                            {dataInfo?.physical_address}
                        </Text>
                    </View>
                    <View style={styles.bodyRowTable}>
                        <Text style={styles.textHeaderTable}>Balance</Text>
                        <Text style={styles.textRowTable}>
                            {_.floor(
                                Rol === 1
                                    ? dataInfo?.amount
                                    : dataInfo?.amount_wallet,
                                2,
                            )}
                            <Text style={{ fontSize: RFValue(9) }}>
                                {Rol === 1
                                    ? dataInfo?.symbol
                                    : dataInfo?.symbol_wallet}
                            </Text>
                        </Text>
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
        flexDirection: "row",
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
        flexDirection: "column",
        justifyContent: "center",
        flex: 1,
    },
    headerTableTitle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerTable: {
        flexDirection: "column",
        justifyContent: "flex-start",
        width: "50%",
    },
    textHeaderTableTitle: {
        fontSize: RFValue(14),
        color: Colors.$colorYellow,
    },
    textHeaderTable: {
        textAlign: "right",
        fontSize: RFValue(13),
        color: Colors.$colorYellow,
    },
    bodyRowTable: {
        flexDirection: "column",
        justifyContent: "flex-end",
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
        flexDirection: "row",
        justifyContent: "space-between",
    },
    icon: {
        width: RFValue(30),
        height: RFValue(30),
    },
})

export default CadProfile
