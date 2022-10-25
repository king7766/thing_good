import { observable, makeObservable } from "mobx";
import DeviceInfo from 'react-native-device-info';
//import DeviceInfo from 'react-native-device-info';
import { getUniqueId, getManufacturer, getVersion, getDeviceId, isEmulator } from 'react-native-device-info';

class RoomViewModel {


  @observable gameroomID = 0
  @observable room_id = 0
  creator_id = 0
  room_status = ''
  @observable room_name = ''
  @observable roomList = []


  constructor(room) {

    makeObservable(this)

  }

  setRoomId = (room_id) => {
    this.room_id = room_id;
    return this.updateRoomDetail();
  }

  getRoomList = () => {
    return fetch(global.apiURL + '/room/list')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("getRoomList = " + responseJson)
        this.roomList = [];
        for (var i = 0; i < responseJson.length; i++) {
          this.roomList.push(responseJson[i]);
        }
        return true;
      })
      .catch((error) => {
        console.error(error);
      });

  }

  checkRoomUpdate = () => {
    this.updateRoomDetail();
  }

  updateRoomName(name) {
    var url = global.apiURL + '/room/updateRoomName?room_id=' + this.room_id + "&room_name=" + name;
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        console.log("updateRoomName = " + JSON.stringify(json))

        this.room_name = name;

      })
      .catch((error) => console.error(error))
      .finally(() => console.log('updateRoom completed !'));
  }

  updateRoomDetail() {
    var url = global.apiURL + '/room/get?room_id=' + this.room_id;
    return fetch(url)
      .then((response) => response.json())
      .then((json) => {
        console.log("updateRoomDetail = " + JSON.stringify(json))
        this.creator_id = json[0].creator_id;
        this.room_status = json[0].room_status;
        this.created_at = json[0].created_at;
        this.room_name = json[0].room_name;
        return true;
      })
      .catch((error) => console.error(error))
      .finally(() => console.log('updateRoomDetail completed !'));

  }

  createRoom(user_id, username) {

    //https://wetag.000webhostapp.com/index.php/room/insert?creator_id=10&room_name=kkk_room

    var url = global.apiURL + '/room/insert?creator_id=' + user_id + '&room_name=' + username + '的房間';


    console.log('createRoom : ' + url);

    return fetch(url)
      .then((response) =>
        response.json()
      )
      .then((json) => {
        console.log("createRoom = " + JSON.stringify(json))
        const num = Number(JSON.stringify(json));
        this.room_id = num;
        this.updateRoomDetail();
        return this.room_id;
      })
      .catch((error) => console.error(error))
      .finally(() => console.log('initUser completed !'));

  }

  updateRoomStatus() {
    var url = global.apiURL + '/room/updateRoomStatus?room_id=' + this.room_id + "&room_status=C";
    fetch(url)
      .then((response) => response.json())
      .then((json) => {

      })
      .catch((error) => console.error(error))
      .finally(() => console.log('updateRoom completed !'));
  }



}

export default RoomViewModel