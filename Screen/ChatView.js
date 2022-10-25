import React, { Component } from 'react';
import { BackHandler, ToastAndroid, Text, Image, ImageBackground, TouchableOpacity, View, StyleSheet, ScrollView, Dimensions, Button, KeyboardAvoidingView, TextInput, TouchableHighlight, Keyboard, Alert } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import AutogrowInput from 'react-native-autogrow-input';
import { NavigationActions } from 'react-navigation'
import SocketIOClient from 'socket.io-client';
import _ from "lodash";
import { observer } from "mobx-react"
import { observable } from "mobx"
import { useRoute } from '@react-navigation/native';
import AppStyles from '../AppStyles';

import boxImage from '../image/sketch_box_01.png'
import imageBackgroundSource from '../image/bg5.png'

const BUTTON_SIZE = parseInt(30);

const uuidv1 = require('uuid/v1');
//const ioServerURL = 'http://192.168.1.118:3000';
const ioServerURL = 'http://18.163.129.246:3000'

const SOCKET_JOIN = 'server/join';
const SOCKET_ACTION = 'server/action';

const socketNamespace = 'server/action';

//used to make random-sized messages
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// The actual chat view itself- a ScrollView of BubbleMessages, with an InputBar at the bottom, which moves with the keyboard
@observer
export default class ChatView extends Component {

  constructor(props) {
    super(props);

    var messages = [];
    var guestList = [];
    var countDownTimer;

    //console.log("ChatView constructor " + JSON.stringify(this.props.route.params));

    this.state = {
      guestList: guestList,
      messages: messages,
      inputBarText: '',
      //roomId:this.props.navigation.state.params.roomId,
      //token:this.props.navigation.state.params.token,
      roomId: this.props.route.params.roomId,
      token: this.props.route.params.token,
      username: this.props.route.params.userViewModel.UserName,
      userId: this.props.route.params.userViewModel.user_id,
      startButtonDisable: false,
      backButtonDisable: false,
      gameStart: false,
      btnOpacity:1,

    }

    this.socket = SocketIOClient(ioServerURL);
    this._onConnected();
    this.socket.on(socketNamespace, msg => {
      this._onReceivedMessage(msg);
    })

    /*
    this.socket.on('disconnect', function (reason) {
      console.log(reason);
    });

    this.socket.on('reconnect', function() {alert('reconnect')} ); // connection restored
    // this.socket.on('reconnect_failed', function() { console.log("Reconnect failed"); });

    //this.socket.on(socketNamespace, this._onReceivedMessage);
    
    this.socket.on('error',this._onErrorMessage);
    */
  }

  static navigationOptions = {
    title: 'Chat',
  };

