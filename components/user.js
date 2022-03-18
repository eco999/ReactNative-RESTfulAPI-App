import 'react-native-gesture-handler'
import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getASyncData = async (itemName) => {
    try {
        const value = await AsyncStorage.getItem(itemName)
        if (value !== null) {
            // value previously stored
        }
    } catch (e) {
        // error reading value
    }
}

class UserInformation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: 0,
            email: "",
            password: ""
        };
    }
    
    

    componentDidMount(){
        getASyncData('@id').then((val) => console.log("hi ",val));
        
      }
    
      


    render() {
        const { navigation } = this.props;
        return (
            <View>
                <Text>{id}</Text>
            </View>
        )
    }

}

class Screen extends Component {
    render() {
        const { navigation } = this.props;
        return (
            <View>
                <UserInformation navigation={navigation}></UserInformation>
            </View>
        )

    }
}


export default Screen;