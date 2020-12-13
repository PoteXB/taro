import React,{Component} from 'react'
import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'
import hocErrorTips from "@/components/HOC/hocErrorTips";
import hocShare from "@/components/HOC/hocShare";
import hocNavBar from "@/components/HOC/hocNavBar/index";
import css from './index.module.scss'
import API from '@/API/home'
@hocErrorTips
@hocShare()
@hocNavBar({title:'首页'})
class Index extends Component {
  componentWillMount() {}
  componentDidMount() {
    API.getHome({keywords:1}).then((v) => {})
  }
  componentDidShow() {}
  componentWillUnmount() {}
  componentDidHide() {}
  aaa() {
    Taro.eventCenter.trigger('changeNavBar',{title:'修改后的首页'})
    Taro.navigateTo({
      url:'/pages/home/index'
    })
  }
  render() {
    return (
      <View className={css.main} onClick={this.aaa}>跳转</View>
    )
  }
}
export default Index
