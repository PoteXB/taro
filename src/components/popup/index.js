import React,{Component} from 'react'
import {View,Image} from '@tarojs/components'
import PropTypes from 'prop-types';
import './index.scss'
import img1 from '@/img/14.png'
export default class PopupLayer extends Component {
  state = {
    ifshow:false, // 是否展示,
    opacity:false, // 蒙层渐变
    translateValue:-100, // 位移距离
    site:'-100%',
    timer:null,
    iftoggle:false
  }
  componentDidMount() {
    if (this.props.showPop) {
      this.show()
    }
  }
  translate = () => {
    const transformObj = {
      top:`transform:translateY(${-this.state.translateValue}%)`,
      bottom:`transform:translateY(${this.state.translateValue}%)`,
      left:`transform:translateX(${-this.state.translateValue}%)`,
      right:`transform:translateX(${this.state.translateValue}%)`
    }
    return transformObj[this.props.direction]
  }
  location = () => {
    const positionValue = {
      top:`bottom:${this.state.site};width:100%;`,
      bottom:`top:${this.state.site};width:100%;`,
      left:`right:0px;top:0;height:100%;`,
      right:`left:0px;top:0;height:100%;`
    }
    return positionValue[this.props.direction] + this.translate()
  }
  show = () => {
    this.setState({
      ifshow:true,
      site:this.props.top + 'rpx'
    })
    let _open = setTimeout(() => {
      this.setState({
        translateValue:0,
        opacity:true,
      })
      _open = null
    },100)
    let _toggle = setTimeout(() => {
      this.setState({
        iftoggle:true
      })
      _toggle = null
    },300)
  }
  close = () => {
    if (this.state.timer !== null || !this.state.iftoggle) {
      return
    }
    this.setState({
      translateValue:-100,
      opacity:false,
    })
    this.state.timer = setTimeout(() => {
      this.setState({
        ifshow:false,
        timer:null,
        iftoggle:false,
        site:'-100%'
      })
    },300)
  }
  ableClose = () => {
    if (this.props.autoClose) {
      this.close()
    }
  }
  render() {
    const {ifshow,opacity} = this.state
    return (
      <View>
        {ifshow && (
          <View
            onClick={this.ableClose}
            className="popup-layer"
            style={{
              top:this.props.top + 'rpx',
              opacity:opacity ? 1 : 0,
            }}
          />
        )}
        <View
          ref="popRef"
          className="popup-content"
          style={this.location()}
        >
          {this.props.children}
          <Image className="popup-close" src={img1} onClick={() => {this.close()}}/>
        </View>
      </View>
    )
  }
}
PopupLayer.propTypes = {
  showPop:PropTypes.bool,
  direction:PropTypes.string,
  autoClose:PropTypes.bool,
  top:PropTypes.number
}
PopupLayer.defaultProps = {
  showPop:false,
  direction:'top',
  autoClose:true,
  top:0
};
