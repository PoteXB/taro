class HocReachBottom {
  pageDom = null
  param = {}
  pages = 0
  total = 0
  load = false
  end = false
  pageNo = 1
  pageSize = 10
  map = {
    pageNo:'pageNo',
    pageSize:'pageSize',
    pages:'pages',
    total:'total',
    result:[],
    list:'data',
  }
  api = () => {}
  constructor(prop) {
    this.api = prop.api
    this.pageSize = prop.pageSize || this.pageSize
    this.map = {...this.map,...(prop.map || {})}
  }
  componentDidMount = (target,name,descriptor) => {
    const oldValue = descriptor.value;
    const that = this
    descriptor.value = function () {
      that.pageDom = this
      that.getList('init')
      oldValue.call(this);
    };
    return descriptor;
  }
  onReachBottom = (target,name,descriptor) => {
    const oldValue = descriptor.value;
    const that = this
    descriptor.value = function () {
      that.getList()
      oldValue.call(this);
    };
    return descriptor;
  }
  getList = (type) => {
    if (type) {
      this.pageNo = 1
      this.end = false
    }
    if (this.load || this.end) {
      return
    }
    let {pageNo,pageSize,map} = this
    this.load = true
    this.api({[map.pageNo]:pageNo,[map.pageSize]:pageSize,...this.param}).then((v) => {
      let data = v.result || {}
      map.result.forEach((m) => {
        data = data[m] || {}
      })
      if (this.pageNo >= data[map.pages]) {
        this.end = true
      }
      this.pages = data[map.pages]
      this.total = data[map.total]
      this.pageNo++
      let list
      if (type) {
        list = data[map.list] || []
      } else {
        list = this.pageDom.state.list.concat(data[map.list] || []);
      }
      this.load = false
      this.pageDom.setState({list})
    }).catch(() => {
      this.load = false
    })
  }
}
export default HocReachBottom;
