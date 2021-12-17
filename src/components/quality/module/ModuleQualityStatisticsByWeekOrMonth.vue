<template>
  <div class="ModuleQualityStatisticsByWeekOrMonth">
    <div style="float: contour">
      <el-row :gutter="20" style="height: 70px">
        <el-col :span="4" :offset="4">
          <el-input placeholder="请输入PN" v-model="pn">
            <template slot="prepend"> PN</template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-tag type="info">月份</el-tag>
          <el-input-number v-model="year" controls-position="right" :min="2000">
          </el-input-number>
        </el-col>
        <el-col :span="4">
          <el-select v-model="orderType" placeholder="请选择工单类型">
            <el-option
              v-for="item in orderTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="1">
          <el-button @click="addStatisticData" type="primary">添加</el-button>
        </el-col>
        <el-col :span="1">
          <el-button @click="clearStatisticData" type="info">清空</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12" style="border:1px solid #909399">
          <Charts :id="idWeekChart" class="high" :option="optionWeekChart"></Charts>
        </el-col>
        <el-col :span="12" style="border:1px solid #909399">
          <Charts :id="idMonthChart" class="high" :option="optionMonthChart"></Charts>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12" style="border:1px solid #909399">
          <Charts :id="idWeekChartNormal" class="high" :option="optionWeekChartNormal"></Charts>
        </el-col>
        <el-col :span="12" style="border:1px solid #909399">
          <Charts :id="idMonthChartNormal" class="high" :option="optionMonthChartNormal"></Charts>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
