import React,{Component} from 'react'
import {View} from '@tarojs/components'
import css from './index.module.scss'
export default class extends Component {
  render() {
    let type = this.props.type || ''
    let className = this.props.className || ''
    return (
      <View className={`${css.main} ${css[type]} ${className}`}>
        <View className={css.icon}/>
        <View className={css.text}>{this.props.children}</View>
      </View>
    )
  }
}
