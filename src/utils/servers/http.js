import Taro from '@tarojs/taro'
import getBaseUrl from './baseUrl'
import {pageToLogin} from "./utils"
import {HTTP_STATUS} from './config'
let count = {};//计数器
let allErrorMsg = {};
Taro.eventCenter.on('openErrorTips',(v) => {
  Taro.$errorTips.addError(v)
})
function jieLiu(errorMsg,callBack) {
  if (!allErrorMsg[errorMsg]) {
    allErrorMsg[errorMsg] = 1;
    setTimeout(() => {
      allErrorMsg[errorMsg] = undefined;
    },500);
    callBack();
  }
}
const customInterceptor = (chain) => {
  let requestParams = chain.requestParams
  requestParams.nowNum = new Date().getTime();
  //参数里带这个请求是否是下拉刷新需要结束下拉刷新
  if (requestParams.data.pullDownRefresh) {
    delete requestParams.data.pullDownRefresh
    requestParams.pullDownRefresh = true;
  }
  //参数里带这个请求是否不需要load
  if (requestParams.data.noLoading) {
    delete requestParams.data.noLoading
    count[requestParams.nowNum] = true
  } else {
    count[requestParams.nowNum] = true
    Taro.showLoading({mask:true,title:'加载中'})
  }
  return chain.proceed(requestParams).then(res => {
    count[requestParams.nowNum] = undefined
    if (JSON.stringify(count) === "{}") {
      Taro.hideLoading()
    }
    if (requestParams.pullDownRefresh) {
      Taro.stopPullDownRefresh()
    }
    let msg = '请求异常';
    if (res.statusCode === HTTP_STATUS.SUCCESS) {
      if (res.data.code === 200) {
        return res.data
      } else {
        res.data.message && (msg = res.data.message)
      }
    }
    if (res.statusCode === HTTP_STATUS.NOT_FOUND) {
      msg = '404'
    } else if (res.statusCode === HTTP_STATUS.BAD_GATEWAY) {
      msg = '502'
    } else if (res.statusCode === HTTP_STATUS.FORBIDDEN) {
      Taro.setStorageSync("token","")
      msg = '403'
    } else if (res.statusCode === HTTP_STATUS.AUTHENTICATE) {
      Taro.setStorageSync("token","")
      msg = '401'
    }
    if (msg) {
      jieLiu(msg,() => {
        Taro.eventCenter.trigger('openErrorTips',msg)
      });
      return Promise.reject({type:'self',msg});
    }
  }).catch((res) => {
    if (typeof res === 'object' && res.type === 'self') {
      if (res.msg === '登录状态失效,请重新登录') {
        Taro.removeStorageSync("token")
        Taro.removeStorageSync("userInfo")
        setTimeout((v) => {
          Taro.navigateTo({
            url:`/pages/index/index`
          })
        },1500)
      }
      return Promise.reject(res.msg);
    }
    count[requestParams.nowNum] = undefined
    if (JSON.stringify(count) === "{}") {
      Taro.hideLoading()
    }
    if (requestParams.pullDownRefresh) {
      Taro.stopPullDownRefresh()
    }
    let msg = '网络异常';
    jieLiu(msg,() => {
      Taro.eventCenter.trigger('openErrorTips',msg)
    });
    return Promise.reject(msg);
  })
}
Taro.addInterceptor(customInterceptor)
// Taro.addInterceptor(Taro.interceptors.logInterceptor)
class httpRequest {
  baseOptions(params,method) {
    let {url,data,contentType = "application/json"} = params;
    const BASE_URL = getBaseUrl(url);
    const option = {
      url:BASE_URL + url,
      data:data,
      method:method,
      header:{
        'content-type':contentType,
        'KH-Token':Taro.getStorageSync('token')
      }
    };
    return Taro.request(option);
  }
  get(url,data = {}) {
    let params = {url,data};
    return this.baseOptions(params,"GET");
  }
  post(url,data = {},contentType) {
    let params = {url,data,contentType};
    return this.baseOptions(params,"POST");
  }
}
export default new httpRequest()
