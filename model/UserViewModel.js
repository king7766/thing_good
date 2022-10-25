import { observable, makeObservable } from "mobx";
import DeviceInfo from 'react-native-device-info';
import { getUniqueId, getManufacturer, getVersion, getDeviceId, isEmulator  } from 'react-native-device-info';

class UserViewModel {

    @observable UserName
    @observable avator

    constructor() {

        this.UserName = '';
        this.udid = '';
        this.user_id = '';
        this.avator = '';

        DeviceInfo.getDeviceName().then((deviceName) => {
            // iOS: "Becca's iPhone 6"
            // Android: ?
            // Windows: ?
            console.log("getDeviceName = " + deviceName);
            this.UserName = deviceName;

            DeviceInfo.getUniqueId().then((uniqueId) => {
                // iOS: "Becca's iPhone 6"
                // Android: ?
                // Windows: ?
                console.log("getUniqueId = " + uniqueId);
                this.udid = uniqueId;

                this.initUser();
            });

        });

        makeObservable(this)

    }

    initUser = () => {

        /*
        DeviceInfo.getUniqueId().then((uniqueId) => {
            // iOS: "FCDBD8EF-62FC-4ECB-B2F5-92C9E79AC7F9"
            // Android: "dd96dec43fb81c97"
            // Windows: "{2cf7cb3c-da7a-d508-0d7f-696bb51185b4}"
            console.log("uniqueId = " + DeviceInfo.getUniqueId());
            this.udid = uniqueId;
        });
        */

        //console.log("uniqueId = " + DeviceInfo.getUniqueId().uniqueId);

        var url = global.apiURL+'/user/init?udid='+this.udid+'&username='+this.UserName;

        console.log('initUser : ' + url);

        fetch(url)
          .then((response) => 
            response.json()
        )
          .then((json) => {
            console.log("json = "+JSON.stringify(json))
            const num = Number(JSON.stringify(json));
            if ( Array.isArray(json))
            {
                console.log("Already have user !");
                this.user_id = json[0].ID;
                this.UserName = json[0].UserName;
                this.avator = json[0].Avator;
            }
            else if ( Number.isInteger(num) && num > 0 )
            {
                console.log("First init user !");
                this.user_id = num;
            }

            console.log("this.user_id = "+ this.user_id );

        })
          .catch((error) => console.error(error))
          .finally(() => console.log('initUser completed !'));
    }

    getUDID()
    {
        return this.udid;
    }

    setUserName = ( name ) =>
    {
        this.UserName = name;
        this.updateUserNameToServer(this.udid, name);
    }

    setAvator = (avator )=>
    {
        this.avator = avator;
        this.updateAvatorToServer(this.udid, avator);
    }

    updateUserNameToServer = (udid, name ) =>
    {
        var url = global.apiURL+'/user/update?udid='+ udid +'&username='+ name;

        console.log('updateUserNameToServer : ' + url);

        fetch(url)
          .then((response) => 
            response.json()
        )
          .then((json) => {
            console.log("json = "+JSON.stringify(json))
        })
          .catch((error) => console.error(error))
          .finally(() => console.log('updateUserNameToServer completed !'));
    }

    updateAvatorToServer = (udid, avator ) =>
    {
        var url = global.apiURL+'/user/updateUsersAvator?udid='+ udid +'&avator='+ avator;

        console.log('updateAvatorToServer : ' + url);

        fetch(url)
          .then((response) => 
            response.json()
        )
          .then((json) => {
            console.log("json = "+JSON.stringify(json))
        })
          .catch((error) => console.error(error))
          .finally(() => console.log('updateAvatorToServer completed !'));
    }

    getUserName()
    {
        return this.UserName;
    }

    getAvator = () =>
    {
        return this.avator;
    }
}

export default UserViewModel