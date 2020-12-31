import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native'

// Import Constants
import { Colors, RFValue, GlobalStyles, showNotification } from '../../utils/constants.util'
import Loader from '../../components/Loader/Loader'
import { useNavigation } from '@react-navigation/native';

// Import component
import Container from '../Container/Container'
import Card from '../../components/CardProfile/CardProfile'

// Import Assets
// import Logo from '../../assets/img/logo.png'

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
        <Container showLogo>
            <Card />
            <View style={styles.container}>
                {/* <View style={{ alignItems: 'center' }}>
                <Image source={Logo} style={styles.logo} />
            </View> */}

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
                <Loader isVisible={loader} />
            </View>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: RFValue(10),
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
        height: RFValue(100),
        marginBottom: RFValue(40),
    },

})

export default Payment