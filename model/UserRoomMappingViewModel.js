import { observable, makeObservable } from "mobx";
import DeviceInfo from 'react-native-device-info';
//import DeviceInfo from 'react-native-device-info';
import { getUniqueId, getManufacturer, getVersion, getDeviceId, isEmulator  } from 'react-native-device-info';

class UserRoomMappingViewModel {

  @observable guestList = [];

  
  constructor(room) {
  
    this.room_id = 0;

    makeObservable(this)
      //let timer = setInterval(this.checkRoomUpdate, 3000);
      
  }

  getPosition = (user_id) =>
  {
    
    for ( var i = 0; i < this.guestList.length; i++)
    {
      if ( parseInt(this.guestList[i].user_id)  == user_id)
      {
        return parseInt(this.guestList[i].Position);
      }
    }
  }

  checkMapping = (room_id) =>
  {
      
    var url = global.apiURL+'/mapping/get?room_id='+room_id;
    return fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {

      this.guestList = [];
      for (var i = 0; i < responseJson.length; i ++)
      {
        console.log("getMapping adding user :"+responseJson[i].Username);
        this.guestList.push(responseJson[i]);
      }
      this.guestList.sort((a,b)=>{
        const position_a = parseInt( a.Position);
        const position_b = parseInt(b.Position);
        return position_a - position_b;
      })
      return true;
         
    })
    .catch((error) => {
      console.error(error);
    });


  }

  joinRoom = (room_id, user_id) =>
  {
    var url = global.apiURL+'/mapping/insert?room_id='+room_id+"&user_id="+user_id;
    console.log("joinRoom = "+url);
    return fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("addMapping = "+responseJson);
      if ( parseInt(responseJson) == -1)
      {
        this.room_id = -1;
        return false; // false
      }
      else
      {
        this.room_id = room_id;
        return true;
      }
      
    })
    .catch((error) => {
      console.error(error);
    });

  }

  leaveRoom = (room_id, user_id) =>
  {
    var url = global.apiURL+'/mapping/remove?room_id='+room_id+"&user_id="+user_id;
    console.log("leaveRoom = "+url);
    return fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("addMapping = "+responseJson);
      if ( parseInt(responseJson) == -1)
      {
        return false; // false
      }
      else
      {
        return true;
      }
      
    })
    .catch((error) => {
      console.error(error);
    });

  }

  startGameSetup = (room_id) =>
  {
    var url = global.apiURL+'/mapping/startGameSetup?room_id='+room_id;
    return fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {

      return true;
         
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
  }


}

export default UserRoomMappingViewModel

/*
import { observable, makeObservable } from "mobx";
import DeviceInfo from 'react-native-device-info';
//import DeviceInfo from 'react-native-device-info';
import { getUniqueId, getManufacturer, getVersion, getDeviceId, isEmulator  } from 'react-native-device-info';

class UserRoomMappingViewModel {

    @observable mappingList = [];
    
    constructor(c) {
  
      makeObservable(this)
     
    }

    hihi = ()=>
    {
      console.log('hihihi');
    }

    getMapping = (room_id) =>
    {
      
      var url = "https://wetag.000webhostapp.com/index.php/mapping/get?room_id="+room_id;
      

      var result = fetch(url)
        .then((response) => response.json())
        .then((responseJson) => {
          //console.log("getMapping = "+responseJson);
          this.mappingList = [];
          for (var i = 0; i < responseJson.length; i ++)
          {
            console.log("getMapping adding user :"+responseJson[i].Username);
            this.mappingList.push(responseJson[i]);
          }
          //console.log("getMapping = "+this.mappingList[0].Username);
          
        })
        .catch((error) => {
          console.error(error);
        });


    }

    addMember  = (room_id, user_id) =>
    {
      var url = "https://wetag.000webhostapp.com/index.php/mapping/insert?room_id="+room_id+"&user_id="+user_id;
      fetch(url)
      .then((response) => response.json())
      .then((json) => {
        console.log("addMember = "+JSON.stringify(json))
    

      })
      .catch((error) => console.error(error))
      .finally(() => console.log('addMember completed !'));
    }

}

export default UserRoomMappingViewModel

*/