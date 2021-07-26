import React, { useState, useEffect } from "react"
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
} from "react-native"

// Import Constants and functions
import {
    Colors,
    RFValue,
    showNotification,
    GlobalStyles,
} from "../../utils/constants.util"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/MaterialIcons"

const Search = () => {
    const [searchText, setSearchText] = useState("")
    const { navigate } = useNavigation()

    // Funcion que pasa por parametro el hash para el detalle de la transaccion
    const goToSearch = () => {
        try {
            // verificamos si el hash es de un formato correcto
            if (searchText.length < 50) {
                throw String("Ingrese un hash de formato correcto")
            } else {
                navigate("Description", { hash: searchText })
                setSearchText("")
            }
        } catch (error) {
            showNotification(error.toString())
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={styles.col}>
                    <View style={styles.rowInput}>
                        <TextInput
                            style={[GlobalStyles.textInput, { flex: 1 }]}
                            value={searchText}
                            onChangeText={setSearchText}
                            placeholder="Buscar detalle de transaccion"
                            placeholderTextColor={Colors.$colorGray}
                        />

                        <TouchableOpacity
                            onPress={goToSearch}
                            style={styles.buttonSearch}>
                            <Icon name="search" size={RFValue(40)} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: RFValue(10),
    },

    textInput: {
        backgroundColor: Colors.$colorBlack,
        borderColor: Colors.$colorYellow,
        borderRadius: 5,
        borderWidth: 1.5,
        color: "#FFF",
        padding: RFValue(5),
    },
    col: {
        flex: 1,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        // marginVertical: RFValue(10)
    },
    rowInput: {
        alignItems: "center",
        flexDirection: "row",
    },
    buttonSearch: {
        backgroundColor: Colors.$colorYellow,
        borderRadius: RFValue(5),
        padding: RFValue(5),
        marginLeft: RFValue(10),
        height: RFValue(50),
        width: RFValue(50),
    },
    lottieQRAnimation: {
        height: RFValue(40),
        width: RFValue(40),
    },
})

export default Search
