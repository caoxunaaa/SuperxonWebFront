<template>
<div class="DynamicWarning" style="background-color: #ffffff;">
  <div v-if="isPc">
    <div style="float:right;width: 110px;height: 62px">
      <div style="width: 110px;height: 21px">
        <div style="float:right;background:#67C23A;width: 50px;height: 20px"></div>
        <p style="margin:0;text-align:left;font-size:15px;color:black">正常: </p>
      </div>
      <div style="width: 110px;height: 21px">
        <div style="float:right;background:darkgray;width: 50px;height: 20px"></div>
      <p style="margin:0;text-align:left;font-size:15px;color:black">未生产: </p>
      </div>
      <div style="width: 110px;height: 20px">
        <button @click="only_warning" style="float:right;background:red;width: 50px;height: 20px;border:0px"></button>
      <p style="margin:0;text-align:left;font-size:15px;color:black">告警: </p>
      </div>
    </div>
    <div><h1>{{oldtime}}至{{time}}工位动态告警</h1></div>
  <el-table
      :data="onlyData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%;font-size:10px"
      :cell-style="columnStyle"
      border
      :header-cell-style="headerStyle">
      <el-table-column
      prop="StationId"
      fixed
      width="110px"
      label="工位">
    </el-table-column>
      <el-table-column  :label="item.label" :property="item.property" :key="item.index" v-for="item in tableHead">
        <template slot-scope="scope">
          {{scope.row[scope.column.property]}}
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination align='center'
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[15]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="onlyData.length">
      </el-pagination>
    </div>
  </div>
  <div v-if="bigPc">
    <div style="float:right;width: 210px;height: 92px;margin-right: 150px">
      <div style="width: 210px;height: 31px">
        <div style="float:right;background:#67C23A;width: 100px;height: 30px"></div>
        <p style="margin:0;text-align:left;font-size:20px;color:black">正常: </p>
      </div>
      <div style="width: 210px;height: 31px">
        <div style="float:right;background:darkgray;width: 100px;height: 30px"></div>
      <p style="margin:0;text-align:left;font-size:20px;color:black">未生产: </p>
      </div>
      <div style="width: 210px;height: 30px">
        <button @click="only_warning" style="float:right;background:red;width: 100px;height: 30px;border:0px"></button>
      <p style="margin:0;text-align:left;font-size:20px;color:black">告警: </p>
      </div>
    </div>
    <div><h1 style="font-size: 50px">{{oldtime}}至{{time}}工位动态告警</h1></div>
    <el-table
      :data="onlyData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%;font-size:24px"
      :cell-style="columnStyle"
      :row-style="{height: '70px'}"
      border
      :header-cell-style="headerStyle">
      <el-table-column
      prop="StationId"
      fixed
      width="210px"
      label="工位">
    </el-table-column>
      <el-table-column  :label="item.label" :property="item.property" :key="item.index" v-for="item in tableHead">
        <template slot-scope="scope">
          {{scope.row[scope.column.property]}}
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination align='center'
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[15]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="onlyData.length">
      </el-pagination>
    </div>
  </div>
  <!-- <div>
    <el-table
      :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%"
      :cell-style="columnStyle"
      border
      :header-cell-style="headerStyle">
      <el-table-column  :label="item.label" :property="item.property" :key="item.index" v-for="item in tableHead">
        <template slot-scope="scope">
          {{scope.row[scope.column.property]}}
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination align='center'
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[15]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.length">
      </el-pagination>
    </div>
  </div> -->
</div>
</template>

