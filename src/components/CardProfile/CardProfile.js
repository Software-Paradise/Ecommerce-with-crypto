import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'

// Import constants
import { RFValue, Colors, readFile } from '../../utils/constants.util'

// Import redux store
import store from '../../store'


const CadProfile = () => {
    const { global } = store.getState()
    const [source, setSource] =  useState('')
    console.log('DatosGlobale', global)

    const read = async () => {
        const blog = global.profile_picture_commerce

        const file = await readFile(blog)
        setSource(file)
    }

    useEffect(() => {
        read()
    }, [])

    return (
        <View style={styles.card}>
            <View style={styles.containerInformation}>
                <View style={styles.containerBackground}>
                    {
                        source.length > 0 &&
                        <Image source={{ uri: source }}   style={styles.logo}/>
                    }
                </View>

                <View style={{ flexDirection: 'column', width: '70%', paddingLeft: 10 }}>
                    <View style={styles.headerTableTitle}>
                        <Text style={styles.textHeaderTable}>{global.name_commerce}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={styles.headerTable}>
                            <Text style={styles.textHeaderTable}>Punto de Referencia</Text>
                            <Text style={styles.textRowTable}>{global.physical_address}</Text>
                        </View>

                        <View style={styles.bodyRowTable}>
                            <Text style={styles.textHeaderTable}>Monto</Text>
                            <Text style={styles.textRowTable}>{global.amount_wallet_commerce} {global.name_coin}</Text>
                        </View>
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
        marginHorizontal: RFValue(10),
        padding: RFValue(10),
        marginTop: RFValue(10),
        marginBottom: RFValue(10),
    },
    containerInformation: {
        flexDirection: 'row',
        width: '100%',
        height: RFValue(90)
    },
    containerBackground: {
        borderRadius: 3,
        borderWidth: 0.5,
        borderColor: "#FFF",
        height: '100%',
        width: '30%',
        // padding: 10,
    },
    logo: {
        width: '100%',
        height: '100%',
        resizeMode: "cover",
        // marginBottom: RFValue(40),
    },
    headerTableTitle: {
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: 'center',
    },
    headerTable: {
        flexDirection: 'column',
    },
    textHeaderTable: {
        textAlign: 'center',
        fontSize: RFValue(16),
        color: Colors.$colorYellow
    },
    bodyRowTable: {
        flexDirection: "column",
    },
    textRowTable: {
        textAlign: 'center',
        color: "#FFF",
        fontSize: RFValue(14),
        justifyContent: "center"
    },

})

export default CadProfile