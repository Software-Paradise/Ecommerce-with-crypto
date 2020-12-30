import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'

// Import constants
import { RFValue, Colors, readFile } from '../../utils/constants.util'

// import assets and styles
import avatar from "../../assets/img/ecommerce-avatar.png"

// Import redux store
import store from '../../store'


const CadProfile = () => {
    const { global } = store.getState()
<<<<<<< Updated upstream
    const [source, setSource] = useState(null)
=======
    const [source, setSource] = useState('')
>>>>>>> Stashed changes

    // ???????
    const read = async () => {
        const blog = global.profile_picture_commerce

        // verificamos si hay foto
        if (blog !== null) {
            const file = await readFile(blog)

            // y si hay foto hay video
            setSource(file)
        }
    }

    useEffect(() => {
        read()
    }, [])

    return (
        <View style={styles.card}>
            <Image source={source === null ? avatar : { uri: source }} style={styles.logo} />

            <View style={styles.cardInformation}>
                <View style={styles.headerTableTitle}>
                    <Text style={styles.textHeaderTableTitle}>{global.name_commerce}</Text>
                </View>

<<<<<<< Updated upstream
                <View style={styles.lineTitle} />
=======
                <View style={{ flexDirection: 'column', width: '75%', paddingLeft: 5 }}>
                    <View style={styles.headerTableTitle}>
                        <Text style={styles.textHeaderTableTitle}>{global.name_commerce}</Text>
                    </View>
>>>>>>> Stashed changes

                <View style={styles.dataDetailsInfoContainer}>
                    <View style={styles.headerTable}>
                        <Text style={styles.textRowTable}>{global.physical_address}</Text>

                        <Text style={[styles.textHeaderTable, { alignSelf: "flex-start" }]}>Dirección</Text>
                    </View>
                    <View style={styles.bodyRowTable}>
                        <Text style={styles.textRowTable}>{global.amount_wallet_commerce} {global.name_coin}</Text>
                        <Text style={styles.textHeaderTable}>Saldo total</Text>
                    </View>

                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.2)",
        marginHorizontal: RFValue(10),
        padding: RFValue(10),
        flexDirection: 'row',
<<<<<<< Updated upstream
=======
        width: '100%',
        height: RFValue(90)
    },
    containerBackground: {
        height: '100%',
        width: '25%',
        overflow: 'hidden',
        // padding: 10,
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        fontSize: RFValue(10),
=======
        fontSize: RFValue(14),
>>>>>>> Stashed changes
        color: Colors.$colorYellow
    },
    bodyRowTable: {
        flexDirection: "column",
        justifyContent: 'flex-end',
    },
    textRowTable: {
        color: "#FFF",
<<<<<<< Updated upstream
        fontSize: RFValue(13),
=======
        fontSize: RFValue(12),
        // justifyContent: "center"
>>>>>>> Stashed changes
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