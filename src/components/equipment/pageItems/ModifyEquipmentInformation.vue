<template>
<div class="ModifyEquipmentInformation">
  <!-- 信息修改弹窗 -->
  <el-form ref="form_put" :model="form_put" label-width="100px" label-position="left">
  <el-form-item label="一级设备类型">
    <el-select v-model="form_put.CategoryRootValue" filterable placeholder="请选择设备类型"
        @change="get_child" style="width:250px">
      <el-option
        v-for="item in CategoryRootOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="二级设备类型">
    <el-select v-model="form_put.CategoryChildValue" filterable placeholder="请选择设备类型" style="width:250px">
      <el-option
        v-for="item in CategoryChildOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="归属者">
    <el-select v-model="form_put.client" filterable placeholder="请选择归属者"
        style="width:250px">
      <el-option
        v-for="item in clientOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="设备名称">
    <el-input v-model="form_put.DeviceName" style="width:250px"></el-input>
  </el-form-item>
  <el-form-item label="设备型号">
    <el-input v-model="form_put.sorttype" style="width:250px"></el-input>
  </el-form-item>
  <el-form-item label="校准类别">
    <el-select v-model="form_put.calibrationCategory" filterable placeholder="请选择校准类型" style="width:250px">
      <el-option
        v-for="item in CalibrationTypeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="供应商">
    <el-input v-model="form_put.supplier" style="width:250px"></el-input>
  </el-form-item>
  <el-form-item label="设备编号">
    <el-input v-model="form_put.equipmentNumber" style="width:250px"></el-input>
  </el-form-item>
  <el-form-item label="SN">
    <el-input v-model="form_put.sn" style="width:250px"></el-input>
  </el-form-item>
  <el-form-item label="固资号">
    <el-input v-model="form_put.fixedAssetNumber" style="width:250px"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button style="width:80px;height:40px">取消</el-button>
    <el-button style="width:80px;height:40px" type="primary" @click="onSubmit">修改</el-button>
  </el-form-item>
  </el-form>
</div>
</template>

