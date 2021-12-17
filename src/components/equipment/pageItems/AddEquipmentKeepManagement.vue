<template>
<div class="AddEquipmentKeepManagement">
  <el-form :model="ruleForm" label-width="0%" class="demo-ruleForm">
  <el-form-item  prop="maintenanceType">
    <el-select v-model="ruleForm.maintenanceType" clearable filterable placeholder="请选择保养计划类型" @visible-change="get_maintenance">
      <el-option
        v-for="item in maintenanceOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </el-form-item>
  </el-form>
  <div>
    <el-table
    :data="data"
    v-loading="loading"
    style="width: 99%"
    height="400">
      <el-table-column
        prop="category"
        label="保养类型">
      </el-table-column>
      <el-table-column
        prop="id"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="name"
        label="保养名称">
      </el-table-column>
      <el-table-column
        prop="period"
        label="保养周期（天）">
      </el-table-column>
      <el-table-column
        prop="threshold"
        label="报警门限（天）">
      </el-table-column>
    </el-table>
  </div>
  <el-button style="width:80px;height:40px" type="primary" @click="onSubmit">新增</el-button>
</div>
</template>

<script>
export default {
  name: 'AddEquipmentKeepManagement',
  methods: {
    // 获取所有保养计划类型
    get_maintenance (bool) {
      if (bool === true) {
        let that = this
        that.maintenanceOptions = []
        that.states = []
        that.$axios({
          method: 'get',
          url: '/api/device-maintenance/maintenance-item'
        }).then(function (response) {
          console.log(response)
          const res = response.data
          // that.data = res
          // console.log(that.data)
          // console.log(that.data[0])
          // console.log(typeof (that.data[0]))
          // that.maintenanceOptions.push(that.data[0])
          if (res !== undefined) {
            console.log(res['maintenance_item'].length)
            for (let i = 0; i < res['maintenance_item'].length; i++) {
              that.states.push({
                label: res['maintenance_item'][i]['category'],
                value: res['maintenance_item'][i]['category']
              })
            }
            that.maintenanceOptions = that.states
            console.log(that.maintenanceOptions)
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
      } else {
        if (this.maintenanceOptions !== null) {
          let that = this
          that.loading = true
          that.$axios({
            method: 'get',
            url: '/api/device-maintenance/maintenance-item/' + that.ruleForm.maintenanceType
          }).then(function (response) {
            console.log(response)
            const res = response.data
            if (res !== null) {
              that.data = res['maintenance_item']
              that.loading = false
            } else {
              that.$message({
                type: 'error',
                message: '暂无数据！'
              })
              that.data = []
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
        }
      }
    },
    // 新增按钮 绑定保养计划
    onSubmit () {
      if (this.data !== null) {
        let that = this
        console.log(that.data)
        that.addData = that.data
        for (let i = 0; i < that.addData.length; i++) {
          delete that.addData[i].ID
        }
        console.log(that.addData)
        console.log(that.message)
        console.log(that.ruleForm.maintenanceType)
        that.messageSn = that.message
        that.$confirm('此操作将修改数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let formData = new FormData()
          formData.append('deviceSn', that.messageSn)
          formData.append('itemCategory', that.ruleForm.maintenanceType)
          that.$axios({
            method: 'post',
            url: '/api/device-maintenance/bind-maintenanceItem',
            data: formData
          }).then(function (response) {
            console.log(response)
            if (response.status === 200) {
              that.$message({
                type: 'success',
                message: '绑定保养计划成功！'
              })
              that.AddEquipmentKeepManagementUpData = true
              that.$emit('AddEquipmentKeepManagement', that.AddEquipmentKeepManagementUpData)
            } else {
              that.$message({
                type: 'error',
                message: '绑定保养计划失败！'
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
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  },
  mounted () {
  },
  data () {
    return {
      ruleForm: {
        maintenanceType: ''
      },
      data: [],
      addData: [],
      states: [],
      maintenanceOptions: [],
      loading: false,
      messageSn: '',
      AddEquipmentKeepManagementUpData: false
    }
  },
  props: {
    message: {
      type: String,
      required: true
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
.el-pagination{
  white-space: pre-line;
}
.el-table >>> .Danger-row {
  color: #000000;
  background-color: #ff0000;
}
.el-table >>> .Pass-row {
  color: #e6a23c;
  background-color: #fdf6ec;
}
.el-table >>> .Excellent-row {
  background: white;
}
.el-table td, .el-table th {
  padding: 0;
}
.block >>> .el-pagination__jump{
    margin-left: 0!important;
}
</style>
