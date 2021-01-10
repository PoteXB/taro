import React,{Component} from 'react'
import Taro from '@tarojs/taro'
import {View,Image} from '@tarojs/components'
import hocCommon from "@/components/HOC/common";
import HocReachBottom from "@/components/HOC/reachBottom";
import css from './index.module.scss'
import API from '@/API/index'
import utils from '@/utils/index'
let hocReachBottom = new HocReachBottom({
  api:API.rewardFindUser,
  map:{list:'records'}
})
@hocCommon({title:'参与抽奖用户'})
class Index extends Component {
  kongArr = utils.numToArr(6)
  state = {
    list:[]
  }
  constructor(props) {
    super(props);
    let rewardId = Taro.getCurrentInstance().router.params.id
    hocReachBottom.param = {rewardId}
  }
  @hocReachBottom.componentDidMount
  componentDidMount() {}
  loadMore() {
    hocReachBottom.getList()
  }
  render() {
    let {list} = this.state;
    let {kongArr} = this;
    let {end,total} = hocReachBottom;
    return (
      <View className={css.main}>
        <View className={css.head}>共有{total}位参与者 </View>
        <View className={css.list}>
          {kongArr.map(() => {
            return <View className={css.kong}/>
          })}
          {list.map((v) => {
            return <Image src={v.faceImg} className={css.item}/>
          })}
        </View>
        {!end ? <View className={css.loadMore} onClick={this.loadMore}>加载更多 >></View> : null}
      </View>
    )
  }
}
export default Index
