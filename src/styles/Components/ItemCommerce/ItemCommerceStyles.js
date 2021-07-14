import { Colors, RFValue } from "../../../utils/constants.util"

export default {
    container: {
        alignItems: "center",
        backgroundColor: Colors.$colorBlack,
        borderRadius: RFValue(5),
        padding: RFValue(10),
        marginVertical: RFValue(5),
        marginHorizontal: RFValue(10),
        flexDirection: "row",
        elevation: 25,
    },

    cardInformation: {
        flexDirection: "column",
        justifyContent: "center",
        flex: 1,
    },
    headerTableTitle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerTable: {
        flexDirection: "column",
        justifyContent: "flex-start",
        width: "50%",
    },
    textHeaderTableTitle: {
        fontSize: RFValue(14),
        color: Colors.$colorYellow,
    },
    textHeaderTable: {
        textAlign: "right",
        fontSize: RFValue(13),
        color: Colors.$colorYellow,
    },
    bodyRowTable: {
        flexDirection: "column",
        justifyContent: "flex-end",
    },
    textRowTable: {
        color: "#FFF",
        fontSize: RFValue(13),
    },
    lineTitle: {
        borderBottomColor: Colors.$colorYellow,
        borderBottomWidth: 1,
        marginVertical: RFValue(10),
        width: "100%",
    },
    dataDetailsInfoContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    icon: {
        width: RFValue(30),
        height: RFValue(30),
    },
    logo: {
        borderRadius: 10,
        height: RFValue(80),
        resizeMode: "cover",
        overflow: "hidden",
        marginRight: RFValue(10),
        width: RFValue(80),
    },
}
