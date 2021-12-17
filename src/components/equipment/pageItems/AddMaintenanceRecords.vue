<template>
<!--新增设备维修信息-->
<div class="AddMaintenanceRecords">
  <el-form :model="ruleForm" ref="ruleForm" label-width="20%" class="demo-ruleForm">
  <el-form-item label="设备名称" >
    <el-input v-model="ruleForm.name" :disabled="true" ></el-input>
  </el-form-item>
  <el-form-item label="设备类型" >
    <el-input v-model="ruleForm.sort" :disabled="true" ></el-input>
  </el-form-item>
  <el-form-item label="SN" >
    <el-input v-model="ruleForm.sn" :disabled="true"></el-input>
  </el-form-item>
  <el-form-item label="委托人" prop="client">
    <el-select v-model="ruleForm.client" filterable placeholder="请选择委托人" >
      <el-option
        v-for="item in clientOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="维修类型" prop="maintenanceType"
  :rules="[
      { required: true, message: '维修类型不能为空' }
    ]">
    <el-select v-model="ruleForm.maintenanceType" filterable placeholder="请选择维修类型"
    @change="get_type">
      <el-option
        v-for="item in maintenanceTypeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="送修厂家" prop="repairManufacturer">
    <el-input v-model="ruleForm.repairManufacturer" :disabled="repairDisabled"></el-input>
  </el-form-item>
  <el-form-item label="时间">
    <el-col :span="11">
      <el-date-picker type="datetime" placeholder="请选择送修时间"
        v-model="ruleForm.time.SendToRepairTime"
        style="width: 100%;float: left"></el-date-picker>
    </el-col>
    <el-col :span="1">-</el-col>
    <el-col :span="10">
      <el-date-picker type="datetime" placeholder="请选择完成时间"
        v-model="ruleForm.time.FinishTime" @change="get_status"
        style="width: 100%;float: right"></el-date-picker>
    </el-col>
  </el-form-item>
  <el-form-item label="维修状态" prop="repairStatus" v-if="statusDisabled">
    <el-select v-model="ruleForm.repairStatus" filterable placeholder="请选择维修状态">
      <el-option
        v-for="item in repairStatusOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="故障原因" prop="failureCause">
    <el-input type="textarea" v-model="ruleForm.failureCause"></el-input>
  </el-form-item>
  <el-form-item label="解决办法" prop="solution">
    <el-input type="textarea" v-model="ruleForm.solution"></el-input>
  </el-form-item>
  <el-form-item label="是否在保质期内" prop="shelfLife">
    <el-radio-group v-model="ruleForm.shelfLife">
      <el-radio label="1">是</el-radio>
      <el-radio label="0">否</el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="维修PR单号" prop="Pr">
    <el-input v-model="ruleForm.Pr"></el-input>
  </el-form-item>
  <el-form-item label="维修费用" prop="cost"
  :rules="[
      { required: true, message: '费用不能为空'},
      { type: 'number', message: '费用必须为数字值'}
    ]">
    <el-input type="number" v-model.number="ruleForm.cost" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button style="width:80px;height:40px;float:right" type="primary" @click="submitForm('ruleForm')">新增</el-button>
    <el-button style="width:80px;height:40px;float:right" @click="resetForm('ruleForm')">重置</el-button>
  </el-form-item>
  </el-form>
</div>
</template>

