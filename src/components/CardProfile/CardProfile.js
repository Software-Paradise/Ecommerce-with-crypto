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
    const [data, setData] = useState({})

    // Almacenamos la imagen del comercio
    const images = data.picture

    // Reemplazamos la extencion de la imagen para poder visualizarla
    const parsedImage = images.replace("http:", "https:")

    /* // Funcion que permite extraer la imagen para visualizarla
  const read = async () => {
    const blog = data?.profile_picture

    // verificamos si hay foto
    if (blog) {
      const file = await readFile(blog)
      setSource(file)
    }
  } */

    useEffect(() => {
        const { global } = store.getState()

        setData(global.info)

        store.subscribe((_) => {
            const { global: newGlobal } = store.getState()
            setData(newGlobal.info)
        })
    }, [])

    /* useEffect(() => {
    read()
  }, [data]) */

    return (
        <View style={styles.card}>
            <Image
                source={data.picture === null ? commerce : { uri: parsedImage }}
                style={styles.logo}
            />

            <View style={styles.cardInformation}>
                <View style={styles.headerTableTitle}>
                    <Text style={styles.textHeaderTableTitle}>
                        {data?.name}
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
                            {data?.physical_address}
                        </Text>
                    </View>
                    <View style={styles.bodyRowTable}>
                        <Text style={styles.textHeaderTable}>Balance</Text>
                        <Text style={styles.textRowTable}>
                            {_.floor(data?.amount_wallet, 2)}
                            <Text style={{ fontSize: RFValue(9) }}>
                                {data?.symbol_wallet}
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
