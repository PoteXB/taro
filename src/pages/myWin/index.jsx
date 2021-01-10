import React,{Component} from 'react'
import {Image,View} from '@tarojs/components'
import hocCommon from "@/components/HOC/common";
import HocReachBottom from "@/components/HOC/reachBottom";
import DrawListItem from "@/components/UI/drawListItem";
import Title from "@/components/UI/title";
import Place from "@/components/UI/place";
import css from './index.module.scss'
import API from '@/API/index'
import img1 from "@/img/20.png";
let hocReachBottom = new HocReachBottom({
  api:API.findPrizePage,
  map:{pages:'totalPage',total:'totalCount'}
})
@hocCommon({title:'中奖记录'})
class Index extends Component {
  state = {
    list:[]
  }
  @hocReachBottom.componentDidMount
  componentDidMount() {}
  @hocReachBottom.onReachBottom
  onReachBottom() {}
  render() {
    let {list} = this.state
    return (
      <View className={css.main}>
        <Title>已结束</Title>
        <Place height={30}/>
        {!list.length && hocReachBottom.end && <>
          <Image src={img1} className={css.noList}/>
          <View className={css.noListText}>暂无内容哦~</View>
        </>}
        <View className={css.endList}>
          {list.map((v,k) => {
            return <DrawListItem key={k} info={v}/>
          })}
        </View>
      </View>
    )
  }
}
export default Index