  //fun keyboard stuff- we use these to get the end of the ScrollView to "follow" the top of the InputBar as the keyboard rises and falls
  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this));

  }

  componentWillUnmount() {

    this.userRoomMappingViewModel.leaveRoom(this.state.roomId, this.state.userId);

    if (parseInt(this.state.userId) == parseInt(this.roomViewModel.creator_id)) {
      console.log(' creator leave, room set to CLOSE')
      this.roomViewModel.updateRoomStatus();
    }

    var msg = {
      type: 'server/leave',
      data: {
        roomId: this.state.roomId,
        token: this.state.token,
        username: this.state.username,
        userId: this.state.userId,
      }
    };

    this.socket.emit(SOCKET_ACTION, { msg: msg }, this.state.roomId);
    this.socket.destroy();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton() {
    //ToastAndroid.show('Back button is pressed', ToastAndroid.SHORT);
    return true;
  }

  //When the keyboard appears, this gets the ScrollView to move the end back "up" so the last message is visible with the keyboard up
  //Without this, whatever message is the keyboard's height from the bottom will look like the last message.
  keyboardDidShow(e) {
    //this.scrollView.scrollToEnd();
  }

  //When the keyboard dissapears, this gets the ScrollView to move the last message back down.
  keyboardDidHide(e) {
    //this.scrollView.scrollToEnd();
  }

  //scroll to bottom when first showing the view
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  //this is a bit sloppy: this is to make sure it scrolls to the bottom when a message is added, but
  //the component could update for other reasons, for which we wouldn't want it to scroll to the bottom.
  componentDidUpdate() {

    setTimeout(function () {
      this.scrollView.scrollToEnd();
    }.bind(this))

  }

  _onConnected = () => {

    console.log('_onConnected');
    var msg = {
      type: 'server/join',
      data: {
        roomId: this.state.roomId,
        token: this.state.token,
        username: this.state.username,
        userId: this.state.userId,
      }
    };
    this.socket.emit(SOCKET_JOIN, { msg: msg }, this.state.roomId);

    /*
    console.log('_onConnected');
    var msg = {
      type: 'server/join',
      data: {
        roomId: this.state.roomId,
        token: this.state.token,
        username: this.state.username,
        userId: this.state.userId,
      }
    };
    this.socket.emit(socketNamespace, { msg: msg });
    */
  }

  _onReceivedMessage = (payload) => {
    console.log('_onReceivedMessage : ');
    console.log(payload);
    var roomId = payload.msg.data.roomId;

    //if (roomId != 'abc') {
    if (false) {
      console.log("not match room, return");
      return;
    }

    if (payload.msg.type === 'server/join') {


      this.state.messages.push({
        type: 'join',
        username: payload.msg.data.username,
      });
      //this.state.guestList.push(payload.msg.data.username);
    }
    else if (payload.msg.type === 'server/leave') {

      console.log(payload.msg.data.userId)
      console.log(this.roomViewModel.creator_id)
      if (parseInt(payload.msg.data.userId) == parseInt(this.roomViewModel.creator_id)) {

        if (this.state.gameStart == false) {
          Alert.alert(
            "房主已退出房間",
            "本房間也即將結束",
            [{ text: "OK", onPress: () => this.props.navigation.goBack() }]
          )
        }

      }

      this.state.messages.push({
        type: 'leave',
        username: payload.msg.data.username,
      });
      //this.state.guestList.push(payload.msg.data.username);
    }
    else if (payload.msg.type === 'server/start') {

      if (global.cardsListViewModel.room_id != this.state.roomId || parseInt(global.cardsListViewModel.cardsListString) == 0) {
        global.cardsListViewModel.getCardsList(this.state.roomId, this.state.userId).then(
          res => {
            console.log('getCardsList successful !');


          }
        )
      }

      this.state.messages.push({
        type: 'start',
        counter: payload.msg.data.counter,
      });
      this.state.backButtonDisable = true;
      this.state.gameStart = true;
      this.state.btnOpacity = 0.5;

      if (parseInt(payload.msg.data.counter) == 0) {
        this.props.navigation.navigate('GamePlayView', {
          roomId: this.state.roomId,
          token: this.state.token,
          userId: this.state.userId,
          userRoomMappingViewModel: this.userRoomMappingViewModel,
          roomViewModel: this.roomViewModel,
          userViewModel: this.props.route.params.userViewModel,
          holdingCards: global.cardsListViewModel.holdingCards,
          deckList: global.cardsListViewModel.deckList,
        });
      }

    }

    this.userRoomMappingViewModel.checkMapping(this.state.roomId).then(r => {

      console.log('check Mapping = ' + JSON.stringify(this.userRoomMappingViewModel.guestList));
      this.setState((state, props) => ({
        messages: state.messages,
        guestList: this.userRoomMappingViewModel.guestList,
        backButtonDisable: state.backButtonDisable,
        gameStart: state.gameStart,
        btnOpacity : state.btnOpacity,
      }));
    })

    /*
    if (payload.msg.type === 'server/leave' || payload.msg.type === 'server/join') {
      this.userRoomMappingViewModel.checkMapping(this.state.roomId).then(r => {

        this.setState((state, props) => ({
          messages: state.messages,
          guestList: this.userRoomMappingViewModel.guestList,
        }));
      })
    }
    else {
      this.setState((state, props) => ({
        messages: state.messages,
        backButtonDisable: state.backButtonDisable,
      }));
    }
    */
  }

  _onErrorMessage = (msg) => {
    alert(msg);
  }

  _sendMessage = () => {


    console.log("_sendMessage : " + this.state.inputBarText);


    //empty text filter
    if (!this.state.inputBarText || !this.state.inputBarText.length) {
      return;
    }


    Keyboard.dismiss();

    //this.socket.emit("server/comment", this.state.inputBarText);

    //return;

    var message = { id: uuidv1(), text: this.state.inputBarText };
    this.state.messages.push(message);
    message.username = this.state.username;
    var data = {
      type: 'server/comment',
      data: {
        //uuidv1:"5",
        text: this.state.inputBarText,
        roomId: this.state.roomId,
        token: this.state.token,
        username: this.state.username,
        userId: this.state.userId,
      }
    };

    /*
    message.direction = "right";
    message.sent = false;
    this.setState({
      messages: this.state.messages,
      inputBarText: ''
    });
    */
  }

  _callbackMessage = () => {
    console.log("_callbackMessage");
  }

  /*
  _callbackMessage=(status)=>{
    console.log(status);
    var messages = _.reduce(this.state.messages,function(messages,msg,index){
                if(msg.id === status.messageId){
                  console.log(msg);
                  msg.sent = true;
                }
                messages.push(msg);
                return messages;
              },[]);
    this.setState({messages:messages});
  }
  */
  _onChangeInputBarText(text) {
    this.setState({
      inputBarText: text
    });
  }

  //This event fires way too often.
  //We need to move the last message up if the input bar expands due to the user's new message exceeding the height of the box.
  //We really only need to do anything when the height of the InputBar changes, but AutogrowInput can't tell us that.
  //The real solution here is probably a fork of AutogrowInput that can provide this information.
  _onInputSizeChange() {
    setTimeout(function () {
      this.scrollView.scrollToEnd({ animated: false });
    }.bind(this))
  }

  startBtnOnClick() {

    this.userRoomMappingViewModel.startGameSetup(this.state.roomId).then(r => {

      if (r) {
        this.counter = 3;

        if (this.countDownTimer == null) {
          var msg = {
            type: 'server/start',
            data: {
              roomId: this.state.roomId,
              counter: new String(this.counter),
            }
          };
          this.socket.emit(SOCKET_ACTION, { msg: msg }, this.state.roomId);
          this.countDownTimer = setInterval(() => {
            this.counter = this.counter - 1;
            console.log("Count down ....  " + this.counter);

            var msg = {
              type: 'server/start',
              data: {
                roomId: this.state.roomId,
                counter: new String(this.counter),
              }
            };
            this.socket.emit(SOCKET_ACTION, { msg: msg }, this.state.roomId);


            if (this.counter == 0) {
              clearInterval(this.countDownTimer);
            }

          }, 1000)



          this.setState((state, props) => ({
            startButtonDisable: true,
            btnOpacity:0.5,
          }));
        }
      }
    })


  }

  logMessageShow(msg) {
    if (msg.type == 'join') {
      return msg.username + ' 加入房間.';
    }
    else if (msg.type === 'leave') {
      return msg.username + '退出房間';
    }
    else if (msg.type == 'start') {
      return '正在倒數開始 ' + msg.counter + ' ...';
    }

    return;
  }

  editRoomName(name) {
    this.roomViewModel.updateRoomName(name);
  }

  render() {
    const { navigation, route } = this.props;
    const { roomViewModel, userViewModel, userRoomMappingViewModel } = route.params;
    this.roomViewModel = roomViewModel;
    this.userViewModel = userViewModel;
    this.userRoomMappingViewModel = userRoomMappingViewModel;

    var messages = [];
    var guestList = [];

    return (

      <ImageBackground
        source={imageBackgroundSource}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: AppStyles.colour.backgroundColor }}>
        <View style={styles.topContainer}>
          {
          //this.userViewModel.user_id == this.roomViewModel.creator_id ?
            false?
          
              <TextInput
                style={styles.title}
                //placeholder={global.cardsListViewModel.cardsListString}
                placeholder={this.roomViewModel.room_name}
                editable
                maxLength={40}
                onSubmitEditing={(event) => this.editRoomName(event.nativeEvent.text)}
              />
              



            :
            <View>

              <Text style={styles.title} >{this.roomViewModel.room_name}</Text>
            </View>
          }

        </View>
        <View style={styles.MiddleContainer}>
          <View style={{ flex: 3 }}>
            {
              this.state.guestList.map((item, index) => {
                return (

                  <View
                    key={index}
                    style={styles.rowItemView}

                  >
                    <Image
                      style={styles.tinyLogo}
                      source={{
                        uri: global.domain + 'wetag/image/face' + item.Avator + '.png',
                      }} />
                    <Text style={styles.usernameText}>{item.Username}</Text>
                  </View>


                  /*
                  <View style={styles.messageJoin} key={index}>
                    <Image
                      style={styles.tinyLogo}
                      source={{
                        uri: global.domain + 'wetag/image/1.jpg',
                      }} /><Text style={styles.usernameText}>{item.Username}</Text>
                  </View>
                  */
                )
              })}
          </View>
          <View
            style={styles.logViewStyle}
            resizeMode='stretch'
            source={boxImage}
          >
            <ScrollView ref={(ref) => { this.scrollView = ref }} style={styles.logScrollView} contentContainerStyle={{ paddingBottom: 20 }}>
              {this.state.messages.map((item, index) => {
                return (
                  <Text style={styles.logTextStyle} key={index}>{this.logMessageShow(item)}</Text>
                )
              })}
            </ScrollView>
          </View>


        </View>
        <View style={styles.BottomContainer}>
          <TouchableOpacity
            disabled={this.state.backButtonDisable}
            style={[styles.buttonStyle,  {opacity:this.state.btnOpacity}]}
            activeOpacity={0.5}
            onPress={() => navigation.goBack()}
          >
            <Image
              style={styles.iconBtnStyle}
              source={this.state.backButtonDisable ? require('../image/icons8-back-96.png') : require('../image/icons8-back-96.png')}
            //style={styles.ImageIconStyle}
            />
          </TouchableOpacity>
          {this.userViewModel.user_id == this.roomViewModel.creator_id ?
            <TouchableOpacity
              disabled={this.state.backButtonDisable}
              style={[styles.buttonStyle,  {opacity:this.state.btnOpacity}]} activeOpacity={0.5}
              onPress={() => this.startBtnOnClick()}
            >
              <Image
                style={styles.iconBtnStyle}
                source={this.state.startButtonDisable ? require('../image/icons8-play-96.png') : require('../image/icons8-play-96.png')}
              //style={styles.ImageIconStyle}
              />
            </TouchableOpacity>
            :
            <View />
          }

        </View>

      </ImageBackground>
   

    )
    return (
      <View style={styles.outer}>
        <ScrollView ref={(ref) => { this.scrollView = ref }} style={styles.messages}>
          {messages}
        </ScrollView>
        <InputBar onSendPressed={() => this._sendMessage()}
          onSizeChange={() => this._onInputSizeChange()}
          onChangeText={(text) => this._onChangeInputBarText(text)}
          text={this.state.inputBarText} />

      </View>
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
    width: Dimensions.get('window').width,

    flex: 8,
  },
  BottomContainer: {
    margin: 10,
    borderRadius: 10,
    flex: 1,
    width: Dimensions.get('window').width - 20,
    backgroundColor: 'red',
    backgroundColor: AppStyles.colour.themeSubColor,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  messageJoin: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Dimensions.get('window').width - 20,
    borderRadius: 5,
    backgroundColor: '#E5E4E2',
    margin: 5,
    padding: 10
  },
  usernameText: {
    color: AppStyles.colour.fontColor_white,
    fontFamily: AppStyles.font.custom,
    marginLeft: 20,
    fontSize: 16
  },
  logScrollView: {
    width: Dimensions.get('window').width - 20,


    padding: 10,
  },
  tinyLogo: {
    marginLeft: 20,
    borderRadius: 25,
    width: 50,
    height: 50,
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
  boxImageBackground: {
    padding: 20,
    margin: 10,
    width: Dimensions.get('window').width - 60,
    height: 80,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row'
  },
  title: {
    color: AppStyles.colour.fontColor,
    fontFamily: AppStyles.font.custom,
    fontSize: 20,
    width: Dimensions.get('window').width - 40,
    margin: 10,
  },
  rowItemView: {
    margin: 10,
    height: 60,
    //backgroundColor:'red',
    backgroundColor: AppStyles.colour.buttonBgColor,
    width: Dimensions.get('window').width - 40,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',

  },
  logViewStyle: {
    flex: 1,
    backgroundColor: AppStyles.colour.themeSubColor,
    margin: 10,
    borderRadius: 10,
  },
  logTextStyle: {
    fontFamily: AppStyles.font.custom,
    fontSize: 16,
    color: AppStyles.colour.fontColor,
  }
});

