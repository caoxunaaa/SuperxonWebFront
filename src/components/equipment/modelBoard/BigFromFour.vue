<template>
<div class="formfour" style="background-color: #ffffff;height: 955px">
  <!-- <download-excel
      class = "export-excel-wrapper"
      style="float: left;"
      :data = "tableData"
      name = "计划excel表格.xls"
    >
      <el-button type="primary" class="el-button--small">导出Excel表格</el-button>
  </download-excel> -->
  <h2 style="color: white; font-size: 40px">{{message}}</h2>
  <div>
    <el-row :gutter="20" style="height: 400px">
      <el-col :span="16"><div>
        <el-table
          border
          :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
          style="width: 100% "
          height="820"
          :row-style="{height: '60px'}"
          v-loading="loading"
          :row-class-name="tableRowClassName">
          <el-table-column
            prop="Id"
            label="ID"
            width="150">
          </el-table-column>
          <el-table-column
            prop="Type"
            label="产品类型"
            width="235">
          </el-table-column>
          <el-table-column
            prop="Code"
            label="产品代码"
            width="230">
          </el-table-column>
          <el-table-column
            prop="PlanToPay"
            label="计划交付"
            width="205">
          </el-table-column>
          <el-table-column
            prop="DoneToPay"
            label="已交付数量"
            width="205">
          </el-table-column>
          <el-table-column
            prop="yieldRate"
            label="达成率"
            width="205">
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
      </div></el-col>
      <el-col :span="7"><div style="width:100%;height:400px;">
        <Charts :id="id" class="high" :option="option1"></Charts>
        <Charts :id="id1" class="high" :option="option2"></Charts>
      </div></el-col>
  </el-row>
  </div>
</div>
</template>

<script>
import Charts from '@/components/chart/Chart'
import Highcharts from 'highcharts'
export default {
  name: 'BigFormFour',
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
      console.log(this.timeData)
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
      that.loading = true
      that.option1.series[0].data = []
      that.option2.series[0].data = []
      that.$axios({
        method: 'get',
        url: '/display/product-operation-info/product-plan/completed-situation'
      }).then(function (response) {
        const res = response.data
        that.loading = false
        if (res !== null) {
          // 总计
          for (let z = 0; z < res.length; z++) {
            that.num += res[z]['PlanToPay']
            that.mun += res[z]['DoneToPay']
          }
          res.push({'Id': '总计', 'PlanToPay': that.num, 'DoneToPay': that.mun})
          that.tableData = res
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
          // console.log(that.tableData)
          // console.log(typeof (that.tableData[0]['Id']))
          // console.log(typeof (that.tableData[0]['Type']))
          // console.log(typeof (that.tableData[0]['Customers']))
          // console.log(typeof (that.tableData[0]['Code']))
          // console.log(typeof (that.tableData[0]['PlanToPay']))
          // console.log(typeof (that.tableData[0]['DoneToPay']))
          for (let j = 0; j < that.tableData.length - 1; j++) {
            that.option1.series[0].data.push({'name': that.tableData[j]['Code'], 'y': Number(that.tableData[j]['PlanToPay'])})
            if (Number(that.tableData[j]['DoneToPay']) !== 0) {
              that.option2.series[0].data.push({'name': that.tableData[j]['Code'], 'y': Number(that.tableData[j]['DoneToPay'])})
            }
            // that.option1.series[0].data.push({'y': Number(that.tableData[j]['PlanToPay'])})
            // that.option1.series[0].data[j]['y'] = that.tableData[j]['PlanToPay']
            // if (j === 0) {
            //   that.option1.series[0].data[0].push({'sliced': true})
            //   that.option1.series[0].data[0].push({'selected': true})
            // }
            // that.tableData[j]['PlanToPay']
            // that.tableData[j]['Code']
          }
          console.log(that.option2.series[0].data)
          Highcharts.chart(that.id, that.option1)
          Highcharts.chart(that.id1, that.option2)
        }
      }).catch(function (err) {
        console.log(err)
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
      currentPage: 1,
      pageSize: 15,
      mun: 0,
      num: 0,
      loading: false,
      tableData: [],
      message: '',
      timeData: '',
      id: 'high1',
      id1: 'high2',
      option1: {
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
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              style: {
                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
              }
            }
          }
        },
        series: [{
          name: 'Brands',
          colorByPoint: true,
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
          text: '已交付占比'
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
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              style: {
                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
              }
            }
          }
        },
        series: [{
          name: 'Brands',
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
  font-size: 25px;
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
.formfour{
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
.formfour >>> .el-table thead {
    color: white !important;
}
.formfour >>> .el-table th, .el-table tr{
    background-color: rgb(84, 92, 100) !important;
}
.formfour >>>.el-table td, .el-table th.is-leaf {
  background-color: rgb(84, 92, 100) !important;
  border-bottom-width: 0px !important;
  color: white;
}
.formfour >>> .el-pagination__total {
  color: white !important;
}
</style>
