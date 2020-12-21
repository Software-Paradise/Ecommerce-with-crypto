import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native';

// Import Component
import Loader from '../Loader/Loader'
import Search from '../Search/Search'
import HistorElement from '../HistoryElement/HistoryElement'
import Lottie from 'lottie-react-native'
import EmptyBox from '../../animations/empty-state.json'
import { View as ViewAnimation } from 'react-native-animatable'
import { useNavigation } from '@react-navigation/native'

// Import Constants and Functions
import { http, showNotification, RFValue, Colors, getHeaders } from '../../utils/constants.util'

// Redux Store
import store from '../../store'

const History = () => {
    const { global } = store.getState()
    const { navigate } = useNavigation()

    const [loader, setLoader] = useState(false)

    // Estado que almacena los datos de la api
    const [transaction, setTransaction] = useState([])

    const getAllData = async () => {
        try {
            setLoader(true)
            // Consumimos la api
            const { data } = await http.get(`/api/ecommerce/wallet/details/${global.wallet_commerce}`, getHeaders())
            setTransaction(data.history)

        } catch (error) {
            showNotification(error.toString())
        } finally {
            setLoader(false)
        }
    }

    useEffect(() => {
        getAllData()
    }, [])

    return (
        <>
            <ViewAnimation style={styles.container}>
                <Loader isVisible={loader} />
                <Search />
                {
                    (transaction.length > 0)
                        ?
                        <FlatList
                            keyExtractor={(_, key) => (key = key.toString())}
                            data={transaction}
                            renderItem={({ item, index }) => <HistorElement navigate={navigate} item={item} index={index} />}
                        />
                        :
                        <View>
                            <Lottie source={EmptyBox} autoPlay loop={false} style={styles.empty} />
                            <Text style={styles.titleText}>No hay transacciones realizadas</Text>
                        </View>
                }
            </ViewAnimation>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: RFValue(10),
        padding: RFValue(10)
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
    },
    empty: {
        alignSelf: "center",
        // resizeMode: "contain",
        height: RFValue(250),
        width: RFValue(250),
    },
    titleText: {
        fontSize: RFValue(20),
        textAlign: 'center',
        color: Colors.$colorGray
    }
})

export default History