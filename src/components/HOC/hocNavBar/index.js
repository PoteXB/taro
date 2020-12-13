import React from 'react'
import Taro from '@tarojs/taro'
import {View,Text,Input,Image} from '@tarojs/components'
import css from './index.module.scss'
function hocNavBar(option = {}) {
  //自定义顶部栏
  return (WrappedComponent) => {
    return class NavBar extends WrappedComponent {
      state = {
        titleBarHeight:0,
        navBarMarginTop:Taro.$systemInfo.statusBarHeight || 0,
        title:option.title || '',
      }
      constructor() {
        super();
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
      componentWillMount() {
        if (super.componentWillMount) {
          super.componentWillMount()
        }
      }
      componentDidMount() {
        if (super.componentDidMount) {
          super.componentDidMount()
        }
      }
      componentDidShow() {
        if (super.componentDidShow) {
          super.componentDidShow()
        }
        Taro.$navBar = this.changeNavBar;
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
          <View style={styleAll} className={css.main}>
            <View style={styleTitle} className={css.title}>
              {this.state.title}
            </View>
          </View>
          {super.render()}
        </>;
      }
    }
  };
}
export default hocNavBar;
