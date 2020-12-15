import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

// Import Componente
import { Image, View as ViewAnimation } from 'react-native-animatable'
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '../../utils/constants.util';

// Import Assets
import images from '../../assets/img/Recurso.png'

const UploadImage = ({ onChange, value }) => {
    return (
        <ViewAnimation style={styles.container} animation="fadeIn">
            <View style={styles.containerImage}>
                <TouchableOpacity onPress={onChange}>
                    <Image source={value ? { uri: value.uri } : images} style={value ? styles.bigPicture : styles.images} />
                </TouchableOpacity>
                {
                    !value &&
                    <Text style={styles.legendImage}>Presiona para subir o tomar una fotografia</Text>
                }
            </View>
        </ViewAnimation >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    containerImage: {
        alignItems: "center",
        backgroundColor: Colors.$colorMain,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: Colors.$colorYellow,
        borderStyle: "dashed",
        padding: 15
    },
    images: {
        alignContent: "center",
        resizeMode: "contain",
        height: RFValue(120),
        width: RFValue(250),
    },
    bigPicture: {
        alignContent: "center",
        resizeMode: "contain",
        height: RFValue(180),
        width: RFValue(300),
    },
    positionLabel: {
        marginBottom: 5,
    },
    legendImage: {
        fontSize: RFValue(15),
        color: Colors.$colorYellow
    },
    deleteImage: {
        alignItems: "center",
        backgroundColor: Colors.colorRed,
        borderColor: Colors.colorGray,
        borderRadius: 10,
        borderWidth: 1,
        height: 25,
        width: 40
    },
})

export default UploadImage