<template>
<!--新增设备转移记录-->
<div class="AddEquipmentTransferInformation">
  <el-form :model="ruleForm" ref="ruleForm" label-width="20%" class="demo-ruleForm">
  <el-form-item label="设备名称" prop="name">
    <el-input v-model="ruleForm.name" :disabled="true"></el-input>
  </el-form-item>
  <el-form-item label="设备型号" prop="type">
    <el-input v-model="ruleForm.type" :disabled="true"></el-input>
  </el-form-item>
  <el-form-item label="设备持有人" prop="holder">
    <el-input v-model="ruleForm.holder" :disabled="true"></el-input>
  </el-form-item>
  <el-form-item label="委托人" prop="incorporatedBy">
    <el-select v-model="ruleForm.incorporatedBy" filterable placeholder="请选择委托人" >
      <el-option
        v-for="item in incorporatedOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
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
  name: 'AddEquipmentTransferInformation',
  // 监听tableData数据发生改变时执行beforeDestroy方法
  watch: {
    message: {
      handler (newVal, oldVal) {
        this.get_Transfer()
      },
      deep: true
    }
  },
  methods: {
    // 获取该设备的转移信息
    get_Transfer () {
      let that = this
      console.log(that.message)
      console.log(that.message['Sn'])
      console.log(that.message['Name'])
      console.log(that.message['Sort']['String'])
      console.log(that.message['Owner'])
      that.transferSn = that.message['Sn']
      that.ruleForm.name = that.message['Name']
      that.ruleForm.type = that.message['Sort']['String']
      that.ruleForm.holder = that.message['Owner']
      that.ruleForm.InternalCoding = that.message['InternalCoding']['String']
      that.ruleForm.Assets = that.message['Assets']
      that.ruleForm.CategoryChild = that.message['CategoryChild']
      that.ruleForm.CategoryRoot = that.message['CategoryRoot']
      console.log(that.transferSn)
      // 获取委托人列表
      that.$axios({
        method: 'get',
        url: '/display/userHandle/profile'
      }).then(function (response) {
        console.log(response)
        const res = response.data
        console.log(res)
        if (res !== null) {
          for (let i = 0; i < res.length; i++) {
            that.incorporatedOptions.push({
              label: res[i]['Username'],
              value: res[i]['Username']
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
    // 提交按钮，同时验证必填项是否填写
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm)
          let that = this
          that.$confirm('此操作将修改数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            that.$axios({
              method: 'post',
              url: '/display/deviceManage/deviceTransmit',
              data: {
                DeviceName: that.ruleForm.name,
                DeviceCategoryRoot: that.ruleForm.CategoryRoot,
                DeviceCategoryChild: that.ruleForm.CategoryChild,
                DeviceSort: {
                  String: that.ruleForm.type
                },
                DeviceSn: that.transferSn,
                DeviceAssets: that.ruleForm.Assets,
                DeviceInternalCoding: {
                  String: that.ruleForm.InternalCoding
                },
                OldOwner: that.ruleForm.holder,
                NewOwner: that.ruleForm.incorporatedBy
              }
            }).then(function (response) {
              if (response.status === 200) {
                that.$message({
                  type: 'success',
                  message: '新增转移记录成功!'
                })
                that.AddEquipmentTransferInformationUpData = true
                that.$emit('AddEquipmentTransferInformation', that.AddEquipmentTransferInformationUpData)
              } else {
                that.$message({
                  type: 'error',
                  message: '新增转移记录失败!'
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
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置按钮
    resetForm (formName) {
      this.$refs[formName].resetFields()
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
    this.get_Transfer()
  },
  data () {
    return {
      transferSn: '',
      data: [],
      AddEquipmentTransferInformationUpData: false,
      incorporatedOptions: [],
      ruleForm: {
        name: '',
        type: '',
        holder: '',
        incorporatedBy: '',
        CategoryChild: '',
        CategoryRoot: '',
        InternalCoding: '',
        Assets: ''
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
