import React, { useEffect, useCallback, useState } from "react"
import { View, Text, TouchableOpacity, Image, Alert } from "react-native"

// Import Component
import Container from "../Container/Container"
import Lottie from "lottie-react-native"
import SocketIo from "socket.io-client"
import Modal from "react-native-modal"
import QRCode from "react-native-qrcode-svg"
import * as CryptoJS from "react-native-crypto-js"

// Import Hooks
import useStyles from "../../Hooks/useStyles.hook"

// Import Sytles
import { DatePhoneStyles } from "../../styles/Components/index"

// Imort Constan
import { socketAddress, Colors, RFValue } from "../../utils/constants.util"

// Import Assets
import Logo from "../../assets/img/logo.png"
import Footer from "../../assets/img/aly-system-by.png"
import { set } from "react-native-reanimated"

/* const QrCodeScanner = () => {
    return (
        <View>
            <View>
                <Text>Detalle de la factura</Text>
            </View>

            <View>
                <QRCode />
            </View>
        </View>
    )
} */

const DatePhone = ({ navigation }) => {
    const classes = useStyles(DatePhoneStyles)
    const [data, setDataSocket] = useState({})
    const [accessKey, setAccessKey] = useState(null)

    /**
     * Estados que visualizan los modales de inicio al datafono
     */

    //Primer modal que renderiza el Keysecret para visualizarlo en la web
    const [showConnection, setShowConnection] = useState(true)

    // Estado que se visualiza cuando esta en espera la transaccion
    const [showModal, setShowModal] = useState(false)

    const [conecctionSocket, setConnectionSocket] = useState()

    const getAccessKey = () => accessKey

    const connection = useCallback(() => {
        const socket = SocketIo(socketAddress, {
            path: "/socket-dataphone",
            query: {
                accessKey: getAccessKey(),
            },
            forceNew: true,
            transports: ["websocket"],
        })

        setConnectionSocket(socket)

        socket.on("reconnect_attempt", (_) => {
            socket.io.opts.transports = ["websocket"]
        })

        socket.on("connection", () => {
            console.log("Conectado")
        })

        socket.on("message", (message) => {
            console.log(message)
            setAccessKey(message.accessKey)
        })

        socket.on("registered", () => {
            setShowModal(true)
            setShowConnection(false)
        })

        socket.on("unregistered", () => {
            setShowModal(false)
            setShowConnection(false)
        })

        socket.on("newbill", (newBill) => {
            console.log("NewBill", newBill)

            setDataSocket(newBill)
            setShowModal(false)
        })
    })

    const cypherdata = CryptoJS.AES.encrypt(
        JSON.stringify({
            id: data.order.id,
            orderId: data.order.orderId,
            wallet_commerce: data.order.wallet,
            description: data.order.description,
            amount: data.order.amount,
        }),
        data.keySecret,
    )

    // Metodo se ejecuta cuando un usuaro cancela la orden
    const goBack = () => {
        Alert.alert(
            "Estas a punto de salir del modo datáfono",
            "Realmente desea confirmar la accion",
            [
                {
                    text: "Cancelar",
                    onPress: () => {},
                },
                {
                    text: "Si, salir",
                    onPress: () => {
                        setShowConnection(false)
                        conecctionSocket.disconnect(true)
                        navigation.pop()
                    },
                },
            ],
        )
    }

    useEffect(() => {
        connection()
    }, [])

    return (
        <Container showLogo>
            {Object.keys(data).length > 0 && (
                <>
                    <View style={classes.statusRow}>
                        <Text>Orden # {data.order.orderId}</Text>
                        <Text>{data.order.amount}</Text>
                    </View>

                    <View style={classes.qrCodeContainer}>
                        <QRCode
                            backgroundColor={Colors.$colorYellow}
                            size={RFValue(310)}
                            value={(`${data.keySecret}`, `${cypherdata}`)}
                        />
                    </View>
                </>
            )}

            <Modal isVisible={showConnection}>
                <View style={classes.containerModal}>
                    <View style={classes.containerTitle}>
                        <Image source={Logo} style={classes.logo} />
                        <Text style={classes.lengendTitle}>
                            Vincular dispositivo
                        </Text>
                    </View>

                    <View style={classes.subContainer}>
                        <Text style={classes.lengendSubTitle}>{accessKey}</Text>
                        <View style={classes.row}>
                            <Text style={classes.lengendLouding}>
                                Esperando
                            </Text>
                        </View>
                    </View>

                    <View style={classes.containerButton}>
                        <TouchableOpacity
                            onPress={goBack}
                            style={[classes.containerButton, classes.button]}>
                            <Text style={{ fontSize: 14, color: "#FFF" }}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={classes.containerImageFooter}>
                        <Image source={Footer} style={classes.logoFooter} />
                    </View>
                </View>
            </Modal>

            <Modal
                isVisible={showModal}
                onBackdropPress={(_) => setShowConnection(false)}
                onBackButtonPress={(_) => setShowConnection(false)}>
                <View style={classes.containerModal}>
                    <View style={{ alignItems: "center" }}>
                        <View style={[classes.row2, { alignItems: "center" }]}>
                            <Text style={[classes.lengendTitle]}>
                                Esperando transacción
                            </Text>
                        </View>
                    </View>
                    <View style={{ alignItems: "center" }}>
                        <View style={[classes.row2]}>
                            <Text style={classes.lengendSubTitleModal}>
                                Cuando genere una transacción se visualizara el
                                QR correspondiente
                            </Text>

                            <View style={classes.row}>
                                <Text style={classes.lengendLouding}>
                                    Esperando...
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </Container>
    )
}

export default DatePhone
