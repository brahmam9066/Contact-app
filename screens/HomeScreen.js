import React from 'react'
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';

import { Button, FAB } from 'react-native-paper';

import { firebaseApp } from "../util/Firebase";
import { MaterialIcons } from '@expo/vector-icons';


class HomeScreen extends React.Component {

    state = {
        contacts: [],
        isLoaded: false
    }

    componentDidMount() {
        this.props.navigation.setOptions({
            headerRight: () => (
                <Button
                    icon="logout"
                    onPress={() => {
                        firebaseApp.auth().signOut()
                            .then(() => {
                                this.props.navigation.replace("LoginScreen")
                            }).catch(err => {
                                console.log(err)
                            })
                    }}
                />
            )
        })
        this.getAllContacts()

        this.props.navigation.addListener("focus", () => {
            this.getAllContacts()
        })
    }

    getAllContacts() {

        const user = firebaseApp.auth().currentUser;

        firebaseApp.firestore()
            .collection("data")
            .doc(user.uid)
            .collection("contacts")
            .get()
            .then(querySnapshot => {

                const contacts = []

                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    contacts.push({
                        id: doc.id,
                        name: doc.data().name,
                        phone: doc.data().phone,

                    })
                });
                this.setState({
                    isLoaded: true,
                    contacts: contacts
                })
            })

    }

    render() {
        if (this.state.isLoaded) {
            return (
                <View style={styles.container}>
                    <FlatList
                        data={this.state.contacts}
                        keyExtractor={(item, index) => item.id}
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity onPress={() => {
                                    this.props.navigation.navigate("UpdateScreen", {
                                        id: item.id,
                                        name: item.name,
                                        phone: item.phone
                                    })
                                }}>
                                    <View style={{
                                        backgroundColor: "#dedede",
                                        marginTop: 10,
                                        marginHorizontal: 20,
                                        padding: 20,
                                        borderRadius: 8,
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center"

                                    }}>

                                        <View>
                                            <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.name}</Text>
                                            <Text style={{ marginTop: 5 }}>{item.phone}</Text>
                                        </View>


                                        <View style={{
                                            flexDirection: "row"
                                        }}>
                                            <TouchableOpacity onPress={() => {
                                                const user = firebaseApp.auth().currentUser

                                                firebaseApp.firestore().collection("data")
                                                    .doc(user.uid)
                                                    .collection("contacts")
                                                    .doc(item.id)
                                                    .delete()


                                                // remove from state

                                                let contacts = this.state.contacts

                                                contacts = contacts.filter(c => c.id !== item.id)

                                                this.setState({
                                                    contacts: contacts
                                                })
                                            }} style={{
                                                marginEnd: 10
                                            }}>
                                                <MaterialIcons
                                                    name="delete"
                                                    color="#FF0000"
                                                    size={32}
                                                />
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={() => {
                                                Linking.openURL(`tel:${item.phone}`)
                                            }}>
                                                <MaterialIcons
                                                    name="call"
                                                    color="#333"
                                                    size={28}
                                                />
                                            </TouchableOpacity>
                                        </View>


                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                    />

                    <FAB
                        icon="plus"
                        style={styles.fab}
                        onPress={() => {
                            this.props.navigation.navigate("AddScreen")
                        }}
                        color="#0000FF"
                    />
                </View>
            )
        } else {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size="large" />

                </View>
            )
        }



    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: '#fff'
    },
    fab: {
        position: "absolute",
        right: 0,
        bottom: 0,
        margin: 16,
    }
})

export default HomeScreen;