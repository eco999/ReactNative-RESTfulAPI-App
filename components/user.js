import 'react-native-gesture-handler'
import React, { Component } from 'react';
import { Image, StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create(
    {
        textbox: { borderWidth: 1, padding: 3, marginBottom: 5 },
        container: { marginBottom: 5 }
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


class UserInformation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: 0,
            firstName: "",
            lastName: "",
            email: "",
            firstNameInput: "",
            lastNameInput: "",
            emailInput: "",
            passwordInput: "",
            image: ""
        };
    }

    componentDidMount() {
        console.log("mounted");
        getASyncData('@id').then((val) => this.setState({ id: parseInt(val) })).then(this.getData())

    }


    getData = async () => {
        const value = await AsyncStorage.getItem('@xauth');
        const id = this.state.id;
        const link = "http://10.0.2.2:3333/api/1.0.0/user/" + id;
        return fetch(link, {
            'headers': {
                'X-Authorization': value
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json()
                }
                else {
                    console.log(response.status)
                    throw 'Something went wrong';
                }
            })
            .then((responseJson) => {
                this.setState({
                    firstName: responseJson.first_name,
                    lastName: responseJson.last_name,
                    email: responseJson.email
                });
            })
            .catch((error) => {
                console.log(error);
            })
    }


    updateUser = async () => {
        let to_send = {};

        if (this.state.firstNameInput.length !== 0) {
            to_send['first_name'] = this.state.firstNameInput;
        }

        if (this.state.lastNameInput.length !== 0) {
            to_send['last_name'] = this.state.lastNameInput;
        }

        if (this.state.emailInput.length !== 0) {
            to_send['email'] = this.state.emailInput;
        }

        if (this.state.passwordInput.length !== 0) {
            to_send['password'] = this.state.passwordInput;
        }

        console.log("json created: ", JSON.stringify(to_send));

        const value = await AsyncStorage.getItem('@xauth');
        const id = this.state.id;
        const link = "http://10.0.2.2:3333/api/1.0.0/user/" + id;

        return fetch(link, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'X-Authorization': value
            },
            body: JSON.stringify(to_send)
        })
            .then((response) => {
                console.log("User updated");
                this.getData();

            })
            .catch((error) => {
                console.log(error);
            })
    }



    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                <Text>Your User ID: {this.state.id}</Text>
                <Text>First name: {this.state.firstName}</Text>
                <Text>Last name: {this.state.lastName}</Text>
                <Text>Email: {this.state.email}</Text>

                <Text>Update info</Text>
                <TextInput onChangeText={(firstNameInput) => this.setState({ firstNameInput })} style={styles.textbox} placeholder='First name here' />
                <TextInput onChangeText={(lastNameInput) => this.setState({ lastNameInput })} style={styles.textbox} placeholder='Last name here' />
                <TextInput onChangeText={(emailInput) => this.setState({ emailInput })} style={styles.textbox} placeholder='Email here' />
                <TextInput secureTextEntry={true} onChangeText={(passwordInput) => this.setState({ passwordInput })} style={styles.textbox} placeholder='Password here' />
                <Button onPress={() => this.updateUser()} title="Update"></Button>

                <Text>View friends</Text>
                <Button title='View friends' onPress={() => navigation.navigate('Friend')} />
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