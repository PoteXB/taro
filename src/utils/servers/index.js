import http from "./http"
export default {
  getBanner(data) {
    return http.get('/business/banner/getBanner',{...data,pullDownRefresh:true});
  },
  indexData(data) {
    return http.get('/business/index/data',data);
  },
  rewardFindPage(data) {
    return http.get('/business/reward/findPage',{...data,noLoading:true});
  },
  rewardFindDetails(data) {
    return http.get('/business/reward/findDetails',data);
  },
  rewardFindUser(data) {
    return http.get('/business/reward/findUser',data);
  },
  rewardReward(data) {
    return http.get('/business/reward/reward',data);
  },
  findPrizePage(data) {
    return http.get('/business/reward/findPrizePage',data);
  },
  findRewardPage(data) {
    return http.get('/business/reward/findRewardPage',data);
  },
  login(data) {
    return http.post('/business/user/login',data);
  },
  refreshToken(data) {
    return http.get('/business/user/refreshToken',data);
  },
}
