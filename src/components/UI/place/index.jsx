import React,{Component} from 'react'
import {View} from '@tarojs/components'
import css from './index.module.scss'
export default class extends Component {
  render() {
    let width = this.props.width ? `${this.props.width}rpx` : '100%'
    let height = this.props.height ? `${this.props.height}rpx` : '100%'
    return (
      <View className={css.main} style={{width:width,height:height}}/>
    )
  }
}
