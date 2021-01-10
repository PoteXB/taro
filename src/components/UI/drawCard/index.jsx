import React,{Component} from 'react'
import Taro from "@tarojs/taro";
import {View,Image} from '@tarojs/components'
import css from './index.module.scss'
import img1 from "@/img/4.png";
import img2 from "@/img/17.png";
class DrawCard extends Component {
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
    let {coverImg,title,rewardTime,id,state} = info;
    let okTip = state === 2
    return (
      <View className={css.item} onClick={() => {this.toDetail(id)}}>
        <Image className={css.itemImg} src={coverImg} lazyLoad={true}/>
        {okTip && <Image className={css.okTip} src={img2}/>}
        <View className={css.itemTitle}>{title}</View>
        <View className={css.itemTime}>
          <Image className={css.icon} src={img1}/>
          {rewardTime}自动开奖</View>
      </View>
    )
  }
}
export default DrawCard
