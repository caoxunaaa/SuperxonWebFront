<template>
  <div class="pregroupPostMessage">
    <el-row :gutter="20">
      <el-form>
        <el-form-item style="float:left">
          <el-button @click="open_post_dialog" type="primary" style="margin-left:16px">创建</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <div style="border:1px solid #909399;background-color:rgb(84, 92, 100);">
          <download-excel
            class = "export-excel-wrapper"
            style="float:left;background-color:rgb(84, 92, 100);"
            :data = "prepareData"
            name = "预组手动录入信息excel表格.xls">
            <el-button type="primary" class="el-button--small" style="padding:0">导出Excel表格</el-button>
          </download-excel>
          <hr>
          <el-table
          :cell-style="{padding: 0+'px'}"
          :data="prepareData"
          v-loading="loading"
          style="width: 100%"
          height="800">
          <el-table-column
          prop="Id"
          label="Id">
          </el-table-column>
          <el-table-column
          prop="WorkOrderNum"
          label="工单号">
          </el-table-column>
          <el-table-column
          prop="TotalInput"
          label="投入">
          </el-table-column>
          <el-table-column
          prop="TotalOutput"
          label="产出">
          </el-table-column>
          <el-table-column
          prop="PassRate"
          label="通过率（%）">
          </el-table-column>
          <el-table-column
          prop="StorageTime"
          width="150"
          label="录入时间">
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">修改</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="12">
        <div id="container" style="border:1px dashed #000;text-align:center;background:rgb(84, 92, 100)"></div>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="postVisible"
      width="40%"
      append-to-body
      :close-on-click-modal="false">
      <div>
        <h3>新增预组统计信息</h3>
        <el-form ref="postform" :rules="postrules" :model="postform">
          <el-form-item label="工单号" prop="WorkOrderNum">
            <el-input v-model="postform.WorkOrderNum"></el-input>
          </el-form-item>
          <el-form-item label="投入" prop="TotalInput">
            <el-input v-model="postform.TotalInput" onkeyup="value=value.replace(/[^\d]/g,'')" @change="get_pass_rate(postform)"></el-input>
          </el-form-item>
          <el-form-item label="产出" prop="TotalOutput">
            <el-input v-model="postform.TotalOutput" onkeyup="value=value.replace(/[^\d]/g,'')" @change="get_pass_rate(postform)"></el-input>
          </el-form-item>
          <el-form-item label="通过率" prop="PassRate">
            <el-input v-model="postform.PassRate" :disabled="true">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="pre_group_post_button('postform')" type="primary" style="margin-left:16px">创建</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="putVisible"
      width="40%"
      append-to-body
      :close-on-click-modal="false">
      <div>
        <h3>修改预组统计信息</h3>
        <el-form ref="putform" :rules="putrules" :model="putform">
          <el-form-item label="ID" prop="Id">
            <el-input v-model="putform.Id" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="工单号" prop="WorkOrderNum">
            <el-input v-model="putform.WorkOrderNum"></el-input>
          </el-form-item>
          <el-form-item label="投入" prop="TotalInput">
            <el-input v-model="putform.TotalInput" onkeyup="value=value.replace(/[^\d]/g,'')" @change="get_pass_rate(putform)"></el-input>
          </el-form-item>
          <el-form-item label="产出" prop="TotalOutput">
            <el-input v-model="putform.TotalOutput" onkeyup="value=value.replace(/[^\d]/g,'')" @change="get_pass_rate(putform)"></el-input>
          </el-form-item>
          <el-form-item label="通过率" prop="PassRate">
            <el-input v-model="putform.PassRate" :disabled="true">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="录入时间">
            <el-date-picker
            v-model="putform.StorageTime"
            type="datetime"
            placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button @click="pre_group_put_button('putform')" type="primary" style="margin-left:16px">修改</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Highcharts from 'highcharts'
