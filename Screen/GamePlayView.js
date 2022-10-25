import React, { Component } from 'react';
//import { SafeAreaView, Text, Image, TouchableOpacity, View, StyleSheet, ScrollView, Dimensions, Button, KeyboardAvoidingView, TextInput, TouchableHighlight, Keyboard, Alert } from 'react-native';
import { Alert, BackHandler, ToastAndroid, Image, TouchableOpacity, Dimensions, StyleSheet, ImageBackground, Platform, View, ScrollView, Text, StatusBar, SafeAreaView } from 'react-native';
import SocketIOClient from 'socket.io-client';
import _ from "lodash";
import { observer } from "mobx-react"
import { observable } from "mobx"

import LinearGradient from 'react-native-linear-gradient';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { ENTRIES1, ENTRIES2 } from './static/entries';
import { sliderWidth, itemWidth } from './styles/SliderEntry.style';
import styles, { colors } from './styles/index.style';
import { scrollInterpolators, animatedStyles } from './utils/animations';
import SliderEntry from './components/SliderEntry';
import { EventRegister } from 'react-native-event-listeners'
import AppStyles from '../AppStyles';

import boxImage from '../image/sketch_box_01.png'
import imageBackgroundSource from '../image/bg5.png'

const IS_ANDROID = Platform.OS === 'android';
const SLIDER_1_FIRST_ITEM = 1;

const uuidv1 = require('uuid/v1');
//const ioServerURL = 'http://192.168.1.118:3000';
const ioServerURL = 'http://18.163.129.246:3001'
const BUTTON_SIZE = parseInt(30);

const SOCKET_JOIN = 'server/join';
const SOCKET_ACTION = 'server/action';

//used to make random-sized messages
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// The actual chat view itself- a ScrollView of BubbleMessages, with an InputBar at the bottom, which moves with the keyboard
@observer
export default class GamePlayView extends Component {

  constructor(props) {
    super(props);

    var messages = [];
    var countDownTimer;

    //console.log("ChatView constructor " + JSON.stringify(this.props.route.params));

    this.state = {
      guestList: [],
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

      //holdingCards: global.cardsListViewModel.holdingCards,
      holdingCards: this.props.route.params.holdingCards,
      deckList: this.props.route.params.deckList,
      yourPosition: this.props.route.params.userRoomMappingViewModel.getPosition(this.props.route.params.roomId),

      userRoomMappingViewModel: this.props.route.params.userRoomMappingViewModel,
      currentPosition: 0,
      card_position_index: global.beginningNumbersOfHand - 1,
      getCardPayLogDisable: false,
      slider1ActiveSlide: SLIDER_1_FIRST_ITEM

    }

    this.socket = SocketIOClient(ioServerURL);
    this._onConnected();
    this.socket.on(SOCKET_ACTION, msg => {
      this._onReceivedMessage(msg);
    })

  }

  _renderItem({ item, index }) {
    return <SliderEntry data={item} even={(index + 1) % 2 === 0} />;
  }

  _renderItemWithParallax({ item, index }, parallaxProps) {
    return (
      <SliderEntry
        data={item}
        even={(index + 1) % 2 === 0}
        parallax={true}
        parallaxProps={parallaxProps}
      />
    );
  }

  sliderItemOnClick(clicked_object) {

    var currentPosition = global.cardsListViewModel.cardsLog.length % this.state.userRoomMappingViewModel.guestList.length;

    if (this.state.getCardPayLogDisable == false) {
      this.setState({
        getCardPayLogDisable: true
      });
      global.cardsListViewModel.getCardPayLog(this.state.roomId).then(r => { })
      setTimeout(() => this.setState({ getCardPayLogDisable: false }), 3000);
    }

    if (currentPosition != this.state.userRoomMappingViewModel.getPosition(this.state.userId)) {
      console.log('not your turn');
      ToastAndroid.show('現在不是你的回合 ', ToastAndroid.SHORT);
      return;
    }

    this.state.card_position_index++;
    let remove = this.state.holdingCards.map(function (item) { return item.ID; })
      .indexOf(clicked_object.ID);

    this.setState({
      holdingCards: this.state.holdingCards.filter((_, i) => i !== remove),
      card_position_index: this.state.card_position_index,
    }, function () {

      var msg = {
        type: 'card/pay',
        data: {
          userId: this.state.userId,
          cardId: parseInt(clicked_object.ID)
        }
      };

      global.cardsListViewModel.payCardAction(this.state.roomId, clicked_object.ID).then(r => {
        console.log(r);
        if (r) {
          this.socket.emit(SOCKET_ACTION, { msg: msg }, this.state.roomId);
        }

      })
    });

  }

