/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import CardsViewModel from './model/CardsViewModel';

global.domain = 'http://18.163.129.246/';
//global.apiURL = 'http://18.163.129.246/wetag/index.php';
global.apiURL = global.domain + 'wetag/index.php';
global.cardsListViewModel = new CardsViewModel(); 

global.beginningNumbersOfHand = 5;

global.backgroundColor = '#EAF2DE'; // most light
global.textColor = '#40376E';
global.borderColor = '#48233C';
global.themeMainColor = '#96ACB7';
global.themeActionColor = '#36558F';
global.themeSubColor = '#D7E7BE'; // 2nd light

global.buttonBgColor = '#88A45C'; // 3rd light
global.buttonSize = 30;


AppRegistry.registerComponent(appName, () => App);
