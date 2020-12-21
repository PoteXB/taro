import React,{Component} from 'react'
import {View} from '@tarojs/components'
import hocCommon from "@/components/HOC/common";
import css from './index.module.scss'
import API from '@/API/home'
@hocCommon({title:'第二页标题'})
class Home extends Component {
  componentDidMount() {
    API.getHome({keywords:1})
  }
  bbb = () => {
  }
  render() {
    return (
      <View className={css.main} onClick={this.bbb}>第二页</View>
    )
  }
}
export default Home
