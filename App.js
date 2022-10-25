/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

//import React from 'react';
import React, {Component} from 'react';
import type {Node} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';
import {observer} from "mobx-react"
import {observable} from "mobx"

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

//require the module
import RoomViewModel from './model/RoomViewModel';
import HomeScreen from './Screen/Home';
import RoomScreen from './Screen/Room';
import RoomListScreen from './Screen/RoomList';
import SettingView from './Screen/SettingView';
import ChatView from './Screen/ChatView';
import ChannelView from './Screen/ChannelView';
import GamePlayView from './Screen/GamePlayView';
import InformationView from './Screen/InformationView';

import SocketTest from './Screen/SocketTest';

const Stack = createNativeStackNavigator();

/*
function HomeScreen ({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}
*/


const Section = ({children, title}): Node => {
  
  const isDarkMode = useColorScheme() === 'dark';
  

  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};



@observer 
export default class App extends Component<Props> {
  
  constructor(props){
    super(props);
    this.viewModel = new RoomViewModel();
    
    //const store = new Store();
  };

  componentDidMount() {
    console.log("UNSAFT_componentWillMount");
    /*
    setInterval(() => {
        console.log("UNSAFT_componentWillMount 111");

        this.secondsPassed++;
    }, 1000)
    */
  
  }

  add = () => {
    console.log("add...");
    this.viewModel.addRoom();
  }

  get = () => {
    console.log("get...");
    this.viewModel.getRoom();
  }


  render() {  
    return (  
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen}/>
          <Stack.Screen name="Room" component={RoomScreen}/>
          <Stack.Screen name="RoomList" component={RoomListScreen}/>
          <Stack.Screen name="ChatView" component={ChatView}/>
          <Stack.Screen name="ChannelView" component={ChannelView}/>
          <Stack.Screen name="GamePlayView" component={GamePlayView}/>
          <Stack.Screen name="SettingView" component={SettingView}/>
          <Stack.Screen name="InformationView" component={InformationView}/>

          <Stack.Screen name="SocketTest" component={SocketTest}/>
          
          
        </Stack.Navigator>
      </NavigationContainer>
    );  
  }  
}

/*
const App: () => Node = () => {

  
  const isDarkMode = useColorScheme() === 'dark';
  
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.js</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};



export default App;
<SafeAreaView viewModel={this.viewModel}>
            <Text>{this.viewModel.gameroomID}</Text>
            <Text>333</Text>
            <Text>{this.secondsPassed}</Text>
            <Button
              //onClick={this.add()}
              title="Press me"
              onPress={this.add}
            />

            <Button
              //onClick={this.add()}
              title="Update Room"
              onPress={this.get}
            />
            {this.viewModel.roomList.map((room)=>
              <Text key= {room.ID}>{room.UserName}</Text>
            )}
            </SafeAreaView>
         

*/



const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});