<script>
export default {
  name: 'ModifyEquipmentInformation',
  // 监听tableData数据发生改变时执行beforeDestroy方法
  watch: {
    message: {
      handler (newVal, oldVal) {
        // console.log(this.tableData)
        // console.log(this.tablesData)
        this.get_options()
      },
      deep: true
    }
  },
  methods: {
    // 打开弹窗获取当前各项信息
    get_options () {
      let that = this
      that.clientOptions = []
      // that.CategoryRootOptions = []
      // console.log(that.CategoryRootOptions)
      console.log(that.message)
      that.form_put.ID = that.message['device_base_info']['id']
      that.form_put.StorageTime = that.message['device_base_info']['storage_time']
      that.form_put.CategoryRootValue = that.message['device_base_info']['category_root']
      that.form_put.CategoryChildValue = that.message['device_base_info']['category_child']
      that.form_put.DeviceName = that.message['device_base_info']['name']
      that.form_put.client = that.message['device_base_info']['owner']
      that.form_put.sorttype = that.message['device_base_info']['sort']
      that.form_put.calibrationCategory = that.message['device_base_info']['calibration_type']
      that.form_put.supplier = that.message['device_base_info']['supplier']
      that.form_put.equipmentNumber = that.message['device_base_info']['internal_coding']
      that.form_put.sn = that.message['device_base_info']['sn']
      that.form_put.fixedAssetNumber = that.message['device_base_info']['assets']
      that.form_put.StatusOfMaintenance = that.message['status_of_maintenance']
      that.form_put.StatusOfRepair = that.message['status_of_repair']
      // 获取测试人员
      that.$axios({
        method: 'get',
        url: '/api/userInfo/getallusername'
      }).then(function (response) {
        console.log(response)
        const res = response.data['userInfosResp']
        console.log(res)
        if (res !== null) {
          for (let i = 0; i < res.length; i++) {
            that.clientOptions.push({
              label: res[i]['nickname'],
              value: res[i]['nickname']
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
      that.CategoryRootOptions = []
      // 获取一级设备信息
      that.$axios({
        method: 'get',
        url: '/api/device-category/parent-category'
      }).then(function (response) {
        const res = response.data['deviceCategoriesResp']
        that.firstdata = JSON.parse(JSON.stringify(res))
        console.log(JSON.parse(JSON.stringify(res)))
        console.log(that.firstdata)
        if (that.firstdata !== null) {
          for (let i = 0; i < that.firstdata.length; i++) {
            that.CategoryRootOptions.push({
              label: that.firstdata[i]['name'],
              value: that.firstdata[i]['name']
            })
          }
          console.log(that.CategoryRootOptions)
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
      // 获取二级设备信息
      that.CategoryChildOptions = []
      that.$axios({
        method: 'get',
        url: '/api/device-category/' + that.form_put.CategoryRootValue
      }).then(function (response) {
        const res = response.data['deviceCategoriesResp']
        that.seconddata = JSON.parse(JSON.stringify(res))
        if (that.seconddata !== null) {
          for (let i = 0; i < that.seconddata.length; i++) {
            that.CategoryChildOptions.push({
              label: that.seconddata[i]['name'],
              value: that.seconddata[i]['name']
            })
          }
          console.log(that.CategoryChildOptions)
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
    get_child () {
      let that = this
      that.form_put.CategoryChildValue = ''
      that.CategoryChildOptions = []
      console.log(that.form_put.CategoryRootValue)
      console.log(typeof (that.form_put.CategoryRootValue))
      that.$axios({
        method: 'get',
        url: '/api/device-category/' + that.form_put.CategoryRootValue
      }).then(function (response) {
        const res = response.data['deviceCategoriesResp']
        that.seconddata = JSON.parse(JSON.stringify(res))
        if (that.seconddata !== null) {
          for (let i = 0; i < that.seconddata.length; i++) {
            that.CategoryChildOptions.push({
              label: that.seconddata[i]['name'],
              value: that.seconddata[i]['name']
            })
          }
          console.log(that.CategoryChildOptions)
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
    // 修改按钮
    onSubmit () {
      console.log(this.form_put)
      let that = this
      that.$confirm('此操作将永久修改该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let formData = new FormData()
        formData.append('name', that.form_put.DeviceName)
        formData.append('sort', that.form_put.sorttype)
        formData.append('sn', that.form_put.sn)
        formData.append('assets', that.form_put.fixedAssetNumber)
        formData.append('category_root', that.form_put.CategoryRootValue)
        formData.append('category_child', that.form_put.CategoryChildValue)
        formData.append('owner', that.form_put.client)
        formData.append('internal_coding', that.form_put.equipmentNumber)
        formData.append('calibration_type', that.form_put.calibrationCategory)
        formData.append('supplier', that.form_put.supplier)
        formData.append('storage_time', that.form_put.StorageTime)
        formData.append('repair_status', that.form_put.StatusOfRepair)
        formData.append('maintenance_status', that.form_put.StatusOfMaintenance)
        that.$axios({
          method: 'put',
          url: '/api/device-base/' + that.form_put.ID,
          data: formData
        }).then(function (response) {
          console.log(response)
          that.$message({
            type: 'success',
            message: '修改成功!'
          })
          that.ModifyEquipmentInformationUpdata = true
          that.$emit('ModifyEquipmentInformation', that.ModifyEquipmentInformationUpdata)
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
    // this.get_keepData()
    this.get_options()
  },
  // beforeDestroy () {
  //   this.ModifyEquipmentInformationUpdata = true
  //   this.$emit('ModifyEquipmentInformation', this.ModifyEquipmentInformationUpdata)
  // },
  data () {
    return {
      ModifyEquipmentInformationUpdata: false,
      firstdata: [],
      seconddata: [],
      clientOptions: [],
      CategoryRootOptions: [],
      CategoryChildOptions: [],
      CalibrationTypeOptions: [{label: '免校', value: '免校'}, {label: '内校', value: '内校'}, {label: '外校', value: '外校'}],
      form_put: {
        ID: '',
        CategoryRootValue: '',
        CategoryChildValue: '',
        DeviceName: '',
        sorttype: '',
        calibrationCategory: '',
        supplier: '',
        equipmentNumber: '',
        sn: '',
        fixedAssetNumber: '',
        StorageTime: '',
        client: '',
        StatusOfMaintenance: '',
        StatusOfRepair: ''
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
</style>
