import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'

// Import constants
import { RFValue, Colors } from '../../utils/constants.util'

// Import Assets
import Logo from '../../assets/img/logo.png'

const CadProfile = () => {
    return (
        <View style={styles.card}>
            <View style={styles.containerBackground}>
            </View>
            <View style={styles.headerTableTitle}>
                <Text style={styles.textHeaderTable}>Comercio 1</Text>
            </View>

            <View style={styles.headerTable}>
                <Text style={styles.textHeaderTable}>Punto de Referencia</Text>
                <Text style={styles.textHeaderTable}>Monto</Text>

            </View>

            <View style={styles.bodyRowTable}>
                <Text style={styles.textRowTable}>Punto de Referencia</Text>
                <Text style={styles.textRowTable}>Monto</Text>
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
        height: RFValue(210)
    },
    containerBackground: {
        borderRadius: 3,
        borderWidth: 0.5,
        borderColor: "#FFF",
        // backgroundColor: "#CCC",
        height: RFValue(90)
    },
    logo: {
        width: RFValue(500),
        height: RFValue(100),
        // marginBottom: RFValue(40),
    },
    headerTableTitle: {
        paddingVertical: 3,
        flexDirection: "row",
        justifyContent: "center",
    },
    headerTable: {
        paddingVertical: 10,
        // marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    textHeaderTable: {
        fontSize: RFValue(16),
        color: Colors.$colorYellow
    },
    bodyRowTable: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    textRowTable: {
        alignItems: "center",
        color: "#FFF",
        fontSize: RFValue(15),
        justifyContent: "center"
    },

})

export default CadProfile