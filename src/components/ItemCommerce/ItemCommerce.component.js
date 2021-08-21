import React, { useEffect } from "react"
import { View, Text, TouchableOpacity, Image } from "react-native"

// Import Component
import _ from "lodash"
import { useNavigation } from "@react-navigation/native"
import { RFValue } from "../../utils/constants.util"

// Import Hooks
import useStyles from "../../Hooks/useStyles.hook"

// Import Styles
import { ItemCommerceStyles } from "../../styles/Components/index"

// Import Assets
import tether from "../../assets/img/tether.png"

// Import Store
import store from "../../store/index"
import { SETWALLETINFO } from "../../store/actionTypes"

const ItemComerce = ({
    data = {},
    disabled = false,
    walletInfoData = {},
    children = false,
}) => {
    const { global, walletInfo } = store.getState()
    const { navigate } = useNavigation()
    const styles = useStyles(ItemCommerceStyles)

    const onInfoCommerce = () => {
        store.dispatch({ type: SETWALLETINFO, payload: data.item })
        navigate("WalletCommerce", data)
    }

    return (
        <>
            {children !== false ? (
                <>
                    <TouchableOpacity
                        disabled={disabled}
                        style={styles.container}
                        onPress={onInfoCommerce}>
                        <Image
                            style={styles.logo}
                            source={{ uri: walletInfo?.profile_picture }}
                        />

                        <View style={styles.cardInformation}>
                            <View style={styles.headerTableTitle}>
                                <Text style={styles.textHeaderTableTitle}>
                                    {walletInfo?.commerce_name}
                                </Text>
                                <Image source={tether} style={styles.icon} />
                            </View>

                            <View style={styles.lineTitle} />

                            <View style={styles.dataDetailsInfoContainer}>
                                <View style={styles.headerTable}>
                                    <Text
                                        style={[
                                            styles.textHeaderTable,
                                            { alignSelf: "flex-start" },
                                        ]}>
                                        Dirección
                                    </Text>
                                    <Text style={styles.textRowTable}>
                                        {walletInfo?.physical_address}
                                    </Text>
                                </View>
                                <View style={styles.bodyRowTable}>
                                    <Text style={styles.textHeaderTable}>
                                        Balance
                                    </Text>
                                    <Text style={styles.textRowTable}>
                                        {_.floor(walletInfoData?.amount, 2)}
                                        <Text style={{ fontSize: RFValue(9) }}>
                                            {walletInfoData?.symbol}
                                        </Text>
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <TouchableOpacity
                        style={styles.container}
                        onPress={onInfoCommerce}>
                        <Image
                            style={styles.logo}
                            source={{ uri: data.item?.profile_picture }}
                        />

                        <View style={styles.cardInformation}>
                            <View style={styles.headerTableTitle}>
                                <Text style={styles.textHeaderTableTitle}>
                                    {data.item?.commerce_name}
                                </Text>
                                <Image source={tether} style={styles.icon} />
                            </View>

                            <View style={styles.lineTitle} />

                            <View style={styles.dataDetailsInfoContainer}>
                                <View style={styles.headerTable}>
                                    <Text
                                        style={[
                                            styles.textHeaderTable,
                                            { alignSelf: "flex-start" },
                                        ]}>
                                        Dirección
                                    </Text>
                                    <Text style={styles.textRowTable}>
                                        {data.item?.physical_address}
                                    </Text>
                                </View>
                                <View style={styles.bodyRowTable}>
                                    <Text style={styles.textHeaderTable}>
                                        Balance
                                    </Text>
                                    <Text style={styles.textRowTable}>
                                        {_.floor(data.item?.amount, 2)}
                                        <Text style={{ fontSize: RFValue(9) }}>
                                            {data.item?.symbol}
                                        </Text>
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </>
            )}
        </>
    )
}

export default ItemComerce