import Highcharts from 'highcharts'
import Charts from '@/components/chart/Chart'
export default {
  name: 'ModuleQualityStatisticsByWeekOrMonth',
  components: {
    Charts
  },
  data () {
    return {
      pn: '',
      year: 2021,
      orderType: '',
      orderTypeOptions: [{
        value: '',
        label: ''
      }, {
        value: '正常品',
        label: '正常品'
      }],
      idWeekChart: 'week_chart',
      optionWeekChart: {
        chart: {
          type: 'spline'
        },
        title: {
          text: '按周统计年数据良率变化（全）'
        },
        xAxis: {
          type: 'category',
          categories: []
        },
        yAxis: {
          min: 0,
          max: 100,
          title: {
            text: '良率值'
          }
        },
        tooltip: {
          formatter: function () {
            return '<b>Pn：' + this.series.name + '<b/> ' +
              '<br>' +
              '<b>总投入：' + this.point.total_input + '<b/>' +
              '<br>' +
              '<b>良率：' + this.point.y + '<b/>'
          }
        },
        legend: {
          enabled: true
        },
        credits: {
          enabled: false // 禁用网址
        },
        series: [{
          name: '',
          data: [{x: 1, y: 0},
            {x: 54, y: 0}],
          visible: true,
          label: {
            enabled: false
          }
        }]
      },
      idMonthChart: 'month_chart',
      optionMonthChart: {
        chart: {
          type: 'spline'
        },
        title: {
          text: '按月统计年数据良率变化（全）'
        },
        xAxis: {
          type: 'category',
          categories: []
        },
        yAxis: {
          min: 0,
          max: 100,
          title: {
            text: '良率值'
          }
        },
        tooltip: {
          formatter: function () {
            return '<b>Pn：' + this.series.name + '<b/> ' +
              '<br>' +
              '<b>总投入：' + this.point.total_input + '<b/>' +
              '<br>' +
              '<b>良率：' + this.point.y + '<b/>'
          }
        },
        legend: {
          enabled: true
        },
        credits: {
          enabled: false // 禁用网址
        },
        series: [{
          name: '',
          data: [{x: 1, y: 0},
            {x: 12, y: 0}],
          visible: true,
          label: {
            enabled: false
          }
        }]
      },
      idWeekChartNormal: 'week_chart_normal',
      optionWeekChartNormal: {
        chart: {
          type: 'spline'
        },
        title: {
          text: '按周统计年数据良率变化（正常品）'
        },
        xAxis: {
          type: 'category',
          categories: []
        },
        yAxis: {
          min: 0,
          max: 100,
          title: {
            text: '良率值'
          }
        },
        tooltip: {
          formatter: function () {
            return '<b>Pn：' + this.series.name + '<b/> ' +
              '<br>' +
              '<b>总投入：' + this.point.total_input + '<b/>' +
              '<br>' +
              '<b>良率：' + this.point.y + '<b/>'
          }
        },
        legend: {
          enabled: true
        },
        credits: {
          enabled: false // 禁用网址
        },
        series: [{
          name: '',
          data: [{x: 1, y: 0},
            {x: 54, y: 0}],
          visible: true,
          label: {
            enabled: false
          }
        }]
      },
      idMonthChartNormal: 'month_chart_normal',
      optionMonthChartNormal: {
        chart: {
          type: 'spline'
        },
        title: {
          text: '按月统计年数据良率变化（正常品）'
        },
        xAxis: {
          type: 'category',
          categories: []
        },
        yAxis: {
          min: 0,
          max: 100,
          title: {
            text: '良率值'
          }
        },
        tooltip: {
          formatter: function () {
            return '<b>Pn：' + this.series.name + '<b/> ' +
              '<br>' +
              '<b>总投入：' + this.point.total_input + '<b/>' +
              '<br>' +
              '<b>良率：' + this.point.y + '<b/>'
          }
        },
        legend: {
          enabled: true
        },
        credits: {
          enabled: false // 禁用网址
        },
        series: [{
          name: '',
          data: [{x: 1, y: 0},
            {x: 12, y: 0}],
          visible: true,
          label: {
            enabled: false
          }
        }]
      }
    }
  },
  methods: {
    addStatisticData () {
      let that = this
      that.$axios({
        method: 'get',
        url: '/display/product-statistic-query/module/week-statistic-data-by-pn-and-year-and-orderType',
        params: {
          pn: that.pn,
          year: that.year,
          orderType: that.orderType
        }
      }).then(function (response) {
        let res = response.data
        if (res !== null) {
          console.log(res)
          that.$message({
            type: 'success',
            message: '周统计添加数据成功'
          })
          let weekChartData = {
            name: '',
            data: []
          }
          // 判断是否已经存在
          weekChartData.name = res.Pn
          for (let i = 0; i < res.Weeks.length; i++) {
            weekChartData.data.push({x: res.Weeks[i], y: Math.floor(res.Statistic[i] * 100 * 100) / 100, total_input: res.TotalInput[i]})
          }
          if (that.orderType === '') {
            that.optionWeekChart.series.push(weekChartData)
            Highcharts.chart(that.idWeekChart, that.optionWeekChart)
          } else {
            that.optionWeekChartNormal.series.push(weekChartData)
            Highcharts.chart(that.idWeekChartNormal, that.optionWeekChartNormal)
          }
        } else {
          that.$message({
            type: 'error',
            message: '周统计暂时没有数据！'
          })
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
            message: '周统计暂时没有数据！'
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
        url: '/display/product-statistic-query/module/month-statistic-data-by-pn-and-year-and-orderType',
        params: {
          pn: that.pn,
          year: that.year,
          orderType: that.orderType
        }
      }).then(function (response) {
        let res = response.data
        if (res !== null) {
          console.log(res)
          that.$message({
            type: 'success',
            message: '月统计添加数据成功'
          })
          let monthChartData = {
            name: '',
            data: []
          }
          // 判断是否已经存在
          monthChartData.name = res.Pn
          for (let i = 0; i < res.Months.length; i++) {
            monthChartData.data.push({x: res.Months[i], y: Math.floor(res.Statistic[i] * 100 * 100) / 100, total_input: res.TotalInput[i]})
          }
          if (that.orderType === '') {
            that.optionMonthChart.series.push(monthChartData)
            Highcharts.chart(that.idMonthChart, that.optionMonthChart)
          } else {
            that.optionMonthChartNormal.series.push(monthChartData)
            Highcharts.chart(that.idMonthChartNormal, that.optionMonthChartNormal)
          }
        } else {
          that.$message({
            type: 'error',
            message: '月统计暂时没有数据！'
          })
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
            message: '月统计暂时没有数据！'
          })
        } else if (err.response.status === 504) {
          that.$message({
            type: 'error',
            message: '服务器未响应！'
          })
        }
      })
    },
    clearStatisticData () {
      window.location.reload()
    }
  }
}
</script>

<style scoped>

</style>
