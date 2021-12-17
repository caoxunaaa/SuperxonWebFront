<template>
<div class="MaintenanceProjectManagement">
  <el-form :model="ruleForm" label-width="0%" class="demo-ruleForm">
  <el-form-item  prop="maintenanceType">
    <el-select v-model="ruleForm.maintenanceType" clearable allow-create filterable placeholder="请选择保养计划类型" @visible-change="get_maintenance">
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
      <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          icon="el-icon-edit"
          circle
          @click="handleEdit(scope.$index, scope.row)">
        </el-button>
        <el-button
          size="mini"
          icon="el-icon-delete"
          circle
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">
        </el-button>
      </template>
    </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button style="width:80px;height:40px;float:right" type="primary" @click="addMaintenanceItemsDialogVisible">新增保养项目</el-button>
    </div>
  </div>
  <br>
  <br>
    <div v-if="addMaintenanceItems" style="border:1px solid black">
    <h3 align="center">新增保养项目</h3>
    <span>项目名称</span>
    <el-input v-model="inputName" placeholder="请输入项目名称" style="width:220px"></el-input>
    <br>
    <span>保养周期（天）</span>
    <el-input-number v-model="numCycle" @change="handleChange" :min="0"></el-input-number>
    <br>
    <span>报警门限（天）</span>
    <el-input-number v-model="numDoorsill" @change="handleChange" :min="0"></el-input-number>
    <br>
    <el-button style="width:80px;height:40px;" type="primary" @click="addMaintencance">新增</el-button>
    </div>
    <div v-if="modifyMaintenanceItems" style="border:1px solid black">
    <h3 align="center">修改保养项目</h3>
    <span>项目名称</span>
    <el-input v-model="modifyInputName" placeholder="请输入项目名称" style="width:220px"></el-input>
    <br>
    <span>保养周期（天）</span>
    <el-input-number v-model="modifyNumCycle" @change="handleChange" :min="0"></el-input-number>
    <br>
    <span>报警门限（天）</span>
    <el-input-number v-model="modifyNumDoorsill" @change="handleChange" :min="0"></el-input-number>
    <br>
    <el-button style="width:80px;height:40px;" type="primary" @click="modifyMaintencance">确认</el-button>
    </div>
</div>
</template>

