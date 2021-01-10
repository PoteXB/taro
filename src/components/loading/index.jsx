import React,{Component} from 'react'
import {View} from '@tarojs/components'
import css from './index.module.scss'
export default class Loading extends Component {
  constructor(props) {
    super(props);
  }
  m = 0
  n = 0
  state = {
    errorList:[]
  }
  addError(msg) {
    this.m++
    this.state.errorList.push({key:`key${new Date().getTime()}`,title:msg});
    this.setState({})
    setTimeout(() => {
      this.n++
      if (this.m === this.n) {
        this.state.errorList = [];
        this.setState({})
        this.m = this.n = 0
      }
    },3000)
  }
  render() {
    return (
      <View className={css.box} style={{top:this.props.navBarStyle.height}}>
        {this.state.errorList.map((v) => {
          return <View key={v.key} className={css.item}>
            <View className={css.itemT}>{v.title}</View>
          </View>
        })}
      </View>
    )
  }
}
