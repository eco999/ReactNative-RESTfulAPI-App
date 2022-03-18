import 'react-native-gesture-handler'
import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';
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
            email: ""
        };
    }

    componentDidMount() {
        console.log("mounted");
        getASyncData('@id').then((val) =>this.setState({ id: parseInt(val) })).then(this.getData())
        
    }
    
    getData = async () => {
        const value = await AsyncStorage.getItem('@xauth');
        const id = this.state.id;
        const link = "http://10.0.2.2:3333/api/1.0.0/user/"+id;
        return fetch(link, {
              'headers': {
                'X-Authorization':  value
              }
            })
            .then((response) => {
                if(response.status === 200){
                    return response.json()
                }
                else{
                    console.log(response.status)
                    throw 'Something went wrong';
                }
            })
            .then((responseJson) => {
              this.setState({
                firstName: responseJson.first_name,
                lastName: responseJson.last_name,
                email: responseJson.email
              })
            })
            .catch((error) => {
                console.log(error);
            })
      }
    
    
      


    render() {
        return (
            <View style={styles.container}>
                <Text>Your User ID: {this.state.id}</Text>
                <Text>First name: {this.state.firstName}</Text>
                <Text>Last name: {this.state.lastName}</Text>
                <Text>Email: {this.state.email}</Text>
            </View>
            
        )
    }
}

class EditInformation extends Component{

    constructor(props) {
        super(props);

        this.state = {
            id: 0,
            firstName: "",
            lastName: "",
            email: ""
        };
    }

    render(){
        return(
            <View>
                <Text>Update info</Text>
                <TextInput onChangeText={(firstName) => this.setState({ firstName })} style={styles.textbox} placeholder='First name here' />
                <TextInput onChangeText={(lastName) => this.setState({ lastName })} style={styles.textbox} placeholder='Last name here' />
                <TextInput onChangeText={(email) => this.setState({ email })} style={styles.textbox} placeholder='Email here' />
                <TextInput secureTextEntry={true} onChangeText={(password) => this.setState({ password })} style={styles.textbox} placeholder='Password here' />
                <Button onPress={() => console.log("update press")} title="Update"></Button>
            </View>
        )
    }
}

class Screen extends Component {
    render() {
        const { navigation } = this.props;
        return (
            <View>
                <UserInformation></UserInformation>
                <EditInformation></EditInformation>
            </View>
        )

    }
}


export default Screen;