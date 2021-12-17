<template>
  <div class="OsaQualityPNStatistics">
    <!-- 上图表 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="grid-content bg-purple" style="height:60px;background-color: white">
          <div >
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="10px" class="demo-ruleForm">
              <el-form-item  prop="value2" style="float:left">
              <el-date-picker
              v-model="ruleForm.value2"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item  prop="searchPn" style="float:left">
              <!-- <el-input placeholder="请输入PN"  style="width: 200px;"
              v-model="ruleForm.searchPn"  class="input-with-select" ></el-input> -->
              <el-select v-model="ruleForm.searchPn" filterable clearable placeholder="请选择" @visible-change="visiblechange">
                <el-option
                  v-for="item in optionsPn"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item  style="float:left">
              <el-select v-model="value" clearable placeholder="请选择工单类型" style="width: 200px;">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-button slot="append" icon="el-icon-search" @click="submitForm('ruleForm')"
            style="background-color: #409eff; color: #fff; height: 40px; width:80px; float:left" ></el-button>
          </div>
        </div></el-col>
      </el-row>
        <!-- 下图表 -->
    <el-row :gutter="20">
      <!--左图表-->
      <el-col :span="13"><div class="grid-content bg-purple" style="border:1px solid #909399;background-color:rgb(84, 92, 100);height: 840px">
        <download-excel
      class = "export-excel-wrapper"
      style="float:left;background-color:rgb(84, 92, 100);"
      :data = "tableData"
      name = "模块PN搜索excel表格.xls"
    >
      <el-button type="primary" class="el-button--small" style="padding:0">导出Excel表格</el-button>
  </download-excel>
  <hr>
        <el-table
          :data="tableData"
          v-loading="loading"
          style="width: 100%"
          height="820"
          :cell-style="{padding:0+'px'}"
          @row-click="onlyRowChart"
          :row-class-name="RowStyle"
          @row-contextmenu="openDetails">
          <el-table-column
            label="ID"
            type="index"
            width="40">
          </el-table-column>
          <el-table-column
            prop="Pn"
            label="PN"
            width="180">
          </el-table-column>
          <el-table-column
            prop="Seq"
            label="序列"
            width="80">
          </el-table-column>
          <el-table-column
            prop="Process"
            label="工序"
            width="180">
          </el-table-column>
          <el-table-column
            prop="TotalInput"
            label="总输入">
          </el-table-column>
          <el-table-column
            prop="OncePass"
            label="一次良品">
          </el-table-column>
          <el-table-column
            prop="FinalPass"
            label="最终良品">
          </el-table-column>
          <el-table-column
            prop="FinalBad"
            label="最终不良品"
            width="100">
          </el-table-column>
          <el-table-column
            prop="FinalPassRate"
            label="最终良率(%)"
            width="100">
          </el-table-column>
        </el-table>
      </div></el-col>
      <!--右图表-->
      <el-col :span="11"><div class="grid-content bg-purple">
        <div style="height:420px;border:1px solid #909399;background-color:rgb(84, 92, 100);">
          <download-excel
            class = "export-excel-wrapper"
            style="float:left;background-color:rgb(84, 92, 100);"
            :data = "badData"
            name = "模块PN搜索不良项excel表格.xls"
          >
            <el-button type="primary" class="el-button--small" style="padding:0">导出Excel表格</el-button>
        </download-excel>
        <hr>
          <el-table
          :data="badData"
          style="width: 100%"
          :cell-style="{padding:0+'px'}"
          :row-class-name="badrowStyle"
          v-loading="loadingright"
          height="420">
          <el-table-column
            prop="Pn"
            label="PN">
          </el-table-column>
          <el-table-column
            prop="Process"
            label="工序">
          </el-table-column>
          <el-table-column
            prop="ErrorCode"
            label="不良代码"
            width="80">
          </el-table-column>
          <el-table-column
            prop="ErrorDescribe"
            label="不良描述"
            width="120"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            prop="BadCount"
            label="不良数量"
            width="100">
          </el-table-column>
          <el-table-column
            prop="Error"
            label="不良占投入"
            width="100">
          </el-table-column>
          </el-table>
        </div>
        <br>
        <div class="grid-content bg-purple">
        <div style="height:400px;border:1px solid #909399">
          <Charts :id="id1" class="high" :option="option1"></Charts>
        </div>
      </div>
      </div></el-col>
    </el-row>
    <br>
    <el-row :gutter="20">
      <el-col :span="24">
        <div id="line" style="height:400px;background-color:rgb(84, 92, 100)"></div>
      </el-col>
    </el-row>
    <!--不良代码详情弹窗-->
    <el-dialog
      title="不良代码详情"
      :visible.sync="modifydialogVisible"
      :close-on-click-modal='false'
      width="90%"
      append-to-body>
        <download-excel
        class = "export-excel-wrapper"
        style="float:left;"
        :data = "workOlderData"
        name = "模块PN搜索不良项详情excel表格.xls">
          <el-button type="primary" class="el-button--small" style="padding:0">导出Excel表格</el-button>
        </download-excel>
        <el-table
          :data="workOlderData"
          max-height="600"
          v-loading="workOlderLoading"
          :row-style="{height:'20px'}"
          style="width: 100%">
          <el-table-column :show-overflow-tooltip="true" v-for="(item) in workOlderDataHeader" :key="item" :label="item" :property="item">
            <template slot-scope="scope" style="font-size:5px">
              {{scope.row[item]}}
            </template>
          </el-table-column>
          </el-table>
      </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import Charts from '@/components/chart/Chart'
