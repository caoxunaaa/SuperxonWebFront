<template>
  <div class="CouplingStation">
    <div class="InternalCoding" v-for="(item,index) in data" :key="index">
      <h3 style=" color: #fff;width: 50%;padding:0;margin:0;">{{index}}:{{startTime}}至{{endTime}}</h3>
      <br>
      <div class="smalldiv" style="float:left" v-for="(items,indexs) in data[index]" :key="indexs">
        <!-- <p v-if="items.color === 'green'" style="color: black;background-color:green;margin:0">{{items.Id}}</p> -->
        <!-- <p v-if="items.color === 'red'">{{items.Id}}</p> -->
        <el-button v-if="items.WorkStatus === '工作中'" @click="get_only_data(items)" style="background:green;color:white;text-align:center;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{items.InsName}}</el-button>
        <el-button v-if="items.WorkStatus === '闲置中'" @click="get_only_data(items)" style="background:darkgray;color:white;text-align:center;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{items.InsName}}</el-button>
        <p v-if="items.PassRate <= 50" style="color:red;font-size:5px;margin:0;">直通率：{{items.PassRate}}%</p>
        <p v-if="items.PassRate > 50" style="font-size:5px;margin:0;">直通率：{{items.PassRate}}%</p>
      </div>
    </div>
    <el-dialog
    :visible.sync="onlyStationVisible"
    width="80%">
    <div>
      <el-row :gutter="20">
      <el-col :span="12" style="font-size:20px">
        <!-- <b>startTime:{{message.startTime}}</b><br>
        <b>endTime:{{message.endTime}}</b><br> -->
        <div style="boreder:20px">
          <b>当前工位：{{only_station_riginally.InsName}}</b><br>
        <b>工人工号：{{only_station_riginally.Worker}}</b><br>
        <b>工单号：{{only_station_riginally.WorkNum}}</b><br>
        <b>投入总数：{{only_station_riginally.Input}}</b><br>
        <b>通过总数：{{only_station_riginally.Pass}}</b><br>
        <b>良率：{{only_station_riginally.PassRate}}%</b><br>
        <b>开始工作时间：{{only_station_riginally.StartTime}}</b><br>
        <b>最近一支产品的Pn：{{only_station_riginally.LatestPn}}</b><br>
        <b>最近生产时间：{{only_station_riginally.LatestTime}}</b><br>
        </div>
      </el-col>
      <el-col :span="12">
        <div style="width: 100%">
        <XChart :id="id2" class="high" :option="option2"></XChart>
        </div>
      </el-col>
    </el-row>
    </div>
    <div>
      <div style="width:100%;height:400px;border:1px solid #909399">
        <XChart :id="id1" :option="option1" style="height:600px"></XChart>
      </div>
    </div>
    <div>
      <div style="width:100%;height:400px;border:1px solid #909399">
        <XChart :id="id3" :option="option3" style="height:600px"></XChart>
      </div>
    </div>
    <div style="width:100%;background:#545c64">
      <div style="width: 10%;">
        <el-input v-model="interval" @change="change_total"></el-input>
      </div>
    </div>
    </el-dialog>
  </div>
</template>

