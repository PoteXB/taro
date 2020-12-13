import http from "../http"
export default {
  getHome(data) {
    return http.get('http://musicapi.leanapp.cn/search',{...data});
  },
}
