import 'react-native-gesture-handler'
import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create(
    {
        textbox: { borderWidth: 1, padding: 3, marginBottom: 5 },
        container: { marginBottom: 5 },
        sectionBorder: { fontSize: 20, marginTop: 5, borderTopWidth: 2, padding: 3 }
    });

const getASyncData = async (itemName) => {
    try {
        const value = await AsyncStorage.getItem(itemName)
        if (value !== null) {
            // value previously stored
            return value
        }
    } catch (e) {
        // error reading value
    }
}

const removeValue = async (itemName) => {
    try {
        await AsyncStorage.removeItem(itemName)
    } catch (e) {
        // remove error
    }

    console.log('Done.')
}


class PostStuff extends Component {

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        console.log("mounted");
    }


   



    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                
            </View>

        )
    }
}

class Screen extends Component {

    render() {
        const { navigation } = this.props;
        return (
            <View>
                <PostStuff navigation={navigation}></PostStuff>
            </View>
        )

    }
}


export default Screen;