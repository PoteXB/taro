import {Component} from 'react'
import Taro from "@tarojs/taro";
import './app.scss'
class App extends Component {
  onLaunch() {
    Taro.$systemInfo = Taro.getSystemInfoSync()
    if (process.env.TARO_ENV === 'weapp') {
      Taro.$menuButtonBoundingClientRect = Taro.getMenuButtonBoundingClientRect()
    } else {
      Taro.$menuButtonBoundingClientRect = {}
    }
  }
  componentDidMount() {
    Taro.eventCenter.on('changeNavBar',(v) => {
      Taro.$navBar(v)
    })
  }
  componentDidShow() {}
  componentDidHide() {}
  componentDidCatchError() {}
  render() {
    return this.props.children
  }
}
export default App
