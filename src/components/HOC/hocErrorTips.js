import React from 'react'
import Taro from '@tarojs/taro'
import Loading from "@/components/loading";
export default (WrappedComponent) => {
  //错误提示message弹窗
  return class ErrorTips extends WrappedComponent {
    componentWillMount() {
      if (super.componentWillMount) {
        super.componentWillMount()
      }
    }
    componentDidMount() {
      if (super.componentDidMount) {
        super.componentDidMount()
      }
    }
    componentDidShow() {
      if (super.componentDidShow) {
        super.componentDidShow()
      }
      Taro.eventCenter.trigger('changeErrorTips',this)
    }
    render() {
      return <>
        <Loading ref={'loading'}/>
        {super.render()}
      </>
    }
  }
}
