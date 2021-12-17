<template>
<div class="EquipmentKeepManagement">
  <!-- 保养状态弹窗 -->
  <!-- <div v-for="item in message" :key="item.id">
    <li>{{item}}</li>
  </div> -->
  <h1>当前保养信息</h1>
  <el-table
    :data="keepData"
    stripe
    v-loading="keeploading"
    max-height="360"
    style="width: 100%">
    <el-table-column
      prop="id"
      label="ID"
      width="50">
    </el-table-column>
    <el-table-column
      prop="item_category"
      label="项目类别">
    </el-table-column>
    <el-table-column
      prop="item_name"
      label="项目名称">
    </el-table-column>
    <el-table-column
      prop="device_name"
      label="设备名">
    </el-table-column>
    <el-table-column
      prop="device_sn"
      label="设备号">
    </el-table-column>
    <el-table-column
      prop="device_assets"
      label="固资号">
    </el-table-column>
    <el-table-column
      prop="device_sort"
      label="设备排序">
    </el-table-column>
    <el-table-column
      prop="device_owner"
      label="设备所有者">
    </el-table-column>
    <el-table-column
      prop="LastMaintenanceTime"
      label="最后维护时间">
    </el-table-column>
    <el-table-column
      prop="Deadline"
      label="截止时间">
    </el-table-column>
    <el-table-column
      prop="status"
      label="状态维护">
    </el-table-column>
    <el-table-column label="更新" width="120">
      <template slot-scope="scope">
        <el-button
          size="mini"
          icon="el-icon-edit"
          circle
          @click="handleEdit(scope.$index, scope.row)">
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog
    title="更新保养信息"
    :close-on-click-modal='false'
    :visible.sync="updateMaintenanceInformationdialogVisible"
    width="40%"
    append-to-body>
    <el-form :model="ruleForm" ref="ruleForm" label-width="20%" class="demo-ruleForm">
      <el-form-item label="设备ID" prop="maintenanceCurrentInfoId">
        <el-input v-model="ruleForm.maintenanceCurrentInfoId" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="设备所有者" prop="maintenanceCurrentInfoDeviceOwner">
        <el-input v-model="ruleForm.maintenanceCurrentInfoDeviceOwner" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="设备名称" prop="DeviceName">
        <el-input v-model="ruleForm.DeviceName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="设备Sn" prop="DeviceSn">
        <el-input v-model="ruleForm.DeviceSn" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="固资号" prop="DeviceAssets">
        <el-input v-model="ruleForm.DeviceAssets" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="种类" prop="deviceSort">
        <el-input v-model="ruleForm.deviceSort" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="项目类别" prop="ItemCategory">
        <el-input v-model="ruleForm.ItemCategory" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="项目名称" prop="ItemName">
        <el-input v-model="ruleForm.ItemName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="保养时间" prop="MaintenanceTime">
        <el-date-picker type="datetime" placeholder="请选择保养时间"
          v-model="ruleForm.MaintenanceTime"
          style="width: 100%;float: left"></el-date-picker>
      </el-form-item>
      <el-form-item label="保养人" prop="MaintenanceUser">
        <el-select v-model="ruleForm.MaintenanceUser" filterable placeholder="请选择保养人" >
          <el-option
            v-for="item in incorporatedOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="Remark">
        <el-input v-model="ruleForm.Remark" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="文件上传" prop="FilePath">
        <input type="file" id="myfile" accept=".rar,.zip">
      </el-form-item>
      <el-form-item>
        <el-button style="width:80px;height:40px;float:right" type="primary" @click="submitForm('ruleForm')">更新</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <el-dialog
    title="新增保养计划"
    :visible.sync="addmaintaindialogVisible"
    :close-on-click-modal='false'
    width="40%"
    append-to-body>
    <AddEquipmentKeepManagement v-on:AddEquipmentKeepManagement="AddEquipmentKeepManagement" :message="msg"></AddEquipmentKeepManagement>
  </el-dialog>
    <div v-if="bind">
      <el-button class="el-button--small" style="background-color: #409eff; color: #fff;height:35px; width:110px;" type="primary"  @click="get_bind">
        解除保养计划
      </el-button>
      <el-button class="el-button--small" style="background-color: #409eff; color: #fff;height:35px; width:110px;" type="primary"  @click="historicalMaintenance">
        查看历史保养记录
      </el-button>
    </div>
    <div v-if="Unbind">
      <el-button class="el-button--small" style="background-color: #409eff; color: #fff;height:35px; width:110px;" type="primary"  @click="get_addmaintain">
        制定保养计划
      </el-button>
      <el-button class="el-button--small" style="background-color: #409eff; color: #fff;height:35px; width:110px;" type="primary"  @click="historicalMaintenance">
        查看历史保养记录
      </el-button>
    </div>
  <div v-if="historicalMaintenanceRecords">
    <h1>历史保养记录</h1>
    <el-table
      :data="historicalMaintenanceRecordsData"
      stripe
      v-loading="historicalloading"
      max-height="360"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="ID"
        width="50">
      </el-table-column>
      <el-table-column
        prop="item_category"
        label="项目类别">
      </el-table-column>
      <el-table-column
        prop="item_name"
        label="项目名称">
      </el-table-column>
      <el-table-column
        prop="device_name"
        label="设备名称">
      </el-table-column>
      <el-table-column
        prop="device_sn"
        label="Sn">
      </el-table-column>
      <el-table-column
        prop="device_assets"
        label="固资号">
      </el-table-column>
      <el-table-column
        prop="device_sort"
        label="设备排序">
      </el-table-column>
      <el-table-column
        prop="maintenance_user"
        label="设备维护者">
      </el-table-column>
      <el-table-column
        prop="maintenance_time"
        label="维护时间">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注">
      </el-table-column>
      <el-table-column
        label="文件路径">
        <template slot-scope="scope">
          <el-link :href="scope.row.file_path" >{{scope.row.file_path}}</el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</div>