  BoxImageBackground = ({ item, index }) => {
    return <TouchableOpacity
      activeOpacity={1}
      style={styles.slideInnerContainer}
      onPress={() => this.sliderItemOnClick(item)}
    >
      <View
        //source={boxImage}
        style={_styles.boxImageBackground}
      >
        <Text style={_styles.cardText}>{item.content}</Text>
      </View>
    </TouchableOpacity >

  }

  _renderLightItem({ item, index }) {
    return <SliderEntry data={item} even={false} />;
  }

  _renderDarkItem({ item, index }) {
    return <SliderEntry data={item} even={true} />;
  }





  get gradient() {
    return (
      <LinearGradient
        colors={[colors.background1, colors.background2]}
        startPoint={{ x: 1, y: 0 }}
        endPoint={{ x: 0, y: 1 }}
        style={styles.gradient}
      />
    );
  }




  componentWillUnmount() {
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
    global.cardsListViewModel.clearLog();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    EventRegister.removeEventListener(this.challegeListener);

  }

  handleBackButton() {
    //ToastAndroid.show('Back button is pressed', ToastAndroid.SHORT);
    return true;
  }

  //scroll to bottom when first showing the view
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    this.challegeListener = EventRegister.addEventListener('CHALLEGE_EVENT', (data) => {
      this.challengesBtnOnClick();
    })

  }

  //this is a bit sloppy: this is to make sure it scrolls to the bottom when a message is added, but
  //the component could update for other reasons, for which we wouldn't want it to scroll to the bottom.
  componentDidUpdate() {

    /*
    setTimeout(function () {
      this.scrollView.scrollToEnd();
    }.bind(this))
    */
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


  }

  _onReceivedMessage = (payload) => {
    console.log('_onReceivedMessage : ');
    console.log(payload);

    if (payload.msg.type === 'card/pay') {
      global.cardsListViewModel.getCardPayLog(this.state.roomId).then(r => {

        console.log('total card Log = ' + global.cardsListViewModel.cardsLog.length);

        if (payload.msg.data.userId === this.state.userId) {

          console.log("card_position_index = " + this.state.card_position_index);

          if (this.state.card_position_index < 10) {
            var new_hand_object = this.state.deckList[this.state.card_position_index];

            console.log("you have pay a hand, sup a hand !! " + JSON.stringify(new_hand_object));

            this.setState({
              holdingCards: [...this.state.holdingCards, new_hand_object],
            });
          }

        }
        else {
          console.log("recived other play action , refresh UI");
        }
      })
    }
    else if (payload.msg.type === 'server/start') {
      console.log("server/start action");
    }
    else if (payload.msg.type === 'card/challenge') {

      var currentPosition = global.cardsListViewModel.cardsLog.length % this.state.userRoomMappingViewModel.guestList.length;

      var username = this.userRoomMappingViewModel.guestList[currentPosition].Username;

      var contents = '';
      for (var j = 0; j < global.cardsListViewModel.cardsLog.length; j++) {
        contents += "# " + global.cardsListViewModel.cardsLog[j].content;
        contents += '\n';
        //contents.push(global.cardsListViewModel.cardsLog[j].content);
      }

      currentPosition = currentPosition - 1;
      if (currentPosition < 0) {
        currentPosition = this.userRoomMappingViewModel.guestList.length - 1;
      }

      var username = this.userRoomMappingViewModel.guestList[currentPosition].Username;

      Alert.alert(
        "挑戰 !",
        "請 " + username + " 說出一件東西附合以下條件 :\n" + contents + "\n\n" + "請各玩家舉手投票是否符合",
        [
          { text: "確認票數 , 完", onPress: () => this.endGame() }
        ]
      );
    }
  }

  endGame() {
    console.log("endGame");
    this.props.navigation.navigate('Home', {

    });
  }

  openingMessage() {
    //console.log('openingMessage');
    console.log(this.state.userId);
    return '你的位置是 ' + (this.state.yourPosition);

  }

  cardSlider(number, title, type) {
    const isTinder = type === 'tinder';
    return (

      <Carousel
        data={isTinder ? ENTRIES2 : ENTRIES1}
        //renderItem={isTinder ? this._renderLightItem : this._renderItem}
        //renderItem={this._renderDarkItem}
        renderItem={this.BoxImageBackground}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        containerCustomStyle={styles.slider}
        contentContainerCustomStyle={styles.sliderContentContainer}
        //layout={type}
        layout={'tinder'}
        //layout={'stack'}
        loop={true}
      />

    );
  }

  contentPrint() {

    console.log('guestList = ' + JSON.stringify(this.userRoomMappingViewModel.guestList));

    var currentPosition = global.cardsListViewModel.cardsLog.length % this.state.userRoomMappingViewModel.guestList.length;


    var print_message_array = [];
    for (var i = 0; i < this.userRoomMappingViewModel.guestList.length; i++) {
      var username = this.userRoomMappingViewModel.guestList[i].Username;
      var contents = [];
      var currentPositionIsUser = false;
      for (var j = 0; j < global.cardsListViewModel.cardsLog.length; j++) {
        if (global.cardsListViewModel.cardsLog[j].user_id === this.userRoomMappingViewModel.guestList[i].user_id) {
          //console.log(messages[j].Username + " : " +messages[j].content);
          contents.push(global.cardsListViewModel.cardsLog[j].content);
        }

      }


      if (parseInt(this.userRoomMappingViewModel.guestList[i].user_id) == parseInt(this.state.userId)) {
        username = '你';
        currentPositionIsUser = true;

      }
      print_message_array.push(
        {
          Username: username,
          Position: this.userRoomMappingViewModel.guestList[i].Position,
          contents: contents,
          avator: this.userRoomMappingViewModel.guestList[i].Avator,
          currentPositionIsUser: currentPositionIsUser,
        })
    }

    return (
      print_message_array.map((item, index) => (
        <MessageBubble key={index} item={item} index={index} currentPosition={currentPosition} />
      ))
    )

  }

  challengesBtnOnClick() {

    var currentPosition = global.cardsListViewModel.cardsLog.length % this.state.userRoomMappingViewModel.guestList.length;
    if (currentPosition != this.state.userRoomMappingViewModel.getPosition(this.state.userId)) {

      console.log('not your turn');
      ToastAndroid.show('現在不是你的回合 ', ToastAndroid.SHORT);
      return;
    }

    var msg = {
      type: 'card/challenge',
      data: {
        userId: this.state.userId,

      }
    };
    this.socket.emit(SOCKET_ACTION, { msg: msg }, this.state.roomId);

  }

  render() {
    const { navigation, route } = this.props;
    const { roomViewModel, userViewModel, userRoomMappingViewModel } = route.params;
    this.roomViewModel = roomViewModel;
    this.userViewModel = userViewModel;
    this.userRoomMappingViewModel = userRoomMappingViewModel;

    const cardSlider = this.cardSlider(3, '"Stack of cards" layout | Loop', 'stack');
    var guestList = [];

    return (

      <ImageBackground
        source={imageBackgroundSource}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: AppStyles.colour.backgroundColor }}>

        <View style={_styles.topContainer}
        >
          <Text style={_styles.title}>想像一個物件能滿足所有條件  {"\n"}(覺得沒有可以按 <Text style={_styles.underlineTextStyle}>手掌</Text> 舉報上一位玩家)</Text>

        </View>
        <View style={_styles.MiddleContainer}
        >

          {
            this.contentPrint()

          }

        </View>
        <View style={_styles.BottomContainer}>
          {
            this.state.holdingCards.length > 0 ?
              <View style={{ bottom: 10 }}>
                <Carousel

                  data={this.state.holdingCards}
                  //data={ENTRIES1}
                  //renderItem={isTinder ? this._renderLightItem : this._renderItem}
                  //renderItem={this._renderDarkItem}
                  renderItem={this.BoxImageBackground}
                  sliderWidth={sliderWidth}
                  itemWidth={120}
                  containerCustomStyle={styles.slider}
                  contentContainerCustomStyle={styles.sliderContentContainer}
                  //layout={type}
                  //layout={'tinder'}
                  layout={'stack'}
                  loop={false}
                />


                <View style={_styles.bottomBtnView}>
                  <TouchableOpacity
                    disabled={this.state.backButtonDisable}
                    style={_styles.buttonStyle} activeOpacity={0.5}
                    onPress={() => this.challengesBtnOnClick()}
                  >
                    <View>
                      <Text style={_styles.challengesBtnText}>挑戰</Text>
                    </View>

                  </TouchableOpacity>


                </View>
              </View>
              :
              <View style={{ bottom: 10, flexDirection: 'row', alignItems: 'center', }}>





                <Text style={{ paddingLeft: 20, fontWeight: 'bold', fontSize: 20, color: AppStyles.colour.fontColor }}>沒有手牌了, 馬上挑戰 ! </Text>
              </View>
          }



        </View>

      </ImageBackground>

    )

  }
}

