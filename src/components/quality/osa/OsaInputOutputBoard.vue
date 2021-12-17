<template>
  <div class="OsaInputOutputBoard">
    <div style="height:40px">
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
    </el-form>
    <el-button slot="append" icon="el-icon-search" @click="submitForm('ruleForm')"
            style="background-color: #409eff; color: #fff; height: 40px; width:80px; float:left" ></el-button>
    </div>
    <br>
    <div style="height: 20px; width: 100%">
    <download-excel
        class = "export-excel-wrapper"
        style="float:left;background-color:white;"
        :data = "data"
        name = "投入产出excel表格.xls">
        <el-button type="primary" class="el-button--small" style="padding:0">导出Excel表格</el-button>
    </download-excel>
    </div>
    <el-table
      :data="data"
      v-loading="loading"
      :cell-style="columnStyle"
      :header-cell-style="headerStyle"
      max-height="700"
      style="width: 100%">
      <el-table-column
        prop="型号"
        label="型号"
        fixed
      ></el-table-column>
      <el-table-column
        prop="代码"
        label="代码"
      ></el-table-column>
      <el-table-column label="1G初测" align="center">
      <el-table-column
        prop="1G初测-投入"
        label="1G初测-投入"
      ></el-table-column>
      <el-table-column
        prop="1G初测-产出"
        label="1G初测-产出"
      ></el-table-column>
      <el-table-column
        prop="1G初测-不良"
        label="1G初测-不良"
      ></el-table-column>
      <el-table-column
        prop="1G初测-不良占比"
        label="1G初测-不良占比"
      ></el-table-column>
      </el-table-column>
      <el-table-column label="10G初测" align="center">
      <el-table-column
        prop="10G初测-投入"
        label="10G初测-投入"
      ></el-table-column>
      <el-table-column
        prop="10G初测-产出"
        label="10G初测-产出"
      ></el-table-column>
      <el-table-column
        prop="10G初测-不良"
        label="10G初测-不良"
      ></el-table-column>
      <el-table-column
        prop="10G初测-不良占比"
        label="10G初测-不良占比"
      ></el-table-column>
      </el-table-column>
      <el-table-column label="终测" align="center">
      <el-table-column
        prop="终测-投入"
        label="终测-投入"
      ></el-table-column>
      <el-table-column
        prop="终测-产出"
        label="终测-产出"
      ></el-table-column>
      <el-table-column
        prop="终测-不良"
        label="终测-不良"
      ></el-table-column>
      <el-table-column
        prop="终测-不良占比"
        label="终测-不良占比"
      ></el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'OsaInputOutputBoard',
  components: {
  },
  mounted () {
    this.get_data()
  },
  methods: {
    // 改变列的颜色
    columnStyle ({row, column, rowIndex, columnIndex}) {
      if (row['型号'] === '总计') {
        // return 'Danger-row'
        return 'background: rgb(226, 94, 93) !important; color: white'
      }
      if (columnIndex === 0 || columnIndex === 1) {
        return 'background:rgb(217, 219, 220);'
      } else if (columnIndex === 2 || columnIndex === 3 || columnIndex === 4 || columnIndex === 5) {
        return 'background:#e6cc6f;'
      } else if (columnIndex === 6 || columnIndex === 7 || columnIndex === 8 || columnIndex === 9) {
        return 'background:rgb(200, 230, 111);'
      } else if (columnIndex === 10 || columnIndex === 11 || columnIndex === 12 || columnIndex === 13) {
        return 'background:rgb(111, 230, 203);'
      } else if (columnIndex === 14 || columnIndex === 15 || columnIndex === 16 || columnIndex === 17) {
        return 'background:rgb(143, 213, 241);'
      }
    },
    headerStyle ({row, column, rowIndex, columnIndex}) {
      if ((columnIndex === 0 || columnIndex === 1) && rowIndex === 0) {
        return 'background:rgb(217, 219, 220);'
      }
      const list = ['background:#e6cc6f;', 'background:rgb(200, 230, 111)', 'background:rgb(111, 230, 203)', 'background:rgb(143, 213, 241)']
      for (let i = 0; i < 4; i++) {
        if (rowIndex === 0 && columnIndex === (2 + i)) {
          return list[i]
        }
        if (rowIndex === 1 && (columnIndex === i * 4 || columnIndex === (i * 4 + 1) || columnIndex === (i * 4 + 2) || columnIndex === (i * 4 + 3))) {
          return list[i]
        }
      }
    },
    get_data () {
      this.time = this.ruleForm.value2
      this.startTime = this.moment(this.time[0]).format('YYYY-MM-DD HH:mm:ss')
      console.log(this.startTime)
      this.endTime = this.moment(this.time[1]).format('YYYY-MM-DD HH:mm:ss')
      let that = this
      that.allOneOneData = 0
      that.allOneTwoData = 0
      that.allOneThreeData = 0
      that.allTwoOneData = 0
      that.allTwoTwoData = 0
      that.allTwoThreeData = 0
      that.allThreeOneData = 0
      that.allThreeTwoData = 0
      that.allThreeThreeData = 0
      that.allFourOneData = 0
      that.allFourTwoData = 0
      that.allFourThreeData = 0
      that.loading = true
      that.$axios({
        method: 'get',
        url: '/display/product-statistic-query/osa-input-and-output-summary',
        params: {
          startTime: that.startTime,
          endTime: that.endTime
        }
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null) {
          that.data = res
          // console.log(typeof (that.data[1]['入库-产出']))
          for (let i = 0; i < that.data.length; i++) {
            // console.log(that.data[i]['调试-投入'])
            // console.log(typeof (that.data[i]['调试-投入']))
            // console.log(that.allOneOneData)
            // console.log(typeof (that.allOneOneData))
            that.allOneOneData += that.data[i]['1G初测-投入']
            that.allOneTwoData += that.data[i]['1G初测-产出']
            that.allOneThreeData += that.data[i]['1G初测-不良']
            that.allTwoOneData += that.data[i]['10G初测-投入']
            that.allTwoTwoData += that.data[i]['10G初测-产出']
            that.allTwoThreeData += that.data[i]['10G初测-不良']
            that.allThreeOneData += that.data[i]['终测-投入']
            that.allThreeTwoData += that.data[i]['终测-产出']
            that.allThreeThreeData += that.data[i]['终测-不良']
          }
          if (that.allOneThreeData !== 0) {
            that.allOneFourData = String(parseInt((that.allOneThreeData * 100) / that.allOneOneData)) + '%'
          } else {
            that.allOneFourData = '0%'
          }
          if (that.allTwoThreeData !== 0) {
            that.allTwoFourData = String(parseInt((that.allTwoThreeData * 100) / that.allTwoOneData)) + '%'
          } else {
            that.allTwoFourData = '0%'
          }
          if (that.allThreeThreeData !== 0) {
            that.allThreeFourData = String(parseInt((that.allThreeThreeData * 100) / that.allThreeOneData)) + '%'
          } else {
            that.allThreeFourData = '0%'
          }
          console.log(that.allOneFourData)
          that.data.push({'型号': '总计', '1G初测-投入': that.allOneOneData, '1G初测-产出': that.allOneTwoData, '1G初测-不良': that.allOneThreeData, '1G初测-不良占比': that.allOneFourData, '10G初测-投入': that.allTwoOneData, '10G初测-产出': that.allTwoTwoData, '10G初测-不良': that.allTwoThreeData, '10G初测-不良占比': that.allTwoFourData, '终测-投入': that.allThreeOneData, '终测-产出': that.allThreeTwoData, '终测-不良': that.allThreeThreeData, '终测-不良占比': that.allThreeFourData})
          console.log(that.data)
          that.loading = false
        } else {
          that.$message({
            type: 'Error',
            message: '暂无数据！'
          })
        }
      }).catch(function (err) {
        console.log(err)
        that.loading = false
        if (err.response.status === 504) {
          that.$message({
            type: 'error',
            message: '服务器未响应！'
          })
        } else if (err.response.status === 404) {
          that.$message({
            type: 'error',
            message: '未找到数据！'
          })
        } else if (err.response.status === 403) {
          that.$message({
            type: 'error',
            message: '权限不够！'
          })
        } else if (err.response.status === 500) {
          that.$message({
            type: 'error',
            message: '服务器内部错误！'
          })
        }
      })
    },
    // 根据时间选择器获取数据
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.get_data()
        }
      })
    }
  },
  data () {
    return {
      allOneOneData: 0,
      allOneTwoData: 0,
      allOneThreeData: 0,
      allTwoOneData: 0,
      allTwoTwoData: 0,
      allTwoThreeData: 0,
      allThreeOneData: 0,
      allThreeTwoData: 0,
      allThreeThreeData: 0,
      allFourOneData: 0,
      allFourTwoData: 0,
      allFourThreeData: 0,
      allOneFourData: 0,
      allTwoFourData: 0,
      allThreeFourData: 0,
      allFourFourData: 0,
      loading: false,
      ruleForm: {
        searchPn: '',
        startTime: '',
        endTime: '',
        value2: [new Date(new Date().setHours(8, 30, 0, 0) - 24 * 60 * 60 * 1000), new Date(new Date().setHours(8, 30, 0, 0))],
        time: []
      },
      rules: {
        searchPn: {required: true, message: '请输入Pn', trigger: 'blur'},
        value2: {required: true, message: '请选择时间', trigger: 'change'}
      },
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
      data: []
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.el-table >>> .Danger-row {
  color: #000000 !important;
  background-color: #ff0000 !important;
}
</style>
