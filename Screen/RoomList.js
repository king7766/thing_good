import React, { Component } from 'react';
import { Button, Image, ImageBackground, View, Text, TextInput, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { observer } from "mobx-react"
import { observable } from "mobx"
import AppStyles from '../AppStyles';

import boxImage from '../image/sketch_box_01.png'
import RoomViewModel from '../model/RoomViewModel';
import UserViewModel from '../model/UserViewModel';
import UserRoomMappingViewModel from '../model/UserRoomMappingViewModel';

import imageBackgroundSource from '../image/bg5.png'

const BUTTON_SIZE = parseInt(30);

@observer
export default class RoomListScreen extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            token: 'abc123',
        }
    };

    listItemOnClick(item) {
        console.log("listItemOnClick " + item.ID);

        this.userRoomMappingViewModel.joinRoom(item.ID, this.userViewModel.user_id).then(
            response => {
                if (response) {
                    this.roomViewModel.setRoomId(item.ID).then(
                        res => {
                            if (res) {
                                console.log(this.userRoomMappingViewModel);
                                this.props.navigation.navigate('ChatView', {
                                    roomId: item.ID,
                                    token: this.state.token,
                                    userRoomMappingViewModel: this.userRoomMappingViewModel,
                                    roomViewModel: this.roomViewModel,
                                    userViewModel: this.props.route.params.userViewModel,
                                });

                                /*
                                this.props.navigation.navigate('Room', {
                                    roomViewModel:this.roomViewModel,
                                    userViewModel:this.userViewModel,
                                    userRoomMappingViewModel: this.userRoomMappingViewModel,
                                })
                                */

                            }
                        }
                    )
                }
            }
        )

    }

    reloadRoomList() {
        this.roomViewModel.getRoomList();
    }

    render() {
        const { navigation, route } = this.props;
        const { roomViewModel, userViewModel, userRoomMappingViewModel } = route.params;
        this.roomViewModel = roomViewModel;
        this.userViewModel = userViewModel;
        this.userRoomMappingViewModel = userRoomMappingViewModel;

        return (
            <ImageBackground
                source={imageBackgroundSource}
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: global.backgroundColor }}>
                <View style={styles.topContainer}>
                    <Text style={styles.title}>房間列表</Text>

                </View>
                <View style={styles.MiddleContainer}>
                    <ScrollView
                        contentContainerStyle={{ justifyContent: 'center', alignItems: 'center',padding:10   }}
                        style={{ width: Dimensions.get('window').width }}>
                        {this.roomViewModel.roomList.map((item, index) => (
                            <View key={index}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={styles.rowItemView}
                                    onPress={() => this.listItemOnClick(item)}
                                >
                                    <View
                                        resizeMode='stretch'
                                        source={boxImage}
                                        style={styles.boxImageBackground}

                                    >
                                        <Text style={styles.room_nameStyle}>{item.room_name}</Text>
                                    </View>
                                </TouchableOpacity >




                            </View>
                        ))}

                    </ScrollView >
                </View>
                <View style={styles.BottomContainer}>
                    <TouchableOpacity
                        disabled={this.state.backButtonDisable}
                        style={styles.buttonStyle}
                        activeOpacity={0.5}
                        onPress={() => navigation.goBack()}
                    >
                        <Image
                            style={styles.iconBtnStyle}
                            source={this.state.backButtonDisable ? require('../image/icons8-back-96.png') : require('../image/icons8-back-96.png')}
                        //style={styles.ImageIconStyle}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buttonStyle} activeOpacity={0.5}
                        onPress={() => this.reloadRoomList()}
                    >
                        <Image
                            style={styles.iconBtnStyle}
                            source={require('../image/icons8-restart-96.png')}
                        //style={styles.ImageIconStyle}
                        />
                    </TouchableOpacity>

                </View>

            </ImageBackground>
        );
    }
}



const styles = StyleSheet.create({
    topContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width,

        flex: 1,
    },
    MiddleContainer: {
        alignItems: 'center',
        width: Dimensions.get('window').width - 20,
        backgroundColor: 'red',
        backgroundColor: AppStyles.colour.themeSubColor,
        borderRadius: 10,
        flex: 8,
    },
    BottomContainer: {
        margin: 10,
        borderRadius: 10,
        flex: 1,
        width: Dimensions.get('window').width - 20,
        backgroundColor: AppStyles.colour.themeSubColor,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    rowItemView: {
        margin: 5,
        //backgroundColor:'red',
        backgroundColor: AppStyles.colour.buttonBgColor,
        width: Dimensions.get('window').width - 40,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconLogo: {
        width: 50,
        height: 50,
    },
    room_nameStyle: {
        fontFamily: AppStyles.font.custom,
        //olor: global.textColor,
        color: 'white',
        fontSize: 16,
    },
    title: {
        fontFamily: AppStyles.font.custom,
        color: AppStyles.colour.fontColor,
        fontSize: 20,
        width: Dimensions.get('window').width - 40,
        margin: 10,
    },
    boxImageBackground: {
        width: Dimensions.get('window').width - 60,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: AppStyles.colour.themeActionColor,
        borderRadius: (BUTTON_SIZE * 1.5) / 2,
        width: BUTTON_SIZE * 1.5,
        height: BUTTON_SIZE * 1.5,
    },
    iconBtnStyle: {
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
    },

});