</template>

<script>
import AddEquipmentKeepManagement from '@/components/equipment/PageItems/AddEquipmentKeepManagement'
export default {
  name: 'EquipmentKeepManagement',
  components: {
    AddEquipmentKeepManagement
  },
  // 监听tableData数据发生改变时执行beforeDestroy方法
  watch: {
    message: {
      handler (newVal, oldVal) {
        // console.log(this.tableData)
        // console.log(this.tablesData)
        this.get_keepData()
        this.historicalMaintenanceRecords = false
      },
      deep: true
    }
  },
  methods: {
    // 监听子组件AddEquipmentKeepManagement传来的值并进行更新和关闭窗口
    AddEquipmentKeepManagement: function (AddEquipmentKeepManagementUpData) {
      console.log(AddEquipmentKeepManagementUpData)
      if (AddEquipmentKeepManagementUpData === true) {
        this.addmaintaindialogVisible = false
        this.get_keepData()
      }
    },
    // 获取此刻时间
    getTime () {
      var that = this
      let yy = new Date().getFullYear()
      let mm = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)
      let dd = new Date().getDate()
      let hh = new Date().getHours()
      let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
      that.nowDateTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
      console.log(that.nowDateTime)
      console.log(typeof (that.nowDateTime))
    },
    // 更新按钮
    handleEdit (index, row) {
      console.log(index)
      console.log(row)
      this.ruleForm.maintenanceCurrentInfoId = row['id']
      this.ruleForm.maintenanceCurrentInfoDeviceOwner = row['device_owner']
      this.ruleForm.DeviceName = row['device_name']
      this.ruleForm.DeviceSn = row['device_sn']
      this.ruleForm.DeviceAssets = row['device_assets']
      this.ruleForm.deviceSort = row['device_sort']
      this.ruleForm.ItemCategory = row['item_category']
      this.ruleForm.ItemName = row['item_name']
      this.ruleForm.MaintenanceTime = this.nowDateTime
      this.updateMaintenanceInformationdialogVisible = true
      // 获取保养人列表
      let that = this
      that.incorporatedOptions = []
      that.ruleForm.MaintenanceUser = ''
      that.$axios({
        method: 'get',
        url: '/api/userInfo/getallusername'
      }).then(function (response) {
        console.log(response)
        const res = response.data['userInfosResp']
        console.log(res)
        if (res !== null) {
          for (let i = 0; i < res.length; i++) {
            that.incorporatedOptions.push({
              label: res[i]['nickname'],
              value: res[i]['nickname']
            })
          }
          console.log(that.incorporatedOptions)
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
    // 更新按钮
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm)
          let that = this
          that.$confirm('此操作将修改数据，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let formData = new FormData()
            const myfile = document.getElementById('myfile').files[0]
            console.log(myfile)
            that.ruleForm.MaintenanceTime = that.moment(that.ruleForm.MaintenanceTime).format('YYYY-MM-DD 00:00:00')
            console.log(that.ruleForm.MaintenanceTime)
            formData.append('maintenanceCurrentInfoId', that.ruleForm.maintenanceCurrentInfoId)
            formData.append('maintenanceCurrentInfoDeviceOwner', that.ruleForm.maintenanceCurrentInfoDeviceOwner)
            formData.append('deviceName', that.ruleForm.DeviceName)
            formData.append('deviceSn', that.ruleForm.DeviceSn)
            formData.append('deviceAssets', that.ruleForm.DeviceAssets)
            formData.append('deviceSort', that.ruleForm.deviceSort)
            formData.append('itemCategory', that.ruleForm.ItemCategory)
            formData.append('itemName', that.ruleForm.ItemName)
            formData.append('maintenanceTime', that.ruleForm.MaintenanceTime)
            formData.append('maintenanceUser', that.ruleForm.MaintenanceUser)
            formData.append('remark', that.ruleForm.Remark)
            if (myfile !== undefined) {
              // formData.append('FileExists', 'true')
              formData.append('file', myfile, myfile.name)
            } else {
              // formData.append('FileExists', 'false')
              formData.append('file', '')
            }
            console.log(formData)
            that.$axios({
              method: 'post',
              url: '/api/device-maintenance/maintenance-record',
              data: formData,
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }).then(function (response) {
              if (response.status === 200) {
                that.$message({
                  type: 'success',
                  message: '更新成功！'
                })
                that.updateMaintenanceInformationdialogVisible = false
                that.get_keepData()
              }
            }).catch(function (err) {
              that.keeploading = false
              that.bind = false
              that.Unbind = true
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
    // 获取当前保养信息
    get_keepData () {
      let that = this
      that.keeploading = true
      console.log(typeof (that.message))
      console.log(that.message)
      that.keepSn = that.message['device_base_info']['sn']
      that.msg = that.keepSn
      console.log(that.keepSn)
      if (that.keepSn !== null) {
        that.$axios({
          url: '/api/device-maintenance/current-info/detail',
          method: 'get',
          params: {
            deviceSn: that.keepSn
          }
        }).then(function (response) {
          console.log(response)
          if (response.data['maintenance_current_info'] !== undefined) {
            console.log(response.data.length)
            const res = response.data['maintenance_current_info']
            // 对时间进行转换处理
            that.Data = JSON.parse(JSON.stringify(res))
            for (let j = 0; j < that.Data.length; j++) {
              that.Data[j]['Deadline'] = that.moment(that.Data[j]['deadline']).format('YYYY-MM-DD HH:mm:ss')
              that.Data[j]['LastMaintenanceTime'] = that.moment(that.Data[j]['last_maintenance_time']).format('YYYY-MM-DD HH:mm:ss')
              // that.rebateSetTransferTable[j]['StorageTime'] = that.moment(that.rebateSetTransferTable[j]['StorageTime']).format('YYYY-MM-DD HH:mm:ss')
            }
            that.keepData = that.Data
            that.bind = true
            that.Unbind = false
            console.log(that.keepData)
            that.keeploading = false
          } else {
            that.keepData = []
            that.bind = false
            that.Unbind = true
            that.keeploading = false
            that.$message({
              type: 'error',
              message: '暂无当前保养信息！'
            })
          }
        }).catch(function (err) {
          that.keeploading = false
          that.bind = false
          that.Unbind = true
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
    // 制定保养计划按钮
    get_addmaintain () {
      this.addmaintaindialogVisible = true
    },
    // 保养记录
    historicalMaintenance () {
      if (this.historicalMaintenanceRecords === false) {
        this.historicalMaintenanceRecords = true
        let that = this
        that.historicalloading = true
        console.log(typeof (that.message))
        console.log(that.message)
        that.keepSn = that.message['device_base_info']['sn']
        console.log(typeof (that.keepSn))
        that.$axios({
          method: 'get',
          url: '/api/device-maintenance/maintenance-record/' + that.keepSn
        }).then(function (response) {
          console.log(response)
          const res = response.data
          if (res['maintenance_record'] !== undefined) {
            // 对时间进行处理
            that.TimeData = JSON.parse(JSON.stringify(res['maintenance_record']))
            for (let j = 0; j < that.TimeData.length; j++) {
              if (that.TimeData[j]['maintenance_time'] !== undefined) {
                that.TimeData[j]['maintenance_time'] = that.moment(that.TimeData[j]['maintenance_time']).format('YYYY-MM-DD HH:mm:ss')
              }
              if (that.TimeData[j]['file_path'] !== undefined) {
                that.TimeData[j]['file_path'] = 'http://172.20.3.19/static' + that.TimeData[j]['file_path']
              }
              console.log(that.TimeData[j]['file_path'])
            }
            that.historicalloading = false
            that.historicalMaintenanceRecordsData = that.TimeData
          } else {
            that.historicalloading = false
            that.historicalMaintenanceRecordsData = []
            that.$message({
              type: 'error',
              message: '暂无历史记录！'
            })
          }
        }).catch(function (err) {
          that.historicalloading = false
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
        this.historicalMaintenanceRecords = false
      }
    },
    // 解除保养计划
    get_bind () {
      let that = this
      that.keepSn = that.message['device_base_info']['sn']
      that.$confirm('此操作将修改数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let formData = new FormData()
        formData.append('deviceSn', that.keepSn)
        that.$axios({
          method: 'post',
          url: '/api/device-maintenance/unbind-maintenanceItem',
          data: formData
        }).then(function (response) {
          console.log(response)
          if (response.status === 200) {
            that.$message({
              type: 'success',
              message: '已解除保养计划！'
            })
            that.get_keepData()
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
  mounted () {
    console.log(this.keepSn)
    this.get_keepData()
  },
  data () {
    return {
      keepData: [],
      Data: [],
      TimeData: [],
      historicalMaintenanceRecordsData: [],
      incorporatedOptions: [],
      msg: '',
      keepSn: '',
      nowDateTime: '',
      keeploading: false,
      historicalloading: false,
      addmaintaindialogVisible: false,
      historicalMaintenanceRecords: false,
      uploadFiledialogVisible: false,
      updateMaintenanceInformationdialogVisible: false,
      bind: false,
      Unbind: false,
      ruleForm: {
        maintenanceCurrentInfoId: '',
        maintenanceCurrentInfoDeviceOwner: '',
        DeviceName: '',
        DeviceSn: '',
        DeviceAssets: '',
        deviceSort: '',
        ItemCategory: '',
        ItemName: '',
        MaintenanceTime: '',
        MaintenanceUser: '',
        Remark: ''
      }
    }
  },
  props: {
    message: {
      type: Object,
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
.block{
  background: #e0dfdf;
  margin: 0;
  min-width: 0;
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
