import React from "react"
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native"

// Import Component
import Container from "../../components/Container/Container"
import ItemComerce from "../../components/ItemCommerce/ItemCommerce.component"

// Import Seriveces

// Import Hooks
import useStyles from "../../Hooks/useStyles.hook"

// Import Styles
import { ListCommerceStyle } from "../../styles/Views/index"

// Import Stort
import store from "../../store/index"

const ListCommerce = () => {
    const classes = useStyles(ListCommerceStyle)

    const { global } = store.getState()

    return (
        // <View style={classes.main}>
        <Container showLogo>
            <View style={classes.containerTitle}>
                <Text style={classes.title}>Listado de comercios</Text>
            </View>

            <View style={classes.contentList}>
                <FlatList
                    data={global.wallets}
                    keyExtractor={(_, i) => i}
                    renderItem={(item) => <ItemComerce data={item} />}
                />
            </View>
        </Container>
        // </View>
    )
}

export default ListCommerce