<script>
export default {
  name: 'DynamicWarning',
  methods: {
    // 点击告警按钮查看告警的信息
    only_warning () {
      if (this.timerwarning === true) {
        console.log('停止自动换页')
        this.timerwarning = false
        this.onlyData = this.warningData
        this.currentPage = 1
        clearInterval(this.timerTwo)
      } else if (this.timerwarning === false) {
        console.log('现在继续自动换页')
        this.onlyData = this.tableData
        this.timerwarning = true
        this.currentPage = 1
        this.setTimerTwo()
      }
    },
    // 加载页面时获取当前屏幕的尺寸
    getScreen () {
      let that = this
      window.onresize = () => {
        window.screenWidth = document.body.clientWidth
        that.screenWidth = window.screenWidth
        console.log(that.screenWidth)
      }
      console.log(that.screenWidth)
      console.log(typeof (that.screenWidth))
      if (that.screenWidth < 600) {
        that.isPc = false
        that.bigPc = false
        that.pageSize = 15
      } else if (that.screenWidth > 3000) {
        that.isPc = false
        that.bigPc = true
        that.pageSize = 25
        console.log('大屏幕')
      }
    },
    // 每页多少条
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pageSize = val
    },
    // 当前页
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.currentPage = val
    },
    // 开启定时器，自动换页
    setTimerTwo: function () {
      // clearInterval(this.timerTwo)
      this.timerTwo = setInterval(() => {
        console.log(this.currentPage)
        this.currentPage++
        if (this.currentPage >= (this.onlyData.length / this.pageSize) + 1) {
          this.currentPage = 1
        }
        this.timerwarning = true
      }, 15 * 1000)
    },
    // 开启定时器
    setTimer: function () {
      console.log('开起了定时器')
      this.timer = setInterval(() => {
        this.get_time()
        this.get_data()
      }, 1000 * 60 * 20)
    },
    // 获取当前时间
    get_time () {
      this.time = ''
      this.oldtime = ''
      this.newdata = 0
      this.tableHead = []
      var time = new Date()
      this.time = this.moment(time).format('YYYY-MM-DD')
      time.setTime(time.getTime() - 3600 * 1000 * 24 * 1)
      this.oldtime = this.moment(time).format('YYYY-MM-DD')
      console.log(this.time)
      console.log(this.oldtime)
      this.newdata = new Date().getHours()
      console.log(this.newdata)
      console.log(typeof (this.newdata))
      console.log(this.timelableData)
      // this.tableHead.push({label: '工位', property: 'StationId'})
      for (let i = this.newdata; i < this.timelableData.length; i++) {
        if (i < (24 + this.newdata)) {
          this.tableHead.push(this.timelableData[i])
        }
      }
      console.log(this.tableHead)
      // console.log(this.data)
      // console.log(this.table)
      // console.log(this.table[0]['st_each'].split(','))
      // for (let i = 0; i < this.table[0]['st_each'].split(',').length; i++) {
      //   this.tableData.push({i: this.table[0]['st_each'].split(',')[i]})
      // }
      // console.log(this.tableData)
    },
    // 获取数据
    get_data () {
      let that = this
      clearInterval(that.timerTwo)
      that.currentPage = 1
      that.table = []
      that.data = []
      that.tableData = []
      that.warningData = []
      that.$axios({
        method: 'get',
        url: '/display/product-operation-info/module/warning-view/station-dynamic-warning-monitoring'
      }).then(function (response) {
        const res = response.data
        console.log(res)
        if (res !== null) {
          that.table = res
          // for (let a = 0; a < that.table.length; a++) {
          //   that.StationIdData.push(that.table[a]['StationId'])
          // }
          // console.log(that.StationIdData)
          for (let s = 0; s < that.table.length; s++) {
            if (that.moment(that.table[s]['RecordDate']).format('YYYY-MM-DD') !== that.time) {
              // console.log('昨天')
              that.data.push(that.table[s])
            }
          }
          for (let r = 0; r < that.data.length; r++) {
            that.data[r]['StatisticsEachHour'] += ','
          }
          for (let w = 0; w < that.table.length; w++) {
            if (that.moment(that.table[w]['RecordDate']).format('YYYY-MM-DD') === that.time) {
              for (let e = 0; e < that.data.length; e++) {
                if (that.table[w]['StationId'] === that.data[e]['StationId']) {
                  that.data[e]['StatisticsEachHour'] += that.table[w]['StatisticsEachHour']
                }
              }
            }
          }
          for (let v = 0; v < that.data.length; v++) {
            if (Number(that.data[v]['StatisticsEachHour'].split(',').length) !== 48) {
              that.data[v]['StatisticsEachHour'] = that.data[v]['StatisticsEachHour'] + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1'
              // console.log(that.data[v])
            }
          }
          for (let f = 0; f < that.data.length; f++) {
            for (let c = 0; c < that.table.length; c++) {
              if (that.data[f]['StationId'] === that.table[c]['StationId']) {
                that.table.splice(c, 1)
                c--
              }
            }
          }
          // console.log(that.table)
          for (let p = 0; p < that.table.length; p++) {
            that.table[p]['StatisticsEachHour'] = '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + '-1,' + that.table[p]['StatisticsEachHour']
            that.data.push(that.table[p])
          }
          // for (let kk = 0; kk < that.data.length; kk++) {
          //   console.log(Number(that.data[kk]['StatisticsEachHour'].split(',').length))
          //   // console.log(that.data[kk]['StatisticsEachHour'].split(','))
          // }
          for (let i = 0; i < that.data.length; i++) {
            // console.log(that.data[i]['StatisticsEachHour'])
            if (that.data[i]['StatisticsEachHour'].length !== 0) {
              // console.log(that.data[i]['StatisticsEachHour'].split(','))
              for (let y = 0; y < that.data[i]['StatisticsEachHour'].split(',').length; y++) {
                // console.log(that.data[i]['StatisticsEachHour'].split(',')[y])
                for (let x = 0; x < that.timeData.length; x++) {
                  if (x === y) {
                    that.data[i][that.timeData[x]] = that.data[i]['StatisticsEachHour'].split(',')[y]
                  }
                }
              }
            }
          }
          // console.log(that.data)
          for (let k = 0; k < that.data.length; k++) {
            that.tableData.push(that.data[k])
          }
          console.log(that.tableData)
          that.onlyData = that.tableData
          console.log(that.warningData)
          for (let n = 0; n < that.tableData.length; n++) {
            that.tableData[n]['StatisticsEachHour'].split(',')
            for (let m = that.newdata; m < that.tableData[n]['StatisticsEachHour'].split(',').length; m++) {
              if (Number((that.tableData[n]['StatisticsEachHour'].split(','))[m]) > 0) {
                that.warningData.push(that.tableData[n])
                break
              }
            }
            console.log(typeof (that.tableData[n]['StatisticsEachHour']))
          }
          console.log(that.warningData)
          that.setTimerTwo()
        }
      })
    },
    // 修改列的颜色
    headerStyle ({row, column, rowIndex, columnIndex}) {
      // console.log(rowIndex)
      if (rowIndex === 0) {
        if (columnIndex === 0) {
          return 'background:rgb(84, 92, 100);color:white;'
        } else if (columnIndex <= 24 && columnIndex > 0) {
          return 'background:rgb(84, 92, 100);color:white;'
        } else {
          return 'background:black;color:white'
        }
      }
    },
    // 修改单元格颜色
    columnStyle ({row, column, rowIndex, columnIndex}) {
      // console.log(typeof (row.name))
      // console.log(column.property)
      // console.log(rowIndex)
      // console.log(columnIndex)
      if (columnIndex === 0) {
        // var err = document.getElementsByClassName('el-table_1_column_1')
        // for (let ot = 0; ot < err.length; ot++) {
        //   document.getElementsByClassName('el-table_1_column_1')[ot].clientWidth = 120
        //   console.log(typeof (err[ot].clientWidth))
        // }
        // console.log(document.getElementsByClassName('el-table_1_column_1'))
        return 'background:rgb(84, 92, 100);color:white;'
      }
      // if (column.property = 'one') {
      //   return 'background-color: #67C23A; color: #67C23A'
      // }
      if (columnIndex === 1) {
        // console.log(row)
        // console.log(column.property)
        // var tt = column.property
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 2) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 3) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 4) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 5) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 6) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 7) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 8) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 9) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 10) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 11) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 12) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 13) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 14) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 15) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 16) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 17) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 18) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 19) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 20) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 21) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 22) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 23) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 24) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 25) {
        // console.log(row)
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 26) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 27) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 28) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 29) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 30) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color:white;text-align: center;'
        }
      }
      if (columnIndex === 31) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 32) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 33) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 34) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 35) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 36) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 37) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 38) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 39) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 40) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 41) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 42) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 43) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 44) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 45) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 46) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 47) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
      if (columnIndex === 48) {
        if (row[column.property] === '0') {
          return 'background-color: #67C23A; color: #67C23A'
        } else if (row[column.property] === '-1') {
          return 'background-color: darkgray; color: darkgray'
        } else {
          return 'background-color: red; color: white;text-align: center;'
        }
      }
    }
  },
  mounted () {
    this.getScreen()
    this.get_time()
    this.get_data()
    this.setTimer()
  },
  beforeDestroy () {
    clearInterval(this.timer)
    clearInterval(this.timerTwo)
  },
  data () {
    return {
      tableHead: [], // 表头数据
      currentPage: 1,
      pageSize: 15,
      time: '',
      oldtime: '',
      // StationIdData: [],
      timeData: ['minusone', 'minustwo', 'minusthree', 'minusfour', 'minusfive', 'minussix', 'minusseven', 'minuseight', 'minusnine', 'minusten', 'minuseleven', 'minustwelve', 'minusthirteen', 'minusfourteen', 'minusfifteen', 'minussixteen', 'minusseventeen', 'minuseighteen', 'minusnineteen', 'minustwenty', 'minustwentyone', 'minustwentytwo', 'minustwentythree', 'minustwentyfour', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'twentyone', 'twentytwo', 'twentythree', 'twentyfour'],
      timelableData: [{
        label: '昨日 1:00',
        property: 'minusone'
      }, {
        label: '昨日 2:00',
        property: 'minustwo'
      }, {
        label: '昨日 3:00',
        property: 'minusthree'
      }, {
        label: '昨日 4:00',
        property: 'minusfour'
      }, {
        label: '昨日 5:00',
        property: 'minusfive'
      }, {
        label: '昨日 6:00',
        property: 'minussix'
      }, {
        label: '昨日 7:00',
        property: 'minusseven'
      }, {
        label: '昨日 8:00',
        property: 'minuseight'
      }, {
        label: '昨日 9:00',
        property: 'minusnine'
      }, {
        label: '昨日 10:00',
        property: 'minusten'
      }, {
        label: '昨日 11:00',
        property: 'minuseleven'
      }, {
        label: '昨日 12:00',
        property: 'minustwelve'
      }, {
        label: '昨日 13:00',
        property: 'minusthirteen'
      }, {
        label: '昨日 14:00',
        property: 'minusfourteen'
      }, {
        label: '昨日 15:00',
        property: 'minusfifteen'
      }, {
        label: '昨日 16:00',
        property: 'minussixteen'
      }, {
        label: '昨日 17:00',
        property: 'minusseventeen'
      }, {
        label: '昨日 18:00',
        property: 'minuseighteen'
      }, {
        label: '昨日 19:00',
        property: 'minusnineteen'
      }, {
        label: '昨日 20:00',
        property: 'minustwenty'
      }, {
        label: '昨日 21:00',
        property: 'minustwentyone'
      }, {
        label: '昨日 22:00',
        property: 'minustwentytwo'
      }, {
        label: '昨日 23:00',
        property: 'minustwentythree'
      }, {
        label: '昨日 24:00',
        property: 'minustwentyfour'
      }, {
        label: '今日 1:00',
        property: 'one'
      }, {
        label: '今日 2:00',
        property: 'two'
      }, {
        label: '今日 3:00',
        property: 'three'
      }, {
        label: '今日 4:00',
        property: 'four'
      }, {
        label: '今日 5:00',
        property: 'five'
      }, {
        label: '今日 6:00',
        property: 'six'
      }, {
        label: '今日 7:00',
        property: 'seven'
      }, {
        label: '今日 8:00',
        property: 'eight'
      }, {
        label: '今日 9:00',
        property: 'nine'
      }, {
        label: '今日 10:00',
        property: 'ten'
      }, {
        label: '今日 11:00',
        property: 'eleven'
      }, {
        label: '今日 12:00',
        property: 'twelve'
      }, {
        label: '今日 13:00',
        property: 'thirteen'
      }, {
        label: '今日 14:00',
        property: 'fourteen'
      }, {
        label: '今日 15:00',
        property: 'fifteen'
      }, {
        label: '今日 16:00',
        property: 'sixteen'
      }, {
        label: '今日 17:00',
        property: 'seventeen'
      }, {
        label: '今日 18:00',
        property: 'eighteen'
      }, {
        label: '今日 19:00',
        property: 'nineteen'
      }, {
        label: '今日 20:00',
        property: 'twenty'
      }, {
        label: '今日 21:00',
        property: 'twentyone'
      }, {
        label: '今日 22:00',
        property: 'twentytwo'
      }, {
        label: '今日 23:00',
        property: 'twentythree'
      }, {
        label: '今日 24:00',
        property: 'twentyfour'
      }],
      newdata: 0,
      table: [],
      tableData: [],
      onlyData: [],
      warningData: [],
      data: [],
      isPc: true,
      bigPc: false,
      timerwarning: false,
      screenWidth: document.body.clientWidth
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
*{
  color:darkgray;
}
/* .el-table >>> .cell, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
  padding: 2px !important;
} */
.el-table >>> th.gutter{
  display: table-cell !important;
}
.el-table >>> th>.cell {
  padding-left: 5px !important;
  padding-right: 5px !important;
}
</style>
