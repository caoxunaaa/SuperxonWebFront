<template>
  <div class="SingleLightInitialMeasurementStation">
    <div class="InternalCoding" v-for="(item,index) in data" :key="index">
      <h3 style=" color: #fff;width: 50%;padding:0;margin:0;">{{index}}:{{startTime}}至{{endTime}}</h3>
      <br>
      <div class="smalldiv" v-for="(items,indexs) in data[index]" :key="indexs">
        <!-- <p v-if="items.color === 'green'" style="color: black;background-color:green;margin:0">{{items.Id}}</p> -->
        <!-- <p v-if="items.color === 'red'">{{items.Id}}</p> -->
        <h5 style=" color: black;width: 50%;padding:0;margin:0;">{{indexs}}</h5>
        <div style="float:left;width:98px; background: white;border:1px solid black" v-for="(itemss,indexss) in data[index][indexs]" :key="indexss">
          <el-button v-if="itemss['工作忙闲'] === '工作中'" @click="get_only_data(itemss)" style="width:100%;background:green;color:white;text-align:center;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{itemss.InsName}}</el-button>
          <el-button v-if="itemss['工作忙闲'] === '闲置中'" @click="get_only_data(itemss)" style="width:100%;background:darkgray;color:white;text-align:center;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{itemss.InsName}}</el-button>
          <p v-if="itemss['通过率'] <= 50" style="color:red;font-size:5px;margin:0;">直通率：{{itemss['通过率']}}%</p>
          <p v-if="itemss['通过率'] > 50" style="font-size:5px;margin:0;">直通率：{{itemss['通过率']}}%</p>
        </div>
        <br>
      </div>
      <el-dialog
      :visible.sync="onlyStationVisible"
      width="90%">
      <h2>{{title}}工位：{{condition}} 通过数：{{passNumber}}个 通过率：{{passRate}}%</h2>
        <div>
          <el-row :gutter="20">
            <el-col :span="12">
              <div>
                <div id="container1GOne" style="width:100%;border: 1px solid black;height:600px;background:rgb(84, 92, 100)">
                </div>
              </div>
              <br>
              <div>
                <div id="container10GOne" style="width:100%;border: 1px solid black;height:600px;background:rgb(84, 92, 100)">
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <div id="container1GTwo" style="width:100%;border: 1px solid black;height:600px;background:rgb(84, 92, 100)">
                </div>
              </div>
              <br>
              <div>
                <div id="container10GTwo" style="width:100%;border: 1px solid black;height:600px;background:rgb(84, 92, 100)">
                </div>
              </div>
            </el-col>
          </el-row>
          <div style="width: 10%;">
            <el-input v-model="total" @change="change_total"></el-input>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Highcharts from 'highcharts'
