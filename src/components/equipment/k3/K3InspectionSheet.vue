<template>
  <div class="K3InspectionSheet">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-date-picker
          style="width: 100%"
          v-model="valuetime"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right">
        </el-date-picker>
      </el-col>
      <el-col :span="4">
        <el-select v-model="fNumber" filterable clearable placeholder="请选择物料代码" @visible-change="select_visiblechange">
          <el-option
            v-for="item in optionsSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <!-- <el-input
        placeholder="请输入物料代码"
        @change="get_k3_ICQC"
        v-model="fNumber"
        clearable>
        </el-input> -->
      </el-col>
      <el-col :span="4">
        <el-input
        placeholder="请输入物料单号"
        @change="get_k3_ICQC"
        v-model="fBillNo"
        clearable>
        </el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="text" @click="get_k3_ICQC" icon="el-icon-search" style="background-color: #409eff; color: #fff; height: 100%; width:100%;">搜索</el-button>
      </el-col>
      <el-col :span="2">
        <download-excel
          style="width: 170px"
          class = "export-excel-wrapper"
          :data = "checkTableData"
          name = "K3入库检验信息excel表格.xls">
          <el-button type="primary" style="width: 170px" :disabled="disabled"><i class="el-icon-download"></i>导出入库检验数据</el-button>
        </download-excel>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <el-table
          :data="checkTableData"
          border
          ref="singleTable"
          highlight-current-row
          :row-style="{height: '10px', padding: '0px'}"
          @row-click="get_row_data"
          @selection-change="handleSelectionChange"
          height="460px"
          style="width: 100%">
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="FDate"
            width="160"
            label="入库检验时间">
          </el-table-column>
          <el-table-column
            prop="FNumber"
            width="120"
            label="物料代码">
          </el-table-column>
          <el-table-column
            prop="FBillNo"
            width="100"
            label="物料单号">
          </el-table-column>
          <el-table-column
            prop="FName"
            label="物料名称"
            width="200"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            prop="FTargetText"
            width="120"
            label="目标值"
            sortable>
          </el-table-column>
          <el-table-column
            prop="FTestValueText"
            label="检验值"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <div style="height:40px;background:rgb(84, 92, 100);">
            <span style="color:white">下限值：</span>
            <el-input
              placeholder="请输入"
              v-model="averageDowbound"
              style="width:18%"
              clearable>
            </el-input>
            <span style="color:white">上限值：</span>
            <el-input
              placeholder="请输入"
              v-model="averageUpbound"
              style="width:18%"
              clearable>
            </el-input>
            <el-button type="text" @click="get_average_charts" style="background-color: #409eff; color: #fff; height: 100%; width:10%;">确定</el-button>
          </div>
        <div style="height:400px;background:rgb(84, 92, 100);border:1px solid #909399">
          <Charts :id="id4" class="high" :option="option4"></Charts>
        </div>
      </el-col>
      <el-col :span="12">
        <div style="height:40px;background:rgb(84, 92, 100);">
            <span style="color:white">下限值：</span>
            <el-input
              placeholder="请输入"
              v-model="rangeDowbound"
              style="width:18%"
              clearable>
            </el-input>
            <span style="color:white">上限值：</span>
            <el-input
              placeholder="请输入"
              v-model="rangeUpbound"
              style="width:18%"
              clearable>
            </el-input>
            <el-button type="text" @click="get_range_charts" style="background-color: #409eff; color: #fff; height: 100%; width:10%;">确定</el-button>
          </div>
      <div style="height:400px;background:rgb(84, 92, 100);border:1px solid #909399">
          <Charts :id="id5" class="high" :option="option5"></Charts>
        </div>
      </el-col>
    </el-row>
    <el-dialog
    top="550px"
    :visible.sync="DialogVisible"
    :close-on-click-modal='false'
    width="100%">
      <el-row :gutter="10">
        <el-col :span="8">
          <div style="height:40px;background:rgb(84, 92, 100);">
            <span style="color:white">下限值：</span>
            <el-input
              placeholder="请输入"
              v-model="Dowbound"
              @change="change_bound_chart"
              style="width:18%"
              clearable>
            </el-input>
            <span style="color:white">上限值：</span>
            <el-input
              placeholder="请输入"
              v-model="Upbound"
              @change="change_bound_chart"
              style="width:18%"
              clearable>
            </el-input>
            <el-button type="text" @click="change_bound_chart" style="background-color: #409eff; color: #fff; height: 100%; width:10%;">确定</el-button>
          </div>
          <div style="height:400px;background:rgb(84, 92, 100);border:1px solid #909399">
            <Charts :id="id1" class="high" :option="option1"></Charts>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="height:40px;background:rgb(84, 92, 100);"></div>
          <div style="height:40px;background:rgb(84, 92, 100)">
            <div style="height:400px;border:1px solid #909399">
              <Charts :id="id3" class="high" :option="option3"></Charts>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="height:40px;background:rgb(84, 92, 100)">
            <span style="color:white">间隔值：</span>
            <el-input
            placeholder="请输入间隔"
            v-model="interval"
            @change="change_interval_chart"
            style="width:18%"
            clearable>
            </el-input>
            <el-button type="text" @click="change_interval_chart" style="background-color: #409eff; color: #fff; height: 100%; width:10%;">确定</el-button>
          </div>
          <div style="height:400px;border:1px solid #909399">
            <Charts :id="id2" class="high" :option="option2"></Charts>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import Charts from '@/components/chart/Chart'
