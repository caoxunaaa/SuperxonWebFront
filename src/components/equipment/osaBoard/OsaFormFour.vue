<template>
<div class="OsaFormFour" style="background-color: #ffffff;">
  <download-excel
      class = "export-excel-wrapper"
      style="float: left;"
      :data = "tableData"
      name = "计划excel表格.xls"
    >
      <el-button type="primary" class="el-button--small">导出Excel表格</el-button>
  </download-excel>
  <h2 style="color: white; font-size: 20px">{{message}}</h2>
  <div>
  <el-row :gutter="0">
    <el-col :span="15"><div>
      <el-table
    :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
    style="width: 100% "
    height="365"
    :row-class-name="tableRowClassName">
    <el-table-column
      prop="Id"
      label="ID"
      width="45">
    </el-table-column>
    <el-table-column
      prop="Type"
      label="产品类型"
      width="100">
    </el-table-column>
    <el-table-column
      prop="Code"
      label="产品代码"
      width="70">
    </el-table-column>
    <el-table-column
      prop="PlanToPay"
      label="计划交付"
      width="90">
    </el-table-column>
    <el-table-column
      prop="DoneToPay"
      label="已交付数量"
      width="90">
    </el-table-column>
    <el-table-column
      prop="yieldRate"
      label="达成率"
      width="90">
    </el-table-column>
  </el-table>
  <div class="block">
    <el-pagination align='center'
    small
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="[6]"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="tableData.length">
    </el-pagination>
  </div>
    </div></el-col>
    <el-col :span="8"><div style="width: 100%">
      <Charts :id="id" class="high" :option="optionOne"></Charts>
      </div></el-col>
  </el-row>
  </div>
</div>
</template>

<script>
import Charts from '@/components/chart/Chart'
import Highcharts from 'highcharts'
export default {
  name: 'OsaFormFour',
  components: {
    Charts
  },
  methods: {
    // 获取当前时间
    get_message () {
      this.timeData = new Date()
      this.timeData = this.moment(this.timeData).format('YYYY-MM-DD HH:mm:ss')
      this.timeData = this.timeData.slice(5, 7)
      const timedata = this.timeData.slice(0, 1)
      if (timedata === '0') {
        this.message = this.timeData.slice(1, 2) + '月生产交付计划'
      } else {
        this.message = this.timeData + '月生产交付计划'
      }
      // console.log(timedata)
      // console.log(this.timeData)
    },
    // 每页多少条
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
    },
    // 当前页
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
    },
    // 开启定时器，每隔30min获取一次新的数据
    setTimerTwo: function () {
      this.timerTwo = setInterval(() => {
        this.tableData = []
        this.get_data()
      }, 1000 * 60 * 30)
    },
    get_data () {
      let that = this
      that.$axios({
        method: 'get',
        url: '/display/product-operation-info/product-plan/completed-situation'
      }).then(function (response) {
        console.log(response)
        that.num = 0
        that.mun = 0
        const res = response.data
        if (res !== null) {
          // 总计
          for (let z = 0; z < res.length; z++) {
            that.num += res[z]['PlanToPay']
            that.mun += res[z]['DoneToPay']
          }
          res.push({'Id': '总计', 'PlanToPay': that.num, 'DoneToPay': that.mun})
          that.tableData = res
          console.log(typeof (res[1]['DoneToPay']))
          for (let i = 0; i < res.length; i++) {
            const data = parseFloat(res[i]['DoneToPay'] / res[i]['PlanToPay']).toFixed(4)
            that.tableData[i]['yieldRate'] = Number(data * 100).toFixed(2) + '%'
            // if (res[1]['DoneToPay'] !== 0) {
            //   console.log((res[i]['DoneToPay'] / res[i]['PlanToPay']).toFixed(4))
            // } else {
            //   that.tableData[i]['yieldRate'] = '0%'
            //   console.log('1')
            // }
          }
          for (let j = 0; j < that.tableData.length - 1; j++) {
            that.optionOne.series[0].data.push({'name': that.tableData[j]['Code'], 'y': Number(that.tableData[j]['PlanToPay'])})
            // that.option2.series[0].data.push({'name': Number(that.tableData[j]['Code']), 'y': Number(that.tableData[j]['DoneToPay'])})
            // that.optionOne.series[0].data.push({'y': Number(that.tableData[j]['PlanToPay'])})
            // that.optionOne.series[0].data[j]['y'] = that.tableData[j]['PlanToPay']
            // if (j === 0) {
            //   that.optionOne.series[0].data[0].push({'sliced': true})
            //   that.optionOne.series[0].data[0].push({'selected': true})
            // }
            // that.tableData[j]['PlanToPay']
            // that.tableData[j]['Code']
          }
          Highcharts.chart(that.id, that.optionOne)
          // console.log(that.tableData)
          // console.log(typeof (that.tableData[0]['Id']))
          // console.log(typeof (that.tableData[0]['Type']))
          // console.log(typeof (that.tableData[0]['Customers']))
          // console.log(typeof (that.tableData[0]['Code']))
          // console.log(typeof (that.tableData[0]['PlanToPay']))
          // console.log(typeof (that.tableData[0]['DoneToPay']))
        }
      }).catch(function (err) {
        console.log(err)
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
    // 开启定时器，自动换页
    setTimer: function () {
      this.timer = setInterval(() => {
        this.currentPage++
        if (this.currentPage >= (this.tableData.length / this.pageSize) + 1) {
          this.currentPage = 1
        }
      }, 10000)
    },
    tableRowClassName ({row, rowIndex}) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    }
  },
  mounted () {
    this.get_data()
    clearInterval(this.timerTwo)
    clearInterval(this.timer)
    this.setTimerTwo()
    this.setTimer()
    this.get_message()
  },
  beforeDestroy () {
    clearInterval(this.timer)
    clearInterval(this.timerTwo)
  },
  data () {
    return {
      // yieldData: 0,
      currentPage: 1,
      pageSize: 6,
      num: 0,
      mun: 0,
      tableData: [],
      message: '',
      timeData: '',
      id: 'highone',
      optionOne: {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: '计划交付占比'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>:  {point.percentage:.1f} %',
              style: {
                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
              }
            }
          }
        },
        series: [{
          name: '占比',
          colorByPoint: true,
          data: []
        }]
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
*{
  padding: 3px;
  margin: 1px;
  font-size: 5px;
}
.block{
  background: #e0dfdf;
  margin: 0;
  min-width: 0;
  background-color: rgb(84, 92, 100) !important;
}
.el-pagination{
  white-space: pre-line;
}
.OsaFormFour{
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: rgb(84, 92, 100) !important;
  border: 1px solid #a4a6aa;
}
.el-table .warning-row {
    background: oldlace;
}
.el-table .success-row {
  background: #f0f9eb;
}
.block >>> .el-pagination__jump{
    color: white !important;
    margin-left: 0!important;
}
.el-table, .el-table__expanded-cell {
    background-color: rgb(84, 92, 100);
}
.OsaFormFour >>> .el-table thead {
    color: white !important;
}
.OsaFormFour >>> .el-table th, .el-table tr{
    background-color: rgb(84, 92, 100) !important;
}
.OsaFormFour >>>.el-table td, .el-table th.is-leaf {
  background-color: rgb(84, 92, 100) !important;
  border-bottom-width: 0px !important;
  color: white;
}
.OsaFormFour >>> .el-pagination__total {
  color: white !important;
}
</style>
