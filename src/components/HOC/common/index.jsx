import React,{Component} from 'react'
import {View} from '@tarojs/components'
import css from './index.module.scss'
import Taro from "@tarojs/taro";
import Loading from "@/components/loading";
export default function hocCommon(navBarOption = {},shareOption = {}) {
  const defaultPath = 'pages/index/index';
  const defaultTitle = '默认标题';
  // const defaultImage = defaultShareImg;
  return (WrappedComponent) => {
    return class Common extends Component {
      state = {
        title:navBarOption.title || '',
        titleBarHeight:0,
        navBarMarginTop:Taro.$systemInfo.statusBarHeight || 0,
      }
      constructor(props) {
        super(props);
        const {statusBarHeight,screenWidth,screenHeight,windowHeight} = Taro.$systemInfo
        const {width,height,left,top,right} = Taro.$menuButtonBoundingClientRect
        let titleBarHeight = 0
        if (process.env.TARO_ENV === 'weapp') {
          titleBarHeight = height + (top - statusBarHeight) * 2
        } else if (process.env.TARO_ENV === 'h5') {
          titleBarHeight = 40
        }
        this.state.titleBarHeight = titleBarHeight
      }
      componentDidShow() {
        this.mainRef.componentDidShow && this.mainRef.componentDidShow()
        Taro.$errorTips = this.loadingRef;
      }
      componentWillMount() {
        if (process.env.TARO_ENV === 'weapp') {
          Taro.showShareMenu({
            withShareTicket:true
          })
        }
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
        path = `${path}&shareFromUser=111`;
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
      render() {
        const styleAll = {
          paddingTop:this.state.navBarMarginTop + 'px'
        }
        const styleTitle = {
          height:this.state.titleBarHeight + 'px'
        }
        return <>
          <View style={styleAll} className={css.navBarMain}>
            <View style={styleTitle} className={css.navBarTitle}>
              {this.state.title}
            </View>
          </View>
          <Loading ref={(v) => {this.loadingRef = v}}/>
          <WrappedComponent ref={(v) => {this.mainRef = v}} {...this.props} changeNavBar={this.changeNavBar}/>
        </>
      }
    }
  }
}