class MessageBubble extends Component {

  challengesBtnOnClick() {

    EventRegister.emit('CHALLEGE_EVENT', '')

  }

  render() {

    var boxStyle;
    if (this.props.index == this.props.currentPosition) {
      //if (false) {

      boxStyle = _styles.messageBoxHighlight;


      return (
        <View style={boxStyle} key={this.props.index}>
          {
            this.props.index == this.props.currentPosition ?
              <View style={{ margin: 0, height: 20 }}>
                <Text style={{ color: 'gold', marginTop: -5, fontFamily: AppStyles.font.custom, }}>★當前玩家★</Text>
              </View> :
              <View style={{ margin: 0, height: 20 }} />
          }

          <View style={_styles.messageInfo} key={this.props.index}>

            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start' }}>
              <Text style={[_styles.positionText, { color: 'white' }]}>{this.props.index + 1}</Text>
            </View>
            <View style={{ flex: 3, alignItems: 'center' }}>
              <Image
                style={_styles.tinyLogo}
                source={{
                  uri: global.domain + 'wetag/image/face' + this.props.item.avator + '.png',
                }} />
              <Text style={[_styles.usernameText, , { color: AppStyles.colour.fontColor_white }]} numberOfLines={1} >{this.props.item.Username}</Text>
            </View>
            <View style={{ flex: 5 }}>
              <ScrollView contentContainerStyle={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
                {
                  this.props.item.contents.map((content, index) => {
                    return (
                      <Text key={index} style={[_styles.contentText, , { color: AppStyles.colour.fontColor_white }]}># {content}</Text>
                    )
                  })
                }
              </ScrollView>
            </View>
            {
              this.props.item.currentPositionIsUser ? <View style={{ flex: 1 }}>
                <TouchableOpacity

                  style={_styles.buttonStyle} activeOpacity={0.5}
                  onPress={() => this.challengesBtnOnClick()}
                >
                  <Image
                    style={_styles.iconBtnStyle}
                    source={require('../image/icons8-hand-100.png')}
                  />


                </TouchableOpacity>

              </View> : null
            }



          </View>
        </View>

      )
    }
    else {
      boxStyle = _styles.messageBox;
      return (
        <View style={boxStyle} key={this.props.index}>
          {
            this.props.index == this.props.currentPosition ?
              <View style={{ margin: 0, height: 20 }}>
                <Text style={{ color: 'gold', marginTop: -5, fontWeight: 'bold' }}>★當前玩家★</Text>
              </View> :
              <View style={{ margin: 0, height: 20 }} />
          }

          <View style={_styles.messageInfo} key={this.props.index}>

            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start' }}>
              <Text style={_styles.positionText}>{this.props.index + 1}</Text>
            </View>
            <View style={{ flex: 3, alignItems: 'center' }}>
              <Image
                style={_styles.tinyLogo}
                source={{
                  uri: global.domain + 'wetag/image/face' + this.props.item.avator + '.png',
                }} />
              <Text style={_styles.usernameText} numberOfLines={1} >{this.props.item.Username}</Text>
            </View>
            <View style={{ flex: 6 }}>
              <ScrollView contentContainerStyle={{ flexDirection: 'column', backgroundColor: 'light-grey', justifyContent: 'flex-end' }}>
                {
                  this.props.item.contents.map((content, index) => {
                    return (
                      <Text key={index} style={_styles.contentText}># {content}</Text>
                    )
                  })
                }
              </ScrollView>
            </View>


          </View>
        </View>

      )

    }

    return (

      <View style={boxStyle} key={this.props.index}>
        {
          this.props.index == this.props.currentPosition ?
            <View style={{ margin: 0, height: 20 }}>
              <Text style={{ color: 'gold', marginTop: -5, fontWeight: 'bold' }}>★當前玩家★</Text>
            </View> :
            <View style={{ margin: 0, height: 20 }} />
        }

        <View style={_styles.messageInfo} key={this.props.index}>

          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start' }}>
            <Text style={_styles.positionText}>{this.props.index + 1}</Text>
          </View>
          <View style={{ flex: 3, alignItems: 'center' }}>
            <Image
              style={_styles.tinyLogo}
              source={{
                uri: global.domain + 'wetag/image/face' + this.props.item.avator + '.png',
              }} />
            <Text style={_styles.usernameText} numberOfLines={1} >{this.props.item.Username}</Text>
          </View>
          <View style={{ flex: 6 }}>
            <ScrollView contentContainerStyle={{ flexDirection: 'column', backgroundColor: 'light-grey', justifyContent: 'flex-end' }}>
              {
                this.props.item.contents.map((content, index) => {
                  return (
                    <Text key={index} style={_styles.contentText}># {content}</Text>
                  )
                })
              }
            </ScrollView>
          </View>


        </View>
      </View>


    )
  }
}


const _styles = StyleSheet.create({
  topContainer: {
    alignItems: 'center',
    width: Dimensions.get('window').width,
  },
  MiddleContainer: {
    alignItems: 'flex-start',
    width: Dimensions.get('window').width,
    flex: 6,
  },
  BottomContainer: {
    alignItems: 'center',
    width: Dimensions.get('window').width,
    justifyContent: "space-around",
    flexDirection: 'row',
    flex: 3,
  },
  title: {
    fontFamily: AppStyles.font.custom,
    color: AppStyles.colour.fontColor,
    fontSize: 18,
    width: Dimensions.get('window').width - 40,
    margin: 10,
  },
  messageBox: {
    flex: 1,
    flexDirection: 'column',
    //alignItems: 'left',
    width: Dimensions.get('window').width - 20,
    backgroundColor: AppStyles.colour.themeSubColor,
    borderRadius: 10,
    margin: 10,
    padding: 10,

  },
  messageBoxHighlight: {
    flex: 1,
    flexDirection: 'column',
    //alignItems: 'left',
    width: Dimensions.get('window').width - 20,
    borderRadius: 10,

    //backgroundColor: '#E5E4E2',
    backgroundColor: AppStyles.colour.buttonBgColor,
    margin: 10,
    padding: 10,

  },

  messageInfo: {
    flexDirection: 'row',
    flex: 1,
    width: Dimensions.get('window').width - 60,
  },


  positionText: 
  {
    fontFamily: AppStyles.font.custom,
    margin: 0,
    fontSize: 50,
    //backgroundColor: 'lightpink'
  },
  usernameText: {
    fontFamily: AppStyles.font.custom,
    fontSize: 16,
  },

  contentText: {
    fontFamily: AppStyles.font.custom,
    fontSize: 14,
    marginLeft: 10,

  },
  iconLogo: {
    width: 30,
    height: 30,
  },
  logView: {
    fontFamily: AppStyles.font.custom,
    width: Dimensions.get('window').width - 20,
    borderRadius: 5,
    margin: 5,
    padding: 10,
  },
  tinyLogo: {
    borderRadius: 25,
    width: 50,
    height: 50,
  },
  /*
  buttonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppStyles.colour.themeActionColor,
    height: 45,
    width: 80,
  },
  */
  buttonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppStyles.colour.themeActionColor,
    borderRadius: (BUTTON_SIZE * 1.5) / 2,
    width: BUTTON_SIZE * 1.5,
    height: BUTTON_SIZE * 1.5,
  },
  /*
  buttonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    backgroundColor: AppStyles.colour.themeActionColor,
    borderRadius: 10,
    marginTop: 10,
    height: 45,
    width: 80,
  },
  */
  refreshBtnStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderRadius: 10,
    height: 40,
    width: 40,
  },
  bottomBtnView: {
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: Dimensions.get('window').height * 2 / 9,
    width: Dimensions.get('window').width * 1 / 3,
    position: 'absolute',


  },
  challengesBtnText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
  boxImageBackground: {
    borderRadius: 10,
    backgroundColor: AppStyles.colour.themeActionColor,
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    height: 160,
    //padding: 10,
    //margin: 20,
  },
  cardText: {
    fontFamily: AppStyles.font.custom,
    color: AppStyles.colour.fontColor_white,
    //fontWeight: 'bold',
    fontSize: 20,
    padding: 10,
  },
  iconBtnStyle: {

    paddingLeft: 10,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
  },
  underlineTextStyle: {
    textDecorationLine: 'underline',
    //line-through is the trick
  },




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