<script>
export default {
  name: 'MaintenanceProjectManagement',
  methods: {
    // 删除按钮
    handleDelete (index, row) {
      console.log(index)
      console.log(row)
      let that = this
      that.$confirm('此操作将删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$axios({
          method: 'delete',
          url: '/api/device-maintenance/maintenance-item/' + row['id']
        }).then(function (response) {
          console.log(response)
          if (response.status === 200) {
            that.$message({
              type: 'success',
              message: '删除保养项目成功！'
            })
            that.get_search()
          } else {
            that.$message({
              type: 'error',
              message: '删除出错！'
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
              message: '找不到服务器！'
            })
          } else if (err.response.status === 504) {
            that.$message({
              type: 'error',
              message: '服务器未响应！'
            })
          }
        })
      })
    },
    // 修改按钮
    handleEdit (index, row) {
      console.log(index)
      console.log(row)
      console.log(row['id'])
      if (this.addMaintenanceItems === false) {
        if (this.modifyMaintenanceItems === false) {
          this.modifyMaintenanceItems = true
          this.modifyInputName = row['name']
          this.modifyNumCycle = row['period']
          this.modifyNumDoorsill = row['threshold']
          this.modifyID = row['id']
          this.modifyCategory = row['category']
        } else {
          this.modifyMaintenanceItems = false
        }
      } else {
        this.$message({
          type: 'error',
          message: '请先关闭新增保养项目！'
        })
        this.modifyMaintenanceItems = false
      }
    },
    // 确认修改按钮
    modifyMaintencance () {
      let that = this
      that.$confirm('此操作将修改数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let formData = new FormData()
        formData.append('category', that.modifyCategory)
        formData.append('name', that.modifyInputName)
        formData.append('period', that.modifyNumCycle)
        formData.append('threshold', that.modifyNumDoorsill)
        that.$axios({
          method: 'put',
          url: '/api/device-maintenance/maintenance-item/' + that.modifyID,
          data: formData
        }).then(function (response) {
          console.log(response)
          if (response.status === 200) {
            that.$message({
              type: 'success',
              message: '修改保养项目成功！'
            })
            that.get_search()
          } else {
            that.$message({
              type: 'error',
              message: '修改保养项目失败！'
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
              message: '找不到服务器！'
            })
          } else if (err.response.status === 504) {
            that.$message({
              type: 'error',
              message: '服务器未响应！'
            })
          }
        })
      })
    },
    // 新增按钮
    addMaintencance () {
      console.log(this.inputName)
      console.log(this.numCycle)
      console.log(this.numDoorsill)
      let that = this
      that.$confirm('此操作将新增数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let formData = new FormData()
        formData.append('category', that.ruleForm.maintenanceType)
        formData.append('name', that.inputName)
        formData.append('period', that.numCycle)
        formData.append('threshold', that.numDoorsill)
        that.$axios({
          method: 'post',
          url: '/api/device-maintenance/maintenance-item',
          data: formData
        }).then(function (response) {
          console.log(response)
          if (response.status === 200) {
            that.$message({
              type: 'success',
              message: '新增保养项目成功！'
            })
          }
          that.get_search()
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
              message: '找不到服务器！'
            })
          } else if (err.response.status === 504) {
            that.$message({
              type: 'error',
              message: '服务器未响应！'
            })
          }
        })
      })
    },
    // 天数增加器
    handleChange (value) {
      console.log(value)
    },
    // 新增保养计划按钮
    addMaintenanceItemsDialogVisible () {
      console.log(this.ruleForm.maintenanceType.length)
      if (this.modifyMaintenanceItems === false) {
        if (this.ruleForm.maintenanceType.length === 0) {
          this.$message({
            type: 'error',
            message: '请先选择保养计划类型！'
          })
          this.addMaintenanceItems = false
        } else {
          if (this.addMaintenanceItems === false) {
            this.addMaintenanceItems = true
          } else {
            this.addMaintenanceItems = false
          }
        }
      } else {
        this.$message({
          type: 'error',
          message: '请先关闭修改保养项目！'
        })
        this.addMaintenanceItems = false
        this.modifyMaintenanceItems = true
      }
    },
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
          // console.log(res['maintenance_item'][0]['category'])
          // console.log(that.data[0])
          // console.log(typeof (that.data[0]))
          // that.maintenanceOptions.push(that.data[0])
          if (res['maintenance_item'] !== undefined) {
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
              message: '找不到服务器！'
            })
          } else if (err.response.status === 504) {
            that.$message({
              type: 'error',
              message: '服务器未响应！'
            })
          }
        })
      } else {
        this.get_search()
      }
    },
    // 查找保养类型下的保养项目
    get_search () {
      if (this.maintenanceOptions !== null) {
        let that = this
        that.loading = true
        that.$axios({
          method: 'get',
          url: '/api/device-maintenance/maintenance-item/' + that.ruleForm.maintenanceType
        }).then(function (response) {
          console.log(response)
          const res = response.data
          if (res['maintenance_item'] !== undefined) {
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
              message: '找不到服务器！'
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
  mounted () {
  },
  data () {
    return {
      ruleForm: {
        maintenanceType: ''
      },
      inputName: '',
      numCycle: 0,
      numDoorsill: 0,
      modifyInputName: '',
      modifyNumCycle: 0,
      modifyNumDoorsill: 0,
      modifyID: '',
      modifyCategory: '',
      data: [],
      states: [],
      maintenanceOptions: [],
      loading: false,
      modifyMaintenanceItems: false,
      addMaintenanceItems: false
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
