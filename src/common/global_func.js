function dictSortFunc (dictory) {
  var arr = []
  for (var k = 0; k < Object.keys(dictory).length; k++) {
    var temDict = {}
    temDict[Object.keys(dictory)[k]] = dictory[Object.keys(dictory)[k]]
    arr.push(temDict)
  }
  for (var i = 0; i < arr.length - 1; i++) {
    // 内层循环,控制比较的次数，并且判断两个数的大小
    for (var j = 0; j < arr.length - 1 - i; j++) {
      // 白话解释：如果前面的数大，放到后面(当然是从小到大的冒泡排序)
      if (parseFloat(Object.keys(arr[j])[0].split('_')) > parseFloat(Object.keys(arr[j + 1])[0].split('_'))) {
        var temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
      }
    }
  }
  // console.log(arr)
  return arr
}
export default {
  // Vue.js的插件应当有一个公开方法 install。这个方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象。
  install: function (Vue) {
    Vue.prototype.global_func = (dictory) => dictSortFunc(dictory)
  }
}
