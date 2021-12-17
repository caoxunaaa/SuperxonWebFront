<template>
<div class="EquipmentMaintenanceManagement">
  <!-- 维修状态弹窗 -->
  <!-- <div v-for="item in message" :key="item.id">
    <li>{{item}}</li>
  </div> -->
  <el-table
    :data="repairData"
    stripe
    style="width: 100%">
    <el-table-column
      prop="id"
      label="ID">
    </el-table-column>
    <el-table-column
      prop="sn"
      label="sn">
    </el-table-column>
    <el-table-column
      prop="repair_category"
      label="维护类型">
    </el-table-column>
    <el-table-column
      prop="delegator"
      label="委托人">
    </el-table-column>
    <el-table-column
      prop="repair_factory"
      label="维修厂家">
    </el-table-column>
    <el-table-column
      prop="send_to_repair_time"
      label="送修时间">
    </el-table-column>
    <el-table-column
      prop="finish_time"
      label="完成时间">
    </el-table-column>
    <el-table-column
      prop="is_shelf_life"
      label="是否在保质期内">
    </el-table-column>
    <el-table-column
      prop="reason"
      label="故障原因">
    </el-table-column>
    <el-table-column
      prop="solution"
      label="解决办法">
    </el-table-column>
    <el-table-column
      prop="pr"
      label="维修PR单号">
    </el-table-column>
    <el-table-column
      prop="cost"
      label="维修费用">
    </el-table-column>
    <el-table-column label="操作">
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
<div slot="footer" class="dialog-footer">
  <el-button class="el-button--small" style="background-color: #409eff; color: #fff;height:35px; width:110px;" type="primary"  @click="get_addDialogVisible">
    新增设备维修记录
  </el-button>
</div>

<!--新增设备维修记录-->
<el-dialog
  title="新增设备维修记录"
  :close-on-click-modal='false'
  :visible.sync="addDialogVisible"
  width="40%"
  append-to-body>
  <AddMaintenanceRecords v-on:AddMaintenanceRecords="AddMaintenanceRecords" :message="msg"></AddMaintenanceRecords>
</el-dialog>

<!--修改操作弹窗-->
<el-dialog
  title="修改维修信息"
  :visible.sync="modifyMaintenanceDialogVisible"
  width="500px"
  :close-on-click-modal='false'
  :before-close="handleClose"
  append-to-body>
  <ModifyMaintenanceInformation v-on:ModifyMaintenanceInformation="ModifyMaintenanceInformation" v-bind:message="modifyMaintenanceMsg" :key="modifyMaintenanceMsg.Sn"></ModifyMaintenanceInformation>
</el-dialog>
</div>
</template>

