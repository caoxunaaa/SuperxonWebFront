<template>
<div class="EquipmentTransferInformation">
  <!-- 转移信息弹窗 -->
  <!-- <div v-for="item in message" :key="item.id">
    <li>{{item}}</li>
  </div> -->
  <el-table
    :data="TransferData"
    stripe
    style="width: 100%">
    <el-table-column
      prop="DeviceName"
      label="设备名称">
    </el-table-column>
    <el-table-column
      prop="DeviceCategoryRoot"
      label="一级设备类型">
    </el-table-column>
    <el-table-column
      prop="DeviceCategoryChild"
      label="二级设备类型">
    </el-table-column>
    <el-table-column
      prop="DeviceSn"
      label="SN">
    </el-table-column>
    <el-table-column
      prop="DeviceAssets"
      label="固资号">
    </el-table-column>
    <el-table-column
      prop="OldOwner"
      label="前归属者">
    </el-table-column>
    <el-table-column
      prop="NewOwner"
      label="现归属者">
    </el-table-column>
    <el-table-column
      prop="TransmitTime"
      label="设备转移时间">
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
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
  <el-dialog
    title="新增设备转移记录"
    :visible.sync="transferDialogVisible"
    width="40%"
    :close-on-click-modal='false'
    append-to-body>
    <AddEquipmentTransferInformation v-on:AddEquipmentTransferInformation="AddEquipmentTransferInformation" :message="msg"></AddEquipmentTransferInformation>
    </el-dialog>
    <div slot="footer" class="dialog-footer">
      <el-button class="el-button--small" style="background-color: #409eff; color: #fff;height:35px; width:110px;" type="primary"  @click="get_transfer">
        新增设备转移记录
      </el-button>
    </div>
</div>
</template>

<script>
import AddEquipmentTransferInformation from '@/components/equipment/PageItems/AddEquipmentTransferInformation'
export default {
  name: 'EquipmentTransferInformation',
  components: {
    AddEquipmentTransferInformation
  },
  // 监听tableData数据发生改变时执行beforeDestroy方法
  watch: {
    message: {
      handler (newVal, oldVal) {
        // console.log(this.tableData)
        // console.log(this.tablesData)
        this.get_keepData()
      },
      deep: true
    }
  },
  methods: {
    // 获取子组件传来的值进行更新并关闭弹窗
    AddEquipmentTransferInformation: function (AddEquipmentTransferInformationUpData) {
      if (AddEquipmentTransferInformationUpData === true) {
        this.transferDialogVisible = false
        this.get_keepData()
      }
    },
    // 获取设备转移记录
    get_keepData () {
      console.log(typeof (this.message))
      console.log(this.message)
      this.msg = this.message
      this.TransferSn = this.message['Sn']
      console.log(this.TransferSn)
      console.log(typeof (this.TransferSn))
      // let that = this
      // if (that.TransferSn !== null) {
      //   that.$axios({
      //     url: '/display/deviceManage/deviceTransmit/' + that.TransferSn,
      //     method: 'get'
      //   }).then(function (response) {
      //     console.log(response)
      //     const res = response.data
      //     console.log(res.TransmitTime)
      //     console.log(typeof (res))
      //     if (res !== null) {
      //       res.TransmitTime = that.moment(res.TransmitTime).format('YYYY-MM-DD HH:mm:ss')
      //       // res.TransmitTime
      //       that.TransferData.push(res)
      //       console.log(res)
      //       console.log(that.TransferData)
      //     } else {
      //       that.$message({
      //         type: 'error',
      //         message: '暂无转移记录！'
      //       })
      //     }
      //   }).catch(function (err) {
      //     if (err.response.status === 401) {
      //       alert('用户未登录或登录已过期')
      //       localStorage.clear()
      //       that.$router.push({path: '/user/login/'})
      //       window.location.reload()
      //     } else if (err.response.status === 403) {
      //       that.$message({
      //         type: 'error',
      //         message: '权限不够！'
      //       })
      //     } else if (err.response.status === 404) {
      //       that.$message({
      //         type: 'error',
      //         message: '未找到数据！'
      //       })
      //     } else if (err.response.status === 504) {
      //       that.$message({
      //         type: 'error',
      //         message: '服务器未响应！'
      //       })
      //     }
      //   })
      // }
    },
    // 操作按钮 （删除）
    handleDelete (index, row) {
      // let that = this
      console.log(index)
      console.log(row['ID'])
      let that = this
      that.$confirm('此操作将修改数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$axios({
          method: 'delete',
          url: '/display/deviceManage/deviceTransmit/' + row['ID']
        }).then(function (response) {
          if (response.status === 200) {
            that.$message({
              type: 'success',
              message: '删除成功!'
            })
            that.TransferData = []
            that.get_keepData()
          } else {
            that.$message({
              type: 'error',
              message: '删除失败！'
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
    },
    // 新增设备转移记录按钮
    get_transfer () {
      if (this.transferDialogVisible === false) {
        this.transferDialogVisible = true
      } else {
        this.transferDialogVisible = false
      }
    }
  },
  mounted () {
    this.get_keepData()
  },
  data () {
    return {
      TransferData: [],
      Data: [],
      msg: [],
      TransferSn: '',
      transferDialogVisible: false
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
