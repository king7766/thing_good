import React, { Component, useState, useEffect } from 'react';
import { Modal, FlatList, Button, ImageBackground, TouchableOpacity, Image, View, Text, TextInput, StyleSheet, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { observer } from "mobx-react"
import { observable } from "mobx"
import AppStyles from '../AppStyles';
import RoomViewModel from '../model/RoomViewModel';
import UserViewModel from '../model/UserViewModel';
import UserRoomMappingViewModel from '../model/UserRoomMappingViewModel';
import imageBackgroundSource from '../image/bg4.png'
import i18next from 'i18next';

const AVATOR_SIZE = 180;
const BUTTON_SIZE = parseInt(30);



@observer
export default class HomeScreen extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            token: 'abc123',
            avator: 1,
            dataSource: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            pickerViewVisible: false,
            fontsLoaded: false,
            currentLanguage: i18next.language,
            showTutorial: true,
        }

        console.log("i18next.language = " + i18next.language);
        this.RoomViewModel = new RoomViewModel();
        this.UserViewModel = new UserViewModel();
        this.UserRoomMappingViewModel = new UserRoomMappingViewModel();
    };




    editUserName(name) {
        console.log("enterUserName : " + name);
        this.UserViewModel.setUserName(name);
    }

    createBtnOnClick() {
        console.log("createBtnOnClick");

        this.RoomViewModel.createRoom(this.UserViewModel.user_id, this.UserViewModel.UserName).then(
            response => {
                console.log("create room !" + response)
                //const num = Number(response);

                if (Number.isInteger(response) && response > 0) {
                    console.log("create room successful !");
                    this.props.navigation.navigate('ChatView', {
                        roomId: response,
                        token: this.state.token,
                        userRoomMappingViewModel: this.UserRoomMappingViewModel,
                        roomViewModel: this.RoomViewModel,
                        userViewModel: this.UserViewModel,
                    });
                }
                else {
                    console.log("create room fail ><! ");
                }
            }
        )
    }

    joinBtnOnClick() {
        console.log("joinBtnOnClick");
        this.RoomViewModel.getRoomList().then(
            response => {
                if (response == true) {
                    this.props.navigation.navigate('RoomList', {
                        roomViewModel: this.RoomViewModel,
                        userViewModel: this.UserViewModel,
                        userRoomMappingViewModel: this.UserRoomMappingViewModel,
                    })

                }
            }
        )
    }

    componentDidMount() {
        console.log('componentDidMount');
    }

    changeAvatarBtnOnClick() {
        this.setState({
            pickerViewVisible: !this.state.pickerViewVisible,
        })
    }

    questionBtnOnClick() {
        this.props.navigation.navigate('SettingView', {})
    }

    settingBtnOnClick() {

        this.props.navigation.navigate('InformationView', {})

    }

    changeLanguage() {
        //i18 example 
        var value = this.state.currentLanguage;

        if (value === 'zh') {
            value = 'en';
        }
        else {
            value = 'zh'
        }
        console.log("changeLanguage to " + value);
        i18next
            .changeLanguage(value)
            .then(() => this.setState({ currentLanguage: value }))
            .catch(err => console.log(err));

        return;
    }



    changeAvatar(index) {

        console.log('changeAvatar = ' + index);

        this.setState({
            pickerViewVisible: !this.state.pickerViewVisible,
            avator: index,
        }, function () {
            this.UserViewModel.setAvator(index);
        })
    }

    render() {
        const { navigation } = this.props;

        console.log("render ...");
        return (
            <ImageBackground
                source={imageBackgroundSource}
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: AppStyles.colour.backgroundColor }}>

                <Modal

                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.showTutorial}
                    onRequestClose={() => { console.log("Modal has been closed.") }}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.9)' }}>
                        <View style={{ flex: 7, justifyContent: 'flex-end' }} >
                            <TouchableOpacity
                                onPress={() => this.setState({ showTutorial: false })}
                            >
                                <View style={{ flex: 6 }}></View>
                            </TouchableOpacity>
                            <Text style={styles.message}>如果您第一次遊玩, 建議先看看教學了解玩法</Text>
                        </View>
                        <View style={styles.bottomContainer}>
                            <TouchableOpacity
                                style={styles.buttonDisableStyle} activeOpacity={0.5}
                            >
                                <Image
                                    style={styles.iconBtnStyle}
                                    source={require('../image/icons8-add-96.png')}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.buttonDisableStyle} activeOpacity={0.5}
                            >
                                <Image
                                    style={styles.iconBtnStyle}
                                    source={require('../image/icons8-search-100.png')}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.buttonStyle} activeOpacity={0.5}
                                onPress={() => this.questionBtnOnClick()}
                            >
                                <Image
                                    style={styles.iconBtnStyle}
                                    source={require('../image/icons8-question-mark-100.png')}
                                //style={styles.ImageIconStyle}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.buttonDisableStyle}
                                activeOpacity={0.5}
                            >
                                <Text style={{ color: AppStyles.colour.fontColor_white }}>中/EN</Text>
                            </TouchableOpacity>

                        </View>
                        <View style={{ height: 20 }} />
                    </View>


                </Modal>
                <Modal

                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.pickerViewVisible}
                    onRequestClose={() => { console.log("Modal has been closed.") }}>
                    {/*All views of Modal*/}
                    <ImageBackground
                        source={imageBackgroundSource}
                        style={styles.modal}>
                        <View style={{ width: '100%' }}>

                            <Text style={styles.title}>請選擇頭像</Text>

                        </View>

                        <View style={{ flex: 8, backgroundColor: themeSubColor, borderRadius: 10 }}>
                            <FlatList

                                contentContainerStyle={{ margin: 10, alignItems: "stretch" }}
                                data={this.state.dataSource}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity
                                        style={styles.pickerIconLogo} activeOpacity={0.5}
                                        onPress={() => this.changeAvatar(item)}
                                    >

                                        <Image
                                            style={styles.pickerIconLogo}
                                            source={{
                                                uri: global.domain + 'wetag/image/face' + item + '.png',
                                            }} />


                                    </TouchableOpacity>
                                )}
                                //Setting the number of column
                                numColumns={3}
                            //keyExtractor={(item, index) => index.toString()}
                            />
                        </View>

                        <View style={{ flex: 1 }}></View>

                    </ImageBackground>
                </Modal>

                <View style={styles.topContainer} >
                    <Image
                        resizeMode='stretch'
                        style={{ height: 180, width: Dimensions.get('window').width - 220 }}
                        //source={require('../image/logo-no-background.png')}
                        source={require('../image/logo-removebg-preview7-removebg-preview.png')}

                    />

                </View>
                <View style={styles.middleContainer}>
                    <View style={{ flex: 1, }} />
                    <View style={{ flex: 1, }}>
                        <TouchableOpacity
                            style={styles.FaceButtonStyle}
                            activeOpacity={0.5}
                            onPress={() => this.changeAvatarBtnOnClick()}
                        >
                            <View >
                                <Image
                                    style={styles.FaceLogo}
                                    source={{
                                        uri: global.domain + 'wetag/image/face' + this.UserViewModel.getAvator() + '.png',
                                    }} />
                                <View
                                    style={styles.editBtnView}
                                >
                                    <Image
                                        style={{ height: 25, width: 25 }}
                                        source={require('../image/icons8-edit-96.png')}
                                    />
                                </View>

                            </View>
                        </TouchableOpacity>
                    </View>
                  
                    <View style={{ flex: 1, width: Dimensions.get('window').width, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontFamily: AppStyles.font.custom, textAlign: 'right', fontSize: 20, color: AppStyles.colour.fontColor, width: Dimensions.get('window').width / 2 }}>
                            {i18next.t('home_your_name')}
                        </Text>
                        <TextInput
                            style={{ fontFamily: AppStyles.font.custom, fontSize: 25, width: Dimensions.get('window').width / 2 }}
                            placeholder={this.UserViewModel.getUserName()}
                            editable
                            maxLength={40}
                            /*
                            onChange={(event) => {
                                this.editUserName(event.nativeEvent.text)
                            }}*/
                            onSubmitEditing={(event) => this.editUserName(event.nativeEvent.text)}
                        />
                    </View>


                </View >


                <View style={styles.bottomContainer}>


                    <TouchableOpacity

                        style={styles.buttonStyle} activeOpacity={0.5}
                        onPress={() => this.createBtnOnClick()}
                    >

                        <Image
                            style={styles.iconBtnStyle}
                            source={require('../image/icons8-add-96.png')}

                        />

                    </TouchableOpacity>



                    <TouchableOpacity

                        style={styles.buttonStyle} activeOpacity={0.5}
                        onPress={() => this.joinBtnOnClick()}
                    >
                        <Image
                            style={styles.iconBtnStyle}
                            source={require('../image/icons8-search-100.png')}
                        />
                    </TouchableOpacity>



                    <TouchableOpacity
                        style={styles.buttonStyle} activeOpacity={0.5}
                        onPress={() => this.questionBtnOnClick()}
                    >
                        <Image
                            style={styles.iconBtnStyle}
                            source={require('../image/icons8-question-mark-100.png')}
                        //style={styles.ImageIconStyle}
                        />
                    </TouchableOpacity>


                    <TouchableOpacity
                        style={styles.buttonStyle}
                        activeOpacity={0.5}
                        onPress={() => this.changeLanguage()}
                    >
                        <Text style={{ color: AppStyles.colour.fontColor_white }}>中/EN</Text>
                    </TouchableOpacity>

                </View>
                <View style={styles.versionViewStyle}>
                    <Text>v1.0.0.1</Text>
                </View>
            </ImageBackground >
        );
    }
}




