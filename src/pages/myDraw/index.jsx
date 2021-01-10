import React,{Component} from 'react'
import {Image,View} from '@tarojs/components'
import hocCommon from "@/components/HOC/common";
import DrawCard from "@/components/UI/drawCard";
import DrawListItem from "@/components/UI/drawListItem";
import HocReachBottom from "@/components/HOC/reachBottom";
import Place from "@/components/UI/place";
import css from './index.module.scss'
import img1 from '@/img/20.png'
import API from "@/API/index";
let hocReachBottom = new HocReachBottom({
  api:API.findRewardPage,
  map:{pages:'totalPage',total:'totalCount'}
})
@hocCommon({title:'全部抽奖'})
class Index extends Component {
  state = {
    list:[],
  }
  constructor(props) {
    super(props);
    hocReachBottom.param = {state:1}
  }
  @hocReachBottom.componentDidMount
  componentDidMount() {}
  @hocReachBottom.onReachBottom
  onReachBottom() {}
  changeState(v) {
    hocReachBottom.param = {state:v}
    hocReachBottom.getList('init')
  }
  render() {
    let {list} = this.state
    let {state} = hocReachBottom.param;
    return (
      <View className={css.main}>
        <View className={css.tab}>
          <View
            className={`${css.item} ${state === 1 ? css.active : ''}`}
            onClick={() => {
              this.changeState(1)
            }}>
            <View className={css.text}>待开奖</View>
            <View className={css.underLine}/>
          </View>
          <View
            className={`${css.item} ${state === 2 ? css.active : ''}`}
            onClick={() => {
              this.changeState(2)
            }}>
            <View className={css.text}>已开奖</View>
            <View className={css.underLine}/>
          </View>
        </View>
        <View className={css.row}/>
        {!list.length && hocReachBottom.end && <>
          <Image src={img1} className={css.noList}/>
          <View className={css.noListText}>暂无内容哦~</View>
        </>}
        {state === 1 && <Place height={30}/>}
        {state === 1 && <View>
          {list.map((v,k) => {
            return <DrawCard key={k} info={v}/>
          })}
        </View>}
        {state === 2 && <View>
          {list.map((v,k) => {
            return <DrawListItem key={k} info={v}/>
          })}
        </View>}
      </View>
    )
  }
}
export default Index
