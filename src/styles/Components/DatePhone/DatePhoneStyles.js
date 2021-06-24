import { Colors, RFValue } from "../../../utils/constants.util"

export default {
    containerTitle: {
        flex: 1,
        alignItems: "center",
        padding: 20,
    },
    subContainer: {
        alignItems: "center",
        padding: 20,
    },
    containerModal: {
        justifyContent: "center",
        alignSelf: "center",
        backgroundColor: Colors.$colorBlack,
        borderRadius: 10,
        padding: 10,
        height: "100%",
        width: "100%",
    },

    containerImageFooter: {
        paddingTop: 20,
        marginHorizontal: 10,
    },
    containerButton: {
        alignSelf: "center",
        marginTop: 10,
    },
    button: {
        alignItems: "center",
        borderRadius: 40,
        justifyContent: "center",
        padding: 10,
        borderWidth: 0,
        backgroundColor: Colors.$colorRed,
    },
    row: {
        alignItems: "center",
        padding: 10,
    },
    row2: {
        flexDirection: "column",
        width: "100%",
        marginVertical: 10,
    },
    lengendTitle: {
        color: Colors.$colorYellow,
        fontSize: RFValue(24),
    },
    lengendSubTitle: {
        color: "#FFF",
        fontSize: RFValue(40),
    },
    lengendLouding: {
        color: "#FFF",
        fontSize: RFValue(18),
    },

    lengendSubTitleModal: {
        color: "#FFF",
        fontSize: RFValue(18),
        textAlign: "justify",
    },
    logo: {
        alignSelf: "center",
        resizeMode: "contain",
        height: RFValue(150),
        width: "100%",
    },
    logoFooter: {
        alignSelf: "center",
        resizeMode: "contain",
        height: RFValue(150),
        width: "100%",
    },

    // Estilos del QR
    qrCodeContainer: {
        alignSelf: "center",
        alignItems: "center",
        backgroundColor: Colors.$colorYellow,
        borderRadius: RFValue(10),
        borderWidth: 10,
        borderColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        padding: 10,
    },

    orderNumber: {
        color: Colors.$colorGray,
        fontSize: RFValue(18),
        textAlign: "center",
    },
    currencyText: {
        color: Colors.$colorGray,
        fontSize: RFValue(24),
        textAlign: "center",
    },
    amountText: {
        color: Colors.$colorGray,
        fontSize: RFValue(16),
        textAlign: "center",
    },
    statusRow: {
        flexDirection: "row",
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: RFValue(20),
        width: "80%",
    },
    status: {
        color: Colors.$colorGray,
        fontSize: RFValue(16),
        marginLeft: 5,
    },
    cancelText: {
        color: Colors.$colorRed,
        fontSize: RFValue(14),
        textDecorationLine: "underline",
    },
    cancelButton: {
        padding: RFValue(10),
    },
    modalView: {
        alignSelf: "center",
        justifyContent: "center",
        backgroundColor: Colors.$colorBlack,
        borderRadius: 10,
        padding: 10,
        height: "70%",
        width: "85%",
    },
    animationContainer: {
        height: RFValue(150),
        width: RFValue(150),
        alignItems: "center",
        justifyContent: "center",
    },
    textAlertStyle: {
        fontSize: RFValue(24),
        fontWeight: "bold",
    },
    loader: {
        height: RFValue(36),
        width: RFValue(36),
    },
    waitingPayment: {
        alignItems: "center",
        flexDirection: "row",
    },
    title: {
        color: Colors.$colorGray,
        fontSize: RFValue(24),
        textAlign: "center",
        textTransform: "uppercase",
    },
    row: {
        flexDirection: "column",
        width: "100%",
        marginVertical: 10,
        padding: 10,
    },
    animation: {
        height: RFValue(160),
        width: RFValue(160),
    },
}
