import React from 'react'
import { View, Text, StyleSheet } from 'react-native';

import { Button, TextInput } from 'react-native-paper';
import { firebaseApp } from "../util/Firebase";


class UpdateScreen extends React.Component {
    state = {
        name: "",
        phone: "",
        id: ""
    }

    componentDidMount() {
        const id = this.props.route.params.id
        const name = this.props.route.params.name
        const phone = this.props.route.params.phone

        this.setState({
            id, name, phone
        })

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
                                .doc(this.state.id)
                                .update({
                                    name: this.state.name,
                                    phone: this.state.phone
                                }).then(() => {
                                    this.props.navigation.goBack()
                                })


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

export default UpdateScreen;