export default {
  name: 'pregroupPostMessage',
  mounted () {
    this.get_prepare_data()
  },
  watch: {
    postVisible: {
      handler (newVal, oldVal) {
        if (this.postVisible === false) {
          console.log('更新')
          this.get_prepare_data()
          this.postform = {TotalInput: '', TotalOutput: '', WorkOrderNum: '', PassRate: ''}
        }
      },
      deep: true
    }
  },
  methods: {
    // 获取预组手动录入数据
    get_prepare_data () {
      let that = this
      that.loading = true
      that.$axios({
        url: '/display/product-statistic-query/prepare-assemble/prepare-assemble-statistic',
        method: 'get'
      }).then(function (response) {
        console.log('获取预组手动录入数据:', response)
        that.loading = false
        const res = response.data
        if (res !== null) {
          for (let i = 0; i < res.length - 1; i++) {
            for (let j = 0; j < res.length - 1 - i; j++) {
              if (res[j + 1]['StorageTime'] > res[j]['StorageTime']) {
                var num = res[j + 1]['StorageTime']
                res[j + 1]['StorageTime'] = res[j]['StorageTime']
                res[j]['StorageTime'] = num
              }
            }
          }
          that.prepareData = res
          var chartsData = []
          if (that.prepareData.length <= 5) {
            chartsData = that.prepareData
          } else {
            for (let i = 0; i < 5; i++) {
              chartsData.push(that.prepareData[i])
            }
          }
          that.get_charts_data(chartsData)
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
    },
    // 处理charts图的数据
    get_charts_data (data) {
      console.log(data)
      var xAxis = []
      var yAxis = []
      for (let i = 0; i < data.length; i++) {
        xAxis.push(data[i]['WorkOrderNum'])
        yAxis.push(data[i]['PassRate'])
      }
      this.empStatices(xAxis, yAxis)
    },
    empStatices (x, y) {
      Highcharts.chart('container', {
        chart: {
          type: 'column',
          backgroundColor: {
            linearGradient: [0, 0, 500, 500],
            stops: [
              [0, 'rgb(84, 92, 100)'],
              [1, 'rgb(84, 92, 100)']
            ]
          }
        },
        title: {
          text: '最近工单良率变化图',
          style: {
            color: 'white'
          }
        },
        xAxis: {
          categories: x,
          title: {
            text: '工单号',
            style: {
              color: '#A0A0A3'
            }
          },
          gridLineColor: '#707073',
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
          min: 0,
          max: 100,
          title: {
            text: '良率（%）',
            style: {
              color: '#A0A0A3'
            }
          },
          gridLineColor: '#707073',
          labels: {
            style: {
              color: '#E0E0E3'
            }
          }
        },
        plotOptions: {
          areaspline: {
            fillOpacity: 0.5
          },
          column: {
            dataLabels: {
              enabled: true
            }
          }
        },
        series: [{
          name: '良率',
          data: y
        }]
      })
    },
    // 打开新增弹窗
    open_post_dialog () {
      this.postVisible = true
    },
    // 计算通过率
    get_pass_rate (data) {
      if (data.TotalInput !== '' && data.TotalOutput !== '') {
        if (Number(data.TotalInput) !== 0) {
          var num = (Number(data.TotalOutput) * 100 / Number(data.TotalInput)).toFixed(2)
          console.log(num)
          if (num <= 100) {
            data.PassRate = num
          } else {
            data.PassRate = ''
          }
        } else {
          data.PassRate = '0'
        }
      }
    },
    // 新增提交按钮
    pre_group_post_button (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.postform)
          let that = this
          that.$confirm('此操作将新增数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let formdata = new FormData()
            formdata.append('workOrderNum', that.postform.WorkOrderNum)
            formdata.append('totalInput', that.postform.TotalInput)
            formdata.append('totalOutput', that.postform.TotalOutput)
            formdata.append('passRate', that.postform.PassRate)
            that.$axios({
              url: '/display/product-statistic-query/prepare-assemble/prepare-assemble-statistic',
              method: 'post',
              data: formdata
            }).then(function (response) {
              console.log('提交成功！')
              that.postVisible = false
              if (response.status === 200) {
                that.$message({
                  type: 'success',
                  message: '新增成功！'
                })
              } else {
                that.$message({
                  type: 'error',
                  message: '新增失败！'
                })
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
          })
        }
      })
    },
    // 修改按钮
    handleEdit (index, row) {
      console.log(index, row)
      this.putVisible = true
      // this.putform = JSON.parse(JSON.stringify(row))
      this.putform.Id = String(row.Id)
      this.putform.WorkOrderNum = String(row.WorkOrderNum)
      this.putform.TotalInput = String(row.TotalInput)
      this.putform.TotalOutput = String(row.TotalOutput)
      this.putform.PassRate = String(row.PassRate)
      this.putform.StorageTime = new Date(row.StorageTime)
    },
    // 修改提交按钮
    pre_group_put_button (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.putform)
          let that = this
          that.$confirm('此操作将修改数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let formdata = new FormData()
            formdata.append('workOrderNum', that.putform.WorkOrderNum)
            formdata.append('totalInput', that.putform.TotalInput)
            formdata.append('totalOutput', that.putform.TotalOutput)
            formdata.append('passRate', that.putform.PassRate)
            formdata.append('storageTime', that.moment(that.putform.StorageTime).format('YYYY-MM-DD HH:mm:ss'))
            that.$axios({
              url: '/display/product-statistic-query/prepare-assemble/prepare-assemble-statistic/' + that.putform.Id,
              method: 'put',
              data: formdata
            }).then(function (response) {
              console.log(response)
              if (response.status === 200) {
                that.putVisible = false
                that.get_prepare_data()
                that.$message({
                  type: 'success',
                  message: '修改成功！'
                })
              } else {
                that.$message({
                  type: 'error',
                  message: '修改失败！'
                })
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
          })
        }
      })
    },
    // 删除按钮
    handleDelete (index, row) {
      console.log(index, row)
      let that = this
      that.$confirm('此操作将删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$axios({
          url: '/display/product-statistic-query/prepare-assemble/prepare-assemble-statistic/' + row.Id,
          method: 'delete'
        }).then(function (response) {
          console.log(response)
          that.get_prepare_data()
          that.$message({
            type: 'success',
            message: '删除成功！'
          })
        }).catch(function (err) {
          console.log(err)
          that.$message({
            type: 'error',
            message: '修改失败!'
          })
        })
      })
    }
  },
  data () {
    return {
      text: '111',
      prepareData: [],
      loading: false,
      postVisible: false,
      putVisible: false,
      postform: {
        TotalInput: '',
        TotalOutput: '',
        WorkOrderNum: '',
        PassRate: ''
      },
      postrules: {
        TotalInput: [
          {required: true, message: '请输入数字', trigger: 'blur'},
          {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
        ],
        TotalOutput: [
          {required: true, message: '请输入数字', trigger: 'blur'},
          {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
        ],
        WorkOrderNum: [
          {required: true, message: '请输入', trigger: 'blur'},
          {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
        ],
        PassRate: [
          {required: true, message: '产出大于投入', trigger: 'blur'},
          {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
        ]
      },
      putform: {
        Id: '',
        WorkOrderNum: '',
        TotalInput: '',
        TotalOutput: '',
        PassRate: '',
        StorageTime: ''
      },
      putrules: {
        Id: [
          {required: true, message: '请输入', trigger: 'blur'},
          {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
        ],
        WorkOrderNum: [
          {required: true, message: '请输入', trigger: 'blur'},
          {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
        ],
        TotalInput: [
          {required: true, message: '请输入数字', trigger: 'blur'},
          {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
        ],
        TotalOutput: [
          {required: true, message: '请输入数字', trigger: 'blur'},
          {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
        ],
        PassRate: [
          {required: true, message: '产出大于投入', trigger: 'blur'},
          {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
        ],
        StorageTime: [
          {required: true, message: '请输入时间', trigger: 'blur'},
          {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
        ]
      }
    }
  }
}
</script>

<style scoped>
.pregroupPostMessage{
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
.pregroupPostMessage >>> .el-table thead {
    color: white !important;
    background-color: rgb(84, 92, 100) !important;
}
.pregroupPostMessage >>> .el-table th, .el-table tr{
    background-color: rgb(84, 92, 100) !important;
}
.pregroupPostMessage >>>.el-table td, .el-table th.is-leaf {
  background-color: rgb(84, 92, 100);
  border-bottom-width: 0px !important;
  color: white;
}
.el-table >>> tbody tr:hover>td {
  background-color: #90c0f1;
}
.container{
  background-color:rgb(84, 92, 100)!important
}
</style>
