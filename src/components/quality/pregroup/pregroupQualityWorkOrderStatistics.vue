<template>
  <div class="pregroupQualityWorkOrderStatistics">
    <el-row :gutter="20">
      <el-col :span="24">
        <div>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="10px">
            <el-form-item prop="valuetime" style="float:left">
              <el-date-picker
              v-model="ruleForm.valuetime"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间">
              </el-date-picker>
              <el-tag style="font-size:5px">该时间选择不对工单搜索做限制</el-tag>
            </el-form-item>
            <el-form-item prop="searchWorkOrder" style="float:left">
              <el-select v-model="ruleForm.searchWorkOrder" filterable allow-create clearable placeholder="请选择工单号" @visible-change="visiblechange">
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
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="13">
        <div style="border:1px solid #909399;background-color:rgb(84, 92, 100);">
          <download-excel
            class = "export-excel-wrapper"
            style="float:left;background-color:rgb(84, 92, 100);"
            :data = "pregroupData"
            name = "预组工单号搜索excel表格.xls">
            <el-button type="primary" class="el-button--small" style="padding:0">导出Excel表格</el-button>
          </download-excel>
          <hr>
          <el-table
          :cell-style="{padding: 0+'px'}"
          :data="pregroupData"
          v-loading="loading"
          style="width:100%"
          height="800">
          <el-table-column
          prop="Pn"
          label="Pn">
          </el-table-column>
          <el-table-column
          prop="Bom"
          label="Bom">
          </el-table-column>
          <el-table-column
          prop="Process"
          label="工序">
          </el-table-column>
          <el-table-column
          prop="TotalPass"
          label="通过">
          </el-table-column>
          <el-table-column
          prop="TotalFail"
          label="失败">
          </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'pregroupQualityWorkOrderStatistics',
  mounted () {
  },
  methods: {
    // 获取搜索框中的数据
    visiblechange (bool) {
      if (bool === true) {
        this.search_workOrder()
      } else {
        this.searchWorkOrder = []
      }
    },
    // 根据时间搜索的工单号数据
    search_workOrder () {
      let that = this
      if (that.ruleForm.valuetime !== null && that.ruleForm.valuetime !== null) {
        const mes = that.$message({
          message: '正在搜索工号中，请耐心等待!',
          center: true,
          duration: 0
        })
        that.$axios({
          url: '/display/product-statistic-query/osa/production-work-order-id-in-time',
          method: 'get',
          params: {
            startTime: that.moment(that.ruleForm.valuetime[0]).format('YYYY-MM-DD HH:mm:ss'),
            endTime: that.moment(that.ruleForm.valuetime[1]).format('YYYY-MM-DD HH:mm:ss')
          }
        }).then(function (response) {
          mes.close()
          console.log('根据时间搜索的工单号数据：', response)
          const res = response.data
          if (res !== null) {
            var statesWorkOrder = []
            for (let i = 0; i < res.length; i++) {
              statesWorkOrder.push({
                label: res[i],
                value: res[i]
              })
            }
            that.$message({
              type: 'success',
              message: '已搜索到当前条件下的工单号！'
            })
            that.optionsWorkOrder = statesWorkOrder
          } else {
            that.$message({
              type: 'error',
              message: '当前搜索条件无工单号！'
            })
          }
        }).catch(function (err) {
          console.log(err)
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
      }
    },
    // 必填项获取数据
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let that = this
          const mes = that.$message({
            message: '正在搜索中，请耐心等待!',
            center: true,
            duration: 0
          })
          that.loading = true
          that.cancel && that.cancel()
          that.$axios({
            url: '/display/product-statistic-query/prepare-assemble/prepare-assemble-record-by-work-order-num',
            method: 'get',
            params: {
              workOrderNum: that.ruleForm.searchWorkOrder
            },
            cancelToken: new axios.CancelToken((c) => {
              // 存储一个cancel函数用于取消本次的网络请求
              that.cancel = c
            })
          }).then(function (response) {
            that.loading = false
            mes.close()
            console.log('通过工单查询预组详细记录:', response)
            const res = response.data
            if (res !== null) {
              that.pregroupData = res
              that.$message({
                type: 'success',
                message: '已查找到该工单号下的预组详细记录！'
              })
            } else {
              that.pregroupData = []
              that.$message({
                type: 'error',
                message: '暂无该工单号下的预组详细记录！'
              })
            }
          }).catch(function (err) {
            console.log(err)
            that.pregroupData = []
            that.loading = false
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
        }
      })
    }
  },
  data () {
    return {
      optionsWorkOrder: [],
      pregroupData: [],
      loading: false,
      ruleForm: {
        valuetime: '',
        searchWorkOrder: ''
      },
      rules: {},
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
      }
    }
  }
}
</script>

<style scoped>
.pregroupQualityWorkOrderStatistics{
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
.pregroupQualityWorkOrderStatistics >>> .el-table thead {
    color: white !important;
    background-color: rgb(84, 92, 100) !important;
}
.pregroupQualityWorkOrderStatistics >>> .el-table th, .el-table tr{
    background-color: rgb(84, 92, 100) !important;
}
.pregroupQualityWorkOrderStatistics >>>.el-table td, .el-table th.is-leaf {
  background-color: rgb(84, 92, 100);
  border-bottom-width: 0px !important;
  color: white;
}
.el-table >>> tbody tr:hover>td {
  background-color: #90c0f1;
}
</style>
