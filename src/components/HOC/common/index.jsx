import React,{Component} from 'react'
import {View,Image,Button,OpenData} from '@tarojs/components'
import css from './index.module.scss'
import Taro from "@tarojs/taro";
import Loading from "@/components/loading";
import img1 from '@/img/10.png'
import img2 from '@/img/15.png'
import Modal from "@/components/modal";
import API from '@/API/index'
export default function hocCommon(navBarOption = {},shareOption = {}) {
  const defaultPath = 'pages/index/index';
  const defaultTitle = '抽封面序列号';
  // const defaultImage = defaultShareImg;
  return (WrappedComponent) => {
    return class Common extends Component {
      jsCode = null
      state = {
        isLogin:false,  //当前是否登录
        currentPages:Taro.getCurrentPages(),  //当前页面堆栈
        navBarTitle:navBarOption.title || '', //顶部标题
        navBarHidden:navBarOption.hidden || false,//是否隐藏顶部
        mainStyle:{
          paddingTop:0,
          heightNum:0,
          height:0
        },//主内容区样式
        navBarStyle:{
          height:0,
          titleHeight:0,
          paddingTop:0,
        },
      }
      constructor(props) {
        super(props);
        let {statusBarHeight,screenHeight} = Taro.$systemInfo
        // let {screenWidth,windowHeight} = Taro.$systemInfo
        statusBarHeight = statusBarHeight || 0
        let {height,top} = Taro.$menuButtonBoundingClientRect
        // let {width,left,right} = Taro.$menuButtonBoundingClientRect
        let titleHeight = 0
        if (process.env.TARO_ENV === 'weapp') {
          titleHeight = height + (top - statusBarHeight) * 2 + 4
        } else if (process.env.TARO_ENV === 'h5') {
          titleHeight = 44
        }
        let navBarHeight = statusBarHeight + titleHeight
        let mainHeight = screenHeight - navBarHeight
        this.state.navBarStyle.height = navBarHeight + 'px'
        this.state.navBarStyle.titleHeight = titleHeight + 'px'
        this.state.navBarStyle.paddingTop = statusBarHeight + 'px'
        this.state.mainStyle.paddingTop = navBarHeight + 'px'
        this.state.mainStyle.height = mainHeight + 'px'
        this.state.mainStyle.heightNum = mainHeight
        let token = Taro.getStorageSync('token')
        this.state.isLogin = !!token
      }
      componentDidShow() {
        this.mainRef.componentDidShow && this.mainRef.componentDidShow()
        Taro.$errorTips = this.loadingRef;
        let token = Taro.getStorageSync('token')
        let that = this;
        if (this.state.isLogin !== token) {
          that.setState({
            isLogin:!!token
          })
        }
      }
      componentWillMount() {
        if (process.env.TARO_ENV === 'weapp') {
          Taro.showShareMenu({
            withShareTicket:true
          })
        }
      }
      onPullDownRefresh() {
        this.mainRef.onPullDownRefresh && this.mainRef.onPullDownRefresh()
      }
      onReachBottom() {
        this.mainRef.onReachBottom && this.mainRef.onReachBottom()
      }
      onShareAppMessage() {
        let realOption
        if (this.mainRef.shareOption) {
          realOption = this.mainRef.shareOption
        } else {
          realOption = shareOption
        }
        let {
          path = defaultPath,
          title = defaultTitle,
          image = null
        } = realOption;
        path = `${path}`;
        return {
          path,
          title,
          imageUrl:image
        };
      }
      //动态修改自定义navbar
      changeNavBar = (data) => {
        const {title} = data;
        this.setState({
          title
        })
      }
      getUserInfo = (data) => {
        if (data.detail.errMsg === "getUserInfo:ok") {
          let userInfo = data.detail.userInfo
          API.login({
            encryptedData:data.detail.encryptedData,
            faceImg:userInfo.avatarUrl,
            iv:data.detail.iv,
            jsCode:this.jsCode,
            nickName:userInfo.nickName,
            sex:userInfo.gender
          }).then((v) => {
            Taro.setStorageSync('token',v.result.token)
            Taro.setStorageSync('userInfo',v.result.userDO)
            this.setState({
              isLogin:true
            })
          })
        }
      }
      iconClick = (iconType) => {
        if (iconType === 1) {this.openLogin()}
        if (iconType === 2) {this.toMy()}
        if (iconType === 3) {this.goBack()}
      }
      openLogin = () => {
        Taro.login().then((v) => {
          this.jsCode = v.code
        })
        this.modalDom.show()
      }
      toMy = () => {
        Taro.navigateTo({
          url:'/pages/my/index'
        })
      }
      goBack = () => {
        Taro.navigateBack({
          delta:1
        })
      }
      render() {
        let {navBarTitle,mainStyle,navBarStyle,currentPages,isLogin} = this.state;
        const styleAll = {
          paddingTop:navBarStyle.paddingTop
        }
        const styleTitle = {
          height:navBarStyle.titleHeight,
          lineHeight:navBarStyle.titleHeight,
        }
        const styleMain = {
          paddingTop:mainStyle.paddingTop
        }
        let {navBarHidden} = this.state
        let iconType = 0
        if (navBarOption.login && !isLogin) {
          iconType = 1
        } else if (navBarOption.login && isLogin) {
          iconType = 2
        } else if (!navBarOption.login && (currentPages.length > 1)) {
          iconType = 3
        }
        return <>
          {navBarHidden ? null : <View style={styleAll} className={css.navBarMain}>
            <View style={styleTitle} className={css.navBarTitle}>
              <View className={css.leftIconBox} onClick={() => {this.iconClick(iconType)}}>
                {(iconType === 1) && <View className={css.head}/>}
                {(iconType === 2) && <View className={css.head}><OpenData type='userAvatarUrl'/></View>}
                {(iconType === 3) && <Image className={css.back} src={img1}/>}
              </View>
              {navBarTitle}
            </View>
          </View>}
          <Loading ref={(v) => {this.loadingRef = v}} navBarStyle={navBarStyle}/>
          <Modal ref={(v) => {this.modalDom = v}}>
            <View className={css.login}>
              <Image src={img2} className={css.icon}/>
              <View className={css.p1}>你还未登录</View>
              <View className={css.p2}>相关操作涉及到用户信息，请登录后再试</View>
              <Button
                openType='getUserInfo'
                className={css.p3}
                onGetUserInfo={this.getUserInfo}
                onClick={() => {this.modalDom.close()}}
              >
                立即登录
              </Button>
              <View className={css.p4} onClick={() => {this.modalDom.close()}}>暂不登录</View>
            </View>
          </Modal>
          <View style={styleMain}>
            <WrappedComponent
              ref={(v) => {this.mainRef = v}}
              isLogin={isLogin}
              mainStyle={mainStyle}
              navBarStyle={navBarStyle}
              {...this.props}
              changeNavBar={this.changeNavBar}
              openLogin={this.openLogin}
            />
          </View>
        </>
      }
    }
  }
}