import Highcharts from 'highcharts'
export default {
  name: 'K3InspectionSheet',
  components: {
    Charts
  },
  mounted () {
  },
  watch: {
    checkTableData: {
      handler (newVal, oldVal) {
        if (this.checkTableData.length !== 0) {
          this.disabled = false
        } else {
          this.disabled = true
        }
      }
    }
  },
  methods: {
    // 获取搜索框中的数据
    select_visiblechange (bool) {
      if (bool === true) {
        let that = this
        var start = that.moment(that.valuetime[0]).format('YYYY-MM-DD HH:mm:ss')
        var end = that.moment(that.valuetime[1]).format('YYYY-MM-DD HH:mm:ss')
        that.$axios({
          url: '/display/k3-system-relation/ICQC-number-by-date',
          method: 'get',
          params: {
            startTime: start,
            endTime: end
          }
        }).then(function (response) {
          console.log(response)
          const res = response.data
          if (res !== null) {
            var list = []
            for (let i = 0; i < res.length; i++) {
              if (res[i].split('.')[0] !== '01' && res[i].split('.')[0] !== '02') {
                list.push({
                  label: res[i],
                  value: res[i]
                })
              }
            }
            that.optionsSelect = list
          }
        }).catch(function (error) {
          console.log(error)
        })
      }
    },
    // 多选获取一行的数据
    handleSelectionChange (val) {
      if (this.checkTableData.length === val.length) {
        // 全选的情况
      } else if (val.length === 0) {
        // 全不选的情况
        console.log(val)
        this.option5.series[0].data = []
        this.option4.yAxis.min = 0
        this.option4.xAxis.title.text = ''
        this.option4.yAxis.max = null
        this.option5.yAxis.min = 0
        this.option5.yAxis.max = null
        this.option4.series[0].data = []
        this.option5.xAxis.categories = []
        this.option4.xAxis.categories = []
        Highcharts.chart(this.id5, this.option5)
        Highcharts.chart(this.id4, this.option4)
      } else {
        this.multipleSelection = val
        console.log(val)
        this.get_average()
      }
    },
    get_average () {
      if (this.multipleSelection.length !== 0) {
        var data = JSON.parse(JSON.stringify(this.multipleSelection))
        for (let i = 0; i < data.length; i++) {
          console.log(data[i]['FTestValueText'])
          if (data[i]['FTestValueText'] === '') {
            data.splice(i, 1)
          }
        }
        for (let n = 0; n < data.length - 1; n++) {
          for (let m = 0; m < data.length - n - 1; m++) {
            if (Date.parse(data[m]['FDate']) > Date.parse(data[m + 1]['FDate'])) {
              let num = data[m]
              data[m] = data[m + 1]
              data[m + 1] = num
            }
          }
        }
        var rangedata = []
        var xdata = []
        var timedata = []
        for (let k = 0; k < data.length; k++) {
          var sliceData = data[k]['FTestValueText'].split(' ')
          var all = 0
          for (let j = 0; j < sliceData.length; j++) {
            if (sliceData[j] !== '') {
              all += Number(sliceData[j])
            }
          }
          var onlyrange = []
          for (let w = 0; w < sliceData.length; w++) {
            if (sliceData[w] !== '') {
              onlyrange.push(Number(sliceData[w]))
            }
          }
          console.log(onlyrange)
          var range = (Math.max(...onlyrange)) - Number(Math.min(...onlyrange))
          console.log(Math.max(...onlyrange))
          console.log(range)
          rangedata.push(Number(range.toFixed(3)))
          timedata.push(data[k]['FDate'].slice(0, 10))
          console.log(all)
          console.log(sliceData)
          for (let t = 0; t < sliceData.length; t++) {
            if (sliceData[t] === '') {
              sliceData.splice(t, 1)
              t--
            }
          }
          console.log(sliceData)
          xdata.push(Number((all / sliceData.length).toFixed(3)))
        }
        var judgment = false
        if (/[A-Za-z\u4e00-\u9fa5]/.test(data[0]['FTargetText']) === false) {
          if (/±/.test(data[0]['FTargetText']) === true) {
            console.log('包含±号')
            console.log(data[0]['FTargetText'].split('±'))
            judgment = true
          }
          console.log('不包含中英文')
        }
        if (judgment === true) {
          this.averageDowbound = Number(data[0]['FTargetText'].split('±')[0]) - Number(data[0]['FTargetText'].split('±')[1])
          this.averageUpbound = Number(data[0]['FTargetText'].split('±')[0]) + Number(data[0]['FTargetText'].split('±')[1])
        } else {
          this.averageDowbound = String(Math.min(...xdata))
          this.averageUpbound = String(Math.max(...xdata))
        }
        this.rangeDowbound = String(Math.min(...rangedata))
        this.rangeUpbound = String(Math.max(...rangedata))
        console.log(xdata)
        console.log(rangedata)
        this.option5.series[0].data = rangedata
        this.option4.xAxis.title.text = '目标值——' + data[0]['FTargetText']
        this.option4.yAxis.min = Number(this.averageDowbound)
        this.option4.yAxis.max = Number(this.averageUpbound)
        this.option5.yAxis.min = Number(this.rangeDowbound)
        this.option5.yAxis.max = Number(this.rangeUpbound)
        this.option4.series[0].data = xdata
        this.option5.xAxis.categories = timedata
        this.option4.xAxis.categories = timedata
        Highcharts.chart(this.id5, this.option5)
        Highcharts.chart(this.id4, this.option4)
        console.log(data)
      }
    },
    get_average_charts () {
      this.option4.yAxis.min = Number(this.averageDowbound)
      this.option4.yAxis.max = Number(this.averageUpbound)
      Highcharts.chart(this.id4, this.option4)
    },
    get_range_charts () {
      this.option5.yAxis.min = Number(this.rangeDowbound)
      this.option5.yAxis.max = Number(this.rangeUpbound)
      Highcharts.chart(this.id5, this.option5)
    },
    // 修改选择项的表头
    // cellClass (row) {
    //   if (row.columnIndex === 7) {
    //     return 'disabledCheck'
    //   }
    // },
    // 获取k3中的数据
    get_k3_ICQC () {
      // this.option1.title.text = ''
      // this.option2.title.text = ''
      // this.option1.subtitle.text = ''
      // this.option2.subtitle.text = ''
      // this.option1.xAxis.title.text = ''
      // this.option2.xAxis.title.text = ''
      // this.option1.series[0].data = []
      // this.option2.series[0].data = []
      // this.option2.xAxis.categories = []
      // Highcharts.chart(this.id1, this.option1)
      // Highcharts.chart(this.id2, this.option2)
      let that = this
      var number = that.fNumber.split(',')[0]
      var start = that.moment(that.valuetime[0]).format('YYYY-MM-DD HH:mm:ss')
      var end = that.moment(that.valuetime[1]).format('YYYY-MM-DD HH:mm:ss')
      that.$axios({
        url: '/display/k3-system-relation/ICQC-bill-entry-order',
        method: 'get',
        params: {
          startTime: start,
          endTime: end,
          fNumber: number,
          fBillNo: that.fBillNo
        }
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null) {
          for (let i = 0; i < res.length; i++) {
            res[i]['FDate'] = res[i]['FDate'].split('T')[0].concat(' ' + res[i]['FDate'].split('T')[1])
            res[i]['FDate'] = res[i]['FDate'].split('Z')[0].concat(res[i]['FDate'].split('Z')[1])
          }
          that.checkTableData = res
        }
      })
    },
    // 点击某一行的数据作图
    get_row_data (row) {
      this.$refs.singleTable.setCurrentRow(row)
      var symbolicJudgment = false
      if (row['FTargetText'] !== '') {
        console.log(row['FTargetText'])
        if (/[A-Za-z\u4e00-\u9fa5]/.test(row['FTargetText']) === false) {
          if (/±/.test(row['FTargetText']) === true) {
            console.log('包含±号')
            console.log(row['FTargetText'].split('±'))
            symbolicJudgment = true
          }
          console.log('不包含中英文')
        }
        // console.log(row['FTestValueText'].split(' '))
        this.DialogVisible = true
        var sliceData = row['FTestValueText'].split(' ')
        this.chartDataOne = []
        var chartDataTwo = []
        for (let i = 0; i < sliceData.length; i++) {
          if (sliceData[i] !== '') {
            this.chartDataOne.push(Number(sliceData[i]))
            chartDataTwo.push(Number(sliceData[i]))
          }
        }
        for (let m = 0; m < chartDataTwo.length - 1; m++) {
          for (let n = 0; n < chartDataTwo.length - m - 1; n++) {
            if (chartDataTwo[n] > chartDataTwo[n + 1]) {
              var num = chartDataTwo[n]
              chartDataTwo[n] = chartDataTwo[n + 1]
              chartDataTwo[n + 1] = num
            }
          }
        }
        this.rowData = row
        this.intervalData = chartDataTwo
        if (symbolicJudgment === true) {
          this.Dowbound = Number(row['FTargetText'].split('±')[0]) - Number(row['FTargetText'].split('±')[1])
          this.Upbound = Number(row['FTargetText'].split('±')[0]) + Number(row['FTargetText'].split('±')[1])
        } else {
          this.Dowbound = this.intervalData[0]
          this.Upbound = this.intervalData[this.intervalData.length - 1]
        }
        // var min = this.intervalData[0]
        // var max = this.intervalData[this.intervalData.length - 1]
        this.$nextTick(() => {
          this.change_bound_chart()
          this.change_interval_chart()
        })
      } else {
        this.$message({
          type: 'warning',
          message: '暂无展示数据！'
        })
        // this.option1.title.text = ''
        // this.option1.subtitle.text = ''
        // this.option2.subtitle.text = ''
        // this.option1.xAxis.title.text = ''
        // this.option2.xAxis.title.text = ''
        // this.option1.series[0].data = []
        // this.option2.series[0].data = []
        // this.option2.xAxis.categories = []
        // Highcharts.chart(this.id1, this.option1)
        // Highcharts.chart(this.id2, this.option2)
      }
    },
    // 折线图
    change_bound_chart () {
      if (this.rowData.length !== 0) {
        console.log(this.rowData)
        console.log(this.chartDataOne)
        if (this.Upbound.length !== 0 && this.Dowbound.length !== 0) {
          if (this.Upbound > this.Dowbound) {
            this.option1.title.text = this.rowData['FName'] + ' ' + this.rowData['FBillNo'] + ' ' + this.rowData['FNumber']
            this.option1.subtitle.text = this.rowData['FDate']
            this.option1.xAxis.title.text = '目标值——' + this.rowData['FTargetText']
            this.option1.yAxis.min = this.Dowbound
            this.option1.yAxis.max = this.Upbound
            // console.log(this.option2.yAxis.max)
            var num = 0
            for (let i = 0; i < this.chartDataOne.length; i++) {
              num = num + Number(this.chartDataOne[i])
            }
            num = (num / this.chartDataOne.length)
            console.log(num)
            console.log(this.chartDataOne)
            // this.option1.yAxis.plotLines[0].label.text = '均值：' + String(num.toFixed(3))
            // this.option1.yAxis.plotLines[0].value = num
            // this.option1.yAxis.plotLines[1].value = this.Upbound
            // this.option1.yAxis.plotLines[2].value = this.Dowbound
            this.option1.series[0].data = this.chartDataOne
            var data = []
            var R = num
            for (let n = 0; n < this.chartDataOne.length; n++) {
              data.push(Number(Math.abs(this.chartDataOne[n] - R).toFixed(3)))
            }
            var sum = 0
            for (let i = 0; i < data.length; i++) {
              sum = sum + Number(data[i])
            }
            sum = (sum / data.length)
            console.log(sum)
            console.log(data)
            this.option3.yAxis.plotLines[0].label.text = '均值：' + String(sum.toFixed(3))
            this.option3.yAxis.plotLines[0].value = sum
            this.option3.series[0].data = data
            console.log('ok')
            Highcharts.chart(this.id1, this.option1)
            Highcharts.chart(this.id3, this.option3)
            console.log('ok')
          } else {
            this.$message({
              type: 'error',
              message: '请输入正确的上下限值！'
            })
          }
        } else {
          this.$message({
            type: 'error',
            message: '请输入上下限！'
          })
        }
      } else {
        this.$message({
          type: 'error',
          message: '请先选择查看的数据的行！'
        })
      }
    },
    // 正态分布图
    change_interval_chart () {
      if (this.intervalData.length !== 0) {
        // console.log(this.intervalData)
        if (this.interval !== '') {
          // console.log(this.interval)
          // console.log(Math.max.apply(null, this.intervalData))
          // console.log(Math.min.apply(null, this.intervalData))
          var min = Math.min.apply(null, this.intervalData)
          var max = Math.max.apply(null, this.intervalData) + Number(this.interval)
          var len = Math.ceil((max - min) / Number(this.interval))
          // console.log(len)
          var chartlistxAxis = []
          var chartlistyAxis = []
          for (let i = 1; i < len + 1; i++) {
            var x = Number((min + Number(this.interval) * (i - 1)).toFixed(3))
            var y = Number((min + Number(this.interval) * i).toFixed(3))
            // var frequency = 0
            // console.log(x, y)
            var list = {}
            list[x] = 0
            // console.log(list)
            for (let j = 0; j < this.intervalData.length; j++) {
              if (this.intervalData[j] >= x && this.intervalData[j] < y) {
                list[x] += 1
              }
            }
            // console.log(list)
            chartlistxAxis.push(x)
            chartlistyAxis.push(list[x])
          }
          chartlistxAxis.push(Number((min + Number(this.interval) * len).toFixed(3)))
          // console.log(chartlistxAxis)
          // console.log(chartlistyAxis)
          this.option2.xAxis.categories = chartlistxAxis
          this.option2.series[0].data = chartlistyAxis
          Highcharts.chart(this.id2, this.option2)
          // if (min + Number(this.interval) < max) {
          //   for (let i = 0; i < )
          // }
        } else {
          this.$message({
            type: 'error',
            message: '请输入间隔值！'
          })
        }
      } else {
        this.$message({
          type: 'error',
          message: '请先选择查看的数据的行！'
        })
      }
    }
  },
  data () {
    return {
      DialogVisible: false,
      disabled: true,
      id1: 'high1',
      id2: 'high2',
      id3: 'high3',
      id4: 'high4',
      id5: 'high5',
      interval: '0.05',
      averageDowbound: '',
      averageUpbound: '',
      rangeDowbound: '',
      rangeUpbound: '',
      Upbound: '',
      Dowbound: '',
      multipleSelection: [],
      intervalData: [],
      checkTableData: [],
      chartDataOne: [],
      rowData: [],
      optionsSelect: [],
      fNumber: '',
      fBillNo: '',
      option1: {
        title: {
          text: ''
        },
        subtitle: {
          text: '',
          style: {
            color: 'white'
          }
        },
        xAxis: {
          crosshair: true,
          tickWidth: 1.5,
          title: {
            text: '',
            style: {
              color: 'red',
              fontSize: '20px'
            }
          }
        },
        yAxis: {
          min: 0,
          max: null,
          title: {
            text: '检验值',
            style: {
              color: 'white'
            }
          },
          plotLines: [{// 均值
            color: 'yellow',
            dashStyle: 'Dash',
            label: {
              text: '均值', // 标签的内容
              align: 'left', // 标签的水平位置，水平居左,默认是水平居中center
              x: 10 // 标签相对于被定位的位置水平偏移的像素，重新定位，水平居左10px
            },
            width: 1.5, // 基准线宽度
            value: 0, // 基准线的参考值
            zIndex: 5
          }, {// Ucl
            color: 'yellow',
            dashStyle: 'Dash',
            label: {
              text: 'Ucl', // 标签的内容
              align: 'left', // 标签的水平位置，水平居左,默认是水平居中center
              x: 10 // 标签相对于被定位的位置水平偏移的像素，重新定位，水平居左10px
            },
            width: 1.5, // 基准线宽度
            value: 0, // 基准线的参考值
            zIndex: 5
          }, {// Lcl
            color: 'yellow',
            dashStyle: 'Dash',
            label: {
              text: 'Lcl', // 标签的内容
              align: 'left', // 标签的水平位置，水平居左,默认是水平居中center
              x: 10 // 标签相对于被定位的位置水平偏移的像素，重新定位，水平居左10px
            },
            width: 1.5, // 基准线宽度
            value: 0, // 基准线的参考值
            zIndex: 5
          }]
        },
        // tooltip: {
        //   // head + 每个 point + footer 拼接成完整的 table
        //   headerFormat: ' A2Ibias ' + '<span style="font-size:10px">{point.key}</span><table>' + ':',
        //   pointFormat: '<tr><td style="color:{series.color};padding:0"></td>' +
        //   '<td style="padding:0"><b>{point.y:.1f} 个</b></td></tr>',
        //   ooterFormat: '</table>',
        //   shared: true,
        //   useHTML: true
        // },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true
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
          name: '检验值',
          data: []
        }]
      },
      option2: {
        title: {
          text: '检验值数量分布图'
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
          tickWidth: 1.5,
          title: {
            text: '',
            style: {
              color: 'red',
              fontSize: '20px'
            }
          }
        },
        yAxis: {
          min: 0,
          max: null,
          title: {
            text: '检验值的数量',
            style: {
              color: 'white'
            }
          }
        },
        // tooltip: {
        //   // head + 每个 point + footer 拼接成完整的 table
        //   headerFormat: ' A2Ibias ' + '<span style="font-size:10px">{point.key}</span><table>' + ':',
        //   pointFormat: '<tr><td style="color:{series.color};padding:0"></td>' +
        //   '<td style="padding:0"><b>{point.y:.1f} 个</b></td></tr>',
        //   ooterFormat: '</table>',
        //   shared: true,
        //   useHTML: true
        // },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true
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
          name: '检验值的数量',
          pointPadding: 0.01,
          groupPadding: 0.01
          // pointPlacement: 0.5
          // pointWidth: 100
        }]
      },
      option4: {
        title: {
          text: '均值图'
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
          tickWidth: 1.5,
          title: {
            text: '',
            style: {
              color: 'red',
              fontSize: '20px'
            }
          }
        },
        yAxis: {
          min: 0,
          max: null,
          title: {
            text: '均值值',
            style: {
              color: 'white'
            }
          }
        },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true
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
          name: '均值',
          data: []
        }]
      },
      option5: {
        title: {
          text: '极差图'
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
          tickWidth: 1.5,
          title: {
            text: '',
            style: {
              color: 'red',
              fontSize: '20px'
            }
          }
        },
        yAxis: {
          min: 0,
          max: null,
          title: {
            text: '极差值',
            style: {
              color: 'white'
            }
          }
        },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true
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
          name: '极差值',
          data: []
        }]
      },
      option3: {
        title: {
          text: '均值极差图'
        },
        subtitle: {
          text: '',
          style: {
            color: 'white'
          }
        },
        xAxis: {
          crosshair: true,
          tickWidth: 1.5,
          title: {
            text: '',
            style: {
              color: 'red',
              fontSize: '20px'
            }
          }
        },
        yAxis: {
          min: 0,
          max: null,
          title: {
            text: '极差值',
            style: {
              color: 'white'
            }
          },
          plotLines: [{// 均值
            color: 'yellow',
            dashStyle: 'Dash',
            label: {
              text: '均值', // 标签的内容
              align: 'left', // 标签的水平位置，水平居左,默认是水平居中center
              x: 10 // 标签相对于被定位的位置水平偏移的像素，重新定位，水平居左10px
            },
            width: 1.5, // 基准线宽度
            value: 0, // 基准线的参考值
            zIndex: 5
          }]
        },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true
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
          name: '极差值',
          data: []
        }]
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            start.setHours(0)
            start.setMinutes(0)
            start.setSeconds(0)
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 7)
            end.setHours(0)
            end.setMinutes(0)
            end.setSeconds(0)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            start.setHours(0)
            start.setMinutes(0)
            start.setSeconds(0)
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 30)
            end.setHours(0)
            end.setMinutes(0)
            end.setSeconds(0)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            start.setHours(0)
            start.setMinutes(0)
            start.setSeconds(0)
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 90)
            end.setHours(0)
            end.setMinutes(0)
            end.setSeconds(0)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      valuetime: [new Date(new Date().setHours(8, 30, 0, 0) - 24 * 60 * 60 * 1000), new Date(new Date().setHours(8, 30, 0, 0))]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.el-table, .el-table__expanded-cell {
    background-color: rgb(84, 92, 100);
}
.K3InspectionSheet >>> .el-table thead {
    color: white !important;
    background-color: rgb(84, 92, 100) !important;
}
.K3InspectionSheet >>> .el-table th, .el-table tr{
    background-color: rgb(84, 92, 100) !important;
}
.K3InspectionSheet >>>.el-table td, .el-table th.is-leaf {
  background-color: rgb(84, 92, 100);
  border-bottom-width: 0px !important;
  color: rgb(255, 255, 255);
}
.el-table >>> tbody tr:hover>td {
  background-color: #90c0f1;
}
/* 去掉全选按钮 */
.el-table >>> .disabledCheck .cell .el-checkbox__inner{
    display: none !important;
}
.el-table >>> .disabledCheck .cell::before{
    content: '选择';
    text-align: center;
}
</style>
