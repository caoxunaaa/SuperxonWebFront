<template>
<div class="DynamicWarning" style="background-color: #ffffff;">
  <el-row>
    <el-col :span="12">
        <div style="float:right;width: 110px;height: 62px">
        <div style="width: 110px;height: 16px">
          <div style="float:right;background:#67C23A;width: 50px;height: 15px"></div>
          <p style="margin:0;text-align:left;font-size:10px;color:black">正常: </p>
        </div>
        <div style="width: 110px;height: 16px">
          <div style="float:right;background:darkgray;width: 50px;height: 15px"></div>
        <p style="margin:0;text-align:left;font-size:10px;color:black">未生产: </p>
        </div>
        <div style="width: 110px;height: 15px">
          <div style="float:right;background:rgb(255, 0, 0);width: 25px;height: 15px"></div>
          <div style="float:right;background:rgb(255, 123, 123);width: 25px;height: 15px"></div>
        <p style="margin:0;text-align:left;font-size:10px;color:black">告警: </p>
        </div>
      </div>
      <h3 style="margin: 0px">OLT产线</h3>
      <h5 style="margin: 0px;color: red;">(连续三支不良告警)</h5>
      <el-table
        :data="station_olt_Data_Table_List"
        style="width: 100%;font-size:10px"
        :cell-style="ThreecolumnStyle"
        border
        :header-cell-style="headerStyle">
        <el-table-column
        prop="station"
        fixed
        width="110px"
        label="工位">
      </el-table-column>
        <el-table-column  :label="item.label" :property="item.property" :key="item.index" v-for="item in timelableData" width="15px">
          <template slot-scope="scope">
            {{scope.row[scope.column.property]}}
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</div>
</template>

