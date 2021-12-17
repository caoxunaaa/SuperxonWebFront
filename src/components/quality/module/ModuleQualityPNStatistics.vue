<template>
  <div class="ModuleQualityPNStatistics">
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

            <!-- <span class="demonstration">时间段：</span>
            <el-date-picker
              v-model="value2"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right">
            </el-date-picker>
            <span class="demonstration">PN：</span>
            <el-input placeholder="请输入PN"  style="width: 200px;"
            v-model="searchPn"  class="input-with-select" >
            </el-input>
            <el-button slot="append" icon="el-icon-search" @click="Search"
            style="background-color: #409eff; color: #fff; height: 40px; width:80px"></el-button> -->
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
          @row-contextmenu="openDetail">
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
            prop="Sequence"
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
            prop="FinalOk"
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
            prop="Sequence"
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
            prop="ErrorCount"
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
      <el-col :span="12">
        <div id="Cpk" style="height:400px;background-color:rgb(84, 92, 100)"></div>
      </el-col>
      <el-col :span="12">
        <div id="Pow" style="height:400px;background-color:rgb(84, 92, 100)"></div>
      </el-col>
    </el-row>
    <br>
    <el-row :gutter="20">
      <el-col :span="24">
        <div id="line" style="height:400px;background-color:rgb(84, 92, 100)"></div>
      </el-col>
    </el-row>
    <!--剩余图的弹窗-->
    <el-dialog
    v-if="chartdialogVisible"
    :visible.sync="chartdialogVisible"
    width="1400px"
    append-to-body>
      <h2 style="text-align:center">{{selectvalue}}</h2>
      <h3 style="color: red">常规项 - CPK</h3>
      <div id="general" style="border:1px dashed #000;text-align:center;"></div>
      <h3 style="color: red">RSSI - CPK</h3>
      <div id="rssi" style="border:1px dashed #000;text-align:center;"></div>
    </el-dialog>
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
            :data = "workOlderDataExcel"
            name = "模块PN搜索不良项详情excel表格.xls"
          >
            <el-button type="primary" class="el-button--small" style="padding:0">导出Excel表格</el-button>
        </download-excel>
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
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import Charts from '@/components/chart/Chart'
import Highcharts from 'highcharts'
export default {
  name: 'ModuleQualityPNStatistics',
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
    // 监听传过来的PN
    this.watch_pn()
    // this.get_moduleList()
    // var dicts = {'2.0_2.5': 19, '2.5_3.0': 20, '1.5_2.0': 10}
    // this.global_func(dicts)
    clearInterval(this.timer)
    localStorage.removeItem('temp')
    this.setTimer()
  },
  watch: {
    generalItems: {
      handler: function (newVal, oldVal) {
        console.log(newVal, oldVal)
        if (newVal === 4) {
          // 执行常规项画图
          console.log('可执行常规项画图')
          this.get_general_CPK_data(this.generalItemsHistogram, this.generalItemsNormal, this.generalScope, this.generalText)
        } else {
          this.button1 = true
        }
      },
      deep: true
    },
    chartdialogVisible: {
      handler: function (newVal, oldVal) {
        if (newVal === false) {
          this.selectvalue = ''
        }
      }
    },
    rssiItems: {
      handler: function (newVal, oldVal) {
        if (newVal === 4) {
          // 执行RSSI画图
          console.log('执行RSSI画图')
          // this.button2 = false
          this.get_rssi_CPK_data(this.rssiItemsHistogram, this.rssiItemsNormal, this.rssiScope, this.rssiText)
        } else {
          this.button2 = true
        }
      }
    }
  },
  methods: {
    // 监听PN
    watch_pn () {
      console.log(localStorage.getItem('PN'))
      if (localStorage.getItem('PN') !== null) {
        var one = localStorage.getItem('PN').split(',')[0]
        var two = localStorage.getItem('PN').split(',')[1]
        this.ruleForm.searchPn = one
        if (two === 'TRX正常品') {
          this.value = '选项1'
        } else {
          this.value = '选项2'
        }
        this.submitForm('ruleForm')
        localStorage.removeItem('PN')
      }
    },
    // 修改左上表格的行样式
    RowStyle (row, rowindex) {
      // console.log(row['row']['Process'])
      if (row['row']['Process'] === '总计') {
        // console.log('1')
        return 'select-row'
      } else {
        if (Number(row['row']['Sequence']) <= 350 & Number(row['row']['Sequence']) >= 230) {
          console.log('1')
          if (Number(row['row']['Sequence']) === 288 || Number(row['row']['Sequence']) === 348) {
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
    },
    // 监听缓存中的值
    setTimer: function () {
      this.timer = setInterval(() => {
        if (localStorage.getItem('temp') !== null) {
          // console.log('temp有值')
          // console.log(localStorage.getItem('temp'))
          // console.log(typeof (localStorage.getItem('temp')))
          this.localStorageNewData = localStorage.getItem('temp')
          // localStorage.setItem('temp', '')
          // console.log(localStorage.getItem('temp'))
          // console.log(typeof (localStorage.getItem('temp')))
          // console.log(this.localStorageNewData)
          // console.log(this.localStorageOldData)
          // console.log(typeof (this.localStorageOldData))
          // console.log(typeof (this.localStorageNewData))
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
              url: '/display/product-statistic-query/module/production-bad-code-detail-by-pn',
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
              // console.log(res)
              if (res !== null) {
                that.workOlderData = []
                that.workOlderData = res
                for (let i = 0; i < res.length; i++) {
                  let temp = {}
                  for (let key in res[i]) {
                    if (res[i][key].Int64 !== undefined) {
                      temp[key] = res[i][key].Int64
                    } else if (res[i][key].String !== undefined) {
                      temp[key] = res[i][key].String
                    } else if (res[i][key].Float64 !== undefined) {
                      temp[key] = res[i][key].Float64
                    }
                  }
                  that.workOlderDataExcel.push(temp)
                }
                console.log('that.workOlderDataExcel', that.workOlderDataExcel)
              } else {
                that.workOlderData = []
                that.$message({
                  type: 'error',
                  message: '暂无数据！'
                })
              }
              that.workOlderLoading = false
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
          } else {
            // console.log('缓存没有发生变化')
          }
        } else {
          this.localStorageOldData = '0'
          // console.log(this.localStorageOldData)
          // console.log('缓存为空')
        }
      }, 500)
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
          url: '/display/common-source/all-module-pn-list-in-time-period',
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
                label: res[i]['Pn'],
                value: res[i]['Pn']
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
    // 取消请求
    cancelQuest () {
      if (typeof this.source === 'function') {
        this.source('终止请求') // 取消请求
      }
    },
    // 获取左图表数据
    get_tableData () {
      this.get_data()
      this.get_cpk_pow_data()
      this.loading = true
      // console.log(this.value)
      if (this.value === '选项1') {
        this.workOrderTypeData = 'TRX正常品'
      } else if (this.value === '选项2') {
        this.workOrderTypeData = 'TRX改制返工品'
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
        url: '/display/product-statistic-query/module/production-yield-info-by-pn',
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
        const res = response.data
        if (res !== null) {
          console.log(response)
          var seqData = []
          var seqnum = 1
          for (let i = 0; i < res.length; i++) {
            if (Number(res[i]['Sequence']) <= 350 && Number(res[i]['Sequence']) >= 230) {
              seqData.push(res[i])
              if (Number(res[i]['Sequence']) !== 288 && Number(res[i]['Sequence']) !== 348) {
                seqnum = seqnum * res[i]['FinalPassRate'].split('%')[0] / 100
              }
            }
          }
          // console.log(seqData)
          for (let n = 0; n < seqData.length - 1; n++) {
            for (let m = 0; m < seqData.length - n - 1; m++) {
              if (Number(seqData[m]['FinalPassRate']) > Number(seqData[m + 1]['FinalPassRate'])) {
                let num = seqData[m]
                seqData[m] = seqData[m + 1]
                seqData[m + 1] = num
                // console.log(m)
              }
            }
          }
          that.topdata = []
          if (seqData.length >= 3) {
            for (let k = 0; k < 3; k++) {
              that.topdata.push(seqData[k])
            }
          }
          console.log(that.topdata)
          for (let n = 0; n < seqData.length - 1; n++) {
            for (let m = 0; m < seqData.length - n - 1; m++) {
              if (Number(seqData[m]['Sequence']) > Number(seqData[m + 1]['Sequence'])) {
                let num = seqData[m]
                seqData[m] = seqData[m + 1]
                seqData[m + 1] = num
                // console.log(m)
              }
            }
          }
          var all = String(seqnum.toFixed(2) * 100) + '%'
          // console.log(seqData)
          // console.log(all)
          seqData.push({Pn: seqData[0]['Pn'], Process: '总计', FinalPassRate: all})
          var bigData = []
          var frontData = []
          for (let i = 0; i < res.length; i++) {
            if (Number(res[i]['Sequence']) > 350) {
              bigData.push(res[i])
            }
          }
          for (let i = 0; i < res.length; i++) {
            if (Number(res[i]['Sequence']) < 230) {
              frontData.push(res[i])
            }
          }
          for (let f = 0; f < bigData.length - 1; f++) {
            for (let g = 0; g < bigData.length - f - 1; g++) {
              if (Number(bigData[g]['Sequence']) > Number(bigData[g + 1]['Sequence'])) {
                var num = bigData[g]
                bigData[g] = bigData[g + 1]
                bigData[g + 1] = num
              }
            }
          }
          for (let f = 0; f < frontData.length - 1; f++) {
            for (let g = 0; g < frontData.length - f - 1; g++) {
              if (Number(frontData[g]['Sequence']) > Number(frontData[g + 1]['Sequence'])) {
                var sum = frontData[g]
                frontData[g] = frontData[g + 1]
                frontData[g + 1] = sum
              }
            }
          }
          seqData = frontData.concat(seqData.concat(bigData))
          that.tableData = seqData
          that.loading = false
        } else {
          that.$message({
            type: 'error',
            message: '暂无数据！'
          })
          that.tableData = []
          that.badData = []
          that.loading = false
          that.option1.xAxis.categories = []
          that.option1.series[0].data = []
          that.option1.yAxis.max = null
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
      // 延时调用执行获取右图表的数据的方法
      // setTimeout(() => {
      //   this.get_badData()
      // }, 1000)
    },
    // 单机获取一行的图
    onlyRowChart (row, column, event) {
      console.log(row['Process'])
      var chartlist = []
      this.option1.series = this.seriesOnly
      this.option1.legend.enabled = false
      if (this.badData.length !== 0) {
        for (let i = 0; i < this.badData.length; i++) {
          if (row['Process'] === this.badData[i]['Sequence']) {
            chartlist.push(this.badData[i])
          }
        }
        var chartData = chartlist
        var chart = []
        var xAxisList = []
        for (let p = 0; p < chartData.length; p++) {
          xAxisList.push(chartData[p]['ErrorCode'])
          chart.push({'name': ':' + chartData[p]['ErrorCode'], 'y': chartData[p]['ErrorCount'], 'describe': chartData[p]['ErrorDescribe'], 'Process': chartData[p]['Sequence']})
        }
        console.log(xAxisList)
        console.log(chart)
        this.option1.xAxis.categories = xAxisList
        this.option1.series[0].data = chart
        Highcharts.chart(this.id1, this.option1)
      }
      // console.log(column)
      // console.log(event)
    },
    // 获取右上图表数据
    get_badData () {
      this.loadingright = true
      // console.log(this.value)
      if (this.value === '选项1') {
        this.workOrderTypeData = 'TRX正常品'
      } else if (this.value === '选项2') {
        this.workOrderTypeData = 'TRX改制返工品'
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
        url: '/display/product-statistic-query/module/production-bad-code-distribution-by-pn',
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
        if (response.data !== null) {
          that.badData = response.data
          // console.log(that.badData)
          // console.log(that.totalInput)
          // 计算不良占投入
          for (let i = 0; i < that.badData.length; i++) {
            // console.log(typeof (that.badData[i]['ErrorCount']))
            // console.log(that.badData[i]['Sequence'])
            // console.log(typeof (that.tableData[0]['TotalInput']))
            // console.log(that.tableData)
            for (let j = 0; j < that.tableData.length; j++) {
              if (that.tableData[j]['Process'] === that.badData[i]['Sequence']) {
                // console.log(that.tableData[j]['TotalInput'])
                // console.log(typeof (that.tableData[j]['TotalInput']))
                that.totalInput = that.tableData[j]['TotalInput']
                // console.log(that.totalInput)
                let data = parseFloat(that.badData[i]['ErrorCount'] / that.totalInput).toFixed(4)
                that.BadAccountsForTotalInvestment = Number(data * 100).toFixed(2) + '%'
                // console.log(that.BadAccountsForTotalInvestment)
                // console.log(typeof (this.BadAccountsForTotalInvestment))
                that.badData[i]['Error'] = that.BadAccountsForTotalInvestment
              }
            }
          }
          var Listchart = []
          console.log(that.topdata)
          var colors = ['green', 'yellow', 'pink']
          if (that.topdata.length !== 0) {
            for (let x = 0; x < that.topdata.length; x++) {
              var list = []
              for (let y = 0; y < that.badData.length; y++) {
                if (that.topdata[x]['Process'] === that.badData[y]['Sequence']) {
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
          // console.log(Listchart)
          for (let n = 0; n < that.badData.length - 1; n++) {
            for (let m = 0; m < that.badData.length - n - 1; m++) {
              if (that.badData[m]['ErrorCount'] < that.badData[m + 1]['ErrorCount']) {
                let num = that.badData[m]
                that.badData[m] = that.badData[m + 1]
                that.badData[m + 1] = num
              }
            }
          }
          // console.log(that.badData.slice(0, 5))
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
            if (name !== chartData[p]['Sequence']) {
              sort += 1
              name = chartData[p]['Sequence']
            }
            numlist.push(chartData[p]['Sequence'])
            xAxisList.push('TOP' + String(sort) + ':' + chartData[p]['ErrorCode'])
            chart.push({'name': 'TOP' + String(sort) + ':' + chartData[p]['ErrorCode'], 'y': chartData[p]['ErrorCount'], 'describe': chartData[p]['ErrorDescribe'], 'Process': chartData[p]['Sequence']})
          }
          numlist = Array.from(new Set(numlist))
          for (let i = 0; i < numlist.length; i++) {
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
          that.loadingright = false
        } else {
          that.$message({
            type: 'error',
            message: '暂无数据！'
          })
          that.badData = []
          that.loadingright = false
        }
      }).catch(function (err) {
        console.log(err)
        that.loadingright = false
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
    // 点击事件
    openDetail (row) {
      if (row['Process'] !== '总计') {
        let that = this
        that.chartdialogVisible = true
        that.rowprocess = row['Process']
        console.log(row)
        that.$axios({
          url: '/display/product-statistic-query/module/spec-condition-by-pn',
          method: 'get',
          params: {
            pn: that.ruleForm.searchPn,
            startTime: that.ruleForm.value2[0],
            endTime: that.ruleForm.value2[1],
            process: row['Process']
          }
        }).then(function (response) {
          console.log(response)
          const res = response.data
          if (res !== null) {
            that.selectvalue = res[0]['Pn'] + ',' + res[0]['Version'] + ',' + res[0]['DtFlag'] + ',' + res[0]['TemperFlag']
            that.get_test_select_data()
          }
        }).catch(function (err) {
          console.log(err)
        })
      }
    },
    // 获取所有图的数据
    get_test_select_data () {
      if (this.selectvalue !== '') {
        let that = this
        var textdata = that.selectvalue.split(',')
        that.generalItems = 0
        that.generalItemsHistogram = {}
        that.generalItemsNormal = {}
        that.rssiItems = 0
        that.rssiItemsHistogram = {}
        that.rssiItemsNormal = {}
        that.$axios({
          url: '/display/product-statistic-query/module/test-result-cpk-hist',
          method: 'get',
          params: {
            pn: that.ruleForm.searchPn,
            process: that.rowprocess,
            startTime: that.ruleForm.value2[0],
            endTime: that.ruleForm.value2[1]
          }
        }).then(function (response) {
          console.log('常规项CPK直方图：', response)
          that.generalItems = that.generalItems + 1
          const res = response.data
          if (res !== null) {
            that.generalItemsHistogram = res
          }
        })
        that.$axios({
          url: '/display/product-statistic-query/module/test-result-cpk-gaussian',
          method: 'get',
          params: {
            pn: that.ruleForm.searchPn,
            process: that.rowprocess,
            startTime: that.ruleForm.value2[0],
            endTime: that.ruleForm.value2[1],
            version: textdata[1],
            dtFlag: textdata[2],
            temperFlag: textdata[3]
          }
        }).then(function (response) {
          console.log('常规项CPK正态图：', response)
          that.generalItems = that.generalItems + 1
          const res = response.data
          console.log(that.generalItems)
          if (res !== null) {
            that.generalItemsNormal = res
          }
        })
        that.$axios({
          url: '/display/product-statistic-query/module/test-result-cpk-value',
          method: 'get',
          params: {
            pn: that.ruleForm.searchPn,
            process: that.rowprocess,
            startTime: that.ruleForm.value2[0],
            endTime: that.ruleForm.value2[1],
            version: textdata[1],
            dtFlag: textdata[2],
            temperFlag: textdata[3]
          }
        }).then(function (response) {
          console.log('常规项CPK文字描述：', response)
          that.generalItems = that.generalItems + 1
          const res = response.data
          console.log(that.generalItems)
          if (res !== null) {
            that.generalText = res
          }
        })
        that.$axios({
          url: '/display/product-statistic-query/module/test-spec-by-condition',
          method: 'get',
          params: {
            pn: that.ruleForm.searchPn,
            version: textdata[1],
            dtFlag: textdata[2],
            temperFlag: textdata[3]
          }
        }).then(function (response) {
          console.log('常规项CPK范围：', response)
          that.generalItems = that.generalItems + 1
          const res = response.data[0]
          if (res !== null) {
            that.generalScope = res
          }
        })
        that.$axios({
          url: '/display/product-statistic-query/module/rssi-result-cpk-hist',
          method: 'get',
          params: {
            pn: that.ruleForm.searchPn,
            process: that.rowprocess,
            startTime: that.ruleForm.value2[0],
            endTime: that.ruleForm.value2[1]
          }
        }).then(function (response) {
          console.log('RSSI CPK直方图：', response)
          that.rssiItems = that.rssiItems + 1
          const res = response.data
          if (res !== null) {
            that.rssiItemsHistogram = res
          }
        })
        that.$axios({
          url: '/display/product-statistic-query/module/rssi-result-cpk-gaussian',
          method: 'get',
          params: {
            pn: that.ruleForm.searchPn,
            process: that.rowprocess,
            startTime: that.ruleForm.value2[0],
            endTime: that.ruleForm.value2[1],
            version: textdata[1],
            dtFlag: textdata[2],
            temperFlag: textdata[3]
          }
        }).then(function (response) {
          console.log('RSSI CPK正态图：', response)
          that.rssiItems = that.rssiItems + 1
          const res = response.data
          if (res !== null) {
            that.rssiItemsNormal = res
          }
        })
        that.$axios({
          url: '/display/product-statistic-query/module/rssi-result-cpk-value',
          method: 'get',
          params: {
            pn: that.ruleForm.searchPn,
            process: that.rowprocess,
            startTime: that.ruleForm.value2[0],
            endTime: that.ruleForm.value2[1],
            version: textdata[1],
            dtFlag: textdata[2],
            temperFlag: textdata[3]
          }
        }).then(function (response) {
          console.log('RSSI CPK文字描述：', response)
          that.rssiItems = that.rssiItems + 1
          const res = response.data
          if (res !== null) {
            that.rssiText = res
          }
        })
        that.$axios({
          url: '/display/product-statistic-query/module/rssi-spec-by-condition',
          method: 'get',
          params: {
            pn: that.ruleForm.searchPn,
            version: textdata[1],
            dtFlag: textdata[2],
            temperFlag: textdata[3]
          }
        }).then(function (response) {
          console.log('RSSI CPK范围：', response)
          that.rssiItems = that.rssiItems + 1
          const res = response.data[0]
          if (res !== null) {
            that.rssiScope = res
          }
        })
      }
    },
    // 执行常规项CPK图的数据处理
    get_general_CPK_data (histogram, normal, generalScope, generalText) {
      console.log(Object.keys(histogram))
      // A2Ibias
      console.log(histogram.Smsr)
      console.log(normal.Smsr)
      var bht = []
      // var A2Ibias = []
      // var TxAop = []
      var text = []
      if (histogram.TxAop !== undefined && normal.TxAop !== undefined) {
        text.push(generalText['TxAop'])
        bht.push({title: 'TxAop', seriesdata: this.get_general_CPK_two_charts_data('TxAop-histogram', 'column', histogram.TxAop, generalScope['TxAopMax'], generalScope['TxAopMin'], 'TxAop-normal', 'spline', normal.TxAop)})
      }
      if (histogram.TxER !== undefined && normal.TxER !== undefined) {
        text.push(generalText['TxER'])
        bht.push({title: 'TxER', seriesdata: this.get_general_CPK_two_charts_data('TxER-histogram', 'column', histogram.TxER, generalScope['TxERMax'], generalScope['TxERMin'], 'TxER-normal', 'spline', normal.TxER)})
      }
      if (histogram.A2Ibias !== undefined && normal.A2Ibias !== undefined) {
        text.push(generalText['A2Ibias'])
        bht.push({title: 'A2Ibias', seriesdata: this.get_general_CPK_two_charts_data('A2Ibias-histogram', 'column', histogram.A2Ibias, generalScope['A2IbiasMax'], generalScope['A2IbiasMin'], 'A2Ibias-normal', 'spline', normal.A2Ibias)})
      }
      if (histogram.EaAbsorb !== undefined && normal.EaAbsorb !== undefined) {
        text.push(generalText['EaAbsorb'])
        bht.push({title: 'EaAbsorb', seriesdata: this.get_general_CPK_two_charts_data('EaAbsorb-histogram', 'column', histogram.EaAbsorb, generalScope['EaAbsorbMax'], generalScope['EaAbsorbMin'], 'EaAbsorb-normal', 'spline', normal.EaAbsorb)})
      }
      if (histogram.Sigma !== undefined && normal.Sigma !== undefined) {
        text.push(generalText['Sigma'])
        bht.push({title: 'Sigma', seriesdata: this.get_general_CPK_two_charts_data('Sigma-histogram', 'column', histogram.Sigma, generalScope['SigmaMax'], generalScope['SigmaMin'], 'Sigma-normal', 'spline', normal.Sigma)})
      }
      if (histogram.Smsr !== undefined && normal.Smsr !== undefined) {
        text.push(generalText['Smsr'])
        bht.push({title: 'Smsr', seriesdata: this.get_general_CPK_two_charts_data('Smsr-histogram', 'column', histogram.Smsr, generalScope['SmsrMax'], generalScope['SmsrMin'], 'Smsr-normal', 'spline', normal.Smsr)})
      }
      console.log('bht:', bht)
      var divGeneral = document.getElementById('general')
      for (let i = 0; i < bht.length; i++) {
        var oDiv = document.createElement('div')
        var p = document.createElement('p')
        oDiv.id = 'bht' + i
        p.id = 'bht' + i
        oDiv.style = 'width:39%;height:200px;text-align:center;display: inline-block;margin-right:1%;'
        p.style = 'width:9%;height:200px;text-align:center;display: inline-block;margin-right:1%;'
        divGeneral.appendChild(oDiv)
        divGeneral.appendChild(p)
        var test = '<p>样本n:' + text[i]['SampleNumber'] + '</p><p>规格上限:' + text[i]['Max'].toFixed(2) + '</p><p>规格下限:' + text[i]['Min'].toFixed(2) + '</p><p>样本均值:' + text[i]['Average'].toFixed(2) + '</p><p>标准差:' + text[i]['StandardDeviation'].toFixed(2) + '</p><p>CPK:' + text[i]['Cpk'].toFixed(2) + '</p>'
        p.innerHTML = test
        this.empStatices('bht' + i, bht[i], text[i], i)
      }
    },
    // 执行rssi CPK图的数据处理
    get_rssi_CPK_data (histogram, normal, rssiScope, rssiText) {
      var bht = []
      var text = []
      if (histogram.CP1 !== undefined && normal.CP1 !== undefined) {
        text.push(rssiText['CP1'])
        bht.push({title: 'CaliPoint1', seriesdata: this.get_rssi_CPK_two_charts_data('CaliPoint1-histogram', 'column', histogram.CP1, rssiScope['CaliPoint1Max'], rssiScope['CaliPoint1Min'], 'CaliPoint1-normal', 'spline', normal.CP1)})
      }
      if (histogram.CP2 !== undefined && normal.CP2 !== undefined) {
        text.push(rssiText['CP2'])
        bht.push({title: 'CaliPoint2', seriesdata: this.get_rssi_CPK_two_charts_data('CaliPoint2-histogram', 'column', histogram.CP2, rssiScope['CaliPoint2Max'], rssiScope['CaliPoint2Min'], 'CaliPoint2-normal', 'spline', normal.CP2)})
      }
      if (histogram.CP3 !== undefined && normal.CP3 !== undefined) {
        text.push(rssiText['CP3'])
        bht.push({title: 'CaliPoint3', seriesdata: this.get_rssi_CPK_two_charts_data('CaliPoint2-histogram', 'column', histogram.CP3, rssiScope['CaliPoint3Max'], rssiScope['CaliPoint3Min'], 'CaliPoint3-normal', 'spline', normal.CP3)})
      }
      if (histogram.CP4 !== undefined && normal.CP4 !== undefined) {
        text.push(rssiText['CP4'])
        bht.push({title: 'CaliPoint4', seriesdata: this.get_rssi_CPK_two_charts_data('CaliPoint2-histogram', 'column', histogram.CP4, rssiScope['CaliPoint4Max'], rssiScope['CaliPoint4Min'], 'CaliPoint4-normal', 'spline', normal.CP4)})
      }
      if (histogram.CP5 !== undefined && normal.CP5 !== undefined) {
        text.push(rssiText['CP5'])
        bht.push({title: 'CaliPoint5', seriesdata: this.get_rssi_CPK_two_charts_data('CaliPoint2-histogram', 'column', histogram.CP5, rssiScope['CaliPoint5Max'], rssiScope['CaliPoint5Min'], 'CaliPoint5-normal', 'spline', normal.CP5)})
      }
      if (histogram.CP6 !== undefined && normal.CP6 !== undefined) {
        text.push(rssiText['CP6'])
        bht.push({title: 'CaliPoint6', seriesdata: this.get_rssi_CPK_two_charts_data('CaliPoint2-histogram', 'column', histogram.CP6, rssiScope['CaliPoint6Max'], rssiScope['CaliPoint6Min'], 'CaliPoint6-normal', 'spline', normal.CP6)})
      }
      if (histogram.CP7 !== undefined && normal.CP7 !== undefined) {
        text.push(rssiText['CP7'])
        bht.push({title: 'CaliPoint7', seriesdata: this.get_rssi_CPK_two_charts_data('CaliPoint2-histogram', 'column', histogram.CP7, rssiScope['CaliPoint7Max'], rssiScope['CaliPoint7Min'], 'CaliPoint7-normal', 'spline', normal.CP7)})
      }
      if (histogram.CP8 !== undefined && normal.CP8 !== undefined) {
        text.push(rssiText['CP8'])
        bht.push({title: 'CaliPoint8', seriesdata: this.get_rssi_CPK_two_charts_data('CaliPoint2-histogram', 'column', histogram.CP8, rssiScope['CaliPoint8Max'], rssiScope['CaliPoint8Min'], 'CaliPoint8-normal', 'spline', normal.CP8)})
      }
      console.log('bht:', bht)
      var divGeneral = document.getElementById('rssi')
      for (let i = 0; i < bht.length; i++) {
        var oDiv = document.createElement('div')
        var p = document.createElement('p')
        oDiv.id = 'rssi' + i
        p.id = 'rssi' + i
        oDiv.style = 'width:39%;height:200px;text-align:center;display: inline-block;margin-right:1%'
        p.style = 'width:9%;height:200px;text-align:center;display: inline-block;margin-right:1%'
        divGeneral.appendChild(oDiv)
        divGeneral.appendChild(p)
        var test = '<p>样本n:' + text[i]['SampleNumber'] + '</p><p>规格上限:' + text[i]['Max'].toFixed(2) + '</p><p>规格下限:' + text[i]['Min'].toFixed(2) + '</p><p>样本均值:' + text[i]['Average'].toFixed(2) + '</p><p>标准差:' + text[i]['StandardDeviation'].toFixed(2) + '</p><p>CPK:' + text[i]['Cpk'].toFixed(2) + '</p>'
        p.innerHTML = test
        this.rssi_empStatices('rssi' + i, bht[i], text[i], i)
      }
    },
    // 画常规项图
    empStatices (id, data, text, i) {
      Highcharts.chart(id, {
        chart: {
          zoomType: 'x'
        },
        title: {
          text: data.title
        },
        xAxis: [{
          plotLines: [{
            color: '#FF4040',
            dashStyle: 'Dash',
            width: 1.5,
            value: data.seriesdata[0].min,
            zIndex: 5
          }, {
            color: '#FF4040',
            dashStyle: 'Dash',
            width: 1.5,
            value: data.seriesdata[0].max,
            zIndex: 5
          }]
        }, {
          opposite: true
        }],
        yAxis: [{}, {
          opposite: true
        }],
        plotOptions: {
          series: {
            pointPadding: 0,
            groupPadding: 0
          }
        },
        credits: {
          enabled: false // 禁用网址
        },
        series: data.seriesdata
      })
    },
    // 画rssi图
    rssi_empStatices (id, data, text, i) {
      Highcharts.chart(id, {
        chart: {
          zoomType: 'x'
        },
        title: {
          text: data.title
        },
        xAxis: [{
          plotLines: [{
            color: '#FF4040',
            dashStyle: 'Dash',
            width: 1.5,
            value: data.seriesdata[0].min,
            zIndex: 5
          }, {
            color: '#FF4040',
            dashStyle: 'Dash',
            width: 1.5,
            value: data.seriesdata[0].max,
            zIndex: 5
          }]
        }, {
          opposite: true
        }],
        yAxis: [{}, {
          opposite: true
        }],
        plotOptions: {
          series: {
            pointPadding: 0,
            groupPadding: 0
          }
        },
        credits: {
          enabled: false // 禁用网址
        },
        series: data.seriesdata
      })
    },
    // 常规项 CPK图
    get_general_CPK_two_charts_data (generalname, generaltype, generaldata, max, min, normalname, normaltype, normaldata) {
      var chartsData = []
      var generalkey = Object.keys(generaldata)
      var generalkeydata = []
      var generalkeyobject = {}
      var normalkeydata = []
      var normalkeyobject = {}
      var normalmarker = {
        radius: 0,
        lineWidth: 1,
        states: {
          hover: {
            enabled: false
          }
        }
      }
      console.log(generalkey)
      for (let i = 0; i < generalkey.length - 1; i++) {
        for (let j = 0; j < generalkey.length - i - 1; j++) {
          if (Number(generalkey[j + 1]) < Number(generalkey[j])) {
            var num = generalkey[j]
            generalkey[j] = generalkey[j + 1]
            generalkey[j + 1] = num
          }
        }
      }
      for (let i = 0; i < generalkey.length; i++) {
        generalkeydata.push({'x': Number(generalkey[i]), 'name': Number(generalkey[i]), 'y': generaldata[generalkey[i]]})
      }
      if (Number(generalkey[0]) < normaldata[0][0]) {
        normalkeydata.push({'x': Number(generalkey[0]), 'name': Number(generalkey[0]), 'y': 0})
      }
      for (let i = 0; i < normaldata.length; i++) {
        if (normaldata[i][0] > Number(generalkey[0]) && normaldata[i][0] < Number(generalkey[generalkey.length - 1])) {
          normalkeydata.push({'x': normaldata[i][0], 'name': normaldata[i][0], 'y': normaldata[i][1]})
        }
      }
      if (Number(generalkey[generalkey.length - 1]) > normaldata[normaldata.length - 1][0]) {
        normalkeydata.push({'x': Number(generalkey[generalkey.length - 1]), 'name': Number(generalkey[generalkey.length - 1]), 'y': 0})
      }
      generalkeyobject['name'] = generalname
      generalkeyobject['type'] = generaltype
      generalkeyobject['data'] = generalkeydata
      generalkeyobject['yAxis'] = 1
      generalkeyobject['max'] = max
      generalkeyobject['min'] = min
      console.log('generalkeyobject:', generalkeyobject)
      normalkeyobject['name'] = normalname
      normalkeyobject['type'] = normaltype
      normalkeyobject['xAxis'] = 1
      normalkeyobject['data'] = normalkeydata
      normalkeyobject['marker'] = normalmarker
      console.log('normalkeyobject:', normalkeyobject)
      chartsData.push(generalkeyobject)
      chartsData.push(normalkeyobject)
      return chartsData
    },
    // rssi CPK图
    get_rssi_CPK_two_charts_data (generalname, generaltype, generaldata, max, min, normalname, normaltype, normaldata) {
      var chartsData = []
      var generalkey = Object.keys(generaldata)
      var generalkeydata = []
      var generalkeyobject = {}
      var normalkeydata = []
      var normalkeyobject = {}
      var normalmarker = {
        radius: 0,
        lineWidth: 1,
        states: {
          hover: {
            enabled: false
          }
        }
      }
      console.log(generalkey)
      for (let i = 0; i < generalkey.length - 1; i++) {
        for (let j = 0; j < generalkey.length - i - 1; j++) {
          if (Number(generalkey[j + 1]) < Number(generalkey[j])) {
            var num = generalkey[j]
            generalkey[j] = generalkey[j + 1]
            generalkey[j + 1] = num
          }
        }
      }
      for (let i = 0; i < generalkey.length; i++) {
        generalkeydata.push({'x': Number(generalkey[i]), 'name': Number(generalkey[i]), 'y': generaldata[generalkey[i]]})
      }
      if (Number(generalkey[0]) < normaldata[0][0]) {
        normalkeydata.push({'x': Number(generalkey[0]), 'name': Number(generalkey[0]), 'y': 0})
      }
      for (let i = 0; i < normaldata.length; i++) {
        if (normaldata[i][0] > Number(generalkey[0]) && normaldata[i][0] < Number(generalkey[generalkey.length - 1])) {
          normalkeydata.push({'x': normaldata[i][0], 'name': normaldata[i][0], 'y': normaldata[i][1]})
        }
      }
      if (Number(generalkey[generalkey.length - 1]) > normaldata[normaldata.length - 1][0]) {
        normalkeydata.push({'x': Number(generalkey[generalkey.length - 1]), 'name': Number(generalkey[generalkey.length - 1]), 'y': 0})
      }
      generalkeyobject['name'] = generalname
      generalkeyobject['type'] = generaltype
      generalkeyobject['data'] = generalkeydata
      generalkeyobject['yAxis'] = 1
      generalkeyobject['max'] = max
      generalkeyobject['min'] = min
      console.log('generalkeyobject:', generalkeyobject)
      normalkeyobject['name'] = normalname
      normalkeyobject['type'] = normaltype
      normalkeyobject['xAxis'] = 1
      normalkeyobject['data'] = normalkeydata
      normalkeyobject['marker'] = normalmarker
      console.log('normalkeyobject:', normalkeyobject)
      chartsData.push(generalkeyobject)
      chartsData.push(normalkeyobject)
      return chartsData
    },
    // 关闭弹窗
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
          localStorage.removeItem('temp')
        })
        .catch(_ => {})
    },
    // 获取不良变化图的数据
    get_data () {
      let that = this
      that.linetable = []
      that.$axios({
        url: '/display/product-statistic-query/module/production-bad-code-top3-distribution-by-pn-in-week',
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
    // 作不良变化图
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
    // 获取cpk—pow变化图的数据
    get_cpk_pow_data () {
      let that = this
      that.$axios({
        url: '/display/product-statistic-query/module/production-avr-pow-and-cpk-by-pn-in-week',
        method: 'get',
        params: {
          pn: that.ruleForm.searchPn
        }
      }).then(function (response) {
        console.log('cpk—pow变化图的数据:', response)
        const res = response.data
        if (res !== null) {
          var data = [
            {name: 'TESTING-CPK', data: res['Cpk']['TESTING']},
            {name: 'TEST_10G-CPK', data: res['Cpk']['TEST_10G']}
          ]
          var pow = [
            {name: 'TESTING-POW', data: res['Pow']['TESTING']},
            {name: 'TEST_10G-POW', data: res['Pow']['TEST_10G']}
          ]
          that.get_cpk_pow_line('Cpk', data, 5)
          that.get_cpk_pow_line('Pow', pow, 15)
        }
      })
    },
    // 作cpk—pow变化图
    get_cpk_pow_line (name, data, num) {
      var datatime = []
      for (let i = 7; i > 0; i--) {
        var date = new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * i)
        var newday = this.moment(date).format('YYYY-MM-DD')
        datatime.push(newday)
      }
      var pName = ''
      if (name === 'Pow') {
        pName = '常温AOP均值'
      } else {
        pName = '常温CPK'
      }
      Highcharts.chart(name, {
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
          text: this.ruleForm.searchPn + ' 近7天' + pName + '变化',
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
          // min: 0,
          // max: num,
          title: {
            text: '值',
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
          // formatter: function () {
          //   return '<b>' + this.x + ' ' + '<br>不良代码：' + this.point.id + '<br>不良工序：' + this.point.process + '<br>不良占比：' + this.point.y + '%</b>'
          // }
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
        series: data
      })
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  data () {
    return {
      button1: true,
      button2: true,
      generalItems: 0,
      generalText: '',
      generalItemsHistogram: {},
      generalItemsNormal: {},
      generalScope: {},
      selectoptions: [],
      selectvalue: '',
      rssiItems: 0,
      rssiText: '',
      rssiItemsHistogram: {},
      rssiItemsNormal: {},
      rssiScope: {},
      linetable: [],
      cancel: null, // 存放取消的请求方法
      source: null,
      isLoading: false,
      id1: 'high1',
      temps: '',
      pn: '',
      proce: '',
      startTime: '',
      endTime: '',
      searchPn: '',
      Process: '',
      rowprocess: '',
      workOrderTypeData: '',
      max: 0,
      sum: 0,
      sumdata: 0,
      sundata: 0,
      localStorageNewData: '',
      localStorageOldData: '',
      BadAccountsForTotalInvestment: '',
      numdata: [],
      topdata: [],
      time: [],
      workOlderData: [],
      workOlderDataExcel: [],
      tableData: [],
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
        label: 'TRX正常品'
      }, {
        value: '选项2',
        label: 'TRX改制返工品'
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
                localStorage.removeItem('temp')
                setTimeout(() => {
                  localStorage.setItem('temp', e.point.name + ',' + e.point.Process)
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
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.ModuleQualityPNStatistics{
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
.ModuleQualityPNStatistics >>> .el-table thead {
    color: white !important;
    background-color: rgb(84, 92, 100) ;
}
.ModuleQualityPNStatistics >>> .el-table th, .el-table tr{
    background-color: rgb(84, 92, 100) ;
}
.ModuleQualityPNStatistics >>>.el-table td, .el-table th.is-leaf {
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
