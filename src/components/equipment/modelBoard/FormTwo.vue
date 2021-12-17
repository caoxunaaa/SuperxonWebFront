<template>
<div class="formtwo" style="background-color: #ffffff;">
  <download-excel
      class = "export-excel-wrapper"
      style="float: left;"
      :data = "tableData"
      name = "设备excel表格.xls"
    >
      <el-button type="primary" class="el-button--small">导出Excel表格</el-button>
  </download-excel>
  <h2 style="color: white; font-size: 19px">当前工位实时效率</h2>
   <el-table
    :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
    style="width: 99%"
    height="375"
    :row-class-name="tableRowClassName">
    <el-table-column
      label="ID"
      type="index"
      width="50">
    </el-table-column>
    <el-table-column
      prop="StationId"
      label="设备编号"
      width="80">
    </el-table-column>
    <!-- <el-table-column
      prop="state"
      label="状态"
      width="90">
    </el-table-column> -->
    <el-table-column
      prop="Pn"
      label="在制PN"
      width="180">
    </el-table-column>
    <el-table-column
      prop="LogAction"
      label="工序"
      width="150">
    </el-table-column>
    <el-table-column
      prop="TotalNum"
      label="投入总数"
      width="80">
    </el-table-column>
    <el-table-column
      prop="TotalPass"
      label="通过总数"
      width="80">
    </el-table-column>
    <el-table-column
      prop="PassRate"
      label="良率">
    </el-table-column>
    <!-- <el-table-column
      prop="yieldReminder"
      label="良率提醒"
      width="100">
    </el-table-column> -->
  </el-table>
  <div class="block">
            <el-pagination align='center'
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[7]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.length">
            </el-pagination>
  </div>
</div>
</template>

<script>
export default {
  name: 'FormTwo',
  methods: {
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
    formatter (row, column) {
      return row.address
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
        url: '/display/product-operation-info/module/overview/station-product-info-of-module-today'
      }).then(function (response) {
        const res = response.data
        if (res !== null) {
          that.tableData = res
          console.log(that.tableData)
          // console.log(typeof (that.tableData[0]['StationId']))
          // console.log(typeof (that.tableData[0]['Pn']))
          // console.log(typeof (that.tableData[0]['LogAction']))
          // console.log(typeof (that.tableData[0]['TotalNum']))
          // console.log(typeof (that.tableData[0]['TotalPass']))
          // console.log(typeof (that.tableData[0]['PassRate']))
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
      }, 15000)
    },
    // 根据良率修改当前行的颜色
    tableRowClassName ({row, rowIndex}) {
      // console.log(Number((row.PassRate).replace('%', '')))
      if (Number((row.PassRate).replace('%', '')) <= 70) {
        return 'Danger-row'
      } else if (Number((row.PassRate).replace('%', '')) <= 90 && Number((row.PassRate).replace('%', '')) > 70) {
        return 'Pass-row'
      } else if (Number((row.PassRate).replace('%', '')) > 90) {
        return 'Excellent-row'
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
  },
  beforeDestroy () {
    clearInterval(this.timerTwo)
    clearInterval(this.timer)
  },
  data () {
    return {
      currentPage: 1,
      pageSize: 7,
      tableData: []
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
*{
  padding: 4px;
  margin: 2px;
  font-size: 5px;
}
.block{
  background: rgb(84, 92, 100);
  margin: 0;
  min-width: 0;
}
.el-pagination{
  white-space: pre-line;
}
.formtwo{
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: 1px solid #909399;
  background-color: rgb(84, 92, 100)!important
}
.el-table >>> .Danger-row {
  color: #000000 !important;
  background-color: #ff0000 !important;
}
.el-table >>> .Pass-row {
  color: #e6a23c !important;
  background-color: #fdf6ec !important;
}
.el-table >>> .Excellent-row {
  background: white;
}
.el-table td, .el-table th {
  padding: 0;
}
.block >>> .el-pagination__jump{
  color: white !important;
  margin-left: 0!important;
}
.el-table, .el-table__expanded-cell {
    background-color: rgb(84, 92, 100);
}
.formtwo >>> .el-table thead {
    color: white !important;
}
.formtwo >>> .el-table th, .el-table tr{
    background-color: rgb(84, 92, 100) !important;
}
.formtwo >>>.el-table td, .el-table th.is-leaf {
  background-color: rgb(84, 92, 100) !important;
  border-bottom-width: 0px !important;
  color: white;
}
.formtwo >>> .el-pagination__total {
  color: white !important;
}
</style>
