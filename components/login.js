import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create(
    {
        textbox: { borderWidth: 1, padding: 3, marginBottom: 5 },
        container: { marginBottom: 5 },
        sectionBorder: { fontSize: 20, marginTop: 5, borderTopWidth: 2, padding: 3 }
    });



const storeData = async (itemName, value) => {
    try {
        await AsyncStorage.setItem(itemName, value)
    } catch (e) {
        // saving error
    }
}

const getData = async (itemName) => {
    try {
        const value = await AsyncStorage.getItem(itemName)
        if (value !== null) {
            // value previously stored
        }
    } catch (e) {
        // error reading value
    }
}

class CreateUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            id: "",
            firstName: "",
            lastName: "",
            email: "",
            password: ""
        };
    }

    componentDidMount() {
        console.log("mounted");
    }

    addUser() {
        let to_send = {
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            email: this.state.email,
            password: this.state.password
        };

        console.log(JSON.stringify(to_send))

        return fetch("http://10.0.2.2:3333/api/1.0.0/user", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(to_send)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                Alert.alert("User added")

            })
            .catch((error) => {
                console.log(error);
            })
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.container} >
                <Text style={styles.sectionBorder}>Create User</Text>
                <TextInput onChangeText={(firstName) => this.setState({ firstName })} style={styles.textbox} placeholder='First name here' />
                <TextInput onChangeText={(lastName) => this.setState({ lastName })} style={styles.textbox} placeholder='Last name here' />
                <TextInput onChangeText={(email) => this.setState({ email })} style={styles.textbox} placeholder='Email here' />
                <TextInput secureTextEntry={true} onChangeText={(password) => this.setState({ password })} style={styles.textbox} placeholder='Password here' />
                <Button onPress={() => this.addUser()} title="Create user"></Button>
            </View>
        )
    }


}

class LoginUser extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            email: "",
            password: ""
        };
    }

    componentDidMount() {
        console.log("mounted");
    }

    loginUser() {
        let to_send = {
            email: this.state.email,
            password: this.state.password
        };

        const { navigation } = this.props;

        console.log(JSON.stringify(to_send))

        return fetch("http://10.0.2.2:3333/api/1.0.0/login", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(to_send)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                let responsebody = responseJson;
                console.log(responsebody.id)
                if (responseJson.token) {
                    console.log("success login")
                    storeData('@xauth', responsebody.token)
                    storeData('@id', responsebody.id.toString())
                    navigation.replace('User')
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    render() {
        const { navigation } = this.props;
        return (
            <View>
                <Text style={styles.sectionBorder}>Login</Text>
                <TextInput defaultValue='qwe@gmail.com' onChangeText={(email) => this.setState({ email })} style={styles.textbox} placeholder='Email here' />
                <TextInput defaultValue='qwerty' secureTextEntry={true} onChangeText={(password) => this.setState({ password })} style={styles.textbox} placeholder='Password here' />
                <Button onPress={() => { this.loginUser(); }} title="Login"></Button>
            </View>
        )
    }
}

class Screen extends Component {
    render() {
        const { navigation } = this.props;
        return (
            <View>
                <CreateUser navigation={navigation}></CreateUser>
                <LoginUser navigation={navigation}></LoginUser>
            </View>
        )

    }
}

export default Screen;