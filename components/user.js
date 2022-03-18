import 'react-native-gesture-handler'
import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

class UserInformation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: 0,
            firstName: "",
            lastName: "",
            email: ""
        };
    }
    


    componentDidMount() {
        console.log("mounted");
        getASyncData('@id').then((val) =>this.setState({ id: val}))
    }
    
      


    render() {
        const { navigation } = this.props;
        return (
            <View>
                <Text>Your User ID: {this.state.id}</Text>
                <Text>First name: {this.state.firstName}</Text>
                <Text>Last name: {this.state.lastName}</Text>
                <Text>Email: {this.state.email}</Text>
                
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