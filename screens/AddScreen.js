import React from 'react'
import { View, Text, StyleSheet } from 'react-native';

import { Button, TextInput } from 'react-native-paper';
import { firebaseApp } from "../util/Firebase";


class AddScreen extends React.Component {
    state = {
        name: "",
        phone: "",
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={{ marginTop: 10 }}
                    label="Name"
                    value={this.state.name}
                    onChangeText={(text) => this.setState({ name: text })}
                />
                <TextInput
                    style={{
                        marginTop: 10
                    }}
                    label="Phone"
                    keyboardType="phone-pad"
                    value={this.state.phone}
                    onChangeText={(text) => this.setState({ phone: text })}
                />
                <Button
                    onPress={() => {

                        if (this.state.name != "" && this.state.phone != "") {
                            const user = firebaseApp.auth().currentUser

                            firebaseApp.firestore().collection("data")
                                .doc(user.uid)
                                .collection("contacts")
                                .add({
                                    name: this.state.name,
                                    phone: this.state.phone
                                }).then(res => {
                                    console.log(res)
                                    this.props.navigation.goBack()
                                }).catch(err => console.log(err))
                        } else {
                            alert("Provide information")
                        }

                    }}
                    mode="contained"
                    style={{ marginTop: 10 }}
                >Save</Button>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10
    }
})

export default AddScreen;