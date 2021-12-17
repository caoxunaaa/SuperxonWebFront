export default ({
  formatDate (row, column) {
    // 获取单元格数据
    let data = row[column.property]
    if (data == null) {
      return null
    }
    let dt = new Date(data)
    return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()
  },
  unique (arr) {
    const res = new Map()
    return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1))
  },
  getTime: function () {
    let yy = new Date().getFullYear()
    let mm = new Date().getMonth() + 1
    let dd = new Date().getDate()
    let hh = new Date().getHours()
    let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
    let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
    return yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
  }
})