<script>
import AddMaintenanceRecords from '@/components/equipment/PageItems/AddMaintenanceRecords'
import ModifyMaintenanceInformation from '@/components/equipment/PageItems/ModifyMaintenanceInformation'
export default {
  name: 'EquipmentMaintenanceManagement',
  components: {
    ModifyMaintenanceInformation,
    AddMaintenanceRecords
  },
  // 监听tableData数据发生改变时执行beforeDestroy方法
  watch: {
    message: {
      handler (newVal, oldVal) {
        // console.log(this.tableData)
        // console.log(this.tablesData)
        this.get_repair()
      },
      deep: true
    }
  },
  methods: {
    // 监听子组件传来的值进行更新和关闭弹窗
    ModifyMaintenanceInformation: function (ModifyMaintenanceInformationUpData) {
      if (ModifyMaintenanceInformationUpData === true) {
        this.modifyMaintenanceDialogVisible = false
        this.get_repair()
      }
    },
    AddMaintenanceRecords: function (AddMaintenanceRecordsUpData) {
      if (AddMaintenanceRecordsUpData === true) {
        this.addDialogVisible = false
        this.get_repair()
      }
    },
    // 新增设备维修按钮弹窗
    get_addDialogVisible () {
      console.log(this.message)
      console.log(this.repairData)
      if (this.repairData.length === 0) {
        this.addDialogVisible = true
        this.msg = this.message
      } else {
        if (this.repairData[0]['finish_time'] !== '未完成') {
          this.addDialogVisible = true
        } else {
          this.$message({
            type: 'error',
            message: '该设备正在维修中，无法新增维修记录！'
          })
        }
      }
    },
    // 获取需要显示的数据
    get_repair () {
      console.log('进行了获取数据的事件')
      let that = this
      that.repairData = []
      console.log(typeof (that.message))
      console.log(that.message)
      that.repairSn = that.message['device_base_info']['sn']
      that.msg = that.message
      console.log(that.repairSn)
      if (that.repairSn !== null) {
        that.$axios({
          url: '/api/device-repair/' + that.repairSn,
          method: 'get'
        }).then(function (response) {
          console.log(response)
          const res = response.data
          console.log(res)
          // console.log(res.length)
          if (res['deviceRepairInfosResp'] !== undefined) {
            // 对时间进行转换处理
            that.Data = res['deviceRepairInfosResp']
            console.log(that.Data)
            for (let n = 0; n < that.Data.length; n++) {
              for (let m = 0; m < that.Data.length - 1; m++) {
                if (that.Data[n]['send_to_repair_time'] > that.Data[m]['send_to_repair_time']) {
                  const mun = that.Data[n]
                  that.Data[n] = that.Data[m]
                  that.Data[m] = mun
                }
              }
            }
            for (let i = 0; i < that.Data.length; i++) {
              if (that.Data[i]['finish_time'] === undefined) {
                that.Data[i]['finish_time'] = '未完成'
              }
              if (that.Data[i]['repair_category'] === '内部维修') {
                that.Data[i]['repair_factory'] = '内部维修'
              }
              if (that.Data[i]['is_shelf_life'] === 1) {
                that.Data[i]['is_shelf_life'] = '是'
              } else if (that.Data[i]['is_shelf_life'] === 0) {
                that.Data[i]['is_shelf_life'] = '否'
              }
              if (that.Data[i]['repair_factory'] === 'undefined') {
                that.Data[i]['repair_factory'] = ''
              }
            }
            // for (let j = 0; j < that.Data.length; j++) {
            //   that.Data[j]['FinishTime']['Time'] = that.moment(that.Data[j]['FinishTime']['Time']).format('YYYY-MM-DD HH:mm:ss')
            //   that.Data[j]['SendToRepairTime'] = that.moment(that.Data[j]['SendToRepairTime']).format('YYYY-MM-DD HH:mm:ss')
            //   // that.rebateSetTransferTable[j]['StorageTime'] = that.moment(that.rebateSetTransferTable[j]['StorageTime']).format('YYYY-MM-DD HH:mm:ss')
            // }
            that.repairData = that.Data
            console.log(that.repairData)
            that.loading = false
          } else {
            // alert('没有相应信息')
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
        // let url = '/deviceManage/deviceRepair/' + that.repairSn
        // let type = 'get'
        // let params = {}
        // that.reqM2Service(url, params, type).then((res) => {
        //   if (res !== null) {
        //     console.log(res)
        //     that.Data = JSON.parse(JSON.stringify(res))
        //     that.repairData.push(that.Data)
        //     console.log(that.repairData)
        //   }
        // })
      }
    },
    // 操作按钮 （修改）
    handleEdit (index, row) {
      // console.log(index)
      // console.log(row)
      // this.modifyMaintenanceMsg = row
      // this.modifyMaintenanceDialogVisible = true
      // console.log(this.modifyMaintenanceMsg)
      if (index === 0) {
        console.log(row)
        this.modifyMaintenanceMsg = row
        this.modifyMaintenanceDialogVisible = true
        console.log(this.modifyMaintenanceMsg)
      } else {
        this.$message({
          type: 'error',
          message: '只能修改最新的维修记录！'
        })
      }
    },
    handleClose (done) {
      done()
    },
    open () {
      console.log('fdsg')
      this.get_repair()
    }
  },
  mounted () {
    this.get_repair()
  },
  data () {
    return {
      repairData: [],
      Data: [],
      modifyMaintenanceMsg: [],
      parentMsg: [],
      msg: [],
      repairSn: '',
      dialogVisible: false,
      modifyMaintenanceDialogVisible: false,
      addDialogVisible: false
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