<script>
export default {
  name: 'DynamicWarningOLTstation',
  mounted () {
    this.get_data()
    this.setTimer()
  },
  methods: {
    // 开启定时器
    setTimer: function () {
      console.log('开起了定时器')
      this.timer = setInterval(() => {
        this.get_data()
      }, 1000 * 60 * 30)
    },
    // 获取数据
    get_data () {
      var time = new Date()
      this.time = this.moment(time).format('YYYY-MM-DD')
      time.setTime(time.getTime() - 3600 * 1000 * 24 * 1)
      this.oldtime = this.moment(time).format('YYYY-MM-DD')
      let that = this
      that.$axios({
        method: 'get',
        url: '/display/product-operation-info/module/warning-view/station-dynamic-warning-monitoring'
      }).then(function (response) {
        const res = response.data
        console.log(response)
        if (res !== null) {
          var station = []
          for (let i = 0; i < res.length; i++) {
            station.push(res[i]['StationId'])
          }
          station = Array.from(new Set(station)).sort()
          // console.log(station)
          // olt产线
          for (let z = 0; z < that.station_olt.length; z++) {
            for (let c = 0; c < station.length; c++) {
              // console.log(station[c].slice(0, 3))
              if (that.station_olt[z] === station[c].slice(0, 3)) {
                that.station_olt_Data.push(station[c])
                station.splice(c, 1)
                c--
              }
            }
          }
          that.station_olt_Data_Table = that.get_table(res, that.station_olt_Data)
          that.station_olt_Data_Table_List = JSON.parse(JSON.stringify(that.onlyData))
          // console.log(that.station_olt_Data_Table)
        }
      })
    },
    get_table (res, station) {
      // 获取所有昨日的数据
      let that = this
      var Data = []
      var olddata = []
      var newdata = []
      for (let n = 0; n < res.length; n++) {
        if (that.moment(res[n]['RecordDate']).format('YYYY-MM-DD') === that.oldtime) {
          olddata.push(res[n])
        } else {
          newdata.push(res[n])
        }
      }
      for (let x = 0; x < station.length; x++) {
        var old = 0
        var now = 0
        var list = []
        for (let e = 0; e < olddata.length; e++) {
          if (station[x] === olddata[e]['StationId']) {
            list = list.concat(olddata[e]['StatisticsEachHour'].split(','))
            old = 1
          }
        }
        if (old === 0) {
          list = list.concat(that.noData)
        }
        for (let r = 0; r < newdata.length; r++) {
          if (station[x] === newdata[r]['StationId']) {
            list = list.concat(newdata[r]['StatisticsEachHour'].split(','))
            now = 1
          }
        }
        if (now === 0) {
          list = list.concat(that.noData)
        }
        Data.push(list)
      }
      that.onlyData = []
      for (let k = 0; k < station.length; k++) {
        var objs = {'station': station[k]}
        for (let y = 0; y < that.timeData.length; y++) {
          objs[that.timeData[y]] = ''
        }
        that.onlyData.push(objs)
      }
      // console.log(that.onlyData)
      // console.log(Data)
      return Data
    },
    // 修改列的颜色
    headerStyle ({row, column, rowIndex, columnIndex}) {
      if (rowIndex === 0) {
        if (columnIndex === 0) {
          return 'background:rgb(84, 92, 100);color:white;'
        } else if (columnIndex <= 24 && columnIndex > 0) {
          return 'background:rgb(84, 92, 100);color:white;'
        } else {
          return 'background:black;color:white;'
        }
      }
    },
    // 修改单元格颜色
    ThreecolumnStyle ({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0) {
        return 'background:rgb(84, 92, 100);color:white;'
      } else {
        if (Number(this.station_olt_Data_Table[rowIndex][columnIndex - 1]) === 0) {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (Number(this.station_olt_Data_Table[rowIndex][columnIndex - 1]) === -1) {
          return 'background-color: darkgray; color: darkgray'
        } else if (Number(this.station_olt_Data_Table[rowIndex][columnIndex - 1]) > 0) {
          if (Number(this.station_olt_Data_Table[rowIndex][columnIndex - 1]) < 10) {
            return 'background-color: rgb(255, 123, 123); color: white;text-align: center;'
          } else if (Number(this.station_olt_Data_Table[rowIndex][columnIndex - 1]) > 20) {
            return 'background-color: rgb(255, 0, 0); color: white;text-align: center;'
          } else {
            return 'background-color: rgb(255, 55, 55); color: white;text-align: center;'
          }
        }
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  data () {
    return {
      hypotheticalData: [],
      timeData: ['minusone', 'minustwo', 'minusthree', 'minusfour', 'minusfive', 'minussix', 'minusseven', 'minuseight', 'minusnine', 'minusten', 'minuseleven', 'minustwelve', 'minusthirteen', 'minusfourteen', 'minusfifteen', 'minussixteen', 'minusseventeen', 'minuseighteen', 'minusnineteen', 'minustwenty', 'minustwentyone', 'minustwentytwo', 'minustwentythree', 'minustwentyfour', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'twentyone', 'twentytwo', 'twentythree', 'twentyfour'],
      timelableData: [{
        label: '',
        property: 'minusone'
      }, {
        label: '',
        property: 'minustwo'
      }, {
        label: '',
        property: 'minusthree'
      }, {
        label: '',
        property: 'minusfour'
      }, {
        label: '',
        property: 'minusfive'
      }, {
        label: '',
        property: 'minussix'
      }, {
        label: '',
        property: 'minusseven'
      }, {
        label: '',
        property: 'minuseight'
      }, {
        label: '',
        property: 'minusnine'
      }, {
        label: '',
        property: 'minusten'
      }, {
        label: '',
        property: 'minuseleven'
      }, {
        label: '',
        property: 'minustwelve'
      }, {
        label: '',
        property: 'minusthirteen'
      }, {
        label: '',
        property: 'minusfourteen'
      }, {
        label: '',
        property: 'minusfifteen'
      }, {
        label: '',
        property: 'minussixteen'
      }, {
        label: '',
        property: 'minusseventeen'
      }, {
        label: '',
        property: 'minuseighteen'
      }, {
        label: '',
        property: 'minusnineteen'
      }, {
        label: '',
        property: 'minustwenty'
      }, {
        label: '',
        property: 'minustwentyone'
      }, {
        label: '',
        property: 'minustwentytwo'
      }, {
        label: '',
        property: 'minustwentythree'
      }, {
        label: '',
        property: 'minustwentyfour'
      }, {
        label: '',
        property: 'one'
      }, {
        label: '',
        property: 'two'
      }, {
        label: '',
        property: 'three'
      }, {
        label: '',
        property: 'four'
      }, {
        label: '',
        property: 'five'
      }, {
        label: '',
        property: 'six'
      }, {
        label: '',
        property: 'seven'
      }, {
        label: '',
        property: 'eight'
      }, {
        label: '',
        property: 'nine'
      }, {
        label: '',
        property: 'ten'
      }, {
        label: '',
        property: 'eleven'
      }, {
        label: '',
        property: 'twelve'
      }, {
        label: '',
        property: 'thirteen'
      }, {
        label: '',
        property: 'fourteen'
      }, {
        label: '',
        property: 'fifteen'
      }, {
        label: '',
        property: 'sixteen'
      }, {
        label: '',
        property: 'seventeen'
      }, {
        label: '',
        property: 'eighteen'
      }, {
        label: '',
        property: 'nineteen'
      }, {
        label: '',
        property: 'twenty'
      }, {
        label: '',
        property: 'twentyone'
      }, {
        label: '',
        property: 'twentytwo'
      }, {
        label: '',
        property: 'twentythree'
      }, {
        label: '',
        property: 'twentyfour'
      }],
      noData: ['-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1'],
      tableHead: [],
      onlyData: [],
      oldtime: '',
      time: '',
      station_10G: ['10G'],
      station_10G_Data: [],
      station_10G_Data_Table: [],
      station_10G_Data_Table_List: [],
      station_osa: ['OSA', 'TC1'],
      station_osa_Data: [],
      station_osa_Data_Table: [],
      station_osa_Data_Table_List: [],
      station_olt: ['OLT'],
      station_olt_Data: [],
      station_olt_Data_Table: [],
      station_olt_Data_Table_List: [],
      station_other: [],
      station_other_Data: [],
      station_other_Data_Table: [],
      station_other_Data_Table_List: []
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.DynamicWarning >>>.el-table td{
  padding: 0px !important
}
.DynamicWarning >>>.el-table th{
  padding: 0px !important
}
.el-table >>> .cell {
  padding: 0px;
  line-height: normal;
  font-size: 2px;
}
</style>
