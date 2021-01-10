import React,{Component} from 'react'
import Taro from "@tarojs/taro";
import {View,Image} from '@tarojs/components'
import css from './index.module.scss'
import img1 from "@/img/8.png";
class DrawListItem extends Component {
  state = {}
  componentDidMount() {
  }
  toDetail(id) {
    Taro.navigateTo({
      url:`/pages/detail/index?id=${id}`
    })
  }
  render() {
    let {info} = this.props;
    let {title,rewardTime,id} = info;
    return (
      <View className={css.item} onClick={() => {this.toDetail(id)}}>
        <View className={css.box}>
          <View className={css.text}>{title}</View>
          <View className={css.time}>{rewardTime}</View>
        </View>
        <Image className={css.arrow} src={img1}/>
      </View>
    )
  }
}
export default DrawListItem