<script>
export default {
  name: 'AddMaintenanceRecords',
  // 监听tableData数据发生改变时执行beforeDestroy方法
  watch: {
    message: {
      handler (newVal, oldVal) {
        this.get_information()
        this.get_client()
      },
      deep: true
    }
  },
  methods: {
    // 获取该设备的名称和SN
    get_information () {
      console.log(this.message)
      this.ruleForm.name = this.message['device_base_info']['name']
      this.ruleForm.sort = this.message['device_base_info']['sort']
      this.ruleForm.sn = this.message['device_base_info']['sn']
      this.ruleForm.assets = this.message['device_base_info']['assets']
    },
    // 获取委托人信息
    get_client () {
      let that = this
      that.clientOptions = []
      that.$axios({
        method: 'get',
        url: '/api/userInfo/getallusername'
      }).then(function (response) {
        console.log(response)
        const res = response.data
        console.log(res)
        if (res['userInfosResp'] !== undefined) {
          for (let i = 0; i < res['userInfosResp'].length; i++) {
            that.clientOptions.push({
              label: res['userInfosResp'][i]['nickname'],
              value: res['userInfosResp'][i]['nickname']
            })
          }
          console.log(that.clientOptions)
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
    // 维修类别控制送修厂家是否禁用
    get_type () {
      console.log(this.ruleForm.maintenanceType)
      if (this.ruleForm.maintenanceType === '内部维修') {
        this.repairDisabled = true
      } else {
        this.repairDisabled = false
      }
    },
    // 维修完成时间控制维修状态是否禁用
    get_status () {
      console.log(this.ruleForm.time.FinishTime)
      if (this.ruleForm.time.FinishTime !== null) {
        this.statusDisabled = true
      } else {
        this.statusDisabled = false
      }
    },
    // 提交按钮，同时验证必填项是否填写
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm)
          console.log(this.ruleForm.time.FinishTime)
          if (this.ruleForm.time.FinishTime === null || this.ruleForm.time.FinishTime === '') {
            console.log('维修中')
            // if (this.ruleForm.shelfLife === 'true') {
            //   this.ruleForm.shelfLife = 1
            // } else {
            //   this.ruleForm.shelfLife = 0
            // }
            this.ruleForm.repairStatus = 0
            this.ruleForm.time.SendToRepairTime = this.ruleForm.time.SendToRepairTime.toJSON()
            this.ruleForm.time.SendToRepairTime = this.moment(this.ruleForm.time.SendToRepairTime).format('YYYY-MM-DD HH:mm:ss')
            // this.ruleForm.time.SendToRepairTime = this.moment(this.ruleForm.time.SendToRepairTime).format('yyyy-MM-DD' + 'T' + 'HH:mm:ss' + '+08:00')
            // console.log(this.ruleForm.time.SendToRepairTime)
            let that = this
            that.$confirm('此操作将修改数据, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              console.log(that.ruleForm)
              let formData = new FormData()
              formData.append('name', that.ruleForm.name)
              formData.append('sort', that.ruleForm.sort)
              formData.append('sn', that.ruleForm.sn)
              formData.append('assets', that.ruleForm.assets)
              formData.append('repairCategory', that.ruleForm.maintenanceType)
              formData.append('delegator', that.ruleForm.client)
              formData.append('repairFactory', that.ruleForm.repairManufacturer)
              formData.append('sendToRepairTime', that.ruleForm.time.SendToRepairTime)
              formData.append('finishTime', that.ruleForm.time.FinishTime)
              formData.append('isShelfLife', that.ruleForm.shelfLife)
              formData.append('reason', that.ruleForm.failureCause)
              formData.append('solution', that.ruleForm.solution)
              formData.append('pr', that.ruleForm.Pr)
              formData.append('cost', that.ruleForm.cost)
              formData.append('isDrop', that.ruleForm.repairStatus)
              that.$axios({
                method: 'post',
                url: '/api/device-repair',
                data: formData
              }).then(function (response) {
                console.log(response)
                if (response.status === 200) {
                  that.$message({
                    type: 'success',
                    message: '新增设备维修记录成功！'
                  })
                  that.AddMaintenanceRecordsUpData = true
                  that.$emit('AddMaintenanceRecords', that.AddMaintenanceRecordsUpData)
                } else {
                  that.$message({
                    type: 'error',
                    message: '新增设备维修记录失败！'
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
          } else {
            console.log('正常')
            // console.log(this.ruleForm.time.SendToRepairTime)
            // console.log(typeof (this.ruleForm.time.SendToRepairTime))
            // console.log(this.ruleForm.time.SendToRepairTime.toJSON())
            // console.log(typeof (this.ruleForm.time.SendToRepairTime.toJSON()))
            this.ruleForm.time.FinishTime = this.ruleForm.time.FinishTime.toJSON()
            this.ruleForm.time.FinishTime = this.moment(this.ruleForm.time.FinishTime).format('YYYY-MM-DD HH:mm:ss')
            this.ruleForm.time.SendToRepairTime = this.ruleForm.time.SendToRepairTime.toJSON()
            this.ruleForm.time.SendToRepairTime = this.moment(this.ruleForm.time.SendToRepairTime).format('YYYY-MM-DD HH:mm:ss')
            // console.log(this.ruleForm.time.FinishTime)
            // console.log(this.ruleForm.time.SendToRepairTime)
            let formData = new FormData()
            let that = this
            formData.append('repairCategory', that.ruleForm.maintenanceType)
            formData.append('repairFactory', that.ruleForm.repairManufacturer)
            formData.append('name', that.ruleForm.name)
            formData.append('sort', that.ruleForm.sort)
            formData.append('sn', that.ruleForm.sn)
            formData.append('assets', that.ruleForm.assets)
            formData.append('delegator', that.ruleForm.client)
            formData.append('sendToRepairTime', that.ruleForm.time.SendToRepairTime)
            formData.append('finishTime', that.ruleForm.time.FinishTime)
            formData.append('isShelfLife', that.ruleForm.shelfLife)
            formData.append('isDrop', that.ruleForm.repairStatus)
            formData.append('reason', that.ruleForm.failureCause)
            formData.append('solution', that.ruleForm.solution)
            formData.append('pr', that.ruleForm.Pr)
            formData.append('cost', that.ruleForm.cost)
            that.$confirm('此操作将修改数据, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              console.log(that.ruleForm)
              console.log(formData)
              that.$axios({
                method: 'post',
                url: '/api/device-repair',
                data: formData
              }).then(function (response) {
                console.log(response)
                const res = response.data
                console.log(res)
                if (response.status === 200) {
                  that.$message({
                    type: 'success',
                    message: '新增设备维修记录成功！'
                  })
                  that.AddMaintenanceRecordsUpData = true
                  that.$emit('AddMaintenanceRecords', that.AddMaintenanceRecordsUpData)
                } else {
                  that.$message({
                    type: 'error',
                    message: '新增设备维修记录失败！'
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
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置按钮
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
  mounted () {
    this.get_information()
    this.get_client()
  },
  data () {
    return {
      AddMaintenanceRecordsUpData: false,
      repairDisabled: false,
      statusDisabled: false,
      clientOptions: [],
      repairStatusOptions: [{label: '正常', value: '0'}, {label: '报废', value: '1'}],
      maintenanceTypeOptions: [{label: '内部维修', value: '内部维修'}, {label: '外部维修', value: '外部维修'}],
      ruleForm: {
        name: '',
        sort: '',
        sn: '',
        client: '',
        maintenanceType: '',
        repairManufacturer: '',
        time: {
          SendToRepairTime: '',
          FinishTime: ''
        },
        failureCause: '',
        solution: '',
        shelfLife: false,
        cost: '',
        repairStatus: '',
        assets: '',
        Pr: ''
      }
    }
  },
  props: {
    message: {
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
