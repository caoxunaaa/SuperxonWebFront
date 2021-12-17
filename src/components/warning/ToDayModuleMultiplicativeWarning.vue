<template>
  <div id="ToDayModuleMultiplicativeWarning">
    <Charts :id="id1" :option="option1"></Charts>
    <el-tag style="background-color: red; color: white;margin:10px 0">注：图中左侧柱为大于50投入数的累乘良率，右侧柱为所有的累乘良率</el-tag>
    <Charts :id="id2" :option="option2"></Charts>
  </div>
</template>

<script>
import Charts from '@/components/chart/Chart'
import HighCharts from 'highcharts'
export default {
  name: 'ToDayModuleMultiplicativeWarning',
  components: {
    Charts
  },
  mounted () {
    HighCharts.chart(this.id1, this.option1)
    HighCharts.chart(this.id2, this.option2)
    // console.log('2')
    this.setTime()
  },
  methods: {
    // 定时器
    setTime: function () {
      // console.log('1')
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime())
      start.setHours(0)
      start.setMinutes(0)
      start.setSeconds(0)
      end.setTime(start.getTime() + 3600 * 1000 * 24 * 1)
      end.setHours(0)
      end.setMinutes(0)
      end.setSeconds(0)
      var startTime = this.moment(start).format('YYYY-MM-DD HH:mm:ss')
      var endTime = this.moment(end).format('YYYY-MM-DD HH:mm:ss')
      // console.log(startTime)
      this.get_normal_data(startTime, endTime)
      this.get_return_data(startTime, endTime)
      this.timer = setInterval(() => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime())
        start.setHours(0)
        start.setMinutes(0)
        start.setSeconds(0)
        end.setTime(start.getTime() + 3600 * 1000 * 24 * 1)
        end.setHours(0)
        end.setMinutes(0)
        end.setSeconds(0)
        var startTime = this.moment(start).format('YYYY-MM-DD HH:mm:ss')
        var endTime = this.moment(end).format('YYYY-MM-DD HH:mm:ss')
        // console.log(startTime)
        this.get_normal_data(startTime, endTime)
        this.get_return_data(startTime, endTime)
      }, 1000 * 60 * 20)
    },
    // 获取当天正常品告警项累乘良率
    get_normal_data (start, end) {
      let that = this
      that.$axios({
        method: 'get',
        url: '/display/product-operation-info/module/warning-view/warning-multiplicative-info-in-time-period-by-work-order-type',
        params: {
          startTime: start,
          endTime: end,
          workOrderType: 'TRX正常品'
        }
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null) {
          // console.log(res['resultDel50'])
          var keys = Object.keys(res['resultDel50'])
          var ydata = []
          var allydata = []
          var xdata = []
          var lindata = []
          var warn = []
          for (let n = 0; n < keys.length - 1; n++) {
            for (let m = 0; m < keys.length - n - 1; m++) {
              if (Number(res['resultDel50'][keys[m]]) < Number(res['resultDel50'][keys[m + 1]])) {
                var num = keys[m]
                keys[m] = keys[m + 1]
                keys[m + 1] = num
              }
            }
          }
          // var bili = Number((255 / (keys.length - 1)).toFixed(2))
          for (let i = 0; i < keys.length; i++) {
            xdata.push(keys[i])
            lindata.push({'name': keys[i], 'y': that.guides})
            warn.push({'name': keys[i], 'y': that.warningGuides})
            if (Number((res['resultDel50'][keys[i]] * 100).toFixed(2)) >= 80) {
              ydata.push({'name': keys[i], 'color': 'green', 'y': Number((res['resultDel50'][keys[i]] * 100).toFixed(2))})
            } else if (Number((res['resultDel50'][keys[i]] * 100).toFixed(2)) < 60) {
              ydata.push({'name': keys[i], 'color': 'red', 'y': Number((res['resultDel50'][keys[i]] * 100).toFixed(2))})
            } else {
              ydata.push({'name': keys[i], 'color': '#dabc27', 'y': Number((res['resultDel50'][keys[i]] * 100).toFixed(2))})
            }
            if (Number((res['resultTotal'][keys[i]] * 100).toFixed(2)) >= 80) {
              allydata.push({'name': keys[i], 'color': 'green', 'y': Number((res['resultTotal'][keys[i]] * 100).toFixed(2))})
            } else if (Number((res['resultTotal'][keys[i]] * 100).toFixed(2)) < 60) {
              allydata.push({'name': keys[i], 'color': 'red', 'y': Number((res['resultTotal'][keys[i]] * 100).toFixed(2))})
            } else {
              allydata.push({'name': keys[i], 'color': '#dabc27', 'y': Number((res['resultTotal'][keys[i]] * 100).toFixed(2))})
            }
            // ydata.push({'name': keys[i], 'color': 'rgb(' + (bili * i) + ',' + (255 - bili * i) + ',' + 0 + ')', 'y': Number((res['resultDel50'][keys[i]] * 100).toFixed(2))})
            // allydata.push({'name': keys[i], 'color': 'rgb(' + (bili * i) + ',' + (255 - bili * i) + ',' + 0 + ')', 'y': Number((res['resultTotal'][keys[i]] * 100).toFixed(2))})
          }
          // console.log(ydata)
          that.option1.xAxis.categories = xdata
          that.option1.series[0].data = ydata
          that.option1.series[1].data = allydata
          that.option1.series[2].data = lindata
          that.option1.series[3].data = warn
          that.option1.subtitle.text = start + '——' + end
          HighCharts.chart(that.id1, that.option1)
        }
      })
    },
    // 获取当天返工品告警项累乘良率
    get_return_data (start, end) {
      let that = this
      that.$axios({
        method: 'get',
        url: '/display/product-operation-info/module/warning-view/warning-multiplicative-info-in-time-period-by-work-order-type',
        params: {
          startTime: start,
          endTime: end,
          workOrderType: '改制返工品'
        }
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null) {
          // console.log(res)
          var keys = Object.keys(res['resultDel50'])
          var ydata = []
          var allydata = []
          var xdata = []
          var lindata = []
          var warn = []
          for (let n = 0; n < keys.length - 1; n++) {
            for (let m = 0; m < keys.length - n - 1; m++) {
              if (Number(res['resultDel50'][keys[m]]) < Number(res['resultDel50'][keys[m + 1]])) {
                var num = keys[m]
                keys[m] = keys[m + 1]
                keys[m + 1] = num
              }
            }
          }
          // var bili = Number((255 / (keys.length - 1)).toFixed(2))
          for (let i = 0; i < keys.length; i++) {
            xdata.push(keys[i])
            if (Number((res['resultDel50'][keys[i]] * 100).toFixed(2)) >= 80) {
              ydata.push({'name': keys[i], 'color': 'green', 'y': Number((res['resultDel50'][keys[i]] * 100).toFixed(2))})
            } else if (Number((res['resultDel50'][keys[i]] * 100).toFixed(2)) < 60) {
              ydata.push({'name': keys[i], 'color': 'red', 'y': Number((res['resultDel50'][keys[i]] * 100).toFixed(2))})
            } else {
              ydata.push({'name': keys[i], 'color': '#dabc27', 'y': Number((res['resultDel50'][keys[i]] * 100).toFixed(2))})
            }
            if (Number((res['resultTotal'][keys[i]] * 100).toFixed(2)) >= 80) {
              allydata.push({'name': keys[i], 'color': 'green', 'y': Number((res['resultTotal'][keys[i]] * 100).toFixed(2))})
            } else if (Number((res['resultTotal'][keys[i]] * 100).toFixed(2)) < 60) {
              allydata.push({'name': keys[i], 'color': 'red', 'y': Number((res['resultTotal'][keys[i]] * 100).toFixed(2))})
            } else {
              allydata.push({'name': keys[i], 'color': '#dabc27', 'y': Number((res['resultTotal'][keys[i]] * 100).toFixed(2))})
            }
            // allydata.push({'name': keys[i], 'color': 'rgb(' + (bili * i) + ',' + (255 - bili * i) + ',' + 0 + ')', 'y': Number((res['resultTotal'][keys[i]] * 100).toFixed(2))})
            lindata.push({'name': keys[i], 'y': that.guides})
            warn.push({'name': keys[i], 'y': that.warningGuides})
          }
          // console.log(ydata)
          that.option2.subtitle.text = start + '——' + end
          that.option2.series[0].data = ydata
          that.option2.series[1].data = allydata
          that.option2.series[2].data = lindata
          that.option2.series[3].data = warn
          that.option2.xAxis.categories = xdata
          HighCharts.chart(that.id2, that.option2)
        }
      })
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  data () {
    return {
      id1: 'high1',
      id2: 'high2',
      guides: 60,
      warningGuides: 80,
      option1: {
        title: {
          text: 'MODEL正常品告警累乘良率'
        },
        subtitle: {
          text: '',
          style: {
            color: 'white'
          }
        },
        xAxis: {
          categories: [],
          crosshair: true,
          title: {
            text: ''
          }
        },
        yAxis: [{
          min: 0,
          max: 110,
          title: {
            text: '百分比'
          }
        }],
        tooltip: {
          // shared: true,
          formatter: function () {
            return '<b>PN：' + this.point.name + '<b/><br><b>良率累乘：' + this.point.y + '%</b>'
          }
          // headerFormat: '<span>[{point.name}]</span>'
          // pointFormat: '<br><p>' + data.UpdateReason + '</p>' + '<br><p>修改前：' + data.OldValue + '</p>' + '<br><p>修改后：' + data.NewValue + '</p>'
        },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true // 开启数据显示
            }
          },
          series: {
            cursor: 'pointer',
            events: {
              click: function (e) {
                window.open('http://172.20.3.12:1180/#/quality/module_quality_pn_statistics')
                localStorage.setItem('PN', (e.point.name + ',TRX正常品'))
              }
            }
          }
        },
        legend: {
          enabled: false // 禁用图例
        },
        credits: {
          enabled: false // 禁用网址
        },
        series: [{
          type: 'column',
          data: [],
          pointPadding: 0.01,
          groupPadding: 0.1,
          dataLabels: {
            enabled: true,
            verticalAlign: 'bottom'
          }
        }, {
          type: 'column',
          data: [],
          pointPadding: 0.01,
          groupPadding: 0.1,
          pointPlacement: -0.2,
          dataLabels: {
            enabled: true,
            verticalAlign: 'top'
          }
        }, {
          data: [],
          dashStyle: 'LongDash',
          color: 'red',
          marker: {
            enabled: false
          }
        }, {
          data: [],
          dashStyle: 'LongDash',
          color: 'yellow',
          marker: {
            enabled: false
          }
        }]
      },
      option2: {
        title: {
          text: 'MODEL改制返工品告警累乘良率'
        },
        subtitle: {
          text: '',
          style: {
            color: 'white'
          }
        },
        xAxis: {
          categories: [],
          crosshair: true,
          title: {
            text: ''
          }
        },
        yAxis: [{
          min: 0,
          max: 120,
          title: {
            text: '百分比'
          }
        }],
        tooltip: {
          // shared: true,
          formatter: function () {
            return '<b>PN：' + this.point.name + '<b/><br><b>良率累乘：' + this.point.y + '%</b>'
          }
          // headerFormat: '<span>[{point.name}]</span>'
          // pointFormat: '<br><p>' + data.UpdateReason + '</p>' + '<br><p>修改前：' + data.OldValue + '</p>' + '<br><p>修改后：' + data.NewValue + '</p>'
        },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true // 开启数据显示
            }
          },
          series: {
            cursor: 'pointer',
            events: {
              click: function (e) {
                window.open('http://172.20.3.12:1180/#/quality/module_quality_pn_statistics')
                localStorage.setItem('PN', (e.point.name + ',TRX改制返工品'))
              }
            }
          }
        },
        legend: {
          enabled: false // 禁用图例
        },
        credits: {
          enabled: false // 禁用网址
        },
        series: [{
          type: 'column',
          data: [],
          pointPadding: 0.01,
          groupPadding: 0.1,
          dataLabels: {
            enabled: true,
            verticalAlign: 'bottom'
          }
        }, {
          type: 'column',
          data: [],
          pointPadding: 0.01,
          groupPadding: 0.1,
          pointPlacement: -0.2,
          dataLabels: {
            enabled: true,
            verticalAlign: 'top'
          }
        }, {
          data: [],
          dashStyle: 'LongDash',
          color: 'red',
          marker: {
            enabled: false
          }
        }, {
          data: [],
          dashStyle: 'LongDash',
          color: 'yellow',
          marker: {
            enabled: false
          }
        }]
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
*{
  padding: 0;
  margin: 0;
}

</style>
