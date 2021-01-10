import {Component} from 'react'
import Taro from "@tarojs/taro";
import './app.scss'
import API from '@/API/index'
class App extends Component {
  onLaunch() {
    let token = Taro.getStorageSync('token')
    if (token) {
      API.refreshToken().then((v) => {
        Taro.setStorageSync('token',v.result.token)
        Taro.setStorageSync('userInfo',v.result.userDO)
      })
    }
    Taro.$systemInfo = Taro.getSystemInfoSync()
    if (process.env.TARO_ENV === 'weapp') {
      Taro.$menuButtonBoundingClientRect = Taro.getMenuButtonBoundingClientRect()
    } else {
      Taro.$menuButtonBoundingClientRect = {}
    }
  }
  componentDidMount() {
  }
  componentDidShow() {}
  componentDidHide() {}
  componentDidCatchError() {}
  render() {
    return this.props.children
  }
}
export default App
