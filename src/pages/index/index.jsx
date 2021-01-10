import React,{Component} from 'react'
import {View,Image} from '@tarojs/components'
import hocCommon from "@/components/HOC/common";
import HocReachBottom from "@/components/HOC/reachBottom";
import DrawCard from "@/components/UI/drawCard";
import Title from "@/components/UI/title";
import Place from "@/components/UI/place";
import css from './index.module.scss'
import API from '@/API/index'
let hocReachBottom = new HocReachBottom({
  api:API.indexData,
  pageSize:5,
  map:{result:['rewardList'],list:'records'}
})
@hocCommon({title:'红包封面',login:true})
class Index extends Component {
  state = {
    banner:[],
    list:[]
  }
  @hocReachBottom.componentDidMount
  componentDidMount() {
    API.getBanner({module:1}).then((v) => {
      this.setState({banner:v.result || []})
    })
  }
  onPullDownRefresh() {
    this.componentDidMount()
  }
  @hocReachBottom.onReachBottom
  onReachBottom() {}
  render() {
    let {banner,list} = this.state
    return (
      <View className={css.main}>
        <Image className={css.banner} src={(banner[0] || {}).bannerImg}/>
        <Place height={40}/>
        <Title type='big' className={css.title}>每日福利</Title>
        <Place height={38}/>
        <View className={css.list}>
          {list.map((v,k) => {
            return <DrawCard key={k} info={v}/>
          })}
        </View>
      </View>
    )
  }
}
export default Index
