import React,{Component} from 'react'
import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'
import hocCommon from "@/components/HOC/common";
import css from './index.module.scss'
import API from '@/API/home'
@hocCommon({title:'首页标题'},{title:'设置的标题'})
class Index extends Component {
  componentDidMount() {
    API.getHome({keywords:1}).then((v) => {})
  }
  aaa = () => {
    Taro.navigateTo({
      url:'/pages/home/index'
    })
  }
  render() {
    return (
      <>
        <View className={css.main} onClick={this.aaa}>跳转</View>
      </>
    )
  }
}
export default Index
