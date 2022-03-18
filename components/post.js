import 'react-native-gesture-handler'
import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';

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

class PostScr extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: 0,
            getPostUserIdInput: 0,
            postArray: [],
            selectedPostAuthorFirst: "",
            selectedPostAuthorLast: "",
            selectedPostLikes: 0,
            selectedPostTime: "",
            selectedPostText: ""
        };
    }

    componentDidMount() {
        console.log("mounted");
        getASyncData('@id').then((val) => this.setState({ id: parseInt(val) })).then(this.getPostList())

    }

    getPostList = async () => {
        const value = await AsyncStorage.getItem('@xauth');
        const id = this.state.getPostUserIdInput;
        const link = "http://10.0.2.2:3333/api/1.0.0/user/" + id + "/post";
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
                this.setState({ postArray: responseJson })
                console.log("post array: ", responseJson)
            })
            .catch((error) => {
                console.log(error);
            })
    }

    getSelectedPost = async (id ,postId) => {
        const value = await AsyncStorage.getItem('@xauth');
        
        const link = "http://10.0.2.2:3333/api/1.0.0/user/" + id + "/post/" + postId ;
        return fetch(link, {
            'headers': {
                'X-Authorization': value
            }
        })
            .then((response) => {
                console.log(response.status)
                return response.json();
            })
            .then((responseJson) => {
                this.setState({ 
                    selectedPostAuthorFirst: responseJson.author.first_name,
                    selectedPostAuthorLast: responseJson.author.last_name,
                    selectedPostLikes: responseJson.numLikes,
                    selectedPostText: responseJson.text,
                    selectedPostTime: responseJson.timestamp
                })
                console.log("selected post array: ", responseJson)
                console.log(this.state.selectedPostArray)
                
            })
            .catch((error) => {
                console.log(error);
            })
    }

    deleteSelectedPost = async (id ,postId) => {
        const value = await AsyncStorage.getItem('@xauth');
        
        const link = "http://10.0.2.2:3333/api/1.0.0/user/" + id + "/post/" + postId ;
        return fetch(link, {
            'method': 'delete',
            'headers': {
                'X-Authorization': value
            }
        })
            .then((response) => {
                console.log(response.status)
                if(response.status === 200)
                {
                    this.setState({ 
                        selectedPostAuthorFirst: "",
                        selectedPostAuthorLast: "",
                        selectedPostLikes: 0,
                        selectedPostText: "",
                        selectedPostTime: ""
                    })
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
                <Text style={styles.sectionBorder}>Get user posts</Text>
                <TextInput onChangeText={(getPostUserIdInput) => this.setState({ getPostUserIdInput })} style={styles.textbox} placeholder='User ID Here' />
                <Button title="search posts" onPress={() => this.getPostList()} />
                <FlatList
                    data={this.state.postArray}
                    renderItem={({ item }) => (
                        <View>
                            <Text>ID: {item.author.user_id}, Name: {item.author.first_name}, Text: {item.text}</Text>
                            <Button title='View' onPress={() => this.getSelectedPost(item.author.user_id,item.post_id)} />
                        </View>
                    )}
                />
                <Text style={styles.sectionBorder}>Selected post: </Text>
                <Text>Author: {this.state.selectedPostAuthorFirst} {this.state.selectedPostAuthorLast}</Text>
                <Text>Time posted: {this.state.selectedPostTime}</Text>
                <Text>Text: {this.state.selectedPostText}</Text>
                <Text>Likes: {this.state.selectedPostLikes}</Text>
            </View>
        )
    }
}


class Screen extends Component {
    render() {
        const { navigation } = this.props;
        return (
            <View>
                <PostScr navigation={navigation}></PostScr>
            </View>
        )

    }
}

export default Screen;