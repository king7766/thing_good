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
                            <Text style={styles.underlineTextStyle}>教學 Step.0</Text>
                            <Image source={require('../image/t1.png')} style={styles.imageStyle} />

                            <View style={styles.wrapper}>
                                <Text style={styles.header}>確認自己的卡牌</Text>
                                <Text style={styles.paragraph}>遊戲開始後先仔細閱讀手中的卡牌{"\n"}他們是您取勝的關鍵 ! </Text>
                            </View>
                        </View>
                        <View style={styles.scrollItem}>
                            <Text style={styles.underlineTextStyle}>教學 Step.1</Text>
                            <Image source={require('../image/t2.png')} style={styles.imageStyle} />

                            <View style={styles.wrapper}>
                                <Text style={styles.header}>起始玩家</Text>
                                <Text style={styles.paragraph}>頭像左邊是您的順序, 起始玩家為 1 先從手上出一張問題卡 （請先預設心中想好答案）</Text>
                            </View>
                        </View>
                        <View style={styles.scrollItem}>
                            <Text style={styles.underlineTextStyle}>教學 Step.2a</Text>
                            <Image source={require('../image/t3.png')} style={styles.imageStyle} />

                            <View style={styles.wrapper}>
                                <Text style={styles.header}>下一位玩家之後有兩種行動可選 (a)</Text>
                                <Text style={styles.paragraph}>ａ跟牌：如果你已經猜想到前面玩家「出的所有牌」都符合的答案，你也能打出一張符合答案的問題卡，即可出卡跟牌，出牌後自動補牌輪到下一位玩家。</Text>
                            </View>
                        </View>
                        <View style={styles.scrollItem}>
                            <Text style={styles.underlineTextStyle}>教學 Step.2b</Text>
                            <Image source={require('../image/t4.png')} style={styles.imageStyle} />

                            <View style={styles.wrapper}>
                                <Text style={styles.header}>下一位玩家之後有兩種行動可選 (b)</Text>
                                <Text style={styles.paragraph}>ｂ質疑：如果你覺得或想不出來有什麼答案符合前面所有玩家出的卡片，那就按"手掌"，提出質疑並要求上一位玩家說出他的答案！</Text>
                            </View>
                        </View>
                        <View style={styles.scrollItem}>
                            <Text style={styles.underlineTextStyle}>教學 Step.3</Text>
                            <Image source={require('../image/t5.png')} style={styles.imageStyle} />

                            <View style={styles.wrapper}>
                                <Text style={styles.header}>質疑</Text>
                                <Text style={styles.paragraph}>遊戲結束並為上一位玩家說出的答案進行投票,
                                    {"\n"}{"\n"}質疑成功：若沒有一半玩家覺得合理, 代表你質疑成功, 上一位玩家成為落敗者
                                    {"\n"}質疑失敗：反之代表你質疑失敗, 你成為落敗者
                                    {"\n"}{"\n"} 其他玩家運用想像力對落敗者作懲罰吧!</Text>
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