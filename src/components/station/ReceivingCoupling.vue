<template>
  <div class="ReceivingCoupling">
    <div class="InternalCoding" v-for="(item,index) in data" :key="index">
      <h3 style=" color: #fff;width: 50%;padding:0;margin:0;">{{index}}:{{startTime}}至{{endTime}}</h3>
      <br>
      <div class="smalldiv" style="float:left;width:105px;" v-for="(items,indexs) in keydata" :key="indexs">
        <!-- <p v-if="items.color === 'green'" style="color: black;background-color:green;margin:0">{{items.Id}}</p> -->
        <!-- <p v-if="items.color === 'red'">{{items.Id}}</p> -->
        <el-button v-if="data[index][items]['工作忙闲'] === '工作中'" @click="get_only_data(data[index][items], items)" style="width:100%;background:green;color:white;text-align:center;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{items}}</el-button>
        <el-button v-if="data[index][items]['工作忙闲'] === '闲置中'" @click="get_only_data(data[index][items], items)" style="width:100%;background:darkgray;color:white;text-align:center;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{items}}</el-button>
        <p v-if="data[index][items]['通过率'] <= 50" style="color:red;font-size:5px;margin:0;">直通率：{{data[index][items]['通过率']}}%</p>
        <p v-if="data[index][items]['通过率'] > 50" style="font-size:5px;margin:0;">直通率：{{data[index][items]['通过率']}}%</p>
      </div>
    </div>
    <el-dialog
    :visible.sync="onlyStationVisible"
    width="90%">
    <div>
      <el-row :gutter="20">
        <el-col :span="12" style="font-size:20px">
          <div style="border:20px">
            <b>当前工位：{{station}}</b><br>
            <b>通过总数：{{pass}}</b><br>
            <b>失败总数：{{bad}}</b><br>
            <b>通过率：{{passrate}}%</b><br>
            <b>开始工作时间：{{opentime}}</b><br>
            <b>最近生产时间：{{nexttime}}</b>
          </div>
        </el-col>
        <el-col :span="12">
          <XChart style="width:100%" :id="id2" class="high" :option="option2"></XChart>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div style="width:100%;height:400px;border:1px solid #909399">
            <XChart :id="id1" :option="option1" style="height:600px"></XChart>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div style="width:100%;height:400px;border:1px solid #909399">
            <XChart :id="id3" :option="option3" style="height:600px"></XChart>
          </div>
        </el-col>
      </el-row>
      <div style="width:100%;background:#545c64">
        <div style="width: 10%;">
          <el-input v-model="interval" @change="change_total"></el-input>
        </div>
      </div>
    </div>
    </el-dialog>
  </div>
</template>

