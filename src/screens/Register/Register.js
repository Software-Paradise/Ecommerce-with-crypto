import React, { useState, useReducer, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList, Alert, KeyboardAvoidingView } from 'react-native'

// Import Component
import Container from '../../components/Container/Container'
import Loader from '../../components/Loader/Loader'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Modal from 'react-native-modal'
import UploadImage from '../../components/UploadImage/UploadImage'
import { launchCamera } from 'react-native-image-picker'
import { Image, View as ViewAnimation } from 'react-native-animatable'
import { Picker } from '@react-native-community/picker'
import DocumentPicker from 'react-native-document-picker'
import CheckBox from "react-native-check-box"

// Import constanst and funtions
import { Colors, showNotification, http, getHeaders, RFValue, GlobalStyles, checkPermissionCamera } from '../../utils/constants.util'
import countries from '../../utils/countries.json'
import validator from 'validator'

// Import Assets
import Logo from '../../assets/img/logo.png'
import Funko from '../../assets/img/AlyFunko.png'

const initialState = {
    companyName: '',
    companyRuc: '',
    country: countries[0],
    phoneCode: '',
    repFirstName: '',
    repLastName: '',
    repPhone: '',
    repIdNumber: '',
    repIDType: '',
    repEmail: '',
    username: '',
    password: '',

    filter: '',

    executive: false
}

const reducer = (state, action) => {
    return {
        ...state,
        [action.type]: action.payload
    }
}

const optionsOpenCamera = {
    //noData: true,
    maxHeight: 1024,
    maxWidth: 1024,
    quality: 0.5,
    mediaType: "photo",
    storageOptions: {
        skipBackup: true,
        path: 'Pictures/myAppPicture/', //-->this is FUCK neccesary
        privateDirectory: true,
        cameraRoll: false
    }
}

