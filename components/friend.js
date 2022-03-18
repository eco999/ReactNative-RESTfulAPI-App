import 'react-native-gesture-handler'
import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList, Switch } from 'react-native-gesture-handler';

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

class FriendList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: 0,
            sendFriendId: 0,
            friendsarray: [],
            friendrequestArray: [],
            searchArray: [],
            searchText: "",
            searchIn: "all",
            searchLimt: 0,
            searchOffset: 0

        };
    }


    componentDidMount() {
        console.log("mounted");
        getASyncData('@id').then((val) => this.setState({ id: parseInt(val) }))
            .then(() => {
                this.getFriendList();
                this.getFriendRequests();
            })

    }

    getFriendList = async () => {
        const value = await AsyncStorage.getItem('@xauth');
        const id = this.state.id;
        const link = "http://10.0.2.2:3333/api/1.0.0/user/" + id + "/friends";
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
                this.setState({ friendsarray: responseJson })
                console.log("friend array: ", responseJson)
            })
            .catch((error) => {
                console.log(error);
            })
    }

    sendFriendRequest = async () => {
        const value = await AsyncStorage.getItem('@xauth');
        const id = this.state.sendFriendId;
        const link = "http://10.0.2.2:3333/api/1.0.0/user/" + id + "/friends"
        return fetch(link, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': value
            },

        })
            .then((response) => {
                console.log(response.status);
                if (response.status === 201) {
                    Alert.alert("friend request sent")
                }
                if (response.status === 403) {
                    Alert.alert("friend request already sent")
                }
                if (response.status === 500) {
                    Alert.alert("friend id not valid/server error")
                }
            })

            .catch((error) => {
                console.log(error);
            })
    }

    getFriendRequests = async () => {
        const value = await AsyncStorage.getItem('@xauth');

        const link = "http://10.0.2.2:3333/api/1.0.0/friendrequests"

        return fetch(link, {
            'headers': {
                'X-Authorization': value
            }
        })
            .then((response) => {
                console.log("req array response", response.status)
                return response.json()
            })
            .then((responseJson) => {
                console.log("req array:", responseJson)
                this.setState({ friendrequestArray: responseJson })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    acceptReq = async (id) => {
        const value = await AsyncStorage.getItem('@xauth');
        const link = "http://10.0.2.2:3333/api/1.0.0/friendrequests/" + id

        return fetch(link, {
            method: 'post',
            'headers': {
                'X-Authorization': value
            }
        })
            .then((response) => {
                console.log("accept req response:", response.status)
                this.getFriendRequests();
            })
            .catch((error) => {
                console.log(error);
            })
    }

    deleteReq = async (id) => {
        const value = await AsyncStorage.getItem('@xauth');
        const link = "http://10.0.2.2:3333/api/1.0.0/friendrequests/" + id

        return fetch(link, {
            method: 'delete',
            'headers': {
                'X-Authorization': value
            }
        })
            .then((response) => {
                console.log("delete req response:", response.status)
                this.getFriendRequests();
            })
            .catch((error) => {
                console.log(error);
            })
    }

    searchUsers = async () => {
        const value = await AsyncStorage.getItem('@xauth');
        const searchText = this.state.searchText;
        searchText.replace(' ', '%');
        const searchIn = this.state.searchIn;
        const searchLimit = this.state.searchLimt;
        const searchOffset = this.state.searchOffset;
        const link = "http://10.0.2.2:3333/api/1.0.0/search?q=" + searchText + "&search_in=" + searchIn
            + "&limit=" + searchLimit + "&offset=" + searchOffset

        return fetch(link, {
            'headers': {
                'X-Authorization': value
            }
        })
            .then((response) => {
                console.log("searchuser response:", response.status)
                return response.json()
            })
            .then((responseJson) => {
                console.log("search array:", responseJson)
                this.setState({ searchArray: responseJson })
            })
            .catch((error) => {
                console.log(error)
            })
    }


    render() {
        const { navigation } = this.props;
        return (
            <View>
                <Text style={styles.sectionBorder}>Send friend request:</Text>
                <TextInput onChangeText={(sendFriendId) => this.setState({ sendFriendId })} style={styles.textbox} placeholder='Friend User ID Here' />
                <Button onPress={() => this.sendFriendRequest()} title='Send friend request' />

                <Text style={styles.sectionBorder}>Outstanding Friend requests:</Text>
                <FlatList data={this.state.friendrequestArray}
                    renderItem={({ item }) => (
                        <View>
                            <Text>ID: {item.user_id}, Name: {item.first_name} {item.last_name}</Text>
                            <Button title="Accept" onPress={() => this.acceptReq(item.user_id)} />
                            <Button title="Delete" onPress={() => this.deleteReq(item.user_id)} />
                        </View>

                    )}
                />


                <Text style={styles.sectionBorder}>Friend list:</Text>
                <FlatList
                    data={this.state.friendsarray}
                    renderItem={({ item }) => (
                        <View>
                            <Text>ID: {item.user_id}, Name: {item.user_givenname} {item.user_familyname}</Text>
                        </View>

                    )}
                />

                <Text style={styles.sectionBorder}>Search users:</Text>
                <TextInput style={styles.textbox} placeholder='Search here' onChangeText={(searchText) => this.setState({ searchText })} />
                <Text>Search in friends or all?</Text>
                <TextInput style={styles.textbox} placeholder='friends or all' onChangeText={(searchIn) => this.setState({ searchIn })} />
                <Text>Limit search results</Text>
                <TextInput style={styles.textbox} placeholder='Search limit number' onChangeText={(searchLimit) => this.setState({ searchLimit })} />
                <Text>Offset items</Text>
                <TextInput style={styles.textbox} placeholder='Skip amount' onChangeText={(searchOffset) => this.setState({ searchOffset })} />
                <Button onPress={() => this.searchUsers()} title='Search' />
                <FlatList
                    data={this.state.searchArray}
                    renderItem={({ item }) => (
                        <View>
                            <Text>ID: {item.user_id}, Name: {item.user_givenname}</Text>
                        </View>
                    )}
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