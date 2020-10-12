import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';

const MainScreen = ({navigation}) => {
    return (
        <SafeAreaView>
            <ScrollView>
                <Text>Hola</Text>
            </ScrollView>
        </SafeAreaView>
    )
}
