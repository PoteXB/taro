import React,{Component} from 'react'
import {Image,View} from '@tarojs/components'
import PropTypes from 'prop-types';
import './index.scss'
import img1 from '@/img/14.png'
export default class ModalLayer extends Component {
  state = {
    ifshow:false, // 是否展示,
    opacity:false, // 蒙层渐变
    timer:null,
    iftoggle:false
  }
  componentDidMount() {
    if (this.props.showPop) {
      this.show()
    }
  }
  show = () => {
    this.setState({
      ifshow:true,
    })
    setTimeout(() => {
      this.setState({
        opacity:true,
      })
    },0)
    setTimeout(() => {
      this.setState({
        iftoggle:true,
      })
    },300)
  }
  close = () => {
    if (this.state.timer !== null || !this.state.iftoggle) {
      return
    }
    this.setState({
      opacity:false,
      timer:1,
    })
    setTimeout(() => {
      this.setState({
        ifshow:false,
        timer:null,
        iftoggle:false,
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
    const {closeIcon} = this.props
    return (
      <View>
        {ifshow && <>
          <View
            onClick={this.ableClose}
            className="modal-layer"
            style={{
              opacity:opacity ? 1 : 0,
            }}
          />
          <View
            className="modal-content"
            style={{opacity:opacity ? 1 : 0}}
          >
            <View style={{position:'relative'}}>
              {this.props.children}
              {closeIcon && <Image className="modal-close" src={img1} onClick={() => {this.close()}}/>}
            </View>
          </View>
        </>}
      </View>
    )
  }
}
ModalLayer.propTypes = {
  showPop:PropTypes.bool,
  direction:PropTypes.string,
  autoClose:PropTypes.bool,
  top:PropTypes.number
}
ModalLayer.defaultProps = {
  showPop:false,
  direction:'top',
  autoClose:true,
  top:0
};