export default {
  name: 'SingleLightInitialMeasurementStation',
  components: {
  },
  watch: {
    message: {
      handler (newVal, oldVal) {
        if (newVal['startTime'] === null && newVal['endTime'] === null) {
          this.get_single_light_initial_measurement_station_time()
        } else {
          console.log(newVal, oldVal)
          this.startTime = newVal['startTime']
          this.endTime = newVal['endTime']
          this.get_single_light_initial_measurement_station_data()
          this.get_single_light_initial_measurement_station_only_data()
          clearInterval(this.timer2)
        }
      },
      deep: true
    }
  },
  mounted () {
    this.xqh_timer()
    this.get_single_light_initial_measurement_station_time()
  },
  methods: {
    // 打开定时器
    xqh_timer () {
      this.timer2 = setInterval(() => {
        this.get_single_light_initial_measurement_station_time()
      }, 1000 * 60 * 30)
    },
    // 获取单光初测台位的时间
    get_single_light_initial_measurement_station_time () {
      let that = this
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime())
      start.setHours(8)
      start.setMinutes(30)
      start.setSeconds(0)
      end.setTime(start.getTime() + 3600 * 1000 * 24 * 1)
      end.setHours(8)
      end.setMinutes(30)
      end.setSeconds(0)
      // console.log(that.moment(start).format('YYYY-MM-DD HH:mm:ss'), that.moment(end).format('YYYY-MM-DD HH:mm:ss'))
      that.startTime = that.moment(start).format('YYYY-MM-DD HH:mm:ss')
      that.endTime = that.moment(end).format('YYYY-MM-DD HH:mm:ss')
      that.get_single_light_initial_measurement_station_data()
      that.get_single_light_initial_measurement_station_only_data()
    },
    // 获取单光初测台位的数据
    get_single_light_initial_measurement_station_data () {
      let that = this
      that.data['单光初测台位']['TC0_1G'] = []
      that.data['单光初测台位']['TC0_10G'] = []
      that.$axios({
        url: '/display/product-operation-info/station/overview/single-light-test-station-overview-info',
        method: 'get',
        params: {
          startTime: that.startTime,
          endTime: that.endTime
          // startTime: '2021-09-09 08:30:00',
          // endTime: '2021-09-10 08:30:00'
        }
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null) {
          // console.log(res)
          var key = Object.keys(res)
          for (let i = 0; i < key.length; i++) {
            // console.log(res[key[i]])
            var keys = Object.keys(res[key[i]])
            for (let n = 0; n < keys.length; n++) {
              if (keys[n] === 'TC0_10G') {
                var only = res[[key[i]]][keys[n]]
                only['InsName'] = key[i]
                that.data['单光初测台位']['TC0_10G'].push(only)
              } else if (keys[n] === 'TC0_1G') {
                var tenonly = res[[key[i]]][keys[n]]
                tenonly['InsName'] = key[i]
                that.data['单光初测台位']['TC0_1G'].push(tenonly)
              }
            }
          }
          // console.log(that.data)
        }
      }).catch(function (err) {
        console.log(err)
        that.$message({
          type: 'error',
          message: '获取单光初测台位失败！'
        })
      })
    },
    // 获取单光初测台位每一个工位详细的数据
    get_single_light_initial_measurement_station_only_data () {
      let that = this
      that.$axios({
        url: '/display/product-operation-info/station/overview/all-single-light-test-station-each-sn-info',
        method: 'get',
        params: {
          startTime: that.startTime,
          endTime: that.endTime
          // startTime: '2021-09-09 08:30:00',
          // endTime: '2021-09-10 08:30:00'
        }
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null) {
          // console.log(res)
          var table = {}
          var station = []
          for (let i = 0; i < res.length; i++) {
            station.push(res[i]['StationId'])
          }
          var key = Array.from(new Set(station))
          for (let n = 0; n < key.length; n++) {
            table[key[n]] = {'TC0_1G': [], 'TC0_10G': []}
          }
          // console.log(table)
          for (let x = 0; x < res.length; x++) {
            for (let y = 0; y < Object.keys(table).length; y++) {
              if (res[x]['StationId'] === Object.keys(table)[y]) {
                if (res[x]['TcFlag'] === 'TC0_1G') {
                  table[Object.keys(table)[y]]['TC0_1G'].push(res[x])
                } else if (res[x]['TcFlag'] === 'TC0_10G') {
                  table[Object.keys(table)[y]]['TC0_10G'].push(res[x])
                }
              }
            }
          }
          // console.log(table)
          that.onlyData = table
        }
      }).catch(function (err) {
        console.log(err)
        that.$message({
          type: 'error',
          message: '获取单光初测台位详细工位信息失败！'
        })
      })
    },
    // 点击详情按钮
    get_only_data (item) {
      this.total = 0.1
      // console.log(item)
      var insname = item['InsName']
      this.condition = item['工作忙闲']
      this.passNumber = item['通过数']
      this.passRate = item['通过率']
      this.title = insname
      // console.log(insname)
      // console.log(this.onlyData[insname])
      this.onlyStationVisible = true
      var splineChartOnly1G = this.get_chart_data(this.onlyData[this.title]['TC0_1G'])
      var splineChartOnly10G = this.get_chart_data(this.onlyData[this.title]['TC0_10G'])
      var columnChartOnly1G = this.get_chart_data_column(this.total, 'TC0_1G', this.onlyData[this.title]['TC0_1G'])
      var columnChartOnly10G = this.get_chart_data_column(this.total, 'TC0_10G', this.onlyData[this.title]['TC0_10G'])
      this.$nextTick(() => {
        this.get_chart_spline('TC0_1G', 'container1GOne', splineChartOnly1G)
        this.get_chart_spline('TC0_10G', 'container10GOne', splineChartOnly10G)
        this.get_chart_column('TC0_1G', 'container1GTwo', columnChartOnly1G)
        this.get_chart_column('TC0_10G', 'container10GTwo', columnChartOnly10G)
      })
    },
    // 统计图
    change_total () {
      if (this.total !== '' && this.total !== 0) {
        var columnChartOnly1G = this.get_chart_data_column(this.total, 'TC0_1G', this.onlyData[this.title]['TC0_1G'])
        var columnChartOnly10G = this.get_chart_data_column(this.total, 'TC0_10G', this.onlyData[this.title]['TC0_10G'])
        this.$nextTick(() => {
          this.get_chart_column('TC0_1G', 'container1GTwo', columnChartOnly1G)
          this.get_chart_column('TC0_10G', 'container10GTwo', columnChartOnly10G)
        })
      }
    },
    // 统计图作图处理数据
    get_chart_data_column (total, name, data) {
      console.log(name)
      console.log(data)
      console.log(this.onlyData[this.title]['TC0_10G'])
      var num = total * 100
      var dict = []
      var leng = Math.floor(200 / num)
      for (let i = 0; i <= leng; i++) {
        var key = String((num * i - 100) / 100)
        dict.push({'name': key, 'y': 0})
      }
      for (let k = 0; k < data.length; k++) {
        var keys = 0
        if (name === 'TC0_1G') {
          keys = Math.floor(data[k]['ComparePo'] * 100 / num) * num
        } else if (name === 'TC0_10G') {
          keys = Math.floor(data[k]['TcPo10G'] * 100 / num) * num
        }
        for (let m = 0; m < dict.length; m++) {
          if (Number(dict[m]['name']) * 100 === keys) {
            dict[m]['y'] += 1
          }
        }
      }
      var summin = 0
      var summax = 0
      for (let x = 0; x < data.length; x++) {
        if (name === 'TC0_1G') {
          if (data[x]['ComparePo'] < -1) {
            summin += 1
          }
          if (data[x]['ComparePo'] > 1) {
            summax += 1
          }
        } else if (name === 'TC0_10G') {
          if (data[x]['TcPo10G'] < -1) {
            summin += 1
          }
          if (data[x]['TcPo10G'] > 1) {
            summax += 1
          }
        }
      }
      if (summin > 0) {
        var list = [{'name': '<-1', y: summin}]
        dict = list.concat(dict)
      }
      if (summax > 0) {
        var table = [{'name': '>1', y: summax}]
        dict = dict.concat(table)
      }
      console.log(dict)
      return dict
    },
    // 作图
    get_chart_column (name, id, columndata) {
      // console.log(columndata)
      Highcharts.chart(id, {
        chart: {
          backgroundColor: {
            linearGradient: [0, 0, 500, 500],
            stops: [
              [0, 'rgb(84, 92, 100)'],
              [1, 'rgb(84, 92, 100)']
            ]
          },
          type: 'column'
        },
        title: {
          text: name + '单光初测统计图(dB)',
          style: {
            color: 'white'
          }
        },
        xAxis: {
          type: 'category',
          gridLineColor: '#707073',
          labels: {
            style: {
              color: '#E0E0E3'
            }
          },
          lineColor: '#707073',
          minorGridLineColor: '#505053',
          tickColor: '#707073',
          tickInterval: 0,
          crosshair: true,
          title: {
            text: '掉光对比值',
            style: {
              color: '#E0E0E3'
            }
          }
        },
        yAxis: {
          title: {
            text: '单光初测统计个数',
            style: {
              color: '#A0A0A3'
            }
          },
          labels: {
            style: {
              color: '#E0E0E3'
            }
          },
          lineColor: '#707073',
          minorGridLineColor: '#505053',
          tickColor: '#707073',
          tickWidth: 1
        },
        plotOptions: {
          series: {
            turboThreshold: 0
          },
          spline: {
            marker: {
              radius: 7,
              enabled: true,
              lineWidth: 2
            }
          }
        },
        series: [{
          pointPadding: 0.01,
          groupPadding: 0.01,
          pointPlacement: 0.4,
          name: '单光初测统计',
          data: columndata
        }]
      })
    },
    // 趋势图作图处理数据
    get_chart_data (data) {
      // console.log(data)
      var data1G = []
      for (let n = 0; n < data.length; n++) {
        var status = ''
        if (data[n]['ErrorCode'] !== '0') {
          status = '#BF0B23'
        }
        var pn = data[n]['Pn']
        var sn = data[n]['Sn']
        var time = this.moment(data[n]['TestDate']).format('YYYY-MM-DD HH:mm:ss')
        var testTime = new Date(this.moment(data[n]['TestDate']).format('YYYY-MM-DD HH:mm:ss'))
        var y = ''
        if (data[n]['TcFlag'] === 'TC0_1G') {
          y = data[n]['ComparePo']
        } else if (data[n]['TcFlag'] === 'TC0_10G') {
          y = data[n]['TcPo10G']
        }
        var x = Date.UTC(testTime.getFullYear(), testTime.getMonth(), testTime.getDay(), testTime.getHours(), testTime.getMinutes(), testTime.getSeconds())
        data1G.push({'x': x, 'y': y, 'Pn': pn, 'Sn': sn, 'Status': status, 'Time': time})
      }
      return data1G
    },
    // 作图
    get_chart_spline (name, id, splinedata) {
      // console.log(splinedata)
      var minmaxdata = []
      for (let n = 0; n < splinedata.length; n++) {
        minmaxdata.push(splinedata[n]['y'])
      }
      var min = Math.min.apply(null, minmaxdata)
      var max = Math.max.apply(null, minmaxdata)
      Highcharts.chart(id, {
        chart: {
          backgroundColor: {
            linearGradient: [0, 0, 500, 500],
            stops: [
              [0, 'rgb(84, 92, 100)'],
              [1, 'rgb(84, 92, 100)']
            ]
          },
          type: 'spline',
          zoomType: 'x'
          // type: 'scatter'
        },
        title: {
          text: name + '单光初测对比图',
          style: {
            color: 'white'
          }
        },
        xAxis: {
          type: 'datetime',
          gridLineColor: '#707073',
          labels: {
            style: {
              color: '#E0E0E3'
            }
          },
          lineColor: '#707073',
          minorGridLineColor: '#505053',
          tickColor: '#707073',
          tickInterval: 0,
          crosshair: true,
          title: {
            text: '时间',
            style: {
              color: '#E0E0E3'
            }
          }
        },
        yAxis: {
          title: {
            text: '单光初测对比',
            style: {
              color: '#A0A0A3'
            }
          },
          labels: {
            style: {
              color: '#E0E0E3'
            }
          },
          lineColor: '#707073',
          minorGridLineColor: '#505053',
          tickColor: '#707073',
          tickWidth: 1,
          min: min,
          max: max
        },
        plotOptions: {
          series: {
            turboThreshold: 0,
            lineWidth: 0
          },
          spline: {
            marker: {
              radius: 7,
              enabled: true,
              lineWidth: 2
            }
          }
        },
        tooltip: {
          formatter: function () {
            return '<b>生产的Sn：' + this.point.Sn + '<br><b>生产的Pn：' + this.point.Pn + '<b/><br><b>生产时间：' + this.point.Time + '<br><b>变化：' + this.point.y + '</b>'
          }
          // headerFormat: '<span>' + this.x + '[{point.x}]</span>',
          // pointFormat: '<br><p>' + data.UpdateReason + '</p>' + '<br><p>修改前：' + data.OldValue + '</p>' + '<br><p>修改后：' + data.NewValue + '</p>'
        },
        series: [{
          name: name + '单光初测对比',
          data: splinedata
        }]
      })
    }
  },
  beforeDestroy () {
    clearInterval(this.timer2)
  },
  data () {
    return {
      data: {
        '单光初测台位': {
          'TC0_10G': [],
          'TC0_1G': []
        }
      },
      total: 0.1,
      stroagedata: '',
      title: '',
      condition: '',
      passNumber: '',
      passRate: '',
      startTime: '',
      endTime: '',
      onlyData: {},
      onlyStationVisible: false
    }
  },
  props: {
    message: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
body{
  text-align: center;
}
.SingleLightInitialMeasurementStation{
  text-align: justify;
}
.color{
  /* border: 1px solid rgb(0, 0, 0); */
  background:rgba(255,255,255,0.7);
  width: 20%;
  height: 200px;
  /* margin-right: 20px; */
  margin-bottom: 20px;
  display: inline-block;
}
.bigdiv {
  font-size: 12px;
  border: 1px solid rgb(0, 0, 0);
  background-color: rgb(84, 92, 100);
  width: 100%;
  height: 750px
}
.smalldiv{
  background-color: rgb(112, 112, 112);
  height: 80px;
  width: 100%;
}
.Medium {
  color: red;
}
.low {
  color: green;
}
.stop{
  color:darkgray;
}
.InternalCoding{
  background-color: rgb(112, 112, 112);
  width: 100%;
  height: 200px;
}
.SingleLightInitialMeasurementStation >>>.el-input__inner {
  color: white !important;
  background-color: #545c64 !important;
}
</style>
