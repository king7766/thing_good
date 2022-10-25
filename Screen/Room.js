import React, {Component} from 'react';
import { Button, View, Text, TextInput, StyleSheet, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {observer} from "mobx-react"
import {observable} from "mobx"

import RoomViewModel from '../model/RoomViewModel';
import UserViewModel from '../model/UserViewModel';
import UserRoomMappingViewModel from '../model/UserRoomMappingViewModel';


@observer 
export default class RoomScreen extends Component<Props> {

    @observable roomList = [];


    constructor(props){
        super(props);
        
        //this.viewModel;
        //const store = new Store();
    };

    update = () => {
        this.roomViewModel.checkRoomUpdate();
        
        this.userRoomMappingViewModel.checkMapping(this.roomViewModel.room_id);
        //this.UserRoomMappingViewModel.getMapping(this.roomViewModel.room_id);
        //this.userRoomMappingViewModel.getMapping(this.roomViewModel.room_id);
        //this.userRoomMappingViewModel.addMember(this.roomViewModel.room_id, this.userViewModel.user_id)
    }

    editRoomName(name)
    {
        this.roomViewModel.updateRoomName(name);
    }


    render() {  
        const { navigation, route } = this.props;
        const { roomViewModel, userViewModel, userRoomMappingViewModel } = route.params;
        this.roomViewModel = roomViewModel;
        this.userViewModel = userViewModel;
        this.userRoomMappingViewModel = userRoomMappingViewModel;

        return (  
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View style={styles.topContainer}>
                    {this.userViewModel.user_id == this.roomViewModel.creator_id ? 
                    <TextInput
                        placeholder={this.roomViewModel.room_name}
                        editable
                        maxLength={40}
                        onSubmitEditing={ (event) => this.editRoomName(event.nativeEvent.text)}
                    />
                    :
                    <Text>{this.roomViewModel.room_name}</Text>
                    }
                </View>
                <View style={styles.MiddleContainer}>
                    <View style= {{backgroundColor:'red', height:500, width:100}}>
                        {this.userRoomMappingViewModel.mappingList.map((item)=>(
                        <View>
                            <Text>{item.Username}</Text>
                        </View>
                        ))}

                    </View>
                </View>
                <View style={styles.BottomContainer}>
                    <Button style={{flex:1, padding:20}} title="Go back" onPress={() => navigation.goBack()} />
                    <Button
                        style={{flex:1, padding:20}} 
                        title="Update "
                        onPress={this.update}
                    />
                </View>
               
            </View>
        );
    }
}



const styles = StyleSheet.create({
    topContainer:{
        alignItems:'center',
        width:Dimensions.get('window').width,
        backgroundColor:'pink',
        flex:1,
    },
    MiddleContainer:{
        alignItems:'center',
        width:Dimensions.get('window').width,
        backgroundColor:'skyblue',
        flex:8,
    },
    BottomContainer:{
        alignItems:'center',
        width:Dimensions.get('window').width,
        backgroundColor:'coral',
        justifyContent: "space-around",
        flexDirection:'row',
        flex:1,
    }
    

});