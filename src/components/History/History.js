import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput } from 'react-native';

// Import Component
import HistorElement from '../HistoryElement/HistoryElement'
import Lottie from 'lottie-react-native'
import EmptyBox from '../../animations/empty-state.json'
import { View as ViewAnimation } from 'react-native-animatable'

// Import Constants and Functions
import { http, showNotification, GlobalStyles, RFValue, Colors, getHeaders } from '../../utils/constants.util'

// Redux Store
import store from '../../store'

const History = () => {
    const { global } = store.getState()

    // Estado que almacena los datos de la api
    const [transaction, setTransaction] = useState([])

    // Estado que guarda el hash escrito
    const [searchText, setSearchText] = useState("")

    // Estado que muestra la precarga antes de realizar la petición
    const [loader, setLoader] = useState(false)

    const getAllData = async () => {
        try {
            // Consumimos la api
            const { data } = await http.get(`/api/ecommerce/wallet/details/${global.wallet_commerce}`, getHeaders())

            console.log(data.history)
            setTransaction(data.history)

        } catch (error) {
            showNotification(error.toString())
        }
    }

    const goToSearch = () => {
        try {
            if (searchText.length < 50) {
                throw String("Ingrese un has de formato correcto")
            }
            navigation.navigate("Description", { hash: searchText })

        } catch (error) {
            showNotification(error.toString())
        }
    }

    useEffect(() => {
        getAllData()
    }, [])

    return (
        <ViewAnimation style={styles.container}>
            <View style={styles.row}>
                <View style={styles.col}>
                    <TextInput
                        style={GlobalStyles.textInput}
                        value={searchText}
                        onChange={setSearchText}
                        placeholder={"Buscar detalle de transaccion"}
                        placeholderTextColor={Colors.$colorGray}
                        returnKeyType='search'
                    />
                </View>
            </View>
            {
                (transaction.length > 0)
                    ?
                    <FlatList
                        keyExtractor={(_, key) => (key = key.toString())}
                        data={transaction}
                        renderItem={HistorElement}
                    />
                    :
                    <View>
                        <Lottie source={EmptyBox} autoPlay loop={false} style={styles.empty} />

                        <Text style={styles.titleText}>No hay transacciones realizadas</Text>
                    </View>
            }
        </ViewAnimation>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: RFValue(10),
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: RFValue(10)
    },
    col: {
        flex: 1,
        marginHorizontal: RFValue(10),
    },
    Input: {
        backgroundColor: Colors.$colorMain,
        borderColor: Colors.$colorYellow,
        borderRadius: 10,
        borderWidth: 2,
        color: '#FFF',
        elevation: 5,
        padding: RFValue(10),
    }
})

export default History