import React, { Component } from 'react';
import { Button, Image, ImageBackground, View, Text, TextInput, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { observer } from "mobx-react"
import AppStyles from '../AppStyles';
import ImageOverlay from "react-native-image-overlay";
import i18next from 'i18next';
import imageBackgroundSource from '../image/bg5.png'

const BUTTON_SIZE = parseInt(30);
const { width, height } = Dimensions.get('window');

@observer
export default class SettingView extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            currentPage: 0,
            currentLanguage: i18next.language,
        }
    };


    setSliderPage = (event) => {

        const { x } = event.nativeEvent.contentOffset;
        const indexOfNextScreen = Math.floor(x / (width - 30));
        console.log('contentOffset = ' + x + '/' + width + ' = ' + indexOfNextScreen);
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
                            <Text style={styles.underlineTextStyle}>{i18next.t('tutorial_teach')}</Text>
                            <Image source={require('../image/thinking.png')} style={styles.imageStyle} />

                            <View style={styles.wrapper}>
                                <Text style={styles.header}>{i18next.t('tutorial_header')}</Text>
                                <Text style={styles.paragraph}>{i18next.t('tutorial_paragraph')}</Text>
                            </View>
                        </View>
                        <View style={styles.scrollItem}>
                            <Text style={styles.underlineTextStyle}>?????? Step.0</Text>
                            <Image source={require('../image/t1.png')} style={styles.imageStyle} />

                            <View style={styles.wrapper}>
                                <Text style={styles.header}>?????????????????????</Text>
                                <Text style={styles.paragraph}>?????????????????????????????????????????????{"\n"}??????????????????????????? ! </Text>
                            </View>
                        </View>
                        <View style={styles.scrollItem}>
                            <Text style={styles.underlineTextStyle}>?????? Step.1</Text>
                            <Image source={require('../image/t2.png')} style={styles.imageStyle} />

                            <View style={styles.wrapper}>
                                <Text style={styles.header}>????????????</Text>
                                <Text style={styles.paragraph}>???????????????????????????, ??????????????? 1 ?????????????????????????????? ????????????????????????????????????</Text>
                            </View>
                        </View>
                        <View style={styles.scrollItem}>
                            <Text style={styles.underlineTextStyle}>?????? Step.2a</Text>
                            <Image source={require('../image/t3.png')} style={styles.imageStyle} />

                            <View style={styles.wrapper}>
                                <Text style={styles.header}>?????????????????????????????????????????? (a)</Text>
                                <Text style={styles.paragraph}>????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????</Text>
                            </View>
                        </View>
                        <View style={styles.scrollItem}>
                            <Text style={styles.underlineTextStyle}>?????? Step.2b</Text>
                            <Image source={require('../image/t4.png')} style={styles.imageStyle} />

                            <View style={styles.wrapper}>
                                <Text style={styles.header}>?????????????????????????????????????????? (b)</Text>
                                <Text style={styles.paragraph}>?????????????????????????????????????????????????????????????????????????????????????????????????????????"??????"????????????????????????????????????????????????????????????</Text>
                            </View>
                        </View>
                        <View style={styles.scrollItem}>
                            <Text style={styles.underlineTextStyle}>?????? Step.3</Text>
                            <Image source={require('../image/t5.png')} style={styles.imageStyle} />

                            <View style={styles.wrapper}>
                                <Text style={styles.header}>??????</Text>
                                <Text style={styles.paragraph}>????????????????????????????????????????????????????????????,
                                    {"\n"}{"\n"}????????????????????????????????????????????????, ?????????????????????, ??????????????????????????????
                                    {"\n"}??????????????????????????????????????????, ??????????????????
                                    {"\n"}{"\n"} ???????????????????????????????????????????????????!</Text>
                            </View>
                        </View>
                        <View style={styles.scrollItem}>
                            <Text style={styles.underlineTextStyle}>{i18next.t('information_information')}</Text>

                            <View style={styles.wrapper}>
                                <Text style={styles.header}>{i18next.t('information_help')}</Text>
                                <Text style={styles.paragraph}>{i18next.t('information_help_detail')}</Text>
                            </View>
                        </View>

                    </ScrollView>
                    <View style={styles.paginationWrapper}>
                        {Array.from(Array(7).keys()).map((key, index) => (
                            <View style={[styles.paginationDots, { opacity: this.state.currentPage === index ? 1 : 0.2 }]} key={index} />
                        ))}
                    </View>

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

                    <View />

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