/*

//TODO: separate these out. This is what happens when you're in a hurry!
const styles = StyleSheet.create({

  //ChatView

  outer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },

  messages: {
    flex: 1
  },

  //InputBar

  inputBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingVertical: 3,
  },

  textBox: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10
  },

  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 15,
    marginLeft: 5,
    paddingRight: 15,
    borderRadius: 5,
    backgroundColor: '#66db30'
  },

  //MessageBubble

  messageBubble: {
      borderRadius: 5,
      marginTop: 8,
      marginRight: 10,
      marginLeft: 10,
      paddingHorizontal: 10,
      paddingVertical: 5,
      flexDirection:'row',
      flex: 1,
      minWidth:20
  },

  messageBubbleLeft: {
    backgroundColor: '#d5d8d4',
  },

  messageBubbleTextLeft: {
    color: 'black'
  },

  messageBubbleRight: {
    backgroundColor: '#66db30',
  },

  messageBubbleTextRight: {
    color: 'white',
  },

  messageJoin:{
    borderRadius: 5,
    backgroundColor:'#D3D3D3',
    margin:5,
    padding:10
  },

  messageBubbleTextJoin:{
    color:'black',
    fontSize:12,
    fontStyle:'italic'
  },

  usernameText:{
    fontWeight:'bold',
    marginBottom:2,
    fontSize:16
  },

  notSendText:{
    fontStyle:'italic',
    fontSize:12,
    color:'red',
    paddingLeft:10
  }
})
*/