import Highcharts from 'highcharts'
export default {
  name: 'OsaQualityPNStatistics',
  components: {
    Charts
  },
  mounted () {
    // 默认时间
    (() => {
      // this.ruleForm.value2[0] = new Date(new Date().setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000)
      this.$set(this.ruleForm, 'value2', [new Date(new Date().setHours(0, 0, 0, 0)), new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000)])
      // console.log(this.ruleForm.value2[0])
    })()
    this.watch_pn()
    localStorage.removeItem('osatemp')
    this.setTimer()
  },
  methods: {
    // 监听PN
    watch_pn () {
      console.log(localStorage.getItem('PN'))
      if (localStorage.getItem('PN') !== null) {
        var one = localStorage.getItem('PN').split(',')[0]
        var two = localStorage.getItem('PN').split(',')[1]
        this.ruleForm.searchPn = one
        if (two === 'OSA成品重工工单') {
          this.value = '选项1'
        } else if (two === 'OSA改制产品工单') {
          this.value = '选项2'
        } else if (two === 'OSA量产产品工单') {
          this.value = '选项3'
        } else if (two === 'OSA试生产产品工单') {
          this.value = '选项4'
        }
        this.submitForm('ruleForm')
        localStorage.removeItem('PN')
      }
    },
    // 监听缓存中的值
    setTimer: function () {
      this.timer = setInterval(() => {
        if (localStorage.getItem('osatemp') !== null) {
          this.localStorageNewData = localStorage.getItem('osatemp')
          if (this.localStorageNewData !== this.localStorageOldData) {
            console.log('打开弹窗')
            this.workOlderLoading = true
            this.localStorageOldData = this.localStorageNewData
            this.modifydialogVisible = true
            let that = this
            var process = that.localStorageOldData.split(',')[1]
            var errorcode = (that.localStorageOldData.split(',')[0]).split(':')[1]
            that.$axios({
              method: 'get',
              url: '/display/product-statistic-query/osa/production-bad-code-detail-by-pn',
              params: {
                pn: that.ruleForm.searchPn,
                workOrderType: that.workOrderTypeData,
                process: process,
                errorCode: errorcode,
                startTime: that.ruleForm.value2[0],
                endTime: that.ruleForm.value2[1]
              }
            }).then(function (response) {
              console.log(response)
              const res = response.data
              if (res !== null) {
                that.workOlderData = res
                that.workOlderDataHeader = Object.keys(res[0])
              }
            })
            that.workOlderLoading = false
          }
        }
      })
    },
    // 获取搜索框中的数据
    visiblechange (bool) {
      if (bool === true) {
        let that = this
        that.optionsPn = []
        that.states = []
        that.ruleForm.value2[0] = this.moment(that.ruleForm.value2[0]).format('YYYY-MM-DD HH:mm:ss')
        // console.log(that.ruleForm.value2[0])
        that.ruleForm.value2[1] = this.moment(that.ruleForm.value2[1]).format('YYYY-MM-DD HH:mm:ss')
        // console.log(that.ruleForm.value2[1])
        that.$axios({
          method: 'get',
          url: '/display/common-source/all-osa-pn-list-in-time-period',
          params: {
            startTime: that.ruleForm.value2[0],
            endTime: that.ruleForm.value2[1]
          }
        }).then(function (response) {
          console.log(response)
          const res = response.data
          console.log(res)
          if (res !== null) {
            for (let i = 0; i < res.length; i++) {
            // console.log(res[i]['Name']['String'])
            // console.log(typeof (res[i]['Name']['String']))
              that.states.push({
                label: res[i],
                value: res[i]
              })
            }
            that.optionsPn = that.states
          } else {
            that.$message({
              type: 'warning',
              message: '该时间段没有数据！'
            })
            that.optionsPn = []
          }
        }).catch(function (err) {
          if (err.response.status === 401) {
            alert('用户未登录或登录已过期')
            localStorage.clear()
            that.$router.push({path: '/user/login/'})
            window.location.reload()
          } else if (err.response.status === 403) {
            that.$message({
              type: 'error',
              message: '权限不够！'
            })
          } else if (err.response.status === 404) {
            that.$message({
              type: 'error',
              message: '未找到数据！'
            })
          } else if (err.response.status === 504) {
            that.$message({
              type: 'error',
              message: '服务器未响应！'
            })
          }
        })
      }
    },
    // 点击搜索按钮后触发该事件
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          this.time = this.ruleForm.value2
          this.startTime = this.moment(this.time[0]).format('YYYY-MM-DD HH:mm:ss')
          this.endTime = this.moment(this.time[1]).format('YYYY-MM-DD HH:mm:ss')
          this.option1.xAxis.categories = []
          this.option1.series[0].data = []
          this.numdata = []
          this.sum = 0
          this.option1.yAxis.max = null
          Highcharts.chart(this.id1, this.option1)
          this.get_tableData()
        } else {
          this.$message({
            type: 'warning',
            message: ' 请填写必填项！'
          })
          return false
        }
      })
    },
    // 获取左图表数据
    get_tableData () {
      this.get_data()
      this.loading = true
      if (this.value === '选项1') {
        this.workOrderTypeData = 'OSA成品重工工单'
      } else if (this.value === '选项2') {
        this.workOrderTypeData = 'OSA改制产品工单'
      } else if (this.value === '选项3') {
        this.workOrderTypeData = 'OSA量产产品工单'
      } else if (this.value === '选项4') {
        this.workOrderTypeData = 'OSA试生产产品工单'
      }
      // console.log(this.optionsPn[0]['value'])
      // console.log(this.ruleForm.searchPn)
      // console.log(this.workOrderTypeData)
      let that = this
      that.ruleForm.value2[0] = this.moment(that.ruleForm.value2[0]).format('YYYY-MM-DD HH:mm:ss')
      // console.log(that.ruleForm.value2[0])
      that.ruleForm.value2[1] = this.moment(that.ruleForm.value2[1]).format('YYYY-MM-DD HH:mm:ss')
      // console.log(that.ruleForm.value2[1])
      that.tableData = []
      that.badData = []
      // const CancelToken = that.axios.cancelToken
      // const source = CancelToken.source()
      that.cancel && that.cancel()
      that.$axios({
        url: '/display/product-statistic-query/osa/production-yield-info-by-pn',
        method: 'get',
        params: {
          pn: that.ruleForm.searchPn,
          workOrderType: that.workOrderTypeData,
          startTime: that.ruleForm.value2[0],
          endTime: that.ruleForm.value2[1]
        },
        cancelToken: new axios.CancelToken((c) => {
          // 存储一个cancel函数用于取消本次的网络请求
          that.cancel = c
        })
        // cancelToken: source.token
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null) {
        //   var data = JSON.parse(JSON.stringify(res))
        //   for (let i = 0; i < data.length - 1; i++) {
        //     for (let j = 0; j < data.length - i - 1; j++) {
        //       if (Number(data[j]['Seq']) > Number(data[j + 1]['Seq'])) {
        //         var num = data[j]
        //         data[j] = data[j + 1]
        //         data[j + 1] = num
        //       }
        //     }
        //   }
        //   console.log(data)
          that.tableData = res
          that.loading = false
        }
        that.get_badData()
      }).catch(function (err) {
        console.log(err)
        that.loading = false
        that.cancelQuest()
        if (err.response.status === 401) {
          alert('用户未登录或登录已过期')
          localStorage.clear()
          that.$router.push({path: '/user/login/'})
          window.location.reload()
        } else if (err.response.status === 403) {
          that.$message({
            type: 'error',
            message: '权限不够！'
          })
        } else if (err.response.status === 404) {
          that.$message({
            type: 'error',
            message: '未找到数据！'
          })
        } else if (err.response.status === 504) {
          that.$message({
            type: 'error',
            message: '服务器未响应！'
          })
        } //  else if (this.axios.isCancel(err)) {
        //   console.log('Rquest canceled', err.message) // 请求如果被取消，这里是返回取消的message
        // }
        // that.get_badData()
      })
    },
    // 获取右上图表数据
    get_badData () {
      this.loadingright = true
      // console.log(this.value)
      if (this.value === '选项1') {
        this.workOrderTypeData = 'OSA成品重工工单'
      } else if (this.value === '选项2') {
        this.workOrderTypeData = 'OSA改制产品工单'
      } else if (this.value === '选项3') {
        this.workOrderTypeData = 'OSA量产产品工单'
      } else if (this.value === '选项4') {
        this.workOrderTypeData = 'OSA量产产品维修工单'
      } else if (this.value === '选项5') {
        this.workOrderTypeData = 'OSA试产产品工单'
      } else if (this.value === '选项6') {
        this.workOrderTypeData = 'OSA试产产品维修工单'
      }
      // console.log(this.workOrderTypeData)
      let that = this
      that.ruleForm.value2[0] = this.moment(that.ruleForm.value2[0]).format('YYYY-MM-DD HH:mm:ss')
      // console.log(that.ruleForm.value2[0])
      that.ruleForm.value2[1] = this.moment(that.ruleForm.value2[1]).format('YYYY-MM-DD HH:mm:ss')
      // console.log(that.ruleForm.value2[1])
      that.badData = []
      that.source && that.source()
      that.$axios({
        url: '/display/product-statistic-query/osa/production-error-code-distribution-by-pn',
        method: 'get',
        params: {
          pn: that.ruleForm.searchPn,
          workOrderType: that.workOrderTypeData,
          startTime: that.ruleForm.value2[0],
          endTime: that.ruleForm.value2[1]
        },
        cancelToken: new axios.CancelToken((b) => {
          // 存储一个cancel函数用于取消本次的网络请求
          that.source = b
        })
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null) {
          that.badData = res
          that.loadingright = false
          // 计算不良占投入
          for (let i = 0; i < that.badData.length; i++) {
            for (let j = 0; j < that.tableData.length; j++) {
              if (that.tableData[j]['Process'] === that.badData[i]['Process']) {
                that.totalInput = that.tableData[j]['TotalInput']
                let data = parseFloat(that.badData[i]['BadCount'] / that.totalInput).toFixed(4)
                that.BadAccountsForTotalInvestment = Number(data * 100).toFixed(2) + '%'
                that.badData[i]['Error'] = that.BadAccountsForTotalInvestment
              }
            }
          }
          var Listchart = []
          console.log(that.tableData)
          console.log(that.badData)
          var colors = ['green', 'yellow', 'pink']
          if (that.tableData.length !== 0) {
            var data = JSON.parse(JSON.stringify(that.tableData))
            for (let w = 0; w < data.length - 1; w++) {
              for (let r = 0; r < data.length - w - 1; r++) {
                if (data[r]['FinalPassRate'] > data[r + 1]['FinalPassRate']) {
                  var mum = data[r]
                  data[r] = data[r + 1]
                  data[r + 1] = mum
                }
              }
            }
            console.log(data)
            for (let x = 0; x < data.length; x++) {
              var list = []
              for (let y = 0; y < that.badData.length; y++) {
                if (data[x]['Process'] === that.badData[y]['Process']) {
                  list.push(that.badData[y])
                }
              }
              if (list.length >= 3) {
                list = list.slice(0, 2)
              }
              for (let m = 0; m < list.length; m++) {
                list[m]['color'] = colors[x]
              }
              Listchart = Listchart.concat(list)
            }
          }
          console.log(Listchart)
          for (let n = 0; n < that.badData.length - 1; n++) {
            for (let m = 0; m < that.badData.length - n - 1; m++) {
              if (that.badData[m]['BadCount'] < that.badData[m + 1]['BadCount']) {
                let num = that.badData[m]
                that.badData[m] = that.badData[m + 1]
                that.badData[m + 1] = num
              }
            }
          }
          // console.log(that.badData.slice(0, 5))02.02.05.00004
          var chartData = Listchart
          var chart = []
          var xAxisList = []
          var numlist = []
          that.option1.series = that.seriesTop3
          that.option1.legend.enabled = true
          console.log(chartData)
          var name = ''
          var sort = 0
          for (let p = 0; p < chartData.length; p++) {
            if (name !== chartData[p]['Process']) {
              sort += 1
              name = chartData[p]['Process']
            }
            numlist.push(chartData[p]['Process'])
            xAxisList.push('TOP' + String(sort) + ':' + chartData[p]['ErrorCode'])
            chart.push({'name': 'TOP' + String(sort) + ':' + chartData[p]['ErrorCode'], 'y': chartData[p]['BadCount'], 'describe': chartData[p]['ErrorDescribe'], 'Process': chartData[p]['Process']})
          }
          numlist = Array.from(new Set(numlist))
          console.log(that.option1.series)
          console.log(numlist)
          for (let i = 0; i < 3; i++) {
            var idata = []
            for (let k = 0; k < chart.length; k++) {
              if (chart[k]['Process'] === numlist[i]) {
                idata.push(chart[k])
              }
            }
            that.option1.series[i].name = numlist[i]
            that.option1.series[i].data = idata
          }
          console.log(that.option1.series[0].data)
          console.log(numlist)
          console.log(xAxisList)
          console.log(chart)
          that.option1.xAxis.categories = xAxisList
          // that.option1.series[0].data = chart
          // that.option1.series[1].data = chart
          console.log(that.option1)
          Highcharts.chart(that.id1, that.option1)
        }
      })
    },
    // 获取变化图的数据
    get_data () {
      let that = this
      that.linetable = []
      that.$axios({
        url: '/display/product-statistic-query/osa/production-error-code-top3-distribution-by-pn-in-week',
        methods: 'get',
        params: {
          pn: that.ruleForm.searchPn
        }
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null) {
          var key = Object.keys(res)
          for (let i = 0; i < key.length; i++) {
            var onlykey = Object.keys(res[key[i]])
            for (let n = 0; n < onlykey.length; n++) {
              var linename = key[i] + ' ' + onlykey[n]
              console.log(key[i] + ' ' + onlykey[n], res[key[i]][onlykey[n]])
              var liny = res[key[i]][onlykey[n]]
              var linedata = []
              for (let m = 0; m < liny.length; m++) {
                linedata.push({id: onlykey[n], process: key[i], y: liny[m]})
              }
              that.linetable.push({name: linename, data: linedata})
            }
          }
          console.log(that.linetable)
          that.get_linechart()
        }
      })
    },
    // 作变化图
    get_linechart () {
      var datatime = []
      for (let i = 7; i > 0; i--) {
        var data = new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * i)
        var newday = this.moment(data).format('YYYY-MM-DD')
        datatime.push(newday)
      }
      console.log(datatime)
      Highcharts.chart('line', {
        chart: {
          type: 'line',
          backgroundColor: {
            linearGradient: [0, 0, 500, 500],
            stops: [
              [0, 'rgb(84, 92, 100)'],
              [1, 'rgb(84, 92, 100)']
            ]
          }
        },
        colors: ['#00FF00', '#0099FF', '#FFCC00', '#FFCCFF', '#000000', '#993300', '#9900FF', '#660099', '#CC00CC', '#FF0000', '#999900', '#3300FF', '#FF0000'],
        title: {
          text: this.ruleForm.searchPn + ' 近7天不良项变化',
          style: {
            color: '#FFFFFF'
          }
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: datatime,
          gridLineColor: '#707073',
          crosshair: true,
          title: {
            text: ''
          },
          labels: {
            style: {
              color: '#E0E0E3'
            }
          },
          lineColor: '#707073',
          minorGridLineColor: '#505053',
          tickColor: '#707073'
        },
        yAxis: {
          gridLineColor: '#707073',
          labels: {
            style: {
              color: '#E0E0E3'
            }
          },
          min: 0,
          max: 40,
          title: {
            text: '不良占比(%)',
            style: {
              color: '#A0A0A3'
            }
          }
        },
        plotOptions: {
          series: {
            marker: {
              radius: 4,
              enabled: true,
              lineWidth: 2,
              symbol: 'diamond'
            }
          }
        },
        tooltip: {
          formatter: function () {
            return '<b>' + this.x + ' ' + '<br>不良代码：' + this.point.id + '<br>不良工序：' + this.point.process + '<br>不良占比：' + this.point.y + '%</b>'
          }
          // headerFormat: '<span>' + this.x + '[{point.x}]</span>',
          // pointFormat: '<br><p>' + data.UpdateReason + '</p>' + '<br><p>修改前：' + data.OldValue + '</p>' + '<br><p>修改后：' + data.NewValue + '</p>'
        },
        credits: {
          enabled: false // 禁用网址
        },
        legend: {
          itemStyle: {
            'color': '#FFFFFF'
          }
        },
        series: this.linetable
      })
    },
    // 取消请求
    cancelQuest () {
      if (typeof this.source === 'function') {
        this.source('终止请求') // 取消请求
      }
    },
    // 单机获取一行的图
    onlyRowChart (row, column, event) {
      console.log(row['Process'])
      var chartlist = []
      this.option1.series = this.seriesOnly
      this.option1.legend.enabled = false
      if (this.badData.length !== 0) {
        for (let i = 0; i < this.badData.length; i++) {
          if (row['Process'] === this.badData[i]['Process']) {
            chartlist.push(this.badData[i])
          }
        }
        var chartData = chartlist
        var chart = []
        var xAxisList = []
        for (let p = 0; p < chartData.length; p++) {
          xAxisList.push(chartData[p]['ErrorCode'])
          chart.push({'name': ':' + chartData[p]['ErrorCode'], 'y': chartData[p]['BadCount'], 'describe': chartData[p]['ErrorDescribe'], 'Process': chartData[p]['Process']})
        }
        console.log(xAxisList)
        console.log(chart)
        this.option1.xAxis.categories = xAxisList
        this.option1.series[0].data = chart
        Highcharts.chart(this.id1, this.option1)
      }
    },
    // 点击事件
    openDetails (row) {
      console.log(row)
    },
    // 修改左上表格的行样式
    RowStyle (row, rowindex) {
      // console.log(row['row']['Process'])
      if (row['row']['Process'] === '总计') {
        // console.log('1')
        return 'select-row'
      } else {
        if (Number(row['row']['Seq']) <= 350 & Number(row['row']['Seq']) >= 230) {
          console.log('1')
          if (Number(row['row']['Seq']) === 288 || Number(row['row']['Seq']) === 348) {
            return 'only-row'
          } else {
            return 'select-row'
          }
        } else {
          return 'only-row'
        }
      }
      // console.log(row)
      // console.log(rowindex)
    },
    // 修改右上表格的航样式
    badrowStyle (row) {
      return 'only-row'
    }
  },
  beforeDestroy () {
  },
  data () {
    return {
      linetable: [],
      cancel: null, // 存放取消的请求方法
      source: null,
      isLoading: false,
      id1: 'high1',
      id2: 'high2',
      id3: 'high3',
      id4: 'high4',
      id5: 'high5',
      id6: 'high6',
      id7: 'high7',
      id8: 'high8',
      id9: 'high9',
      id10: 'high10',
      id11: 'high11',
      id12: 'high12',
      id13: 'high13',
      id14: 'high14',
      id15: 'high15',
      temps: '',
      pn: '',
      proce: '',
      startTime: '',
      endTime: '',
      searchPn: '',
      Process: '',
      workOrderTypeData: '',
      max: 0,
      sum: 0,
      sumdata: 0,
      sundata: 0,
      localStorageNewData: '',
      localStorageOldData: '',
      BadAccountsForTotalInvestment: '',
      numdata: [],
      tableData: [],
      time: [],
      workOlderData: [],
      workOlderDataHeader: [],
      badData: [],
      totalInput: 0,
      loading: false,
      workOlderLoading: false,
      loadingright: false,
      modifydialogVisible: false,
      chartdialogVisible: false,
      ruleForm: {
        searchPn: '',
        value2: []
      },
      rules: {
        searchPn: {required: true, message: '请输入Pn', trigger: 'blur'},
        value2: {required: true, message: '请选择时间', trigger: 'change'}
      },
      optionsPn: [],
      list: [],
      valuePn: [],
      states: [],
      options: [{
        value: '选项1',
        label: 'OSA成品重工工单'
      }, {
        value: '选项2',
        label: 'OSA改制产品工单'
      }, {
        value: '选项3',
        label: 'OSA量产产品工单'
      }, {
        value: '选项4',
        label: 'OSA试生产产品工单'
      }],
      value: '',
      // 快捷按钮（近一周，近一月，近三月）
      pickerOptions: {
        shortcuts: [{
          text: '今天白班',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setHours(8)
            start.setMinutes(30)
            start.setSeconds(0)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '昨天晚班',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
            start.setHours(20)
            start.setMinutes(30)
            start.setSeconds(0)
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 1)
            end.setHours(8)
            end.setMinutes(30)
            end.setSeconds(0)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '昨天白班',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
            start.setHours(8)
            start.setMinutes(30)
            start.setSeconds(0)
            end.setTime(start.getTime())
            end.setHours(20)
            end.setMinutes(30)
            end.setSeconds(0)
            picker.$emit('pick', [start, end])
          }
        }, {
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
          text: '最近半个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 15)
            start.setHours(0)
            start.setMinutes(0)
            start.setSeconds(0)
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 15)
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
        }]
      },
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      // highcharts图
      seriesTop3: [{
        name: 'TOP1',
        type: 'column',
        data: [],
        pointPadding: 0.01,
        groupPadding: 0.01,
        pointPlacement: 0.33
      }, {
        name: 'TOP2',
        type: 'column',
        data: [],
        pointPadding: 0.01,
        groupPadding: 0.01
      }, {
        name: 'TOP3',
        type: 'column',
        data: [],
        pointPadding: 0.01,
        groupPadding: 0.01,
        pointPlacement: -0.33
      }],
      seriesOnly: [{
        type: 'column',
        data: [],
        pointPadding: 0.01,
        groupPadding: 0.01
      }],
      option1: {
        title: {
          text: '不良-TOP'
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          type: 'category'
        },
        yAxis: [{
          min: 0,
          max: null,
          title: {
            text: '不良数量(个)'
          }
        }],
        tooltip: {
          // shared: true,
          formatter: function () {
            return '<b>工序：' + this.point.Process + '<b/><br><b>不良代码：' + this.point.name.split(':')[1] + '<b/><br><b>不良数量：' + this.point.y + '<b/><br><b>不良描述：' + this.point.describe + '</b>'
          }
          // headerFormat: '<span>[{point.name}]</span>'
          // pointFormat: '<br><p>' + data.UpdateReason + '</p>' + '<br><p>修改前：' + data.OldValue + '</p>' + '<br><p>修改后：' + data.NewValue + '</p>'
        },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true
            }
          },
          series: {
            cursor: 'pointer',
            // test: [],
            events: {
              // click: (() => {
              //   // console.log(e.point.category)
              //   // e.modifydialogVisible = true
              //   // console.log(e.modifydialogVisible)
              //   // console.log(typeof (e.modifydialogVisible))
              //   console.log(this.modifydialogVisible)
              // })()
              click: function (e) {
                console.log(this.name)
                console.log(e)
                localStorage.removeItem('osatemp')
                setTimeout(() => {
                  localStorage.setItem('osatemp', e.point.name + ',' + e.point.Process)
                  // localStorage.setItem('lang', e.point.Process)
                }, 1000)
                // localStorage.setItem('temp', e.point.category)
                // localStorage.setItem('const', 1)
                // console.log(typeof (localStorage.getItem('const')))
                // console.log(e.point.category)
                // this.test = e.point.category
                // console.log()
                // var dicts = {'2.0_2.5': 19, '2.5_3.0': 20, '1.5_2.0': 10}
                // this.global_func(dicts)
              }
            }
          }
        },
        legend: {
          enabled: true,
          title: {
            text: '<b>工序TOP3</b>'
          },
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'top',
          x: 0,
          y: 100
        },
        credits: {
          enabled: false // 禁用网址
        },
        series: [{
          name: 'TOP1',
          type: 'column',
          data: [],
          pointPadding: 0.01,
          groupPadding: 0.01,
          pointPlacement: 0.33
        }, {
          name: 'TOP2',
          type: 'column',
          data: [],
          pointPadding: 0.01,
          groupPadding: 0.01
        }, {
          name: 'TOP3',
          type: 'column',
          data: [],
          pointPadding: 0.01,
          groupPadding: 0.01,
          pointPlacement: -0.33
        }]
      },
      option2: {
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: [],
          crosshair: true,
          tickWidth: 1.5,
          title: {
            text: ''
          }
        },
        yAxis: {
          min: 0,
          max: null,
          title: {
            text: '数量(个)'
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
          pointPadding: 0.01,
          groupPadding: 0.01
          // pointPlacement: -0.25
          // pointWidth: 100
        }, {
          data: []
        }]
      },
      option3: {
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: [],
          crosshair: true,
          title: {
            text: ''
          }
        },
        yAxis: {
          min: 0,
          max: null,
          title: {
            text: '数量(个)'
          }
        },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true // 开启数据显示
            }
          }
        },
        // tooltip: {
        //   // head + 每个 point + footer 拼接成完整的 table
        //   headerFormat: ' EaAbsorb ' + '<span style="font-size:10px">{point.key}</span><table>' + ':',
        //   pointFormat: '<tr><td style="color:{series.color};padding:0"></td>' +
        //   '<td style="padding:0"><b>{point.y:.1f} 个</b></td></tr>',
        //   ooterFormat: '</table>',
        //   shared: true,
        //   useHTML: true
        // },
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
          groupPadding: 0.01
        }, {
          data: []
        }]
      },
      option4: {
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: [],
          crosshair: true,
          title: {
            text: ''
          }
        },
        yAxis: {
          min: 0,
          max: null,
          title: {
            text: '数量(个)'
          }
        },
        // tooltip: {
        //   // head + 每个 point + footer 拼接成完整的 table
        //   headerFormat: ' Sigma ' + '<span style="font-size:10px">{point.key}</span><table>' + ':',
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
          pointPadding: 0.01,
          groupPadding: 0.01
        }, {
          data: []
        }]
      },
      option5: {
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: [],
          crosshair: true,
          title: {
            text: ''
          }
        },
        yAxis: {
          min: 0,
          max: null,
          title: {
            text: '数量(个)'
          }
        },
        // tooltip: {
        //   // head + 每个 point + footer 拼接成完整的 table
        //   headerFormat: ' Smsr ' + '<span style="font-size:10px">{point.key}</span><table>' + ':',
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
          pointPadding: 0.01,
          groupPadding: 0.01
        }, {
          data: []
        }]
      },
      option6: {
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: [],
          crosshair: true,
          title: {
            text: ''
          }
        },
        yAxis: {
          min: 0,
          max: null,
          title: {
            text: '数量(个)'
          }
        },
        // tooltip: {
        //   // head + 每个 point + footer 拼接成完整的 table
        //   headerFormat: ' TxAop ' + '<span style="font-size:10px">{point.key}</span><table>' + ':',
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
          pointPadding: 0.01,
          groupPadding: 0.01
        }, {
          data: []
        }]
      },
      option7: {
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: [],
          crosshair: true,
          title: {
            text: ''
          }
        },
        yAxis: {
          min: 0,
          max: null,
          title: {
            text: '数量(个)'
          }
        },
        // tooltip: {
        //   // head + 每个 point + footer 拼接成完整的 table
        //   headerFormat: ' TxER ' + '<span style="font-size:10px">{point.key}</span><table>' + ':',
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
          pointPadding: 0.01,
          groupPadding: 0.01
        }, {
          data: []
        }]
      },
      option8: {
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: [],
          crosshair: true,
          title: {
            text: ''
          }
        },
        yAxis: {
          min: 0,
          max: null,
          title: {
            text: '数量(个)'
          }
        },
        // tooltip: {
        //   // head + 每个 point + footer 拼接成完整的 table
        //   headerFormat: ' TxER ' + '<span style="font-size:10px">{point.key}</span><table>' + ':',
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
          pointPadding: 0.01,
          groupPadding: 0.01
        }, {
          data: []
        }]
      },
      option9: {
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: [],
          crosshair: true,
          title: {
            text: ''
          }
        },
        yAxis: {
          min: 0,
          max: null,
          title: {
            text: '数量(个)'
          }
        },
        // tooltip: {
        //   // head + 每个 point + footer 拼接成完整的 table
        //   headerFormat: ' TxER ' + '<span style="font-size:10px">{point.key}</span><table>' + ':',
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
          pointPadding: 0.01,
          groupPadding: 0.01
        }, {
          data: []
        }]
      },
      option10: {
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: [],
          crosshair: true,
          title: {
            text: ''
          }
        },
        yAxis: {
          min: 0,
          max: null,
          title: {
            text: '数量(个)'
          }
        },
        // tooltip: {
        //   // head + 每个 point + footer 拼接成完整的 table
        //   headerFormat: ' TxER ' + '<span style="font-size:10px">{point.key}</span><table>' + ':',
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
          pointPadding: 0.01,
          groupPadding: 0.01
        }, {
          data: []
        }]
      },
      option11: {
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: [],
          crosshair: true,
          title: {
            text: ''
          }
        },
        yAxis: {
          min: 0,
          max: null,
          title: {
            text: '数量(个)'
          }
        },
        // tooltip: {
        //   // head + 每个 point + footer 拼接成完整的 table
        //   headerFormat: ' TxER ' + '<span style="font-size:10px">{point.key}</span><table>' + ':',
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
          pointPadding: 0.01,
          groupPadding: 0.01
        }, {
          data: []
        }]
      },
      option12: {
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: [],
          crosshair: true,
          title: {
            text: ''
          }
        },
        yAxis: {
          min: 0,
          max: null,
          title: {
            text: '数量(个)'
          }
        },
        // tooltip: {
        //   // head + 每个 point + footer 拼接成完整的 table
        //   headerFormat: ' TxER ' + '<span style="font-size:10px">{point.key}</span><table>' + ':',
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
          pointPadding: 0.01,
          groupPadding: 0.01
        }, {
          data: []
        }]
      },
      option13: {
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: [],
          crosshair: true,
          title: {
            text: ''
          }
        },
        yAxis: {
          min: 0,
          max: null,
          title: {
            text: '数量(个)'
          }
        },
        // tooltip: {
        //   // head + 每个 point + footer 拼接成完整的 table
        //   headerFormat: ' TxER ' + '<span style="font-size:10px">{point.key}</span><table>' + ':',
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
          pointPadding: 0.01,
          groupPadding: 0.01
        }, {
          data: []
        }]
      },
      option14: {
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: [],
          crosshair: true,
          title: {
            text: ''
          }
        },
        yAxis: {
          min: 0,
          max: null,
          title: {
            text: '数量(个)'
          }
        },
        // tooltip: {
        //   // head + 每个 point + footer 拼接成完整的 table
        //   headerFormat: ' TxER ' + '<span style="font-size:10px">{point.key}</span><table>' + ':',
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
          pointPadding: 0.01,
          groupPadding: 0.01
        }, {
          data: []
        }]
      },
      option15: {
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: [],
          crosshair: true,
          title: {
            text: ''
          }
        },
        yAxis: {
          min: 0,
          max: null,
          title: {
            text: '数量(个)'
          }
        },
        // tooltip: {
        //   // head + 每个 point + footer 拼接成完整的 table
        //   headerFormat: ' TxER ' + '<span style="font-size:10px">{point.key}</span><table>' + ':',
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
          pointPadding: 0.01,
          groupPadding: 0.01
        }, {
          data: []
        }]
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.OsaQualityPNStatistics{
  padding: 0;
  margin: 0;
}
.block{
  background: #e0dfdf;
  margin: 0;
  min-width: 0;
}
.el-table, .el-table__expanded-cell {
    background-color: rgb(84, 92, 100);
}
.OsaQualityPNStatistics >>> .el-table thead {
    color: white !important;
    background-color: rgb(84, 92, 100) ;
}
.OsaQualityPNStatistics >>> .el-table th, .el-table tr{
    background-color: rgb(84, 92, 100) ;
}
.OsaQualityPNStatistics >>>.el-table td, .el-table th.is-leaf {
  border-bottom-width: 0px !important;
}
.el-table >>> tbody tr:hover>td {
  background-color: #90c0f1;
}
.el-table >>> .total-row {
  color: #000000 !important;
  border-bottom-width: 0px !important;
  background-color: #90c0f1 !important;
}
.el-table >>> .select-row {
  color: #000000 !important;
  border-bottom-width: 0px !important;
  background-color: #bcfdaf !important;
}
.el-table >>> .only-row {
  color: #ffffff !important;
  border-bottom-width: 0px !important;
  background-color: rgb(84, 92, 100) !important;
}
</style>
