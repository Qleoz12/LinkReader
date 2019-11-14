import React, { Component } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { deleteArticle, queryAllArticles,filterArticle } from '../database/allSchemas';
import realm from '../database/allSchemas';
import Swipeout from 'react-native-swipeout';

import HeaderComponent from './HeaderComponent';
import PopupDialogComponent from './PopupDialogComponent';
//sort 
import { SORT_ASCENDING, SORT_DESCENDING } from './sortStates';

let FlatListItem = (props) => {
    
    //const { itemIndex, creationDate, popupDialogComponent, onPressItem } = props;
    showEditModal = () => 
    {
        // popupDialogComponent.showDialogComponentForUpdate({
        //     id, desc
        // });
    }

    showDeleteConfirmation = () => 
    {
        // Alert.alert(
        //     'Delete',
        //     'Delete a Article',
        //     [
        //         {
        //             text: 'No', onPress: () => { },//Do nothing
        //             style: 'cancel'
        //         },
        //         {
        //             text: 'Yes', onPress: () => {
        //                 deleteArticle(id).then().catch(error => {
        //                     alert(`Failed to delete todoList with id = ${id}, error=${error}`);
        //                 });
        //             }
        //         },
        //     ],
        //     { cancelable: true }
        // );
    };
    return (
        <Swipeout right={[
            {
                text: 'Edit',
                backgroundColor: 'rgb(81,134,237)',
                onPress: showEditModal
            },
            {
                text: 'Delete',
                backgroundColor: 'rgb(217, 80, 64)',
                onPress: showDeleteConfirmation
            }
        ]} autoClose={true}>
        
        {/* <TouchableOpacity onPress={ononPressPressItem}> */}
        <TouchableOpacity >
        <View style={{ backgroundColor: props.itemIndex % 2 == 0 ? 'powderblue' : 'skyblue' }}> 
                <Text style={{ fontWeight: 'bold', fontSize: 18, margin: 10 }}>{props.item.desc}</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 18, margin: 10 }}>{props.item.url}</Text>         
            </View>
        </TouchableOpacity>
        </Swipeout >
    );
}


export default class ArticleListComponent extends Component 
{
    constructor(props) {
        super(props);
        this.state = {
            sortState: SORT_ASCENDING,
            articleLists: [],
            searchedDesc:''
        };
       
        realm.addListener('change', () => {
            this.componentDidMount()
        });
    }

    componentDidMount(){
        this.reloadData();
    }

    sort = () => {
        this.setState({ 
            sortState: this.state.sortState === SORT_ASCENDING ? SORT_DESCENDING : SORT_ASCENDING,
            articleLists: this.state.todoLists.sorted("desc", this.state.sortState === SORT_DESCENDING ? true : false)
        });

    }

    reloadData = () => {
        queryAllArticles().then((articleLists) => {
            this.setState({ articleLists });
        }).catch((error) => {
            this.setState({ articleLists: [] });
        });
        console.log(`reloadData`);
    }

    render() {
        return (<View style={styles.container}>
            <HeaderComponent title={"Listado de Links"}
                hasAddButton={true}
                hasDeleteAllButton={true}
                showAddTodoList={
                    () => { this.refs.popupDialogComponent.showDialogComponentForAdd();}
                }
                hasSortButton={true}
                sort={this.sort} 
                sortState={this.state.sortState}
            />
            <TextInput 
                style={styles.textInput} 
                placeholder="Enter text to search" 
                autoCorrect={false}
                onChangeText={(text) => {
                    this.setState({ searchedDesc: text });
                    filterArticle(text).then(filteredTodoLists => {
                        this.setState({ articleLists: filteredTodoLists });
                    }).catch(error => {
                        this.setState({ articleLists: [] });
                    });
                }} 
                value={this.state.searchedDesc}
            />
            <FlatList
                style={styles.flatList}
                data={this.state.articleLists}
                renderItem={({ item, index }) => 
                <FlatListItem
                    item={item} 
                    itemIndex={index}
                    popupDialogComponent={this.refs.popupDialogComponent}
                    onPressItem={() => {
                        alert(`You pressed item `+item.desc);
                    }} />}
                keyExtractor={item => item.id.toString()}
            />
            <PopupDialogComponent ref={"popupDialogComponent"} />
        </View>);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    flatList: {
        flex: 1,
        flexDirection: 'column',
    },
    textInput: {
        height: 40,
        padding: 10,
        margin: 10,
        borderColor: 'gray',
        borderWidth: 1
    },
});