<script>
import XChart from '@/components/chart/Chart'
import Highcharts from 'highcharts'
export default {
  name: 'ReceivingCoupling',
  components: {
    XChart
  },
  watch: {
    message: {
      handler (newVal, oldVal) {
        if (newVal['startTime'] === null && newVal['endTime'] === null) {
          this.get_receiving_coupling_station_time()
        } else {
          this.startTime = newVal['startTime']
          this.endTime = newVal['endTime']
          this.get_receiving_coupling_station_data()
          this.get_station_only_data()
          clearInterval(this.timer2)
        }
      },
      deep: true
    },
    stroagedata: {
      handler (newVal, oldVal) {
        console.log(newVal)
        if (newVal !== '') {
          if (newVal.split(',')[0] === oldVal.split(',')[0]) {
            if (newVal.split(',')[1] !== '' && newVal.split(',')[1] !== oldVal.split(',')[1]) {
              console.log(newVal)
              if (newVal.split(',')[1] === 'all') {
                this.get_spline_chart_data()
                this.get_column_chart_data(this.onlyStationData)
              } else {
                var onlydata = []
                for (let i = 0; i < this.stationLapWeldRateData.length; i++) {
                  if (this.stationLapWeldRateData[i]['name'] === newVal.split(',')[1]) {
                    onlydata.push(this.stationLapWeldRateData[i])
                  }
                }
                this.option1.series[0]['data'] = onlydata
                Highcharts.chart(this.id1, this.option1)
                var onlychart = []
                console.log(this.onlyStationData)
                for (let m = 0; m < this.onlyStationData.length; m++) {
                  if (this.onlyStationData[m]['Pn'] === newVal.split(',')[1]) {
                    onlychart.push(this.onlyStationData[m])
                  }
                }
                console.log(onlychart)
                this.get_column_chart_data(onlychart)
              }
            }
          }
        }
      }
    }
  },
  mounted () {
    this.xqh_timer()
    this.get_receiving_coupling_station_time()
  },
  methods: {
    // 打开定时器
    xqh_timer () {
      this.timer = setInterval(() => {
        this.stroagedata = localStorage.getItem('changeDataReceiving')
        // console.log(localStorage.getItem('changeDataReceiving'))
      }, 100)
      this.timer2 = setInterval(() => {
        this.get_receiving_coupling_station_time()
      }, 1000 * 60 * 30)
    },
    // 获取接收耦合台位的时间
    get_receiving_coupling_station_time () {
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
      that.get_receiving_coupling_station_data()
      that.get_station_only_data()
    },
    // 获取接收耦合台位的数据
    get_receiving_coupling_station_data () {
      let that = this
      that.data['接收耦合台位'] = []
      that.$axios({
        url: '/display/product-operation-info/station/overview/receive-couple-info-overview-info',
        method: 'get',
        params: {
          startTime: that.startTime,
          endTime: that.endTime
          // startTime: '2021-09-14 08:30:00',
          // endTime: '2021-09-15 08:30:00'
        }
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null) {
          that.keydata = Object.keys(res).sort()
          console.log(that.keydata)
          that.data['接收耦合台位'] = res
          console.log(that.data)
        }
      }).catch(function (err) {
        console.log(err)
        that.$message({
          type: 'error',
          message: '获取接收耦合台位失败！'
        })
      })
    },
    // 点击按钮
    get_only_data (data, id) {
      console.log(data, id)
      this.station = id
      this.bad = data['失败数']
      this.pass = data['通过数']
      this.passrate = data['通过率']
      this.onlyStationData = this.onlydata[id]
      console.log(this.onlyStationData)
      this.opentime = this.moment(this.onlyStationData[0]['TestTime']).format('YYYY-MM-DD HH:mm:ss')
      this.nexttime = this.moment(this.onlyStationData[this.onlyStationData.length - 1]['TestTime']).format('YYYY-MM-DD HH:mm:ss')
      localStorage.setItem('changeDataReceiving', id + ',')
      this.get_pie_data(id)
      this.onlyStationVisible = true
      this.$nextTick(() => {
        this.get_spline_chart_data()
        this.get_column_chart_data(this.onlyStationData)
      })
    },
    // 获取饼图的信息
    get_pie_data (InsName) {
      let that = this
      that.$axios({
        url: '/display/product-operation-info/station/overview/receive-couple-info-statistic-group-by-pn',
        method: 'get',
        params: {
          startTime: that.startTime,
          endTime: that.endTime,
          // startTime: '2021-09-14 08:30:00',
          // endTime: '2021-09-15 08:30:00',
          insName: InsName
        }
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null) {
          var key = Object.keys(res)
          var total = []
          for (let i = 0; i < key.length; i++) {
            total.push({'name': key[i], 'y': res[key[i]], 'data': res[key[i]]})
          }
          that.option2.series[0]['data'] = total
          Highcharts.chart(that.id2, that.option2)
        }
      }).catch(function (error) {
        console.log(error)
        that.$message({
          type: 'error',
          message: '获取接收耦合生产占比数据失败！'
        })
      })
    },
    // 获取接收耦合每一个工位详细的数据
    get_station_only_data () {
      let that = this
      that.$axios({
        url: '/display/product-operation-info/station/overview/all-receive-couple-station-each-sn-info',
        method: 'get',
        params: {
          startTime: that.startTime,
          endTime: that.endTime
          // startTime: '2021-09-14 08:30:00',
          // endTime: '2021-09-15 08:30:00'
        }
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null) {
          var data = []
          var station = []
          for (let i = 0; i < res.length; i++) {
            station.push(res[i]['InsName'])
          }
          var key = Array.from(new Set(station))
          console.log(key)
          for (let n = 0; n < key.length; n++) {
            data[key[n]] = []
          }
          for (let x = 0; x < res.length; x++) {
            for (let y = 0; y < key.length; y++) {
              if (res[x]['InsName'] === key[y]) {
                data[key[y]].push(res[x])
              }
            }
          }
          console.log(data)
          that.onlydata = data
        }
      })
    },
    // 获取接收耦合台位的单个趋势图
    get_spline_chart_data () {
      console.log(this.onlyStationData)
      var data = this.onlyStationData
      var table = []
      for (let i = 0; i < data.length; i++) {
        var Status = ''
        if (data[i]['Status'] !== 'PASS') {
          Status = '#BF0B23'
        }
        var TestTimeTwo = this.moment(data[i]['TestTime']).format('YYYY-MM-DD HH:mm:ss')
        var testTime = new Date(this.moment(data[i]['TestTime']).format('YYYY-MM-DD HH:mm:ss'))
        var pn = data[i]['Pn']
        var sn = data[i]['Sn']
        var y = Number(data[i]['Rescrt'])
        var worker = data[i]['Worker']
        var workerNum = data[i]['WorkNum']
        table.push({x: Date.UTC(testTime.getFullYear(), testTime.getMonth(), testTime.getDay(), testTime.getHours(), testTime.getMinutes(), testTime.getSeconds()), y: y, color: Status, workernum: workerNum, name: pn, Time: TestTimeTwo, Sn: sn, Worker: worker})
      }
      this.stationLapWeldRateData = table
      this.option1.series[0]['data'] = table
      console.log(this.option1.series[0]['data'])
      Highcharts.chart(this.id1, this.option1)
    },
    // 修改间隔
    change_total () {
      if (this.interval !== 0 && this.interval !== '') {
        this.get_column_chart_data(this.onlyStationData)
      } else {
        this.interval = 10
      }
    },
    // 获取接收耦合台位的单个统计图
    get_column_chart_data (data) {
      var num = this.interval
      var leng = Math.floor(300 / num)
      var dict = []
      for (let i = 0; i <= leng; i++) {
        var key = String(num * i + 150)
        dict.push({'name': key, 'y': 0})
      }
      for (let k = 0; k < data.length; k++) {
        var keys = Math.floor(Number(data[k]['Rescrt']) / num) * num
        for (let m = 0; m < dict.length; m++) {
          if (dict[m]['name'] === String(keys)) {
            dict[m]['y'] += 1
          }
        }
      }
      console.log(dict)
      this.option3.series[0].data = dict
      Highcharts.chart(this.id3, this.option3)
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
    clearInterval(this.timer2)
  },
  data () {
    return {
      stationLapWeldRateData: [],
      onlydata: [],
      onlyStationData: [],
      data: {'接收耦合台位': []},
      keydata: [],
      bad: 0,
      pass: 0,
      passrate: 0,
      station: '',
      opentime: '',
      nexttime: '',
      worknum: '',
      startTime: '',
      endTime: '',
      stroagedata: '',
      interval: 10,
      id1: 'high1',
      id2: 'high2',
      id3: 'high3',
      onlyStationVisible: false,
      option1: {
        chart: {
          type: 'spline',
          zoomType: 'xy'
        },
        title: {
          text: '接收耦合IOP分布图'
        },
        xAxis: {
          type: 'datetime',
          title: {
            text: '时间'
          }
        },
        yAxis: {
          title: {
            text: 'IOP值'
          },
          lineWidth: 1,
          gridLineWidth: 1,
          gridLineColor: 'black',
          minorGridLineWidth: 0.1,
          minorTickInterval: 'auto',
          minorGridLineColor: '#E0E0E0',
          minorTickWidth: 1,
          minorTickLength: 5
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
            return '<b>生产的Sn：' + this.point.Sn + '<br><b>生产的Pn：' + this.point.name + '<b/><br><b>生产时间：' + this.point.Time + '<b/><br><b>员工工号：' + this.point.Worker + '<b/><br><b>工单号：' + this.point.workernum + '<b/><br><b>IOP值：' + this.point.y + '%</b>'
          }
          // headerFormat: '<span>' + this.x + '[{point.x}]</span>',
          // pointFormat: '<br><p>' + data.UpdateReason + '</p>' + '<br><p>修改前：' + data.OldValue + '</p>' + '<br><p>修改后：' + data.NewValue + '</p>'
        },
        series: [{
          name: '接收耦合IOP值',
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
                console.log(localStorage.getItem('changeDataReceiving').split(',')[0])
                console.log(localStorage.getItem('changeDataReceiving').split(',')[1])
                if (localStorage.getItem('changeDataReceiving').split(',')[1] === '') {
                  localStorage.setItem('changeDataReceiving', localStorage.getItem('changeDataReceiving') + e.point.name)
                } else {
                  if (localStorage.getItem('changeDataReceiving').split(',')[1] === e.point.name) {
                    localStorage.setItem('changeDataReceiving', localStorage.getItem('changeDataReceiving').split(',')[0] + ',all')
                  } else {
                    localStorage.setItem('changeDataReceiving', localStorage.getItem('changeDataReceiving').split(',')[0] + ',' + e.point.name)
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
          text: '接收耦合IOP统计图'
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
          name: '接收耦合IOP统计',
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

<style scoped>
body{
  text-align: center;
}
.ReceivingCoupling{
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
.ReceivingCoupling >>>.el-input__inner {
  color: white !important;
  background-color: #545c64 !important;
}
</style>