<script>
import XChart from '@/components/chart/Chart'
import Highcharts from 'highcharts'
export default {
  name: 'OsaQualityStatisticsBoardTwo',
  components: {
    XChart
  },
  watch: {
    message: {
      handler (newVal, oldVal) {
        if (newVal['startTime'] === null && newVal['endTime'] === null) {
          this.get_automatic_launch_coupling_station_time()
        } else {
          console.log(newVal, oldVal)
          this.startTime = newVal['startTime']
          this.endTime = newVal['endTime']
          this.get_automatic_launch_coupling_station_data()
          clearInterval(this.timer2)
        }
      },
      deep: true
    },
    stroagedata: {
      handler (newVal, oldVal) {
        if (newVal !== '') {
          if (newVal.split(',')[0] === oldVal.split(',')[0]) {
            if (newVal.split(',')[1] !== '' && newVal.split(',')[1] !== oldVal.split(',')[1]) {
              console.log(newVal)
              if (newVal.split(',')[1] === 'all') {
                this.all_data()
                this.statistical_chart(this.statisticalData)
              } else {
                var onlydata = []
                // console.log(this.automatic_transmission_coupling_station_lapWeldRate_data)
                for (let i = 0; i < this.automatic_transmission_coupling_station_lapWeldRate_data.length; i++) {
                  if (this.automatic_transmission_coupling_station_lapWeldRate_data[i]['name'] === newVal.split(',')[1]) {
                    onlydata.push(this.automatic_transmission_coupling_station_lapWeldRate_data[i])
                  }
                }
                // console.log(onlydata)
                this.option1.series[0]['data'] = onlydata
                Highcharts.chart(this.id1, this.option1)
                var onlychart = []
                for (let m = 0; m < this.statisticalData.length; m++) {
                  if (this.statisticalData[m]['Pn'] === newVal.split(',')[1]) {
                    onlychart.push(this.statisticalData[m])
                  }
                }
                this.statistical_chart(onlychart)
              }
            }
          }
        }
      },
      deep: true
    }
  },
  mounted () {
    this.xqh_timer()
    this.get_automatic_launch_coupling_station_time()
  },
  methods: {
    // 打开定时器
    xqh_timer () {
      this.timer = setInterval(() => {
        this.stroagedata = localStorage.getItem('changeData')
      }, 100)
      this.timer2 = setInterval(() => {
        this.get_automatic_launch_coupling_station_time()
      }, 1000 * 60 * 30)
    },
    all_data () {
      this.option1.series[0]['data'] = this.automatic_transmission_coupling_station_lapWeldRate_data
      Highcharts.chart(this.id1, this.option1)
    },
    // 获取整个饼图的数据
    get_pie_data (InsName) {
      let that = this
      that.$axios({
        url: '/display/product-operation-info/station/overview/transmit-auto-couple-info-statistic-group-by-pn',
        method: 'get',
        params: {
          startTime: that.startTime,
          endTime: that.endTime,
          insname: InsName
        }
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null) {
          // 获取工位全部投入数
          var total = []
          for (let i = 0; i < res.length; i++) {
            total.push({'name': res[i]['Pn'], 'y': res[i]['Input'], 'data': res[i]['Input']})
          }
          that.option2.series[0]['data'] = total
          Highcharts.chart(that.id2, that.option2)
        }
      })
    },
    // 获取自动发射耦合台位的数据
    get_automatic_launch_coupling_station_time () {
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
      that.get_automatic_launch_coupling_station_data()
    },
    get_automatic_launch_coupling_station_data () {
      let that = this
      const m = that.$message({
        type: 'info',
        message: '正在查询中...',
        duration: 0
      })
      that.$axios({
        url: '/display/product-operation-info/station/overview/all-transmit-auto-couple-info',
        method: 'get',
        params: {
          startTime: that.startTime,
          endTime: that.endTime
        }
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null) {
          that.data['自动发射耦合台位'] = res
          // console.log(that.data)
        }
        m.close()
      }).catch(function (err) {
        m.close()
        console.log(err)
        that.$message({
          type: 'error',
          message: '获取自动发射耦合台位失败！'
        })
      })
    },
    // 获取一个台位的数据
    get_only_data (items) {
      console.log(items)
      this.get_station_data(items['InsName'])
      this.get_pie_data(items['InsName'])
      items['StartTime'] = this.moment(items['StartTime']).format('YYYY-MM-DD HH:mm:ss')
      items['LatestTime'] = this.moment(items['LatestTime']).format('YYYY-MM-DD HH:mm:ss')
      this.only_station_riginally = items
      this.onlyStationVisible = true
    },
    // 获取自动发射耦合某个台位详细信息
    get_station_data (InsName) {
      console.log(InsName)
      localStorage.setItem('changeData', InsName + ',')
      let that = this
      that.$axios({
        url: '/display/product-operation-info/station/overview/transmit-auto-couple-info-detail-info-by-stationid',
        method: 'get',
        params: {
          startTime: that.startTime,
          endTime: that.endTime,
          insname: InsName
        }
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null) {
          // Date.UTC
          // 趋势图
          that.statisticalData = res
          that.automatic_transmission_coupling_station_lapWeldRate_data = []
          that.automatic_transmission_coupling_station_throughWeldRate_data = []
          for (let i = 0; i < res.length; i++) {
            var Status = ''
            // var TestTime = (new Date(that.moment(res[i]['TestTime']).format('YYYY-MM-DD HH:mm:ss').replace(new RegExp('-', 'gm'), '/'))).getTime()
            if (res[i]['Status'] === 'Fail') {
              Status = '#BF0B23'
            }
            var sn = res[i]['Sn']
            var End = res[i]['PwrEnd']['Float64']
            var UOk = res[i]['PwrUOk']['Float64']
            // var sn = 'hahaha'
            var testTime = that.moment(res[i]['TestTime']).format('YYYY-MM-DD HH:mm:ss')
            var TestTimeTwo = new Date(that.moment(res[i]['TestTime']).format('YYYY-MM-DD HH:mm:ss'))
            // console.log(res[i]['TestTime'], testTime, TestTimeTwo)
            // var TestTimeThree = Date.UTC(TestTimeTwo.getFullYear(), TestTimeTwo.getMonth(), TestTimeTwo.getDay(), TestTimeTwo.getHours(), TestTimeTwo.getMinutes(), TestTimeTwo.getSeconds())
            var LapWeldRate = res[i]['LapWeldRate']
            var ThroughWeldRate = res[i]['ThroughWeldRate']
            var Pn = res[i]['Pn']
            // console.log(TestTime)
            // console.log(Status)
            // console.log(LapWeldRate)
            // console.log(ThroughWeldRate)
            that.automatic_transmission_coupling_station_lapWeldRate_data.push({x: Date.UTC(TestTimeTwo.getFullYear(), TestTimeTwo.getMonth(), TestTimeTwo.getDay(), TestTimeTwo.getHours(), TestTimeTwo.getMinutes(), TestTimeTwo.getSeconds()), y: LapWeldRate, color: Status, name: Pn, Time: testTime, Sn: sn, PwrEnd: End, PwrUOk: UOk})
            that.automatic_transmission_coupling_station_throughWeldRate_data.push({x: Date.UTC(TestTimeTwo.getFullYear(), TestTimeTwo.getMonth(), TestTimeTwo.getDay(), TestTimeTwo.getHours(), TestTimeTwo.getMinutes(), TestTimeTwo.getSeconds()), y: ThroughWeldRate, color: Status, name: Pn, Time: testTime, Sn: sn, PwrEnd: End, PwrUOk: UOk})
          }
          that.option1.series[0]['data'] = that.automatic_transmission_coupling_station_lapWeldRate_data
          // that.option1.series[1]['data'] = that.automatic_transmission_coupling_station_throughWeldRate_data
          console.log(that.option1.series[0]['data'])
          Highcharts.chart(that.id1, that.option1)
          that.statistical_chart(res)
          // console.log(Date.UTC(1970, 10, 9, 0, 0, 0))
          // var starttime = '1970-11-9 08:00:00'
          // starttime = starttime.replace(new RegExp('-', 'gm'), '/')
          // console.log((new Date(starttime.replace(new RegExp('-', 'gm'), '/'))).getTime())
        }
      })
    },
    // 修改间隔
    change_total () {
      if (this.interval !== 0 && this.interval !== '') {
        this.statistical_chart(this.statisticalData)
      } else {
        this.interval = 10
      }
    },
    // 统计图
    statistical_chart (res) {
      let that = this
      for (let p = 0; p < that.option3.series[0].data.length; p++) {
        that.option3.series[0].data[p]['y'] = 0
      }
      // console.log(res)
      var num = that.interval
      var leng = Math.floor(200 / num)
      var dict = []
      for (let i = 0; i <= leng; i++) {
        var key = String(num * i - 100)
        dict.push({'name': key, 'y': 0})
      }
      for (let k = 0; k < res.length; k++) {
        var keys = Math.floor(res[k]['LapWeldRate'] / num) * num
        for (let m = 0; m < dict.length; m++) {
          if (dict[m]['name'] === String(keys)) {
            dict[m]['y'] += 1
          }
        }
      }
      console.log(dict)
      that.option3.series[0].data = dict
      Highcharts.chart(that.id3, that.option3)
      console.log(that.option3.series[0].data)
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
    clearInterval(this.timer2)
  },
  data () {
    return {
      interval: 10,
      id1: 'high1',
      id2: 'high2',
      id3: 'high3',
      startTime: '',
      endTime: '',
      stroagedata: '',
      only_station_riginally: {},
      onlyStationVisible: false,
      data: {
        '自动发射耦合台位': []
      },
      statisticalData: [],
      automatic_transmission_coupling_station_lapWeldRate_data: [],
      automatic_transmission_coupling_station_throughWeldRate_data: [],
      option1: {
        chart: {
          type: 'spline',
          zoomType: 'x'
        },
        title: {
          text: '焊变率趋势图'
        },
        xAxis: {
          type: 'datetime',
          title: {
            text: '时间'
          }
        },
        yAxis: {
          title: {
            text: '焊变率（%）'
          },
          lineWidth: 1,
          gridLineWidth: 1,
          gridLineColor: 'black',
          minorGridLineWidth: 0.1,
          minorTickInterval: 'auto',
          minorGridLineColor: '#E0E0E0',
          minorTickWidth: 1,
          minorTickLength: 5,
          min: -100,
          max: 100
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
        tooltip: {
          formatter: function () {
            return '<b>生产的Sn：' + this.point.Sn + '<br><b>生产的Pn：' + this.point.name + '<b/><br><b>生产时间：' + this.point.Time + '<b/><br><b>PwrUOk：' + this.point.PwrUOk + '</b><br><b>PwrEnd：' + this.point.PwrEnd + '<b/><br><b>焊变率：' + this.point.y + '%</b>'
          }
          // headerFormat: '<span>' + this.x + '[{point.x}]</span>',
          // pointFormat: '<br><p>' + data.UpdateReason + '</p>' + '<br><p>修改前：' + data.OldValue + '</p>' + '<br><p>修改后：' + data.NewValue + '</p>'
        },
        series: [{
          name: '搭接焊变率',
          data: []
        }]
      },
      option2: {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: '工位生产占比图'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            events: {
              click: function (e) {
                console.log(e)
                console.log(localStorage.getItem('changeData').split(',')[0])
                console.log(localStorage.getItem('changeData').split(',')[1])
                if (localStorage.getItem('changeData').split(',')[1] === '') {
                  localStorage.setItem('changeData', localStorage.getItem('changeData') + e.point.name)
                } else {
                  if (localStorage.getItem('changeData').split(',')[1] === e.point.name) {
                    localStorage.setItem('changeData', localStorage.getItem('changeData').split(',')[0] + ',all')
                  } else {
                    localStorage.setItem('changeData', localStorage.getItem('changeData').split(',')[0] + ',' + e.point.name)
                  }
                }
              }
            }
          },
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
            }
          }
        },
        tooltip: {
          headerFormat: '<b>{series.name}: {point.percentage:.1f}%<b><br>',
          pointFormat: '{point.name}: <b>{point.data}个</b>'
        },
        series: [{
          name: '工位生产占比',
          data: []
        }]
      },
      option3: {
        chart: {
          type: 'column'
        },
        title: {
          text: '焊变率统计图'
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          title: {
            text: ''
          }
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false // 禁用网址
        },
        plotOptions: {
          series: {
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              format: '{point.y}'
            }
          }
        },
        tooltip: {
          headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat: '<b>{point.y}个</b><br/>'
        },
        series: [{
          pointPadding: 0.01,
          groupPadding: 0.01,
          pointPlacement: 0.4,
          name: '焊变率统计',
          data: []
        }]
      }
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
body{
  text-align: center;
}
.CouplingStation{
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
  border: 1px solid rgb(0, 0, 0);
  background-color: white;
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
.CouplingStation >>>.el-input__inner {
  color: white !important;
  background-color: #545c64 !important;
}
/*plotLines:[{//基准线
    color:'red',
    dashStyle:'Dash',
    width:1.5,//基准线宽度
    value:1,//基准线的参考值
    zIndex:5
  }, {//基准线
    color:'red',
    dashStyle:'solid',
    label:{
      text:'我是标示线的标签',     //标签的内容
      align:'left',                //标签的水平位置，水平居左,默认是水平居中center
      x:10                         //标签相对于被定位的位置水平偏移的像素，重新定位，水平居左10px
    },
    width:1.5,//基准线宽度
    value:0.25,//基准线的参考值
    zIndex:5
  }], */
</style>
