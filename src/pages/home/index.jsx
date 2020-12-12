import React,{Component} from 'react'
import {View} from '@tarojs/components'
import hocErrorTips from "@/components/HOC/hocErrorTips";
import hocShare from "@/components/HOC/hocShare";
import css from './index.module.scss'
import API from '@/API/home'
@hocShare({})
@hocErrorTips
class Home extends Component {
  componentWillMount() { }
  componentDidMount() {
    API.getHome({keywords:1})
  }
  componentWillUnmount() { }
  componentDidShow() { }
  componentDidHide() { }
  render() {
    return (
      <View className={css.main}>第二页</View>
    )
  }
}
export default Home
