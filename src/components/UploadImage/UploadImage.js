import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

// Import Componente
import { Image, View as ViewAnimation } from 'react-native-animatable'
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '../../utils/constants.util';

// Import Assets
import images from '../../assets/img/Recurso.png'
import pdf from '../../assets/img/uploadPdf.png'

const UploadImage = ({ onChange, value, isPdf = false }) => {
    return (
        <ViewAnimation style={styles.container} animation="fadeIn">
            <View style={styles.containerImage}>
                <TouchableOpacity onPress={onChange}>
                    {
                        value && value.type === 'application/pdf'
                            ? <Text style={styles.legendTitle}>{value.name}</Text>
                            : <Image source={isPdf ? pdf : (value ? { uri: value.uri } : images)} style={value ? styles.bigPicture : styles.images} />
                    }
                </TouchableOpacity>
                {
                    (!value && isPdf) &&
                    <Text style={styles.legendImage}>Presiona para subir o tomar una fotografia</Text>
                }
                {
                    (!value && !isPdf) &&
                    < Text style={styles.legendImage}>Presiona para subir o tomar una fotografia</Text>
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
    panel: {
        padding: 20,
        backgroundColor: Colors.$colorBlack,
        paddingTop: 20
    },
    panelTitle: {
        fontSize: RFValue(25),
        color: "#FFF"
    },
    panelButton: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: Colors.$colorGray,
        alignItems: 'center',
        marginVertical: 7,
    },
    panelButtonTitle: {
        fontSize: 17,
        color: Colors.$colorYellow,
        fontWeight: 'bold',
        // color: 'white',
    },
    legendTitle: {
        color: Colors.$colorYellow,
        fontSize: RFValue(16),
        padding: 10,
    },
})

export default UploadImage