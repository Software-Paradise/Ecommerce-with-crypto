import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native'

// Import Constants
import { Colors, RFValue, GlobalStyles, showNotification } from '../../utils/constants.util'
import Loader from '../../components/Loader/Loader'
import { useNavigation } from '@react-navigation/native';

// Import Assets
import Logo from '../../assets/img/transaction.png'

const Payment = () => {
    const navigation = useNavigation()
    const [amount, setAmount] = useState('')
    const [loader, setLoader] = useState(false)

    const handleSubmit = async () => {
        try {
            setLoader(true)
            if (amount.trim().length === 0) {
                throw String("Ingrese un monto a facturar")
            } else {
                navigation.navigate('Transaction', { amount })
            }

        } catch (error) {
            showNotification(error.toString())
        } finally {
            setLoader(false)
        }
    }

    useEffect(() => {
        const onSubscribe = navigation.addListener('focus', () => {
            setAmount('')
        })

        return onSubscribe
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={styles.labelsRow}>
                    <Text style={styles.textTitle}>Ingrese el monto (USD)</Text>
                </View>

                <View style={{ width: "90%", height: 55 }}>
                    <TextInput
                        style={GlobalStyles.textInput}
                        placeholder="0.00"
                        placeholderTextColor={Colors.$colorGray}
                        value={amount}
                        keyboardType='email-address'
                        keyboardType="numeric"
                        onChangeText={(value) => setAmount(value)}
                    />
                </View>
            </View>

            <View style={[styles.buttonPosition,{height:100, paddingTop:20}]}>
                <TouchableOpacity onPress={handleSubmit} style={[GlobalStyles.buttonPrimary,]}>
                    <Text style={GlobalStyles.textButton}>Procesar transaccion</Text>
                </TouchableOpacity>
            </View>


            <View style={[styles.row, { padding: RFValue(150) }]}>
                <Image source={Logo} style={styles.logo} />
            </View>

            <Loader isVisible={loader} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: RFValue(60),
    },
    row: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "column",
        width: "100%",
        paddingBottom: 20
    },
    textTitle: {
        color: Colors.$colorYellow,
        fontSize: RFValue(18)
    },
    labelsRow: {
        alignItems: "center",
        position: "relative",
        marginBottom: 20,
        flexDirection: "row",
    },
    button: {
        height: 50,
        margin: 30
    },
    buttonPosition: {
        padding:20,
        // marginVertical: 10,
        width:'100%'
    },
    titleButton: {
        color: Colors.$colorBlack,
        fontSize: RFValue(20)
    },
    logo: {
        width: RFValue(345),
        height: RFValue(240),
        // marginBottom: RFValue(40),
    }

})

export default Payment