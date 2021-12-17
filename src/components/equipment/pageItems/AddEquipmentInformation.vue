<template>
<div class="AddEquipmentInformation">
  <!-- 新增设备信息弹窗 -->
  <el-form ref="form_put" :model="form_put" :rules="rules" label-width="25%" label-position="left">
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
  <el-form-item label="SN" prop="sn">
    <el-input  v-model="form_put.sn" style="width:250px"></el-input>
  </el-form-item>
  <el-form-item label="固资号">
    <el-input v-model="form_put.fixedAssetNumber" style="width:250px"></el-input>
  </el-form-item>
  <el-form-item label="归属者">
    <el-select v-model="form_put.Attributor" filterable placeholder="请选择归属者"
        style="width:250px">
      <el-option
        v-for="item in AttributorOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="时间">
      <el-date-picker type="datetime" placeholder="请选择入库时间"
        v-model="form_put.time"
        style="width: 100%;float: left"></el-date-picker>
  </el-form-item>
  <el-form-item>
    <el-button style="width:80px;height:40px">取消</el-button>
    <el-button style="width:80px;height:40px" type="primary" @click="submitForm('form_put')">新增</el-button>
  </el-form-item>
  </el-form>
</div>
</template>

<script>
export default {
  name: 'AddEquipmentInformation',
  // 监听tableData数据发生改变时执行beforeDestroy方法
  watch: {
    message: {
      handler (newVal, oldVal) {
        // console.log(this.tableData)
        // console.log(this.tablesData)
        this.get_options()
        this.getTime()
      },
      deep: true
    }
  },
  methods: {
    // // 打开弹窗获取当前各项信息
    get_options () {
      let that = this
      that.CategoryRootOptions = []
      that.AttributorOptions = []
      // console.log(that.CategoryRootOptions)
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
        } else {
          that.CategoryRootOptions = []
          that.$message({
            type: 'error',
            message: '暂无数据！'
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
      // 获取测试人员名称
      that.$axios({
        method: 'get',
        url: '/api/userInfo/getallusername'
      }).then(function (response) {
        const res = response.data
        console.log(res)
        // that.Attributordata = JSON.parse(JSON.stringify(res))
        // console.log(that.AttributorOptions)
        if (res['userInfosResp'] !== undefined) {
          for (let i = 0; i < res['userInfosResp'].length; i++) {
            that.AttributorOptions.push({
              label: res['userInfosResp'][i]['nickname'],
              value: res['userInfosResp'][i]['nickname']
            })
          }
          console.log(that.AttributorOptions)
        } else {
          that.AttributorOptions = []
          that.$message({
            type: 'error',
            message: '暂无数据！'
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
    },
    // 获取二级设备信息
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
        console.log(res)
        that.seconddata = JSON.parse(JSON.stringify(res))
        if (that.seconddata !== null) {
          for (let i = 0; i < that.seconddata.length; i++) {
            that.CategoryChildOptions.push({
              label: that.seconddata[i]['name'],
              value: that.seconddata[i]['name']
            })
          }
          console.log(that.CategoryChildOptions)
        } else {
          that.CategoryChildOptions = []
          that.$message({
            type: 'error',
            message: '暂无数据！'
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
    // 新增按钮
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let that = this
          console.log(that.form_put)
          that.form_put.time = that.form_put.time.toJSON()
          that.form_put.time = that.moment(that.form_put.time).format('YYYY-MM-DD HH:mm:ss')
          // that.form_put.time = that.moment(that.form_put.time).format('yyyy-MM-DD' + 'T' + 'HH:mm:ss' + '+08:00')
          console.log(that.form_put.time)
          console.log(typeof (that.form_put.time))
          that.$confirm('此操作将新增数据, 是否继续?', '提示', {
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
            formData.append('owner', that.form_put.Attributor)
            formData.append('internal_coding', that.form_put.equipmentNumber)
            formData.append('calibration_type', that.form_put.calibrationCategory)
            formData.append('supplier', that.form_put.supplier)
            formData.append('storage_time', that.form_put.time)
            that.$axios({
              method: 'post',
              url: '/api/device-base',
              data: formData
            }).then(function (response) {
              console.log(response)
              that.$message({
                type: 'success',
                message: '新增成功!'
              })
              that.AddEquipmentInformationUpdata = true
              that.$emit('AddEquipmentInformation', that.AddEquipmentInformationUpdata)
            }).catch(function (err) {
              console.log(err)
              if (err.response.status === 400) {
                that.$message({
                  type: 'error',
                  message: 'SN已存在！'
                })
                that.form_put.time = ''
              } else if (err.response.status === 401) {
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
          console.log('未通过')
        }
      })
    }
  },
  mounted () {
    this.get_options()
    this.getTime()
  },
  data () {
    var checkSn = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('SN不能为空！'))
      }
      setTimeout(() => {
        if ((/^[A-Za-z0-9-_\u4e00-\u9fa5]{1,30}$/).test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的字符'))
        }
      })
    }
    return {
      newtime: '',
      AddEquipmentInformationUpdata: false,
      firstdata: [],
      seconddata: [],
      Attributordata: [],
      CategoryRootOptions: [],
      CategoryChildOptions: [],
      AttributorOptions: [{label: '管理者', value: '管理者'}],
      nowDateTime: '',
      CalibrationTypeOptions: [{label: '免校', value: '免校'}, {label: '内校', value: '内校'}, {label: '外校', value: '外校'}],
      form_put: {
        CategoryRootValue: '',
        CategoryChildValue: '',
        DeviceName: '',
        sorttype: '',
        calibrationCategory: '',
        supplier: '',
        equipmentNumber: '',
        sn: '',
        time: '',
        fixedAssetNumber: '',
        Attributor: ''
      },
      rules: {
        sn: [
          {validator: checkSn, trigger: 'blur'}
        ]
      }
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
