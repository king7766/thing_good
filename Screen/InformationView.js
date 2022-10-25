import React, { Component, useState, useEffect } from 'react';
import { Button, Image, ImageBackground, View, Text, TextInput, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import AppStyles from '../AppStyles';
import imageBackgroundSource from '../image/bg5.png'
import '../lang/i18n';
import { useTranslation } from 'react-i18next';

const BUTTON_SIZE = parseInt(30);
const { width, height } = Dimensions.get('window');

export default function InformationView({ navigation }) {

    const [count, setCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const { t, i18n } = useTranslation();
    const [currentLanguage, setLanguage] = useState(i18n.language);

    // 與 componentDidMount 和 componentDidUpdate 類似：
    useEffect(() => {
        // 使用瀏覽器 API 更新文件標題
        console.log(count);
        //document.title = `You clicked ${count} times`;
    });

    //const changeLanguage = value => {

    function changeLanguage() {
        var value = currentLanguage;
        
        if (currentLanguage === 'zh') {
            value = 'en';
        }
        else {
            value = 'zh'
        }
        console.log("changeLanguage to "+value);
        i18n
            .changeLanguage(value)
            .then(() => setLanguage(value))
            .catch(err => console.log(err));
    }




    function _handlePress() {
        setCount(count + 1)
    }

    function setSliderPage(event) {

        const { x } = event.nativeEvent.contentOffset;
        const indexOfNextScreen = Math.floor(x / (width - 30));
        console.log('contentOffset = ' + x + '/' + width + ' = ' + indexOfNextScreen);
        if (indexOfNextScreen !== state.currentPage) {
            setCurrentPage(indexOfNextScreen);
        }
    };

    return (
        <ImageBackground
            source={imageBackgroundSource}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: global.backgroundColor }}>
            <View style={styles.topContainer}>

                <Text style={styles.title}></Text>

            </View>

            <View style={styles.MiddleContainer}>
                <ScrollView
                    style={{ flex: 1 }}
                    horizontal={true}
                    scrollEventThrottle={16}
                    pagingEnabled={true}
                    showsHorizontalScrollIndicator={true}
                    onScroll={(event: any) => {
                        this.setSliderPage(event);
                    }}
                >

                    <View style={styles.scrollItem}>
                        <Text style={styles.underlineTextStyle}>{t('information_information')}</Text>

                        <View style={styles.wrapper}>
                            <Text style={styles.header}>{t('information_help')}</Text>
                            <Text style={styles.paragraph}>{t('information_help_detail')}</Text>
                        </View>
                    </View>


                </ScrollView>
            </View>

            <View style={styles.BottomContainer}>
                <TouchableOpacity
                    style={styles.buttonStyle}
                    activeOpacity={0.5}
                    onPress={() => navigation.goBack()}
                >
                    <Image
                        style={styles.iconBtnStyle}
                        source={require('../image/icons8-back-96.png')}
                    //style={styles.ImageIconStyle}
                    />
                </TouchableOpacity>
                <View/>
                

            </View>



        </ImageBackground>
    );
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
    scrollItem: {
        width: Dimensions.get('window').width - 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    wrapper: {
        fontFamily: AppStyles.font.custom,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 30,
        color: AppStyles.font.fontColor,
    },
    header: {
        fontFamily: AppStyles.font.custom,
        color: AppStyles.font.fontColor,
        fontSize: 20,
        marginLeft: 20,
        marginRight: 20,
    },
    paragraph: {
        fontFamily: AppStyles.font.custom,
        color: AppStyles.font.fontColor,
        fontSize: 15,
        margin: 20,
    },
    paginationWrapper: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,

        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    paginationDots: {

        height: 10,

        width: 10,

        borderRadius: 10 / 2,

        backgroundColor: '#0898A0',

        marginLeft: 10,

    },
    imageStyle: {
        flex: 5,
        resizeMode: 'contain',
        height: (width - 150) * 1.5,
        width: width - 150,
    },
    underlineTextStyle: {
        flex: 1,
        fontFamily: AppStyles.font.custom,
        textDecorationLine: 'underline',
        color: AppStyles.font.fontColor,
        fontSize: 30,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        //line-through is the trick
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



/*
import React, { Component, useState, useEffect } from 'react';
import { Button, Image, ImageBackground, View, Text, TextInput, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { observer } from "mobx-react"
import AppStyles from '../AppStyles';
import ImageOverlay from "react-native-image-overlay";
import { useTheme } from '@react-navigation/native';

import imageBackgroundSource from '../image/bg5.png'

const BUTTON_SIZE = parseInt(30);
const { width, height } = Dimensions.get('window');

//@observer
export default class InformationView extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            currentPage: 0,
        }
    };


    setSliderPage = (event) => {

        const { x } = event.nativeEvent.contentOffset;
        const indexOfNextScreen = Math.floor(x / (width-30) );
        console.log('contentOffset = '+ x+'/'+width +' = '+indexOfNextScreen);
        if (indexOfNextScreen !== this.state.currentPage) {
            this.setState({
                currentPage: indexOfNextScreen,
            })

        }
    };

    render() {
        const { navigation, route } = this.props;


        return (
            <ImageBackground
                source={imageBackgroundSource}
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: global.backgroundColor }}>
                <View style={styles.topContainer}>

                    <Text style={styles.title}></Text>

                </View>

                <View style={styles.MiddleContainer}>
                    <ScrollView
                        style={{ flex: 1 }}
                        horizontal={true}
                        scrollEventThrottle={16}
                        pagingEnabled={true}
                        showsHorizontalScrollIndicator={true}
                        onScroll={(event: any) => {
                            this.setSliderPage(event);
                        }}
                    >
                        
                        <View style={styles.scrollItem}>
                            <Text style={styles.underlineTextStyle}>Information</Text>
                            
                            <View style={styles.wrapper}>
                                <Text style={styles.header}>如有任何提供幫助或提問</Text>
                                <Text style={styles.paragraph}>請聯終 kingtai76@gmail.com</Text>
                            </View>
                        </View>
                        

                    </ScrollView>
                    

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

                    <View/>

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
    scrollItem: {
        width: Dimensions.get('window').width - 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    wrapper: {
        fontFamily: AppStyles.font.custom,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 30,
        color: AppStyles.font.fontColor,
    },
    header: {
        fontFamily: AppStyles.font.custom,
        color: AppStyles.font.fontColor,
        fontSize: 20,
        marginLeft: 20,
        marginRight: 20,
    },
    paragraph: {
        fontFamily: AppStyles.font.custom,
        color: AppStyles.font.fontColor,
        fontSize: 15,
        margin: 20,
    },
    paginationWrapper: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
   
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    paginationDots: {

        height: 10,

        width: 10,

        borderRadius: 10 / 2,

        backgroundColor: '#0898A0',

        marginLeft: 10,

    },
    imageStyle: {
        flex: 5,
        resizeMode: 'contain',
        height: (width - 150) * 1.5,
        width: width - 150,
    },
    underlineTextStyle: {
        flex: 1,
        fontFamily: AppStyles.font.custom,
        textDecorationLine: 'underline',
        color: AppStyles.font.fontColor,
        fontSize: 30,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        //line-through is the trick
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

*/