import 'react-native-gesture-handler'
import React, { Component } from 'react';
import { Image, StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';

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

class FriendList extends Component{
    
    constructor(props) {
        super(props);

        this.state = {
            id: 0,
            friendsarray: []
        };
    }
    
    componentDidMount() {
        console.log("mounted");
        getASyncData('@id').then((val) => this.setState({ id: parseInt(val) })).then(this.getData())

    }
    
    getData = async () => {
        const value = await AsyncStorage.getItem('@xauth');
        const id = this.state.id;
        const link = "http://10.0.2.2:3333/api/1.0.0/user/" + id+"/friends";
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
                this.setState({ friendsarray: responseJson})
                console.log(responseJson)
            })
            .catch((error) => {
                console.log(error);
            })
    }
    
    
    
    render(){
        const { navigation } = this.props;
        return(
            <View>
                <FlatList
                data={this.state.friendsarray} 
                renderItem={({item}) => (
                    <View>
                      <Text>{item.first_name} {item.last_name}</Text>
                    </View>
                )}
                keyExtractor={(item,index) => item.id.toString()}
                />

            </View>
        )
    }
}


class Screen extends Component {
    render() {
        const { navigation } = this.props;
        return (
            <View>
                <FriendList></FriendList>
            </View>
        )

    }
}


export default Screen;