const styles = StyleSheet.create({
    topContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        transform: [{ scaleX: 2 }],
        borderBottomStartRadius: 200,
        borderBottomEndRadius: 200,
        overflow: 'hidden',
        backgroundColor: AppStyles.colour.themeSubColor,
        flex: 2,
    },
    middleContainer: {
        flex: 5,

        flexDirection: 'column',
        alignItems: 'center'
    },
    bottomContainer: {
        margin: 10,
        borderRadius: 10,
        flex: 1,
        width: Dimensions.get('window').width - 20,
        backgroundColor: AppStyles.colour.themeSubColor,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        //position: 'absolute',
    },
    buttonDisableStyle: {
        opacity: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: AppStyles.colour.themeActionColor,
        borderRadius: (BUTTON_SIZE * 1.5) / 2,
        width: BUTTON_SIZE * 1.5,
        height: BUTTON_SIZE * 1.5,
    },
    buttonStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: AppStyles.colour.themeActionColor,
        borderRadius: (BUTTON_SIZE * 1.5) / 2,
        width: BUTTON_SIZE * 1.5,
        height: BUTTON_SIZE * 1.5,
    },
    versionViewStyle: {
        height: 20,
        width: Dimensions.get('window').width,
        justifyContent: 'flex-end',
        flexDirection: 'row'
    },
    iconBtnStyle: {


        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
    },
    pickerIconLogo: {
        borderRadius: ((Dimensions.get('window').width - 60) / 3) / 2,
        width: (Dimensions.get('window').width - 60) / 3,
        height: (Dimensions.get('window').width - 60) / 3,
    },
    FaceButtonStyle: {

        justifyContent: 'center',
        alignItems: 'center',

        borderRadius: (BUTTON_SIZE * 1.5) / 2,
        width: BUTTON_SIZE * 1.5,
        height: BUTTON_SIZE * 1.5,
    },
    FaceLogo: {

        borderRadius: AVATOR_SIZE / 2,
        width: AVATOR_SIZE,
        height: AVATOR_SIZE,

    },

    modal: {

        //justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: AppStyles.colour.backgroundColor,
        width: Dimensions.get('window').width,
        flex: 1,
    },
    title: {
        fontFamily: AppStyles.font.custom,
        //fontWeight: 'bold',
        fontSize: 20,
        width: Dimensions.get('window').width - 40,
        margin: 10,
    },
    editBtnView: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        height: AVATOR_SIZE / 6,
        width: AVATOR_SIZE / 6,
        borderRadius: AVATOR_SIZE / 12,
        backgroundColor: AppStyles.colour.themeActionColor,
        marginTop: AVATOR_SIZE - AVATOR_SIZE / 5,
        marginLeft: AVATOR_SIZE - 1.5 * AVATOR_SIZE / 5
    },
    TopicStyle: {
        marginBottom: 50,
        fontFamily: AppStyles.font.custom,
        textAlign: 'center',
        fontSize: 40,
        color: AppStyles.colour.fontColor,
        width: Dimensions.get('window').width / 2

    },
    message: {
        textAlign: 'center',
        borderColor: 'white',
        borderWidth: 2,
        borderStyle: 'dotted',
        borderRadius: 1,
        padding: 10,
        color: AppStyles.colour.fontColor_white,
        fontSize: 16,
        fontFamily: AppStyles.font.custom
    },
});


