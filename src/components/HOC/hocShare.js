import React from 'react'
import Taro from '@tarojs/taro'
function hocShare(option = {}) {
  const defaultPath = 'pages/index/index';
  const defaultTitle = '默认标题';
  // const defaultImage = defaultShareImg;
  //页面分享
  return (WrappedComponent) => {
    class Share extends WrappedComponent {
      componentWillMount() {
        if (super.componentWillMount) {
          super.componentWillMount()
        }
        if (process.env.TARO_ENV === 'weapp') {
          Taro.showShareMenu({
            withShareTicket:true
          })
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
      }
      onShareAppMessage() {
        let realOption
        if (this.liveOption) {
          realOption = this.liveOption
        } else {
          realOption = option
        }
        let {
          path = defaultPath,
          title = defaultTitle,
          image = null
        } = realOption;
        path = `${path}&shareFromUser=111`;
        return {
          path,
          title,
          imageUrl:image
        };
      }
      render() {
        return super.render();
      }
    }
    return Share
  };
}
export default hocShare;
