import { observable, makeObservable } from "mobx";
import DeviceInfo from 'react-native-device-info';
import { getUniqueId, getManufacturer, getVersion, getDeviceId, isEmulator } from 'react-native-device-info';

class CardsViewModel {

  @observable cardsList = [];
  @observable cardsListString = '';
  @observable position = 0;
  @observable room_id = 0;

  @observable cardsLog = [];

  deckList = [];
  holdingCards = [];


  allCardList = [];

  constructor() {

    this.getAllCard();

    makeObservable(this)

  }

  getCardContentById(card_id) {
    for (var i = 0; i < this.allCardList.length; i++) {
      var card_item = this.allCardList[i];
      if (card_id == parseInt(card_item.ID)) {
        return this.allCardList[i].content;
      }
    }
  }

  getAllCard() {
    var url = global.apiURL + '/card/getAllCards';
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {

        for (var i = 0; i < responseJson.length; i++) {
          this.allCardList.push(responseJson[i]);
        }

        console.log("Complete getAllCard !");
        return true;

      })
      .catch((error) => {
        console.error(error);
      });
  }

  clearLog () {
    this.cardsLog = [];
    this.cardsList = [];
    this.cardsListString = '';
    this.room_id = 0;
  }

  getCardPayLog = (room_id) => {

    var url = global.apiURL + '/card/cardPayLog?room_id=' + room_id;
    console.log("url = "+url);
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {

        console.log("getCardPayLog = "+JSON.stringify(responseJson) );
      
        this.cardsLog = [];
        for (var i = 0; i < responseJson.length; i++) {
          console.log("adding card pay log :" + JSON.stringify(responseJson[i]) );
          this.cardsLog.push(responseJson[i]);
        }
        
        return true;

      })
      .catch((error) => {
        console.error(error);
      });
  }

  payCardAction = (room_id, card_id) => {
    var url = global.apiURL + '/card/payCard?room_id=' + room_id + "&card_id=" + card_id;
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("payCardAction : "+responseJson);
        return true;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  }

  getCardsList = (room_id, user_id) => {
    if (this.allCardList.length == 0) {
      this.getAllCard();
    }

    var url = global.apiURL + '/mapping/getCardsList?room_id=' + room_id + '&user_id=' + user_id;
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {

        console.log("getCardsList : "+JSON.stringify(responseJson[0]) );

        this.cardsListString = responseJson[0].Cards;
        this.cardsList = this.cardsListString.split(",");
        this.room_id = responseJson[0].room_id;


        this.deckList = [];
        this.holdingCards = [];
        for (var i = 0; i < this.cardsList.length; i++) {
          if (i < global.beginningNumbersOfHand ) {
            this.holdingCards.push({ 'ID': this.cardsList[i], 'content': this.getCardContentById(this.cardsList[i]) });
          }
          this.deckList.push({ 'ID': this.cardsList[i], 'content': this.getCardContentById(this.cardsList[i]) });

          console.log("add ... " + this.cardsList[i] + ': ' + this.getCardContentById(this.cardsList[i]));
        }

        this.position = parseInt(responseJson[0].Position);

        return true;

      })
      .catch((error) => {
        console.error(error);
      });
  }

}

export default CardsViewModel