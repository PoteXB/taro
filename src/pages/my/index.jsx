import React,{Component} from 'react'
import Taro from '@tarojs/taro'
import {View,Image,Button,OpenData} from '@tarojs/components'
import hocCommon from "@/components/HOC/common";
import css from './index.module.scss'
import img1 from '@/img/6.png'
import img2 from '@/img/7.png'
import img3 from '@/img/8.png'
import img4 from '@/img/11.png'
@hocCommon({title:'我的'})
class Index extends Component {
  state = {
    id:null
  }
  componentDidMount() {
    let userInfo = Taro.getStorageSync('userInfo') || {}
    this.setState({
      id:userInfo.id
    })
  }
  toAll() {
    Taro.navigateTo({
      url:'/pages/myDraw/index'
    })
  }
  toRecord() {
    Taro.navigateTo({
      url:'/pages/myWin/index'
    })
  }
  render() {
    let {id} = this.state
    return (
      <View className={css.main}>
        <View className={css.use}>
          <OpenData type='userAvatarUrl' className={css.img}/>
          <View>
            <OpenData type='userNickName' className={css.name}/>
            <View className={css.id}>ID:{id}</View>
          </View>
        </View>
        <View className={css.title} onClick={this.toAll}>
          <Image className={css.icon} src={img1}/>
          <View className={css.box}>
            <View className={css.text}>全部抽奖</View>
            {/*<View className={css.text}>全部抽奖（25）</View>*/}
            <Image className={css.arrow} src={img3}/>
          </View>
        </View>
        <View className={css.title} onClick={this.toRecord}>
          <Image className={css.icon} src={img2}/>
          <View className={css.box}>
            <View className={css.text}>中奖记录</View>
            <Image className={css.arrow} src={img3}/>
          </View>
        </View>
        <View className={css.title}>
          <Image className={css.icon} src={img4}/>
          <Button openType='contact' plain={true} className={css.box}>
            <View className={css.text}>联系客服</View>
            <Image className={css.arrow} src={img3}/>
          </Button>
        </View>
      </View>
    )
  }
}
export default Index
