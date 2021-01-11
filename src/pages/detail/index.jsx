import React,{Component} from 'react'
import Taro from '@tarojs/taro'
import {View,Image,ScrollView,Button} from '@tarojs/components'
import hocCommon from "@/components/HOC/common";
import DrawCard from "@/components/UI/drawCard";
import Title from "@/components/UI/title";
import Place from "@/components/UI/place";
import Popup from "@/components/popup";
import Modal from "@/components/modal";
import css from './index.module.scss'
import API from '@/API/index'
import utils from '@/utils/index'
import img1 from '@/img/4.png'
import img2 from '@/img/5.png'
import img3 from '@/img/3.png'
import img5 from '@/img/12.png'
import img6 from '@/img/13.png'
import img7 from '@/img/16.png'
import img8 from '@/img/18.png'
import img9 from '@/img/19.png'
@hocCommon({title:'抽奖领红包序列号'})
class Index extends Component {
  kongArr = utils.numToArr(5)
  startY = 0
  divisionObj = {'1':'观看视频广告，参与抽奖','3':'邀请好友助力，获取更多概率劵'}
  joinObj = {'1':'参与抽奖','3':'待开奖'}
  statusObj = {'2':'很遗憾，您未中奖~','4':'恭喜你，中奖啦！'}
  statusTipObj = {'2':'再接再厉，相信好运很快就会降临！','4':'快去联系客服，领奖吧~'}
  explainArr = [
    '1.观看视频广告，即可参与抽奖；',
    '2.参与抽奖后，默认获得一张概率劵，分享给好友好友参与抽奖，可获得更多的概率劵；',
    '3.概率劵越高，中奖几率越大；'
  ]
  tabArr = ['抽奖说明','图文介绍']
  pageNo = 1
  pageSize = 10
  end = false
  isLogin = this.props.isLogin
  state = {
    mainInfo:{}, //第一条主要信息 //1初始态可参加  2已结束未中奖  3参与中 4中奖 5已结束未参加
    scrollIndex:0,
    list:[],
    modalImg:''
  }
  componentDidMount() {
    let rewardId = Taro.getCurrentInstance().router.params.id
    let result = []
    //首次首页详情
    this.getInfoById(rewardId,(data) => {
      let {status,reward,nextReward,rewardUserList,prizeList} = data
      let mainStatus = status
      if (reward) {
        reward.lock = true
        reward.status = status
        reward.rewardUserList = rewardUserList
        reward.prizeList = prizeList
        reward.nextReward = nextReward
        result.push(reward)
      }
      let mainInfo = reward
      if (nextReward.id) {
        result.push(nextReward)
      }
      result = result.map((x) => {
        return {
          ...x,
          selectTab:0,
          scrollData:{
            scrollTop:0,
            allHeight:0,
            boxHeight:0,
          }
        }
      })
      let list = this.state.list.concat(result);
      this.setState({list,mainInfo},() => {
        if (mainStatus === 4 || mainStatus === 2) {
          this.popupDom.show()
        }
      })
    })
  }
  componentDidUpdate(a,b,c) {
    if (this.isLogin !== this.props.isLogin) {
      this.isLogin = this.props.isLogin
      this.restNowInfo()
    }
  }
  getInfoById(rewardId,callBack) {
    API.rewardFindDetails({rewardId}).then((v) => {
      let {isEnd,isJoin,isPrize,isReward,reward,nextReward,rewardUserList,prizeList} = v.result
      let status = this.returnStatus(isEnd,isJoin,isPrize,isReward)
      callBack({
        status,
        reward,
        rewardUserList:rewardUserList || [],
        prizeList:prizeList || [],
        nextReward:nextReward || {},
      })
    })
  }
  restNowInfo(obj = {}) {
    let {scrollIndex,list} = this.state
    let rewardId = list[scrollIndex].id
    this.getInfoById(rewardId,(data) => {
      let {status,reward,nextReward,rewardUserList,prizeList} = data
      this.state.list[scrollIndex] = {
        ...list[scrollIndex],
        ...reward,
        status:status,
        rewardUserList:rewardUserList,
        prizeList:prizeList,
        nextReward:nextReward,
      }
      this.setState({})
      if (obj.callBack) {
        obj.callBack(data)
      }
    })
  }
  returnStatus(isEnd,isJoin,isPrize,isReward) {
    let status = 1
    if (isReward && isEnd && !isPrize && isJoin) {
      status = 2
    } else if (isJoin && !isReward) {
      status = 3
    } else if (isJoin && isReward && isPrize) {
      status = 4
    } else if (isEnd && !isJoin) {
      status = 5
    }
    return status
  }
  getList() {
    let {pageNo,pageSize} = this
    API.rewardFindPage({pageNo,pageSize}).then((v) => {
      if (v.result.totalPage === this.pageNo) {
        this.end = true
      }
      this.pageNo++
      let result = (v.result.data || []).map((x) => {
        return {
          ...x,
          scrollData:{
            scrollTop:0,
            allHeight:0,
            boxHeight:0,
          }
        }
      })
      let list = this.state.list.concat(result);
      this.setState({list})
    })
  }
  onChange = () => {
    let {scrollIndex,list} = this.state
    if (!list[scrollIndex].lock) {
      if (!this.end) {
        this.restNowInfo({
          callBack:(data) => {
            list[scrollIndex].lock = true
            if (data.nextReward.id) {
              let {list} = this.state
              list.push({
                ...data.nextReward,
                selectTab:0,
                scrollData:{
                  scrollTop:0,
                  allHeight:0,
                  boxHeight:0,
                }
              })
              this.setState({
                list
              })
            }
          }
        })
        // this.getList()
      }
    }
  }
  toJoinUser(id) {
    Taro.navigateTo({
      url:`/pages/joinUser/index?id=${id}`
    })
  }
  clickJoin = (rewardId,status) => {
    if (!this.props.isLogin) {
      this.props.openLogin()
      return
    }
    if (status === 1) {
      API.rewardReward({rewardId}).then(() => {
        let that = this;
        Taro.requestSubscribeMessage({
          tmplIds:['wi-uGtvC2wLlznxCOwso9OGbTsZJOB1i5T-5g0IdLTY'],
          success:function (res) {
          },
          fail:function (res) {
          },
          complete:function () {
            that.restNowInfo({
              callBack:() => {
                Taro.showToast({
                  title:'参与成功',
                  icon:'success',
                  duration:2000
                })
              }
            })
          },
        })
      })
    }
    // this.modalTipDom.show()
  }
  fuLiInfoDom(title,v) {
    let fuLiInfo = v.nextReward || {}
    return (fuLiInfo.id && <>
      <Title>{title}</Title>
      <Place height={30}/>
      <DrawCard info={fuLiInfo}/>
    </>)
  }
  winListDom(v,noBorder) {
    let style = noBorder ? {border:'none',paddingBottom:0,marginBottom:'20rpx'} : {}
    let prizeList = v.prizeList || []
    return !!prizeList.length && <>
      <Title>中奖者名单</Title>
      <Place height={30}/>
      <View className={css.winList} style={style}>
        {this.kongArr.map(() => {
          return <View className={css.kong}/>
        })}
        {prizeList.map((x,k) => {
          return <View className={css.item} key={k}>
            <Image src={x.faceImg}/>
            <View className={css.text}>{x.nickName}</View>
          </View>
        })}
      </View>
    </>
  }
  joinDom(v) {
    let {joinObj} = this
    let {status} = v
    return <View className={css.join}>
      <Image className={css.img} src={img2} onClick={() => {this.clickJoin(v.id,status)}}/>
      <Button openType="share" plain={true} className={css.share}>
        <Image src={img9}/>
        <View>分享给好友</View>
      </Button>
      <View className={css.text} onClick={() => {this.clickJoin(v.id,status)}}>{joinObj[status]}</View>
    </View>
  }
  joinNumDom(v) {
    return <View className={css.joinNum} onClick={() => {this.toJoinUser(v.id)}}>
      已有{(v.rewardUserList || []).length}人参与，查看全部
      <Image className={css.icon} src={img3}/>
    </View>
  }
  joinIconDom(rewardUserList) {
    return <View className={css.joinIcon}>
      {(rewardUserList || []).map((v,k) => {
        return <Image className={css.img} src={v.faceImg} key={k}/>
      })}
    </View>
  }
  tabDom(v) {
    let {tabArr} = this
    let {selectTab} = v
    return <View className={css.tab}>
      {tabArr.map((x,k) => {
        return <View
          className={`${css.item} ${selectTab === k ? css.active : ''}`}
          key={k}
          onClick={() => {
            v.selectTab = k
            this.setState({})
          }}>
          <View className={css.text}>{x}</View>
          <View className={css.underLine}/>
        </View>
      })}
    </View>
  }
  tabContDom(v) {
    let {selectTab} = v
    // let {explainArr} = this
    return <>
      {selectTab === 0 ? <View className={css.explain}>
        {/*{explainArr.map((v,k) => {*/}
        {/*  return <View className={css.item} key={k}>*/}
        {/*    <View className={css.spot}/>*/}
        {/*    <View className={css.text}>{v}</View>*/}
        {/*  </View>*/}
        {/*})}*/}
        <View className={css.item}>
          <View className={css.spot}/>
          <View className={css.text}>{v.descs}</View>
        </View>
      </View> : null}
      {selectTab === 1 ? <Image className={css.redImg} src={v.redImg}/> : null}
    </>
  }
  divisionDom(v) {
    let {divisionObj} = this
    let {status} = v
    return <View className={css.division}>
      <View className={`${css.line} ${css[`line${status}`]}`}/>
      <View className={css[`text${status}`]}>{divisionObj[status]}</View>
      <View className={`${css.line} ${css[`line${status}`]}`}/>
    </View>
  }
  render() {
    let {scrollIndex,list,modalImg,mainInfo} = this.state
    let mainStatus = mainInfo.status
    console.log('当前页数',scrollIndex + 1)
    console.log('总页数' + list.length)
    console.log('数据',this)
    let moreFuLiInfoDom = this.fuLiInfoDom('更多抽奖',mainInfo)
    let winListPopDom = this.winListDom(mainInfo,true)
    let {screenHeight} = Taro.$systemInfo
    let scrollHeight = this.props.mainStyle.height
    let navBarHeight = this.props.navBarStyle.height
    let mainStatus2 = mainStatus === 2;
    let mainStatus4 = mainStatus === 4;
    let lastIndex = list.length - 1
    return (
      <View className={css.main}>
        <View
          onTransitionEnd={this.onChange}
          onTouchStart={(v) => {
            this.startY = v.touches[0].pageY
          }}
          onTouchEnd={(k) => {
            let scrollData = list[scrollIndex].scrollData
            let countY = k.changedTouches[0].pageY - this.startY
            let boxHeight = (scrollData.boxHeight || '').split('px')[0]
            if (countY < -200 && scrollData.scrollTop > (scrollData.allHeight - boxHeight - 10)) {
              if (scrollIndex < list.length - 1) {
                this.setState({
                  scrollIndex:scrollIndex + 1
                })
              }
            } else if (countY > 200 && scrollData.scrollTop < 10) {
              if (scrollIndex > 0) {
                this.setState({
                  scrollIndex:scrollIndex - 1
                })
              }
            }
          }}
          className={css.box}
          style={{transform:`translateY(-${screenHeight * scrollIndex}px)`}}
        >
          {list.map((v,k) => {
            let status = v.status
            let status1 = status === 1;
            let status2 = status === 2;
            let status3 = status === 3;
            let status4 = status === 4;
            let status5 = status === 5;
            let isRender = [scrollIndex - 1,scrollIndex,scrollIndex + 1].includes(k)
            let joinIcon = this.joinIconDom(v.rewardUserList)
            let joinNum = this.joinNumDom(v)
            let tab = this.tabDom(v)
            let tabCont = this.tabContDom(v)
            let division = this.divisionDom(v)
            let join = this.joinDom(v)
            let winListDom = this.winListDom(v)
            let fuLiInfoDom = this.fuLiInfoDom('为你准备了如下福利',v)
            return isRender ? <>
              <ScrollView
                key={v.id}
                style={{height:scrollHeight}}
                scrollTop={v.scrollData.scrollTop}
                scrollY
                scrollWithAnimation
                onScroll={(k) => {
                  v.scrollData = {
                    scrollTop:k.target.scrollTop,
                    allHeight:k.target.scrollHeight,
                    boxHeight:scrollHeight,
                  }
                }}
              >
                <View className={css.banner}>
                  {status3 && <View className={css.bell}>
                    <Image src={img8}/>
                  </View>}
                  <Image className={css.mainImg} src={v.coverImg}/>
                </View>
                <View className={css.padding}>
                  <View className={css.title}>
                    {v.title}
                  </View>
                  <View className={css.time}>
                    <Image className={css.icon} src={img1}/>
                    <View className={css.text}>{v.rewardTime} 自动开奖</View>
                    <View className={css.btn} onClick={() => {
                      this.setState({
                        modalImg:v.redImg
                      })
                      this.modalDom.show()
                    }}>封面预览</View>
                  </View>
                  <View className={css.describe}>中奖后，通过客服功能发送截图即可领取奖励~</View>
                </View>
                {status1 && <>
                  {tab}
                  <View className={css.padding}>
                    {tabCont}
                    {division}
                    {join}
                    {joinNum}
                    {joinIcon}
                  </View>
                </>}
                {status2 && <>
                  <View className={css.tab}/>
                  <View className={css.padding}>
                    <View className={css.status}>很遗憾，你未中奖~</View>
                    <View className={css.statusTip}>再接再厉，相信好运很快就会降临！</View>
                    {fuLiInfoDom}
                    {winListDom}
                    {joinNum}
                    {joinIcon}
                  </View>
                </>}
                {status3 && <>
                  {tab}
                  <View className={css.padding}>
                    {tabCont}
                    {division}
                    {join}
                    {joinNum}
                    {joinIcon}
                  </View>
                </>}
                {status4 && <>
                  <View className={css.tab}/>
                  <View className={css.padding}>
                    <View className={css.status}>恭喜你，中奖啦！</View>
                    <View className={css.statusTip}>快去联系客服，领奖吧~</View>
                    {fuLiInfoDom}
                    {winListDom}
                    {joinNum}
                    {joinIcon}
                  </View>
                </>}
                {status5 && <>
                  <View className={css.tab}/>
                  <View className={css.padding}>
                    <View className={css.status}>未参与</View>
                    <View className={css.statusTip}>你来晚了，奖品已经被领走了~</View>
                    {fuLiInfoDom}
                    {winListDom}
                    {joinNum}
                    {joinIcon}
                  </View>
                </>}
                <View className={css.next}>
                  {k === lastIndex ? null : <Image className={css.icon} src={img7}/>}
                  <View>{k === lastIndex ? '已经到底了' : '继续上滑，参与下一个抽奖'}</View>
                </View>
              </ScrollView>
              <View style={{height:navBarHeight}}/>
            </> : <View style={{height:`${screenHeight}px`}}/>
          })}
        </View>
        <Popup direction="top" ref={(v) => {this.popupDom = v}}>
          <View className={css.padding}>
            <View className={css.popup}>
              {mainStatus2 && <Image className={css.icon} src={img5}/>}
              {mainStatus4 && <Image className={css.icon} src={img6}/>}
              <View>
                <View className={css.status} style={{marginTop:0}}>{this.statusObj[mainStatus]}</View>
                <View className={css.statusTip} style={{marginBottom:0}}>{this.statusTipObj[mainStatus]}</View>
              </View>
            </View>
            {winListPopDom}
            {moreFuLiInfoDom}
          </View>
        </Popup>
        <Modal ref={(v) => {this.modalDom = v}} closeIcon>
          <Image className={css.redImg} src={modalImg} style={{marginTop:0}}/>
        </Modal>
        <Modal ref={(v) => {this.modalTipDom = v}} closeIcon>
          <View className={css.subTip}>
            <View className={css.p1}>温暖提示</View>
            <View className={css.p2}>建议开启【接受订阅消息】允许通知开奖结果，及时领取红包封面奖励~</View>
            <View className={css.p3}>你知道吗？每天有100+的中奖者因未及时领奖而错失大奖~</View>
            <View className={css.p4}>开启开奖通知</View>
          </View>
        </Modal>
      </View>
    )
  }
}
export default Index
