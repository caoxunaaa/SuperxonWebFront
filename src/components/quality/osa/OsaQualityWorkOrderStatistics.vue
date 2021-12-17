<template>
  <div class="OsaQualityWorkOrderStatistics">
    <el-row :gutter="20" style="height: 70px">
      <el-col :span="10" style="height:45px">
        <div style="height:40px">
          <div style="height: 40px">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="10px" class="demo-ruleForm">
            <el-form-item style="float:left">
                <el-date-picker
                v-model="ruleForm.value2"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <el-tag style="font-size:5px">该时间选择不对工单搜索做限制</el-tag>
            </el-form>
          </div>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="grid-content bg-purple" style="height:40px;background-color: white">
          <div style="height: 40px">
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="10px" class="demo-ruleForm">
              <el-form-item  prop="searchWorkOrder" style="float:left">
                <el-select v-model="ruleForm.searchWorkOrder" clearable filterable allow-create placeholder="请输入工单号" @visible-change="test_visible_change">
                      <el-option
                        v-for="item in optionsWorkOrder"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
              </el-form-item>
            </el-form>
            <el-button slot="append" icon="el-icon-search" @click="submitForm('ruleForm')"
              style="background-color: #409eff; color: #fff; height: 40px; width:80px; float:left" ></el-button>

            <!-- <el-input placeholder="请输入PN"  style="width: 200px;"
            v-model="searchPn"  class="input-with-select" ></el-input>
            <el-input placeholder="请输入工单类型"  style="width: 200px;"
            v-model="workOrderModel"  class="input-with-select" ></el-input>
            <el-date-picker
              v-model="value2"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <el-button slot="append" icon="el-icon-search" @click="Search"
            style="background-color: #409eff; color: #fff; height: 40px; width:80px"></el-button> -->
          </div>
        </div>
      </el-col>
    </el-row>
    <br>
    <div style="margin-bottom: 20px">
      <span>工单号对应的模块总量率</span>
      <el-table
        :data="orderModuleYieldData"
        style="width: 100%">
        <el-table-column
          prop="OsaOrderNum"
          label="工单号">
        </el-table-column>
        <el-table-column
          prop="TotalInput"
          label="总投入">
        </el-table-column>
        <el-table-column
          prop="TotalPass"
          label="总良品">
        </el-table-column>
        <el-table-column
          prop="PassRate"
          label="总良率(%)">
        </el-table-column>
      </el-table>
    </div>
    <div>
    <el-row :gutter="20">
      <el-col :span="13">
          <div class="grid-content bg-purple" style="border:1px solid #909399;background-color:rgb(84, 92, 100);">
            <download-excel
              class = "export-excel-wrapper"
              style="float:left;background-color:rgb(84, 92, 100);"
              :data = "data"
              name = "模块工单号搜索excel表格.xls"
            >
              <el-button type="primary" class="el-button--small" style="padding:0">导出Excel表格</el-button>
            </download-excel>
            <hr>
            <el-table
              :cell-style="{padding:0+'px'}"
              :data="data"
              @row-click="only_row_chart"
              v-loading="loading"
              style="width: 100%"
              height="800">
              <el-table-column
                prop="WorkOrderId"
                label="工单号"
                width="100">
              </el-table-column>
              <el-table-column
                prop="Pn"
                label="PN">
              </el-table-column>
              <el-table-column
                prop="Series"
                label="系列">
              </el-table-column>
              <el-table-column
                prop="Seq"
                label="序列"
                width="50">
              </el-table-column>
              <el-table-column
                prop="Process"
                label="工序">
              </el-table-column>
              <!-- <el-table-column
                prop="Version.String"
                label="SVERSION">
              </el-table-column> -->
              <el-table-column
                prop="TotalInput"
                label="总输入"
                width="70">
              </el-table-column>
              <el-table-column
                prop="FinalOk"
                label="最终良品"
                width="90">
              </el-table-column>
              <el-table-column
                prop="FinalBad"
                label="最终不良品"
                width="110">
              </el-table-column>
              <el-table-column
                prop="FinalPassRate"
                label="最终良率(%)"
                width="110">
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      <el-col :span="11">
        <div class="grid-content bg-purple">
          <div style="border:1px solid #909399;background-color:rgb(84, 92, 100)">
            <download-excel
              class = "export-excel-wrapper"
              style="float:left;background-color:rgb(84, 92, 100);"
              :data = "dataRight"
              name = "模块工单号搜索不良项excel表格.xls"
            >
              <el-button type="primary" class="el-button--small" style="padding:0">导出Excel表格</el-button>
            </download-excel>
            <hr>
            <el-table
              :data="dataRight"
              :cell-style="{padding:0+'px'}"
              v-loading="loadingRight"
              style="width: 100%"
              height="400">
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
                :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column
                prop="BadCount"
                label="不良数量"
                width="80">
              </el-table-column>
              <el-table-column
                prop="ErrorInputRate"
                label="不良率"
                width="80">
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div style="height:400px;border:1px solid #909399">
            <Charts :id="id8" class="high" :option="option8"></Charts>
        </div>
      </el-col>
    </el-row>
    </div>
    <!-- <el-row :gutter="20">
      <el-col :span="24">
        <div style="height:400px;border:1px solid #909399">
            <Charts :id="id8" class="high" :option="option8"></Charts>
          </div>
          <br>
      </el-col>
    </el-row> -->
    <!--不良代码详情弹窗-->
    <!-- <el-dialog
      title="不良代码详情"
      :visible.sync="modifydialogVisible"
      width="80%"
      append-to-body
      :before-close="handleClose">
        <el-table
          :data="workOlderData"
          max-height="600"
          v-loading="workOlderLoading"
          :row-style="{height:'20px'}"
          style="width: 100%">
          <el-table-column
            prop="Pn.String"
            label="Pn">
          </el-table-column>
          <el-table-column
            prop="Sn.String"
            label="Sn">
          </el-table-column>
          <el-table-column
            prop="WorkOrderId.String"
            label="WorkOrderId">
          </el-table-column>
          <el-table-column
            prop="A2Ibias.Float64"
            label="A2Ibias">
          </el-table-column>
          <el-table-column
            prop="A2Temperature.Float64"
            label="A2Temperature">
          </el-table-column>
          <el-table-column
            prop="A2TxMon.Float64"
            label="A2TxMon">
          </el-table-column>
          <el-table-column
            prop="A2Vcc.Float64"
            label="A2Vcc">
          </el-table-column>
          <el-table-column
            prop="ActionTime.String"
            label="ActionTime">
          </el-table-column>
          <el-table-column
            prop="AopStability01.Float64"
            label="AopStability01">
          </el-table-column>
          <el-table-column
            prop="AopStability02.Float64"
            label="AopStability02">
          </el-table-column>
          <el-table-column
            prop="AopStability03.Float64"
            label="AopStability03">
          </el-table-column>
          <el-table-column
            prop="AopStability04.Float64"
            label="AopStability04">
          </el-table-column>
          <el-table-column
            prop="AopStability05.Float64"
            label="AopStability05">
          </el-table-column>
          <el-table-column
            prop="AopStability06.Float64"
            label="AopStability06">
          </el-table-column>
          <el-table-column
            prop="AopStability07.Float64"
            label="AopStability07">
          </el-table-column>
          <el-table-column
            prop="AopStability08.Float64"
            label="AopStability08">
          </el-table-column>
          <el-table-column
            prop="AopStability09.Float64"
            label="AopStability09">
          </el-table-column>
          <el-table-column
            prop="AopStability10.Float64"
            label="AopStability10">
          </el-table-column>
          <el-table-column
            prop="AopStabilityDelta.Float64"
            label="AopStabilityDelta">
          </el-table-column>
          <el-table-column
            prop="BandWidth.Float64"
            label="BandWidth">
          </el-table-column>
          <el-table-column
            prop="CaseTemperature.Float64"
            label="CaseTemperature">
          </el-table-column>
          <el-table-column
            prop="CenterSensitivity.Float64"
            label="CenterSensitivity">
          </el-table-column>
          <el-table-column
            prop="Comments.String"
            label="Comments"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            prop="CommitVer.String"
            label="CommitVer"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            prop="Current5V.Float64"
            label="Current5V">
          </el-table-column>
          <el-table-column
            prop="DacApc.Float64"
            label="DacApc">
          </el-table-column>
          <el-table-column
            prop="DacApd.Float64"
            label="DacApd">
          </el-table-column>
          <el-table-column
            prop="DacCross.Float64"
            label="DacCross">
          </el-table-column>
          <el-table-column
            prop="DacEA.Float64"
            label="DacEA">
          </el-table-column>
          <el-table-column
            prop="DacLos.Float64"
            label="DacLos">
          </el-table-column>
          <el-table-column
            prop="DacMod.Float64"
            label="DacMod">
          </el-table-column>
          <el-table-column
            prop="EAAbsorb.Float64"
            label="EAAbsorb">
          </el-table-column>
          <el-table-column
            prop="ErrorCode.String"
            label="ErrorCode">
          </el-table-column>
          <el-table-column
            prop="InfoApc.String"
            label="InfoApc"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            prop="InfoApd.String"
            label="InfoApd"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            prop="InfoCross.String"
            label="InfoCross"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            prop="InfoEA.String"
            label="InfoEA"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            prop="InfoLos.String"
            label="InfoLos"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            prop="InfoMod.String"
            label="InfoMod"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            prop="LogAction.String"
            label="LogAction">
          </el-table-column>
          <el-table-column
            prop="MARGIN.Float64"
            label="MARGIN">
          </el-table-column>
          <el-table-column
            prop="ModuleSn.String"
            label="ModuleSn">
          </el-table-column>
          <el-table-column
            prop="OVERLOAD.Float64"
            label="OVERLOAD">
          </el-table-column>
          <el-table-column
            prop="Operator.String"
            label="Operator">
          </el-table-column>
          <el-table-column
            prop="PValue.String"
            label="PValue">
          </el-table-column>
          <el-table-column
            prop="Parameter.String"
            label="Parameter">
          </el-table-column>
          <el-table-column
            prop="PathPenalty.Float64"
            label="PathPenalty">
          </el-table-column>
          <el-table-column
            prop="PchLx.String"
            label="PchLx">
          </el-table-column>
          <el-table-column
            prop="PeakWavelength.Float64"
            label="PeakWavelength">
          </el-table-column>
          <el-table-column
            prop="RXI.Float64"
            label="RXI">
          </el-table-column>
          <el-table-column
            prop="RunCount.Int64"
            label="RunCount">
          </el-table-column>
          <el-table-column
            prop="RunTime.Int64"
            label="RunTime">
          </el-table-column>
          <el-table-column
            prop="SDASSERT.Float64"
            label="SDASSERT">
          </el-table-column>
          <el-table-column
            prop="SDDASSERT.Float64"
            label="SDDASSERT">
          </el-table-column>
          <el-table-column
            prop="SENSITIVITY.Float64"
            label="SENSITIVITY">
          </el-table-column>
          <el-table-column
            prop="SIGMA.Float64"
            label="SIGMA">
          </el-table-column>
          <el-table-column
            prop="SMSR.Float64"
            label="SMSR">
          </el-table-column>
          <el-table-column
            prop="SetVcc.Float64"
            label="SetVcc">
          </el-table-column>
          <el-table-column
            prop="SoftVersion.String"
            label="SoftVersion">
          </el-table-column>
          <el-table-column
            prop="StationId.String"
            label="StationId">
          </el-table-column>
          <el-table-column
            prop="TE.Float64"
            label="TE">
          </el-table-column>
          <el-table-column
            prop="TXI.Float64"
            label="TXI">
          </el-table-column>
          <el-table-column
            prop="TecTemperature.Float64"
            label="TecTemperature">
          </el-table-column>
          <el-table-column
            prop="Temperature.Float64"
            label="Temperature">
          </el-table-column>
          <el-table-column
            prop="TxAOP.Float64"
            label="TxAOP">
          </el-table-column>
          <el-table-column
            prop="TxCROSS.Float64"
            label="TxCROSS">
          </el-table-column>
          <el-table-column
            prop="TxER.Float64"
            label="TxER">
          </el-table-column>
          <el-table-column
            prop="TxOffPOWER.Float64"
            label="TxOffPOWER">
          </el-table-column>
          <el-table-column
            prop="TxPPJ.Float64"
            label="TxPPJ">
          </el-table-column>
          <el-table-column
            prop="TxTF.Float64"
            label="TxTF">
          </el-table-column>
          <el-table-column
            prop="TxTR.Float64"
            label="TxTR">
          </el-table-column>
          <el-table-column
            prop="Version.String"
            label="Version">
          </el-table-column>
        </el-table>
    </el-dialog> -->
  </div>