const Register = ({ navigation }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [loader, setLoader] = useState(false)
    const [dataRegister, setDataRegister] = useState('')

    const [confirmPassword, setConfirmPassword] = useState('')

    // Estado que indica si muestra la modal de paises
    const [modalCoutry, setModalCountry] = useState(false)

    // Estados que permiten previsualizar las contraseñas
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Estados que almacenan la informacion de las imagenes
    const [operationPermission, setOperationPermission] = useState('');
    const [RUCImage, setRUCImage] = useState('');
    const [legalPower, setLegalPower] = useState('');
    const [repID, setRepID] = useState('')

    // Estado que verifica si agregamos un Ejectivo o no
    const [check, setCheck] = useState(false)
    const [excute, setExcute] = useState('')

    // Estado que almacena la peticion de los terminoss y condiciones
    const [terms, setTerms] = useState('')
    const [showTerms, setShowTerms] = useState(false)

    // Estado que indica si muestra el modal de success
    const [modalSuccess, setModalSuccess] = useState(false)
    /**
     * Funcion que permite guardar la seleccion del pais
     * @param {*} item 
     */
    const selectedCountry = (item) => {
        dispatch({ type: "country", payload: item })

        setModalCountry(false)
    }

    /**render element country modal */
    const ItemCountry = ({ item }) => {
        if (item.name.length > 0 && item.name.toLowerCase().search(state.filter.toLocaleLowerCase()) > -1) {
            return (
                <TouchableOpacity style={styles.itemCountry} onPress={_ => selectedCountry(item)}>
                    <Text style={{ color: "#FFF" }}>{item.name}</Text>
                    <Text style={{ color: Colors.$colorYellow }}>{item.phoneCode}</Text>
                </TouchableOpacity>
            )
        }
    }

    // Funcion que hace la peticion para guardar las imagenes en la nube
    const createFormData = (operationPermission, rucImage, legalPower, repID, body) => {
        const data = new FormData();

        data.append('operationPermission', {
            name: operationPermission.fileName,
            type: operationPermission.type,
            uri:
                Platform.OS === 'android'
                    ? operationPermission.uri
                    : operationPermission.uri.replace('file://', ''),
        });

        data.append('rucImage', {
            name: rucImage.fileName,
            type: rucImage.type,
            uri:
                Platform.OS === 'android'
                    ? rucImage.uri
                    : rucImage.uri.replace('file://', ''),
        });

        data.append('repLegalPower', {
            name: legalPower.name,
            type: legalPower.type,
            uri:
                Platform.OS === 'android'
                    ? legalPower.uri
                    : legalPower.uri.replace('file://', ''),
        });

        data.append('repIdDocument', {
            name: repID.fileName,
            type: repID.type,
            uri:
                Platform.OS === 'android'
                    ? repID.uri
                    : repID.uri.replace('file://', ''),
        });

        Object.keys(body).forEach((key) => {
            data.append(key, body[key]);
        });

        return data;

    }

    // Funcion que pertime almacenar las imagenes
    const uploadImage = async (imageDestination) => {
        try {
            await checkPermissionCamera()

            launchCamera(optionsOpenCamera, (response) => {
                if (response.error) {
                    throw String(response.error)
                }

                switch (imageDestination) {
                    case 'operationPermission': {
                        setOperationPermission(response);
                        break;
                    }
                    case 'ruc': {
                        setRUCImage(response);
                        break;
                    }
                    case 'repID': {
                        setRepID(response);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            })
        } catch (error) {
            showNotification(error.toString())
        }
    }

    const uploadDocument = async () => {
        const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.pdf]
        })

        setLegalPower(res)
    }

    /**Metodo que confirma la salida del usuario a la pantalla de inicio */
    const goBack = () => {
        Alert.alert("Estas a punto de salir", "Perderas todo tus registros. ¿Salir?", [
            {
                text: "Cancelar",
                onPress: () => { }
            },
            {
                text: "Salir",
                onPress: () => navigation.pop()
            }
        ])

        return true
    }

    // Funcion que hace la peticion al server
    const onSubmitInformation = async () => {
        setShowTerms(false)
        try {
            setLoader(true)

            if (state.companyName.trim().length === 0) {
                throw String("Ingrese el nombre de la compañía")
            }

            if (!validator.isEmail(state.username)) {
                throw String("Ingrese correo de registro de compañía")
            }

            if (state.companyRuc.trim().length === 0) {
                throw String("Ingrese un numero ruc")
            }

            if (state.repFirstName.trim().length === 0) {
                throw String("Ingrese el nombre del representante")
            }

            if (state.repLastName.trim().length === 0) {
                throw String("Ingrese el apellido del representante")
            }

            if (!validator.isEmail(state.repEmail)) {
                throw String("Ingrese un correo valido")
            }

            if (state.password.trim().length === 0) {
                throw String("Ingrese una constasena")
            }

            if (state.password !== confirmPassword) {
                throw String("Las contraseña nos coinciden")
            }

            if (state.repIdNumber.trim().length === 0) {
                throw String("Ingrese su numero de identificacion")
            }

            if (operationPermission === null) {
                throw String("Imagen de operacion de permiso es requerida")
            }

            if (RUCImage === null) {
                throw String("Imagen de identificacion de la empresa es requerida")
            }

            if (legalPower === null) {
                throw String("El documento de poder administrativo es requerida")
            }

            if (repID === null) {
                throw String("Imagen de perfil es requerida")
            }


            if (check) {
                if (excute.trim().length === 0) {
                    throw String("Es requerido que ingrese el correo de su ejecutivo de venta para continuar")
                }
            }

            const dataSent = {
                companyName: state.companyName,
                companyRUC: state.companyRuc,
                country: state.country.name,
                phoneCode: state.country.phoneCode,
                repFirstName: state.repFirstName,
                repLastName: state.repLastName,
                repPhone: `${state.country.phoneCode} ${state.repPhone}`,
                repIdNumber: state.repIdNumber,
                repIDType: state.repIDType,
                repEmail: state.repEmail,
                username: state.username,
                password: state.password,
                sale_excutive: excute
            }

            const { data } = await http.post('/ecommerce/company/register', createFormData(
                operationPermission,
                RUCImage,
                legalPower,
                repID,
                dataSent,
            ), getHeaders())

            setDataRegister(data)

            if (data.error) {
                throw String(data.message)
            } else {
                setModalSuccess(true)
            }
        } catch (error) {
            showNotification(error.toString())
        } finally {
            setLoader(false)
        }
    }

    // Funcion que verifica si el correo ya existe en la base de datos
    const validateEmailFunction = async (value) => {
        try {
            const dataEmail = {
                email: value
            }

            const { data } = await http.post('/ecommerce/company/comprobate-email', dataEmail)

            if (data.error) {
                throw String(data.message)
            }
        } catch (error) {
            showNotification(error.toString())
        }
    }

    const termsModal = async () => {
        try {
            const { data } = await http.get('https://ardent-medley-272823.appspot.com/terms/read/alypay-ecommerce')

            const text = data.split(/<p>/gm)[1].split(/<\/p>/)[0]
            console.log(text)

            setTerms(text.split('\n'))
            setShowTerms(true)

        } catch (error) {
            showNotification(error.toString())
        }
    }

    // Funcion que permite llenar el registro del comercio
    const registerCommerce = () => {
        navigation.navigate('RegisterCommerce', { companyId: dataRegister.id })
        setModalSuccess(false)
    }

    return (
        <Container showLogo>
            <KeyboardAvoidingView style={styles.scrollView} >
                <View style={styles.container1}>
                    <Loader isVisible={loader} />

                    <ViewAnimation style={[styles.tab, { paddingBottom: RFValue(20) }]} animations="fadeIn" >
                        <View style={styles.containerTitle}>
                            <Text style={{ color: Colors.$colorYellow, fontSize: RFValue(20) }}>Registro de Compañía</Text>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.labelsRow}>
                                <Text style={styles.legendRow}>Nombre de la compañía</Text>
                            </View>

                            <TextInput
                                style={GlobalStyles.textInput}
                                placeholder="Ingrese nombre de la compañía aqui"
                                placeholderTextColor='#CCC'
                                value={state.companyName}
                                onChangeText={str => dispatch({ type: 'companyName', payload: str })}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={styles.labelsRow}>
                                <Text style={styles.legendRow}>Correo electrónico</Text>
                            </View>

                            <TextInput
                                style={GlobalStyles.textInput}
                                placeholder="Ingrese correo aqui"
                                placeholderTextColor='#CCC'
                                keyboardType='email-address'
                                value={state.username}
                                onChangeText={str => dispatch({ type: 'username', payload: str })}
                                onBlur={_ => validateEmailFunction(state.username)}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={styles.labelsRow}>
                                <Text style={styles.legendRow}>Contraseña</Text>
                            </View>
                            <View style={[styles.textInputWithImage, GlobalStyles.textInput]}>
                                <TextInput
                                    secureTextEntry={!showPassword}
                                    value={state.password}
                                    onChangeText={(payload) => dispatch({ type: 'password', payload })}
                                    placeholder="Contraseña"
                                    placeholderTextColor='#CCC'
                                    style={styles.textInputCol}
                                />
                                <TouchableOpacity onPress={(e) => setShowPassword(!showPassword)} style={styles.touchableCol}>
                                    <Icon name={showPassword ? 'visibility-off' : 'visibility'} color={Colors.$colorYellow} size={18} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.labelsRow}>
                                <Text style={styles.legendRow}>Repetir contraseña</Text>
                            </View>
                            <View style={[styles.textInputWithImage, GlobalStyles.textInput]}>
                                <TextInput
                                    secureTextEntry={!showConfirmPassword}
                                    value={confirmPassword}
                                    onChangeText={value => setConfirmPassword(value)}
                                    placeholder="Contraseña"
                                    placeholderTextColor='#CCC'
                                    style={styles.textInputCol}
                                />
                                <TouchableOpacity onPress={(e) => setShowConfirmPassword(!showConfirmPassword)} style={styles.touchableCol}>
                                    <Icon name={showConfirmPassword ? 'visibility-off' : 'visibility'} color={Colors.$colorYellow} size={18} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.labelsRow}>
                                <Text style={styles.legendRow}>Número de identificación fiscal</Text>
                            </View>

                            <TextInput
                                style={GlobalStyles.textInput}
                                placeholder="Ingrese numero ruc aqui"
                                placeholderTextColor='#CCC'
                                value={state.companyRuc}
                                onChangeText={str => dispatch({ type: 'companyRuc', payload: str })}
                            />
                        </View>

                        <View style={styles.containerTitle}>
                            <Text style={{ color: Colors.$colorYellow, fontSize: RFValue(20) }}>Representante Legal</Text>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.labelsRow}>
                                <Text style={styles.legendRow}>Nombre </Text>
                            </View>

                            <TextInput
                                style={GlobalStyles.textInput}
                                placeholder="Ingrese nombre aqui"
                                placeholderTextColor='#CCC'
                                value={state.repFirstName}
                                onChangeText={str => dispatch({ type: 'repFirstName', payload: str })}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={styles.labelsRow}>
                                <Text style={styles.legendRow}>Apellido(s)</Text>
                            </View>

                            <TextInput
                                style={GlobalStyles.textInput}
                                placeholder="Ingrese numero ruc aqui"
                                placeholderTextColor='#CCC'
                                value={state.repLastName}
                                onChangeText={str => dispatch({ type: 'repLastName', payload: str })}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={styles.labelsRow}>
                                <Text style={styles.legendRow}>Correo electrónico</Text>
                            </View>

                            <TextInput
                                style={GlobalStyles.textInput}
                                placeholder="Ingrese correo aqui"
                                placeholderTextColor='#CCC'
                                keyboardType='email-address'
                                value={state.repEmail}
                                onChangeText={str => dispatch({ type: 'repEmail', payload: str })}
                                onBlur={_ => validateEmailFunction(state.repEmail)}
                            />
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.legendRow}>Numero de telefono</Text>

                            <View style={styles.rowPhoneNumber}>
                                <TouchableOpacity style={[GlobalStyles.textInput, { marginRight: 10, justifyContent: "center" }]} onPress={_ => setModalCountry(true)}>
                                    <Text style={{ color: '#CCC' }}>{state.country.phoneCode}</Text>
                                </TouchableOpacity>

                                <TextInput
                                    style={[GlobalStyles.textInput, { flex: 1 }]}
                                    placeholder="Ingrese numero de telefono"
                                    placeholderTextColor='#CCC'
                                    value={state.repPhone}
                                    autoCorrect={false}
                                    keyboardType="numeric"
                                    keyboardAppearance="dark"
                                    onChangeText={payload => dispatch({ type: "repPhone", payload })}
                                />
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.labelsRow}>
                                <Text style={styles.legendRow}>Tipo de ID</Text>
                            </View>

                            <View style={GlobalStyles.containerPicker}>
                                <Picker
                                    style={GlobalStyles.picker}
                                    selectedValue={state.repIDType}
                                    onValueChange={id => dispatch({ type: "repIDType", payload: id })}
                                >
                                    <Picker.Item label='Seleccione el tipo de identificacion' value={0} />
                                    <Picker.Item label='Identificacion Personal' value={1} />
                                    <Picker.Item label='Pasaporte' value={2} />
                                    <Picker.Item label='Permiso de Conducir' value={3} />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.labelsRow}>
                                <Text style={styles.legendRow}>Numero de identificacion</Text>
                            </View>

                            <TextInput
                                style={GlobalStyles.textInput}
                                placeholder="Ingrese numero de identificacion aqui"
                                placeholderTextColor={Colors.$colorGray}
                                value={state.repIdNumber}
                                onChangeText={str => dispatch({ type: 'repIdNumber', payload: str })}
                            />
                        </View>

                        <View style={styles.position}>
                            <View style={styles.labelsRow}>
                                <Text style={styles.legendRow}>Identificacion del representante legal</Text>
                            </View>

                            <UploadImage value={repID} onChange={_ => uploadImage('repID')} />
                        </View>

                        <View style={styles.containerTitle}>
                            <Text style={{ color: Colors.$colorYellow, fontSize: RFValue(20) }}>Agregar imagen de documentos</Text>
                        </View>

                        <View style={styles.position}>
                            <View style={styles.labelsRow}>
                                <Text style={styles.legendRow}>Permiso de operación</Text>
                            </View>

                            <UploadImage value={operationPermission} onChange={_ => uploadImage('operationPermission')} />
                        </View>

                        <View style={styles.position}>
                            <View style={styles.labelsRow}>
                                <Text style={styles.legendRow}>Identificación fiscal</Text>
                            </View>

                            <UploadImage value={RUCImage} onChange={_ => uploadImage('ruc')} />
                        </View>

                        <View style={styles.position}>
                            <View style={styles.labelsRow}>
                                <Text style={styles.legendRow}>Poder administrativo</Text>
                            </View>

                            <UploadImage isPdf value={legalPower} onChange={_ => uploadDocument('legalPower')} />
                        </View>

                        <View style={[styles.rowButtons, { justifyContent: 'flex-end' }]}>
                            <Text style={[styles.legendRow, { marginRight: 10 }]}>Añadir asesor Alysystem</Text>

                            <CheckBox
                                checkBoxColor={Colors.$colorYellow}
                                isChecked={check}
                                onClick={_ => setCheck(!check)}
                            />
                        </View>

                        {
                            check
                                ?
                                <View style={styles.row}>
                                    <View style={styles.labelsRow}>
                                        <Text style={styles.legendRow}>Ejectivo de venta</Text>
                                    </View>

                                    <TextInput
                                        style={GlobalStyles.textInput}
                                        placeholder="Ingrese el correo del ejecutivo"
                                        placeholderTextColor={Colors.$colorGray}
                                        value={excute}
                                        onChangeText={setExcute}
                                    />
                                </View>
                                : null
                        }

                        <View style={styles.rowButtons}>
                            <TouchableOpacity onPress={goBack}>
                                <Text style={styles.textBack}>Iniciar sesion</Text>
                            </TouchableOpacity>


                            <TouchableOpacity onPress={termsModal} disabled={!state.companyName} style={state.companyName ? GlobalStyles.buttonPrimary : GlobalStyles.button}>
                                <Text style={[GlobalStyles.textButton, { opacity: state.companyName ? 1 : 0.5 }]}>Continuar</Text>
                            </TouchableOpacity>
                        </View>
                    </ViewAnimation>
                </View>

                <Modal isVisible={modalSuccess} onBackButtonPress={_ => setModalSuccess(true)} onBackdropPress={_ => setModalSuccess(true)}>
                    <View style={styles.containerModalSuccess}>
                        <Image style={styles.logo} source={Logo} />

                        <View style={{ alignItems: 'center' }}>
                            <View style={[styles.row, { alignItems: 'center' }]}>
                                <Text style={{ color: Colors.$colorYellow, fontSize: RFValue(15) }}>Esta a un paso de completar el registro</Text>
                            </View>
                            <Image style={styles.logo} source={Funko} />
                        </View>

                        <View style={{ alignItems: 'center' }}>
                            <View style={styles.row}>
                                <Text style={{ color: Colors.$colorYellow, fontSize: RFValue(15), textAlign: 'justify' }}>Ahora solo debe vincular su primer comercio para empezar a hacer uso de Alypay E-commerce</Text>
                            </View>
                        </View>

                        <View style={{ alignItems: 'center', padding: 20 }}>
                            <TouchableOpacity onPress={registerCommerce} style={GlobalStyles.buttonPrimary}>
                                <Text>REGISTRA TU COMERCIO</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal onBackdropPress={_ => setModalCountry(false)} onBackButtonPress={_ => setModalCountry(false)} isVisible={modalCoutry}>
                    <View style={styles.containerModal}>
                        <TextInput
                            style={GlobalStyles.textInput}
                            placeholder="Buscar"
                            placeholderTextColor="#FFF"
                            value={state.filter}
                            onChangeText={str => dispatch({ type: "filter", payload: str })} />

                        <View style={{ height: 10 }} />

                        <FlatList
                            keyboardShouldPersistTaps="always"
                            data={countries}
                            renderItem={ItemCountry}
                            keyExtractor={(_, i) => i.toString()} />
                    </View>
                </Modal>

                <Modal isVisible={showTerms} onBackdropPress={_ => setShowTerms(false)} onBackButtonPress={_ => setShowTerms(false)} >
                    <View style={styles.containerModalTerms}>
                        <View style={styles.positionContain}>
                            <Image style={styles.logo} source={Logo} />
                        </View>
                        <ScrollView>
                            <View style={styles.positionContain}>
                                <Text style={styles.legendTerms}>{terms}</Text>
                            </View>
                        </ScrollView>
                        <View style={styles.positionButton}>
                            <TouchableOpacity onPress={onSubmitInformation} style={GlobalStyles.buttonPrimary}>
                                <Text>Aceptar términos y condiciones</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </KeyboardAvoidingView>
        </Container>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    container1: {
        alignItems: "center",
        paddingHorizontal: "5%",
        flexDirection: "column",
        justifyContent: "space-between",
        flex: 1,
    },
    containerTitle: {
        flex: 1,
        padding: 10,
        marginLeft: 10,
        alignItems: "center"
    },
    containerModalSuccess: {
        alignSelf: "center",
        backgroundColor: Colors.$colorBlack,
        borderRadius: 10,
        padding: 10,
        height: "80%",
        width: "90%",
    },
    containerModal: {
        alignSelf: "center",
        backgroundColor: Colors.$colorMain,
        borderRadius: 10,
        padding: 10,
        height: "80%",
        width: "90%",
    },
    containerModalTerms: {
        alignSelf: "center",
        backgroundColor: Colors.$colorBlack,
        borderRadius: 10,
        padding: 10,
        height: "80%",
        width: "90%",
    },
    logo: {
        resizeMode: "contain",
        height: RFValue(128),
        width: RFValue(256),
    },
    legendRow: {
        color: Colors.$colorYellow,
        fontSize: RFValue(16)
    },
    legendTerms: {
        color: "#FFF",
        fontSize: RFValue(14),
        textAlign: 'justify',
        letterSpacing: -0.003
    },
    labelsRow: {
        alignItems: "center",
        position: "relative",
        marginBottom: 5,
        flexDirection: "row",
    },
    row: {
        flexDirection: "column",
        width: "100%",
        marginVertical: 10,
    },
    tab: {
        width: "100%",
    },
    textInputWithImage: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    touchableCol: {
        flex: 0.1,
        alignItems: 'flex-end',
    },
    textInputCol: {
        flex: 0.9,
        paddingLeft: 5,
        padding: 0,
        color: 'white',
    },
    rowPhoneNumber: {
        alignItems: "stretch",
        flexDirection: "row",
        marginTop: RFValue(5),
        width: '100%',
    },
    rowButtons: {
        alignItems: "center",
        // marginTop: 10,
        marginVertical: RFValue(25),
        flexDirection: "row",
        justifyContent: "space-between",
    },
    position: {
        padding: 10
    },
    positionContain: {
        alignSelf: "center",
    },
    positionButton: {
        alignItems: 'center',
        padding: 10
    },
    textBack: {
        color: Colors.$colorYellow,
        textTransform: "uppercase",
        fontSize: RFValue(16)
    },
    itemCountry: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderColor: Colors.$colorYellow,
        flexDirection: "row",
        justifyContent: "space-between",
        borderRadius: 5,
        borderWidth: 1,
        padding: 10,
        marginVertical: 5,
    },
    valid: {
        backgroundColor: Colors.$colorYellow,
        padding: 5,
        borderRadius: 5,
        color: Colors.colorMain,
        fontSize: RFValue(10),
        marginLeft: 10,
    },

    invalid: {
        backgroundColor: Colors.$,
        padding: 5,
        borderRadius: 5,
        color: "#FFF",
        fontSize: RFValue(10),
        marginLeft: 10,
    },
})

export default Register