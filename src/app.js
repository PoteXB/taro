import {Component} from 'react'
import Taro from "@tarojs/taro";
import './app.scss'
class App extends Component {
  errorTips = null
  componentDidMount() {
    Taro.eventCenter.on('changeErrorTips',(v) => {
      this.errorTips = v.refs.loading;
    })
    Taro.eventCenter.on('openErrorTips',(v) => {
      this.errorTips.addError(v)
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