</template>

<script>
import axios from 'axios'
import Highcharts from 'highcharts'
import Charts from '@/components/chart/Chart'
export default {
  name: 'OsaQualityWorkOrderStatistics',
  components: {
    Charts
  },
  mounted () {
  },
  methods: {
    // 工单号下拉按钮获取工单数据
    test_visible_change (test) {
      if (test === true) {
        this.searchRight()
      } else {
        this.optionsWorkOrder = []
      }
    },
    // 获取工单号选择框的数据
    searchRight () {
      let that = this
      const mes = that.$message({
        message: '正在搜索工号中，请耐心等待!',
        center: true,
        duration: 0
      })
      console.log(that.ruleForm.valueFinish)
      that.optionsWorkOrder = []
      that.statesWorkOrder = []
      console.log(that.ruleForm.value2)
      if (that.ruleForm.value2 !== null && that.ruleForm.value2 !== null) {
        that.ruleForm.value2[0] = that.moment(that.ruleForm.value2[0]).format('YYYY-MM-DD HH:mm:ss')
        // console.log(that.ruleForm.value2[0])
        that.ruleForm.value2[1] = that.moment(that.ruleForm.value2[1]).format('YYYY-MM-DD HH:mm:ss')
        that.$axios({
          method: 'get',
          url: '/display/product-statistic-query/osa/production-work-order-id-in-time',
          params: {
            startTime: that.ruleForm.value2[0],
            endTime: that.ruleForm.value2[1]
          }
        }).then(function (response) {
          console.log(response)
          const res = response.data
          if (res !== null) {
            for (let i = 0; i < res.length; i++) {
              that.statesWorkOrder.push({
                label: res[i],
                value: res[i]
              })
            }
            mes.close()
            that.$message({
              type: 'success',
              message: '已搜索到当前条件下的工单号！'
            })
            that.optionsWorkOrder = that.statesWorkOrder
          } else {
            mes.close()
            that.$message({
              type: 'error',
              message: '当前搜索条件无工单号！'
            })
          }
        }).catch(function (err) {
          mes.close()
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
      } else {
        mes.close()
        that.$message({
          type: 'error',
          message: '当前搜索条件无工单号！'
        })
      }
    },
    // 必填项获取数据
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message({
            message: '正在搜索中，请耐心等待!',
            center: true
          })
          this.loading = true
          let that = this
          that.cancel && that.cancel()

          that.$axios({
            method: 'get',
            url: '/display/product-statistic-query/osa/production-module-yield-info-by-osa-work-order-id',
            params: {
              osaOrderNum: that.ruleForm.searchWorkOrder
            },
            cancelToken: new axios.CancelToken((c) => {
              // 存储一个cancel函数用于取消本次的网络请求
              that.cancel = c
            })
          }).then(function (response) {
            console.log(response)
            const res = response.data
            that.orderModuleYieldData = []
            if (res !== null) {
              res.PassRate = res.PassRate.toFixed(2)
              that.orderModuleYieldData.push(res)
              that.$message({
                type: 'success',
                message: '已查找到该工单号下的模块良率数据！'
              })
            } else {
              that.$message({
                type: 'error',
                message: '暂无该工单号下的模块良率数据！'
              })
            }
          }).catch(function (err) {
            that.loading = false
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

          that.$axios({
            method: 'get',
            url: '/display/product-statistic-query/osa/production-yield-info-by-work-order-id',
            params: {
              workOrderId: that.ruleForm.searchWorkOrder
            },
            cancelToken: new axios.CancelToken((c) => {
              // 存储一个cancel函数用于取消本次的网络请求
              that.cancel = c
            })
          }).then(function (response) {
            console.log(response)
            const res = response.data
            if (res !== null) {
              that.loading = false
              that.data = res
              that.$message({
                type: 'success',
                message: '已查找到该工单号下的良率数据！'
              })
            } else {
              that.$message({
                type: 'error',
                message: '暂无该工单号下的良率数据！'
              })
              that.data = []
              that.loading = false
            }
            that.source && that.source()
            that.loadingRight = true
            that.$axios({
              method: 'get',
              url: '/display/product-statistic-query/osa/production-error-code-distribution-by-work-order-id',
              params: {
                workOrderId: that.ruleForm.searchWorkOrder
              },
              cancelToken: new axios.CancelToken((b) => {
                // 存储一个cancel函数用于取消本次的网络请求
                that.source = b
              })
            }).then(function (response) {
              console.log(response)
              const res = response.data
              if (res !== null) {
                for (let i = 0; i < res.length - 1; i++) {
                  for (let j = 0; j < res.length - i - 1; j++) {
                    if (res[j]['BadCount'] < res[j + 1]['BadCount']) {
                      var num = res[j]
                      res[j] = res[j + 1]
                      res[j + 1] = num
                    }
                  }
                }
                that.dataRight = res
                that.loadingRight = false
                that.$message({
                  type: 'success',
                  message: '已查找到该工单号下的不良率数据！'
                })
                // 计算不良占投入
                var Listchart = []
                console.log(that.data)
                console.log(that.dataRight)
                var colors = ['green', 'yellow', 'pink']
                if (that.data.length !== 0) {
                  var data = JSON.parse(JSON.stringify(that.data))
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
                    for (let y = 0; y < that.dataRight.length; y++) {
                      if (data[x]['Process'] === that.dataRight[y]['Process']) {
                        list.push(that.dataRight[y])
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
                for (let n = 0; n < that.dataRight.length - 1; n++) {
                  for (let m = 0; m < that.dataRight.length - n - 1; m++) {
                    if (that.dataRight[m]['BadCount'] < that.dataRight[m + 1]['BadCount']) {
                      let num = that.dataRight[m]
                      that.dataRight[m] = that.dataRight[m + 1]
                      that.dataRight[m + 1] = num
                    }
                  }
                }
                // console.log(that.dataRight.slice(0, 5))
                var chartData = Listchart
                var chart = []
                var xAxisList = []
                var numlist = []
                that.option8.series = that.seriesTop3
                that.option8.legend.enabled = true
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
                console.log(that.option8.series)
                console.log(numlist)
                for (let i = 0; i < 3; i++) {
                  var idata = []
                  for (let k = 0; k < chart.length; k++) {
                    if (chart[k]['Process'] === numlist[i]) {
                      idata.push(chart[k])
                    }
                  }
                  that.option8.series[i].name = numlist[i]
                  that.option8.series[i].data = idata
                }
                console.log(that.option8.series[0].data)
                console.log(numlist)
                console.log(xAxisList)
                console.log(chart)
                that.option8.xAxis.categories = xAxisList
                // that.option8.series[0].data = chart
                // that.option8.series[1].data = chart
                console.log(that.option8)
                Highcharts.chart(that.id8, that.option8)
              } else {
                that.$message({
                  type: 'error',
                  message: '暂无该工单号下的不良率数据！'
                })
                that.dataRight = []
                that.loading = false
              }
            }).catch(function (err) {
              that.loading = false
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
          }).catch(function (err) {
            that.loading = false
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
          that.option8.xAxis.categories = []
          that.option8.series[0].data = []
          that.option8.yAxis.max = null
          Highcharts.chart(that.id8, that.option8)
        } else {
          this.$message({
            type: 'warning',
            message: ' 请填写必填项！'
          })
          return false
        }
      })
    },
    // 点击行显示图
    only_row_chart (row, column, event) {
      console.log(row['Process'])
      var chartlist = []
      this.option8.series = this.seriesOnly
      this.option8.legend.enabled = false
      if (this.dataRight.length !== 0) {
        for (let i = 0; i < this.dataRight.length; i++) {
          if (row['Process'] === this.dataRight[i]['Process']) {
            chartlist.push(this.dataRight[i])
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
        this.option8.xAxis.categories = xAxisList
        this.option8.series[0].data = chart
        Highcharts.chart(this.id8, this.option8)
      }
    }
  },
  data () {
    return {
      cancel: null, // 存放取消的请求方法
      source: null,
      orderModuleYieldData: [],
      id8: 'high',
      searchIf: false,
      searchUnIf: true,
      currentPage: 1,
      pageSize: 20,
      searchPn: '',
      Process: '',
      workOrderModel: '',
      startTime: '',
      endTime: '',
      loading: false,
      loadingRight: false,
      modifydialogVisible: false,
      workOlderLoading: false,
      localStorageOldData: [],
      localStorageNewData: [],
      time: [],
      data: [],
      topdata: [],
      dataRight: [],
      workOlderData: [],
      states: [],
      statesWorkOrder: [],
      optionsPn: [],
      optionsWorkOrder: [],
      ruleForm: {
        searchPn: '',
        valueFinish: '',
        value2: [],
        searchWorkOrder: ''
      },
      rules: {
        searchWorkOrder: {required: true, message: '请输入工单号', trigger: 'blur'}
      },
      options: [{
        value: '正常品',
        label: '正常品'
      }, {
        value: '改制返工品',
        label: '改制返工品'
      }],
      optionsFinish: [{
        value: 'yes',
        label: '已结案'
      }, {
        value: 'no',
        label: '未结案'
      }],
      valueFinish: '',
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
      // ruleForm.value2
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
      // highcharts图
      option8: {
        chart: {
          type: 'column'
        },
        title: {
          text: '不良-TOP'
        },
        xAxis: {
          type: 'category',
          categories: []
        },
        yAxis: {
          title: {
            text: '不良数量(个)'
          }
        },
        tooltip: {
          formatter: function () {
            return '<b>工序：' + this.point.Process + '<b/><br><b>不良代码：' + (this.point.name).split(':')[1] + '<b/><br><b>不良数量：' + this.point.y + '<b/><br><b>不良描述：' + this.point.describe + '</b>'
          }
          // headerFormat: '<span>' + this.x + '[{point.x}]</span>',
          // pointFormat: '<br><p>' + data.UpdateReason + '</p>' + '<br><p>修改前：' + data.OldValue + '</p>' + '<br><p>修改后：' + data.NewValue + '</p>'
        },
        plotOptions: {
          series: {
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
                localStorage.setItem('workOlderTemp', e.point.name + ',' + e.point.Process)
                console.log(e.point.category)
                // this.test = e.point.category
                // console.log()
                // var dicts = {'2.0_2.5': 19, '2.5_3.0': 20, '1.5_2.0': 10}
                // this.global_func(dicts)
              }
            }
          }
        },
        legend: {
          enabled: false,
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
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.OsaQualityWorkOrderStatistics{
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
.OsaQualityWorkOrderStatistics >>> .el-table thead {
    color: white !important;
    background-color: rgb(84, 92, 100) !important;
}
.OsaQualityWorkOrderStatistics >>> .el-table th, .el-table tr{
    background-color: rgb(84, 92, 100) !important;
}
.OsaQualityWorkOrderStatistics >>>.el-table td, .el-table th.is-leaf {
  background-color: rgb(84, 92, 100);
  border-bottom-width: 0px !important;
  color: white;
}
.el-table >>> tbody tr:hover>td {
  background-color: #90c0f1;
}
</style>
