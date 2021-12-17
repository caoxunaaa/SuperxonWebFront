<template>
<div class="CreateDeviceType">
  <span>一级设备类别</span>
  <el-select v-model="createDeviceData" placeholder="请选择">
    <el-option
      v-for="item in createData"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  <br>
  <el-input
      placeholder="请输入新增设备类型"
      v-model="createTypeData"
      style="width:310px"
      clearable>
      <el-button slot="append" @click="createType" style="background-color: #409eff; color: #fff;height: 40px">新增类别</el-button>
    </el-input>
    <br>
</div>
</template>

<script>
export default {
  name: 'CreateDeviceType',
  // 监听tableData数据发生改变时执行beforeDestroy方法
  watch: {
    message: {
      handler (newVal, oldVal) {
        this.get_create()
      },
      deep: true
    }
  },
  methods: {
    // 获取所有的一级设备类别
    get_create () {
      let that = this
      that.$axios({
        method: 'get',
        url: '/api/device-category/parent-category'
      }).then(function (response) {
        if (response.data !== null) {
          console.log(response.data)
          const res = response.data['deviceCategoriesResp']
          for (let i = 0; i < res.length; i++) {
            that.createData.push({
              label: res[i]['name'],
              value: res[i]['name']
            })
          }
          console.log(that.createData)
        }
      })
    },
    // 新增设备类别
    createType () {
      let that = this
      for (let i = 0; i < that.createData.length; i++) {
        if (that.createDeviceData === that.createData[i]['label']) {
          that.createDeviceDataID = that.createData[i]['value']
        }
      }
      console.log(that.createDeviceDataID)
      console.log(that.createTypeData)
      that.$confirm('新增设备类型, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let formData = new FormData()
        formData.append('name', that.createTypeData)
        formData.append('parentCategoryName', that.createDeviceDataID)
        this.$axios({
          url: '/api/device-category',
          method: 'post',
          data: formData
        }).then(function (response) {
          console.log(response.data)
          that.$message({
            type: 'success',
            message: '新增设备类型成功!'
          })
        }).catch(function (err) {
          if (err.response.status === 400) {
            alert('记录信息不正确')
          } else if (err.response.status === 401) {
            alert('用户未登录或登录已过期')
            localStorage.clear()
            that.$router.push({path: '/user/login/'})
            window.location.reload()
          } else if (err.response.status === 403) {
            alert('需要管理员权限')
          }
        })
      }).catch(() => {
        that.$message({
          type: 'info',
          message: '已取消修改'
        })
      })
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
    this.get_create()
  },
  data () {
    return {
      createTypeData: '',
      createData: [],
      createDeviceData: '',
      ID: '',
      createDeviceDataID: ''
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
