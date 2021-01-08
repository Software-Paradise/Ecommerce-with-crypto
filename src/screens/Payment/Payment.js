import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native'

// Import Constants
import { Colors, RFValue, GlobalStyles, showNotification, setStorage, http, getStorage } from '../../utils/constants.util'
import { useNavigation } from '@react-navigation/native';

// Import component
import Container from '../../components/Container/Container'
import Card from '../../components/CardProfile/CardProfile'
import Loader from '../../components/Loader/Loader'

// Import redux store
import store from '../../store'
import { SETSTORAGE } from '../../store/actionTypes'

// Import assets 
import Logo from '../../assets/img/aly-system-by.png'

const Payment = () => {
    const { global } = store.getState()

    const navigation = useNavigation()
    const [amount, setAmount] = useState('')
    const [loader, setLoader] = useState(false)

    // Funcion que pasa el monto de para efectuar el pago de la transaccion
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

    // Hacemos peticion al server para obtener los fee de las monedas
    const feesPercentage = async () => {
        try {
            setLoader(true)

            const { data } = await http.get('/fees-percentage')

            if (Object.values(data).length > 0) {
                store.dispatch({ type: SETSTORAGE, payload: { ...global.data, fee: data } } )
            }

        } catch (error) {
            showNotification(error.toString())
        } finally {
            setLoader(false)
        }
    }

    useEffect(() => {
        feesPercentage()
        const onSubscribe = navigation.addListener('focus', () => {
            setAmount('')
        })

        return onSubscribe
    }, [])

    return (
        <Container showLogo onRefreshEnd={feesPercentage}>
            <Loader isVisible={loader} />
            <Card />
            <View style={styles.container}>
                <View style={styles.containerTitle}>
                    <Text style={styles.legendTitle}>Facturar transaccion</Text>
                </View>

                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.legend}>Ingrese el monto (USD)</Text>

                        <TextInput
                            style={[GlobalStyles.textInput]}
                            placeholder="0.00"
                            placeholderTextColor={Colors.$colorGray}
                            value={amount}
                            keyboardType='email-address'
                            keyboardType="numeric"
                            onChangeText={(value) => setAmount(value)}
                        />
                    </View>
                </View>

                <View style={[styles.buttonPosition]}>
                    <TouchableOpacity onPress={handleSubmit} style={[GlobalStyles.buttonPrimary,]}>
                        <Text style={GlobalStyles.textButton}>Procesar transaccion</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.positionLogo}>
                    <Image source={Logo} style={styles.logo} />
                </View>
                <Loader isVisible={loader} />
            </View>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: RFValue(10),
        padding: 10
    },
    containerTitle: {
        flexDirection: "row",
        justifyContent: "center"
    },
    col: {
        flex: 1,
        marginHorizontal: RFValue(10),
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: RFValue(10)
    },
    legendTitle: {
        color: Colors.$colorYellow,
        fontSize: RFValue(24),
        textTransform: 'uppercase',
        marginBottom: 10
    },
    legend: {
        color: Colors.$colorYellow,
        marginBottom: 10
    },
    buttonPosition: {
        marginVertical: 16,
        paddingHorizontal: 10,
        width: '100%'
    },
    logo: {
        width: RFValue(300),
        height: RFValue(90),
        marginBottom: RFValue(40),
    },
    positionLogo: {
        flex:1,
        alignItems: "center",
        justifyContent: "center",
        padding:20
    }

})

export default Payment