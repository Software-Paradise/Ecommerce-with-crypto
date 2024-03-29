import React, { useState, useEffect } from "react"
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native"

// Import Component
import Container from "../Container/Container"
import Icon from "react-native-vector-icons/Ionicons"
import Loader from "../Loader/Loader"
import _ from "lodash"
import Lottie from "lottie-react-native"

// Import constants and functions
import moment from "moment"
import {
    http,
    showNotification,
    CopyClipboard,
    RFValue,
    Colors,
} from "../../utils/constants.util"

// Import Assets
import empty from "../../animations/empty-state.json"

const Description = ({ route }) => {
    const [details, setDetails] = useState({})
    const [loader, setLoader] = useState(false)
    const hash = route.params?.hash

    // Hacemos la peticon al server para obtener los detalles de las transacciones
    const getAllDetails = async () => {
        try {
            setLoader(true)

            const { data } = await http.get(`/blockchain/transaction/${hash}`)

            if (data.error) {
                throw String(data.message)
            }

            setDetails(data)
        } catch (error) {
            showNotification(error.toString())
        } finally {
            setLoader(false)
        }
    }

    useEffect(() => {
        getAllDetails()
    }, [])

    /// Total de factura
    const totalBill =
        details.id_type === 6
            ? _.subtract(details.amount_usd, details.commerce_fee)
            : _.add(details.amount_usd, details.amount_fee_usd)

    // constante que retorna si encontro datos
    const foundData = Object.keys(details).length > 0 && !loader

    return (
        <Container showLogo>
            <Loader isVisible={loader} />
            {foundData && (
                <ScrollView>
                    <View style={styles.containerTitlePrincipal}>
                        <Text style={styles.titlePrincipal}>
                            Detalle de Transacción
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={(_) => CopyClipboard(details.hash)}>
                        <View style={[styles.hashsec, styles.text]}>
                            <View style={styles.containertitle}>
                                <Text style={styles.title}>HASH</Text>
                                <Icon
                                    name="ios-copy"
                                    size={15}
                                    color="#877E7C"
                                />
                            </View>
                            <View style={styles.containertitle}>
                                <Text style={styles.subtitle}>
                                    {details.hash
                                        ? details.hash.substr(0, 36)
                                        : ""}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <View style={[styles.hashsec, styles.text]}>
                        <View style={styles.containertitle}>
                            <Text style={styles.title}>Descripcion</Text>
                            <Text style={styles.subtitle}>
                                {details.description_transaction}
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.facePost, styles.text]}>
                        <View style={styles.containerPrinc}>
                            <View style={styles.containertitle}>
                                <Text style={styles.title}>Fecha</Text>
                                <Text style={styles.title}>Hora</Text>
                            </View>

                            <View style={styles.containertitle}>
                                <Text style={styles.subtitle}>
                                    {details.date_create
                                        ? moment(details.date_create).format(
                                              "DD/MM/YYYY",
                                          )
                                        : ""}
                                </Text>
                                <Text style={styles.subtitle}>
                                    {details.date_create
                                        ? moment(details.date_create).format(
                                              "HH:mm a",
                                          )
                                        : ""}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.containerPrinc}>
                            <View style={styles.containertitle}>
                                <Text style={styles.title}>
                                    Monto de Transacción
                                </Text>
                                <Text style={styles.title}>Monto (USD)</Text>
                            </View>

                            <View style={styles.containertitle}>
                                <Text style={styles.subtitle}>
                                    {details.amount ? details.amount : ""}
                                </Text>
                                <Text style={styles.subtitle}>
                                    {details.amount_usd
                                        ? details.amount_usd
                                        : ""}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.containerPrinc}>
                            <View style={styles.containertitle}>
                                <Text style={styles.title}>Moneda</Text>
                                <Text style={styles.title}>Fee</Text>
                            </View>

                            <View style={styles.containertitle}>
                                <Text style={styles.subtitle}>
                                    {details.name_coin_to
                                        ? details.name_coin_to
                                        : details.name_coin_transaction}
                                </Text>
                                <Text style={styles.subtitle}>
                                    {details.id_type === 6
                                        ? `${details.commerce_fee} ${details.symbol}`
                                        : `${details.amount_fee} ${details.coin_fee}`}
                                </Text>
                            </View>
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                            }}>
                            <Text style={styles.titleTotal}>Total: </Text>

                            <View style={{ justifyContent: "center" }}>
                                <Text
                                    style={{
                                        color: "#FFF",
                                        fontSize: RFValue(20),
                                    }}>
                                    {_.floor(totalBill, 2)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={(_) => CopyClipboard(details.wallet_too)}>
                        <View style={[styles.hashsec, styles.text]}>
                            <View style={styles.containertitle}>
                                <Text style={styles.title}>
                                    Billetera Remitente
                                </Text>
                                <Icon
                                    name="ios-copy"
                                    size={15}
                                    color="#877E7C"
                                />
                            </View>

                            <View style={styles.containertitle}>
                                {details.wallet_to ? (
                                    <Text style={styles.subtitle}>
                                        {details.wallet_to.substr(0, 36)}
                                    </Text>
                                ) : (
                                    <Text style={styles.textInfoEmpty}>
                                        SIN DATOS
                                    </Text>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={(_) => CopyClipboard(details.wallet_from)}>
                        <View style={[styles.hashsec, styles.text]}>
                            <View style={styles.containertitle}>
                                <Text style={styles.title}>
                                    Billetera Receptora
                                </Text>
                                <Icon
                                    name="ios-copy"
                                    size={15}
                                    color="#877E7C"
                                />
                            </View>

                            <View style={styles.containertitle}>
                                <Text style={styles.subtitle}>
                                    {details.wallet_from
                                        ? details.wallet_from.substr(0, 36)
                                        : ""}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            )}

            {!foundData && (
                <>
                    <View style={styles.containerError}>
                        <Lottie
                            source={empty}
                            style={styles.empty}
                            loop={false}
                            autoPlay
                        />
                        <Text style={styles.titlePrincipal}>
                            No hay transacciones realizadas
                        </Text>
                    </View>
                </>
            )}
        </Container>
    )
}
const styles = StyleSheet.create({
    containerTitlePrincipal: {
        alignItems: "center",
    },
    titlePrincipal: {
        color: Colors.$colorYellow,
        fontSize: RFValue(24),
        padding: RFValue(5),
    },
    //Secciones de los detalles
    facePost: {
        backgroundColor: Colors.$colorBlack,
        margin: 10,
        borderRadius: 5,
    },
    hashsec: {
        backgroundColor: Colors.$colorBlack,
        margin: 10,
        borderRadius: 5,
    },
    scroll: {
        paddingHorizontal: RFValue(5),
    },
    text: {
        padding: 5,
    },
    title: {
        color: Colors.$colorYellow,
        fontSize: RFValue(14),
    },
    // Contenedor de los titulos principales estaticos
    containertitle: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: RFValue(5),
    },
    //contenedor de los subtitulos
    containerPrinc: {
        flexDirection: "column",
        justifyContent: "space-between",
        marginBottom: 20,
        borderBottomColor: Colors.$colorYellow,
        borderBottomWidth: 2,
        borderRadius: 3,
    },
    //subtitulos de los textos
    subtitle: {
        color: "#CCC",
        fontSize: RFValue(16),
        textTransform: "uppercase",
    },
    textInfoEmpty: {
        alignSelf: "center",
        color: Colors.$colorMain,
        flex: 1,
        fontSize: RFValue(18),
        textAlign: "center",
        marginVertical: RFValue(10),
    },
    titleTotal: {
        color: Colors.$colorYellow,
        fontSize: RFValue(20),
        padding: RFValue(5),
    },
    empty: {
        alignSelf: "center",
        resizeMode: "contain",
        height: RFValue(250),
        width: RFValue(250),
    },
    containerError: {
        alignItems: "center",
    },
})

export default Description
