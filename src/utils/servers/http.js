import Taro from '@tarojs/taro'
import getBaseUrl from './baseUrl'
import {pageToLogin} from "./utils"
import {HTTP_STATUS} from './config'
let count = {};//计数器
let allErrorMsg = {};
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
  if (requestParams.data._noLoad) {
    delete requestParams.data._noLoad
    count[requestParams.nowNum] = true
  } else {
    count[requestParams.nowNum] = true
    Taro.showLoading({mask:true})
  }
  return chain.proceed(requestParams).then(res => {
    count[requestParams.nowNum] = undefined
    if (JSON.stringify(count) === "{}") {
      Taro.hideLoading()
    }
    if (res.statusCode === HTTP_STATUS.NOT_FOUND) {
      return Promise.reject("请求资源不存在")
    } else if (res.statusCode === HTTP_STATUS.BAD_GATEWAY) {
      return Promise.reject("服务端出现了问题")
    } else if (res.statusCode === HTTP_STATUS.FORBIDDEN) {
      Taro.setStorageSync("Authorization","")
      pageToLogin()
      return Promise.reject("没有权限访问");
    } else if (res.statusCode === HTTP_STATUS.AUTHENTICATE) {
      Taro.setStorageSync("Authorization","")
      pageToLogin()
      return Promise.reject("需要鉴权")
    } else if (res.statusCode === HTTP_STATUS.SUCCESS) {
      return res.data
    }
  }).catch(() => {
    count[requestParams.nowNum] = undefined
    if (JSON.stringify(count) === "{}") {
      Taro.hideLoading()
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
        // 'content-type':contentType,
        // 'Authorization':Taro.getStorageSync('Authorization')
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
