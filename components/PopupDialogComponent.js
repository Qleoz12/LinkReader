import React, { Component } from 'react';
import {
    StyleSheet, View, Text, TouchableOpacity,
    Platform, Image, TextInput
} from "react-native";
import PopupDialog, { SlideAnimation, DialogTitle } from 'react-native-popup-dialog';
//Database
import { insertNewArticle, updateArticle } from '../database/allSchemas';
export default class PopupDialogComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            name: '',
            isAddNew: true,
            visible: false,
        };
    }
    //Show dialog when update    
    showDialogComponentForUpdate = (existingTodoList) => {
        this.refs.popupDialog.onShow();
        this.setState({
            dialogTitle: 'Update Article',             
            id: existingTodoList.id,
            name: existingTodoList.name,
            isAddNew: false
        });
    }
    //Show dialog when add new "todoList"
    showDialogComponentForAdd = () => {
        
        this.setState({
            visible: true,
            dialogTitle: 'Add a new Article',
            desc: "",
            url: "",
            isAddNew: true
        });
    }
    render() {
        const { dialogTitle } = this.state;
        return (
            <PopupDialog
                visible={this.state.visible}
                dialogTitle={<DialogTitle title={dialogTitle} />}
                width={0.7} height={250}
                ref={"popupDialog"}
            >
                <View style={styles.container}>
                    <TextInput 
                        style={styles.textInput} 
                        placeholder="Enter desc for article" 
                        autoCorrect={false}
                        onChangeText={(text) => this.setState({ desc: text })} 
                        value={this.state.desc}
                    />
                    <TextInput 
                        style={styles.textInput} 
                        placeholder="Enter url for article" 
                        autoCorrect={false}
                        onChangeText={(text) => this.setState({ url: text })} 
                        value={this.state.url}
                    />
                    
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.button} onPress={() => {
                            if (this.state.desc.trim() == "") {
                                alert("Please enter Article's name");
                                return;
                            }
                            
                            if (this.state.isAddNew == true) 
                            {
                                const newTodoList = {
                                    id: Math.floor(Date.now() / 1000),
                                    desc: this.state.desc,
                                    url: this.state.url,
                                    creationDate: new Date()
                                };
                                insertNewArticle(newTodoList).then().catch((error) => {
                                    alert(`Insert new todoList error ${error}`);
                                });
                            } else {
                                const todoList = {    
                                    id:  this.state.id,
                                    name: this.state.name,                                        
                                };    
                                updateArticle(todoList).then().catch((error) => {
                                    alert(`Update todoList error ${error}`);
                                });  
                            }

                            this.setState({visible: false});
                        }}>
                            <Text style={styles.textLabel}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => {
                           
                                this.setState({
                                    visible: false,});
                                console.log('Called Cancel, dismiss popup');
                           
                        }}>
                            <Text style={styles.textLabel}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </PopupDialog>
        );
    }
};
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        height: 40,
        padding: 10,
        margin: 10,
        borderColor: 'gray',
        borderWidth: 1
    },
    button: {
        backgroundColor: 'steelblue',
        padding: 10,
        margin: 10
    },
    textLabel: {
        color: 'white',
        fontSize: 18,
    }
});