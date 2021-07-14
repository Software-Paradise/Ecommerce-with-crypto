import React from "react"
import { View, Text, TouchableOpacity, Image } from "react-native"

// Import Component
import _ from "lodash"

// Import Hooks
import useStyles from "../../Hooks/useStyles.hook"

// Import Styles
import { ItemCommerceStyles } from "../../styles/Components/index"

// Import Assets

const ItemComerce = ({ data = {} }) => {
    const styles = useStyles(ItemCommerceStyles)

    console.log("DataItem", data)
    return (
        <>
            <TouchableOpacity style={styles.container}>
                <Image style={styles.logo} source={{ uri: data }} />

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
                            <Text style={styles.textHeaderTable}>Balance</Text>
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
    )
}

export default ItemComerce
