<template>
<div class="EquipmentDetailAndManages">
  <div>
    <!-- 导出excel表-->
    <!-- <download-excel
    class = "export-excel-wrapper"
    :data = "rebateSetTable"
    name = "设备excel表格.xls">
      <el-button type="primary"  class="el-button--small" style="background-color: #409eff; color: #fff; height: 40px; width:100px;float: right;">导出Excel表格</el-button>
    </download-excel> -->
    <el-popover
      placement="left"
      width="180">
      <div style="text-align: right; margin: 0;">
        <download-excel
          class = "export-excel-wrapper"
          :data = "allEquipmentInformationData"
          name = "所有设备信息excel表格.xls">
          <el-button type="primary" size="mini" style="width: 170px" :disabled="alldisabled" >导出所有设备信息</el-button>
        </download-excel>
        <download-excel
          class = "export-excel-wrapper"
          :data = "transferInformationForAllDevicesData"
          name = "所有设备转移信息excel表格.xls">
          <el-button type="primary" size="mini" style="width: 170px" :disabled="transferdisabled">导出所有设备转移信息</el-button>
        </download-excel>
        <download-excel
          class = "export-excel-wrapper"
          :data = "maintenanceInformationOfAllEquipmentData"
          name = "所有设备维修信息excel表格.xls">
          <el-button type="primary" size="mini" style="width: 170px" :disabled="maintenancedisabled">导出所有设备维修信息</el-button>
        </download-excel>
        <download-excel
          class = "export-excel-wrapper"
          :data = "currentMaintenanceInformationOfAllEquipmentData"
          name = "所有设备的当前保养信息excel表格.xls">
          <el-button type="primary" size="mini" style="width: 170px" :disabled="currentMaintenancedisabled">导出所有设备的当前保养信息</el-button>
        </download-excel>
        <download-excel
          class = "export-excel-wrapper"
          :data = "allMaintenanceInformationOfAllEquipmentData"
          name = "所有设备的所有保养信息excel表格.xls">
          <el-button type="primary" size="mini" style="width: 170px" :disabled="allMaintenancedisabled">导出所有设备的所有保养信息</el-button>
        </download-excel>
      </div>
      <el-button slot="reference" @click="allEquipmentInformation" style="background-color: #409eff; color: #fff; height: 40px; width:110px;padding:0;font-size:5px;float: right;">导出Excel表格</el-button>
    </el-popover>
    <!--新增设备信息-->
    <el-button class="el-button--small" style="background-color: #409eff; color: #fff; height: 40px; width:100px;padding:0;font-size:5px" type="primary"  @click="adddialogVisible = true"> 新增设备信息</el-button>
    <el-dialog
    title="新增设备信息"
    :close-on-click-modal='false'
    :visible.sync="adddialogVisible"
    width="30%">
    <AddEquipmentInformation v-on:AddEquipmentInformation="AddEquipmentInformation"></AddEquipmentInformation>
    </el-dialog>
    <!-- 创建设备类型-->
    <el-button class="el-button--small" style="background-color: #409eff; color: #fff; height: 40px;padding:0;font-size:5px; width:100px;" type="primary"  @click="dialogVisible = true"> 创建设备类型</el-button>
    <el-dialog
    title="创建设备类型"
    :close-on-click-modal='false'
    :visible.sync="dialogVisible"
    width="30%">
    <CreateDeviceType></CreateDeviceType>
    </el-dialog>
    <!--保养项目管理-->
    <el-button class="el-button--small" style="background-color: #409eff; color: #fff;height:40px; width:110px;padding:0;font-size:5px;" type="primary"  @click="maintenanceProjectManagement = true">
      保养项目管理
    </el-button>
    <el-dialog
    title="保养项目管理"
    :visible.sync="maintenanceProjectManagement"
    width="40%"
    :close-on-click-modal='false'
    append-to-body>
    <MaintenanceProjectManagement></MaintenanceProjectManagement>
  </el-dialog>
    <el-input placeholder="请输入设备名称"  style="width: 200px;"
      v-model="searchName"  class="input-with-select">
    <el-button slot="append" icon="el-icon-search" @click="nameSearch"
      style="background-color: #409eff; color: #fff; height: 40px; width:50px"></el-button>
    </el-input>
    <el-input placeholder="请输入SN或固资号"  style="width: 200px;"
      v-model="searchSn"  class="input-with-select">
    <el-button slot="append" icon="el-icon-search" @click="snSearch"
      style="background-color: #409eff; color: #fff; height: 40px; width:50px"></el-button>
    </el-input>
    <el-button type="primary" @click="sn_clear" style="background-color: #409eff; color: #fff; height: 40px; width:60px;">清 除</el-button>
  </div>
  <hr style="height:2px;padding:0px;margin:0px;border:0px;background-color:rgb(64, 158, 255)">
   <el-table
    ref="filterTable"
    v-loading="loading"
    :data="rebateSetTable.slice((currentPage-1)*pageSize,currentPage*pageSize)"
    style="width: 100%"
    lazy
    height="770"
    @filter-change="filterTagTable"
    @row-click="openDetails"
    :row-class-name="tableRowClassName">
    <el-table-column
      prop="device_base_info.id"
      label="ID">
    </el-table-column>
    <el-table-column
      prop="device_base_info.name"
      label="设备名称">
    </el-table-column>
    <el-table-column
      prop="device_base_info.storage_time"
      label="入库时间">
    </el-table-column>
    <el-table-column
      filter-placement="bottom-end"
      :column-key=" 'category_root' "
      :filters="CategoryRoottabledata"
      prop="device_base_info.category_root"
      label="一级设备类型">
    </el-table-column>
    <!-- <el-table-column
      prop="state"
      label="状态"
      width="90">
    </el-table-column> -->
    <el-table-column
      filter-placement="bottom-end"
      :column-key=" 'category_child' "
      :filters="CategoryChildData"
      prop="device_base_info.category_child"
      label="二级设备类型">
    </el-table-column>
    <el-table-column
      prop="device_base_info.sort"
      label="设备型号">
    </el-table-column>
    <el-table-column
      filter-placement="bottom-end"
      :column-key=" 'calibration_type' "
      :filters="[
        { text: '外校', value: '外校' },
        { text: '内校', value: '内校' },
        { text: '免校', value: '免校' }
      ]"
      prop="device_base_info.calibration_type"
      label="校准类别">
    </el-table-column>
    <el-table-column
      prop="device_base_info.supplier"
      label="供应商">
    </el-table-column>
    <el-table-column
      prop="device_base_info.internal_coding"
      label="设备编号">
    </el-table-column>
    <el-table-column
      prop="device_base_info.sn"
      label="SN">
    </el-table-column>
    <el-table-column
      prop="device_base_info.assets"
      label="固资号">
    </el-table-column>
    <el-table-column
      filter-placement="bottom-end"
      :column-key=" 'owner' "
      :filters="OwnerData"
      prop="device_base_info.owner"
      label="归属者">
    </el-table-column>
    <el-table-column
      filter-placement="bottom-end"
      :column-key=" 'status_of_repair' "
      :filters="[
        { text: '正常', value: '正常' },
        { text: '维修中', value: '维修中' },
        { text: '报废', value: '报废' }
      ]"
      label="维修状态"
      prop="status_of_repair">
      <template slot-scope="scope" >
            <el-button
              :type="tagChange(scope.row.status_of_repair)"
              disable-transitions v-if="scope.row.status_of_repair==='正常'">正常
            </el-button>
            <el-button
              :type="tagChange(scope.row.status_of_repair)"
              disable-transitions v-else-if="scope.row.status_of_repair==='待维修'">维修中
            </el-button>
            <el-button
              :type="tagChange(scope.row.status_of_repair)"
              disable-transitions v-else>报废
            </el-button>
          </template>
    </el-table-column>
    <el-table-column
      filter-placement="bottom-end"
      :column-key=" 'status_of_maintenance' "
      :filters="[
        { text: '正常', value: '正常' },
        { text: '待保养', value: '待保养' },
        { text: '未绑定', value: '未绑定' },
        { text: '保养超时', value: '保养超时' }
      ]"
      label="保养状态"
      prop="status_of_maintenance">
      <template slot-scope="scope">
            <el-button
              :type="tagMaintenanceChange(scope.row.status_of_maintenance)"
              disable-transitions v-if="scope.row.status_of_maintenance==='正常'">正常
            </el-button>
            <el-button
              :type="tagMaintenanceChange(scope.row.status_of_maintenance)"
              disable-transitions v-else-if="scope.row.status_of_maintenance==='待保养'">待保养
            </el-button>
            <el-button
              :type="tagMaintenanceChange(scope.row.status_of_maintenance)"
              disable-transitions v-else-if="scope.row.status_of_maintenance==='未绑定'">未绑定
            </el-button>
            <el-button
              :type="tagMaintenanceChange(scope.row.status_of_maintenance)"
              disable-transitions v-else-if="scope.row.status_of_maintenance==='X'">X
            </el-button>
            <el-button
              :type="tagMaintenanceChange(scope.row.status_of_maintenance)"
              disable-transitions v-else>保养超时
            </el-button>
          </template>
    </el-table-column>
    <el-table-column label="转移信息">
      <el-button>查看</el-button>
    </el-table-column>
    <el-table-column label="操作" width="120">
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
  <div class="block">
            <el-pagination align='center'
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="rebateSetTable.length">
            </el-pagination>
  </div>
  <!-- 维修状态弹窗 -->
  <el-dialog
  title="设备维修管理记录"
  :visible.sync="repairdialogVisible"
  width="80%"
  :close-on-click-modal='false'
  :before-close="handleClose">
  <EquipmentMaintenanceManagement v-bind:message="parentMsg" :key="parentMsg.Sn"></EquipmentMaintenanceManagement>
</el-dialog>

<!-- 保养状态弹窗 -->
  <el-dialog
  title="设备保养管理"
  :visible.sync="maintaindialogVisible"
  width="70%"
  :close-on-click-modal='false'
  :before-close="handleClose">
  <EquipmentKeepManagement v-bind:message="keepMsg" :key="keepMsg.Sn"></EquipmentKeepManagement>

</el-dialog>

<!-- 设备转移弹窗 -->
  <el-dialog
  title="设备转移记录"
  :visible.sync="transferdialogVisible"
  width="80%"
  :close-on-click-modal='false'
  :before-close="handleClose">
  <EquipmentTransferInformation v-bind:message="TransferMsg" :key="TransferMsg.Sn"></EquipmentTransferInformation>
</el-dialog>

<!--修改操作弹窗-->
<el-dialog
  title="修改信息"
  :close-on-click-modal='false'
  :visible.sync="modifydialogVisible"
  width="500px">
  <ModifyEquipmentInformation v-on:ModifyEquipmentInformation="ModifyEquipmentInformation" v-bind:message="modifyMsg" :key="modifyMsg.Sn" @fatherMethod="fatherMethod"></ModifyEquipmentInformation>
</el-dialog>
</div>
</template>

<script>
import EquipmentMaintenanceManagement from '@/components/equipment/PageItems/EquipmentMaintenanceManagement'
import EquipmentKeepManagement from '@/components/equipment/PageItems/EquipmentKeepManagement'
import EquipmentTransferInformation from '@/components/equipment/PageItems/EquipmentTransferInformation'
import ModifyEquipmentInformation from '@/components/equipment/PageItems/ModifyEquipmentInformation'
import CreateDeviceType from '@/components/equipment/PageItems/CreateDeviceType'
import MaintenanceProjectManagement from '@/components/equipment/PageItems/MaintenanceProjectManagement'
import AddEquipmentInformation from '@/components/equipment/PageItems/AddEquipmentInformation'
export default {
  name: 'EquipmentDetailAndManages',
  components: {
    EquipmentMaintenanceManagement,
    EquipmentKeepManagement,
    EquipmentTransferInformation,
    ModifyEquipmentInformation,
    CreateDeviceType,
    MaintenanceProjectManagement,
    AddEquipmentInformation
  },
  methods: {
    // 获取归属者名字
    get_name () {
      let that = this
      that.$axios({
        method: 'get',
        url: '/api/userInfo/getallusername'
      }).then(function (response) {
        console.log(response)
        const res = response.data['userInfosResp']
        for (let p = 0; p < res.length; p++) {
          that.OwnerData.push({'text': res[p]['nickname'], 'value': res[p]['nickname']})
        }
        // console.log(that.OwnerData)
      })
    },
    // 获取一级设备类型
    get_CategoryRoot () {
      let that = this
      that.$axios({
        method: 'get',
        url: '/api/device-category/parent-category'
      }).then(function (response) {
        console.log(response)
        const res = response.data['deviceCategoriesResp']
        if (res.length !== null) {
          for (let w = 0; w < res.length; w++) {
            // console.log(res[w]['name'])
            // console.log(typeof (res[w]['Name']))
            that.CategoryRoottabledata.push({'text': res[w]['name'], 'value': res[w]['name']})
          }
          // console.log(that.CategoryRoottabledata)
          that.get_CategoryChild()
        }
      })
    },
    // 获取二级设备类型
    get_CategoryChild () {
      let that = this
      for (let z = 0; z < that.CategoryRoottabledata.length; z++) {
        that.deviceChildCategoryString = String(that.CategoryRoottabledata[z]['text'])
        that.$axios({
          method: 'get',
          url: '/api/device-category/' + that.deviceChildCategoryString
        }).then(function (response) {
          console.log(response)
          const res = response.data['deviceCategoriesResp']
          // console.log(res)
          if (res !== undefined) {
            for (let q = 0; q < res.length; q++) {
              that.deviceChildCategoryData.push({'text': res[q]['name'], 'value': res[q]['name']})
              // console.log(that.deviceChildCategoryData)
            }
          }
        })
      }
      setTimeout(function () {
        that.CategoryChildData = that.deviceChildCategoryData
      }, 1000 * 10)
      // console.log(that.CategoryRoottabledata[0]['text'])
      // that.$axios({
      //   method: 'get',
      //   url: '/display/deviceManage/deviceChildCategory/设备'
      // }).then(function (response) {
      //   console.log(response)
      // })
    },
    // 监听子组件传来的值并进行跟新
    handleClose (done) {
      done()
      if (this.searchSn !== null) {
        this.snSearch()
      } else {
        this.sn_clear()
      }
      // this.sn_clear()
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done()
      //     console.log('关闭了！')
      //     this.sn_clear()
      //   })
      //   .catch(_ => {})
    },
    // 修改设备信息弹窗的关闭与刷新
    ModifyEquipmentInformation: function (ModifyEquipmentInformationUpdata) {
      if (ModifyEquipmentInformationUpdata === true) {
        if (this.rebateSetTable.length === 1) {
          this.modifydialogVisible = false
          this.snSearch()
        } else {
          this.modifydialogVisible = false
          this.sn_clear()
        }
      }
    },
    // 新增设备信息弹窗的关闭与刷新
    AddEquipmentInformation: function (AddEquipmentInformationUpdata) {
      if (AddEquipmentInformationUpdata === true) {
        this.adddialogVisible = false
        this.sn_clear()
      }
    },
    // 获取导出excal表格数据
    allEquipmentInformation () {
      let that = this
      that.$axios({
        method: 'get',
        url: '/api/export-device-base'
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res.device_base_infos !== null) {
          that.allEquipmentInformationData = res.device_base_infos
          that.alldisabled = false
        }
      })
      that.$axios({
        methods: 'get',
        url: '/display/deviceManage/deviceTransmit'
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null) {
          that.transferInformationForAllDevicesData = res
          that.transferdisabled = false
        }
      })
      that.$axios({
        method: 'get',
        url: '/api/device-repair'
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res.deviceRepairInfosResp.length !== 0) {
          that.maintenanceInformationOfAllEquipmentData = res.deviceRepairInfosResp
          that.maintenancedisabled = false
        }
      })
      that.$axios({
        method: 'get',
        url: '/api/device-maintenance/current-info'
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res.maintenance_current_info !== undefined) {
          that.currentMaintenanceInformationOfAllEquipmentData = res.maintenance_current_info
          that.currentMaintenancedisabled = false
        }
      })
      that.$axios({
        method: 'get',
        url: '/api/device-maintenance/maintenance-record'
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res.maintenance_record !== null) {
          that.allMaintenanceInformationOfAllEquipmentData = res.maintenance_record
          that.allMaintenancedisabled = false
        }
      })
    },
    // 每页多少条
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pageSize = val
    },
    // 当前页
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.currentPage = val
    },
    formatter (row, column) {
      return row.address
    },
    filterTag (value, row) {
      return row.name === value
    },
    filterHandler (value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    filterTagTable (filters) {
      this.twoData = []
      this.selectdata[String(Object.keys(filters))] = filters[String(Object.keys(filters))]
      this.newData = JSON.parse(localStorage.getItem('alldata'))
      for (let j = 0; j < Object.keys(this.selectdata).length; j++) {
        if (this.selectdata[Object.keys(this.selectdata)[j]].length <= 1) {
          for (let k = 0; k < this.selectdata[Object.keys(this.selectdata)[j]].length; k++) {
            for (let i = 0; i < this.newData.length; i++) {
              if (this.selectdata[Object.keys(this.selectdata)[j]][k] !== this.newData[i]['device_base_info'][String(Object.keys(this.selectdata)[j])]) {
                this.newData.splice(i, 1)
                i--
              }
            }
          }
        } else {
          this.twoData = []
          for (let k = 0; k < this.selectdata[Object.keys(this.selectdata)[j]].length; k++) {
            for (let i = 0; i < this.newData.length; i++) {
              if (this.selectdata[Object.keys(this.selectdata)[j]][k] === this.newData[i][String(Object.keys(this.selectdata)[j])]) {
                this.twoData.push(this.newData[i])
              }
            }
          }
          if (this.twoData.length !== 0) {
            this.newData = []
            for (let io = 0; io < this.twoData.length; io++) {
              this.newData.push(this.twoData[io])
            }
          }
        }
      }
      this.rebateSetTable = this.newData
    },
    // 操作按钮 （修改）
    handleEdit (index, row) {
      this.modifyMsg = row
      this.modifydialogVisible = true
    },
    // 操作按钮 （删除）
    handleDelete (index, row) {
      let that = this
      that.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$axios({
          method: 'delete',
          url: '/api/device-base/' + row['device_base_info']['id']
        }).then(function (response) {
          if (response.status === 200) {
            that.sn_clear()
            that.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            that.$message({
              type: 'error',
              message: '删除失败!'
            })
          }
        }).catch(function (err) {
          console.log(err)
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
          } else if (err.response.status === 400) {
            that.$message({
              type: 'error',
              message: '设备已关联维修、保养、转移等信息，无法删除！'
            })
          }
        })
      })
    },
    // 获取所有设备信息数据
    get_data () {
      localStorage.removeItem('alldata')
      let that = this
      that.loading = true
      // that.Equipments = []
      that.$axios({
        method: 'get',
        url: '/api/device-base'
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null) {
          // 对时间进行转换处理
          that.rebateSetTransferTable = JSON.parse(JSON.stringify(res))
          that.rebateSetTable = that.rebateSetTransferTable['device']
          for (let i = 0; i < that.rebateSetTable.length; i++) {
            var num = that.rebateSetTable[i]['device_base_info']
            num['status_of_maintenance'] = that.rebateSetTable[i]['status_of_maintenance']
            num['status_of_repair'] = that.rebateSetTable[i]['status_of_repair']
          }
          localStorage.setItem('alldata', JSON.stringify(that.rebateSetTable))
          that.loading = false
        } else {
          alert('没有相应信息')
        }
      }).catch(function (err) {
        console.log(err)
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
    // 点击搜索按钮进行查找某一个设备的信息
    snSearch () {
      // if (this.searchSn !== null) {
      //   console.log('bus')
      // }
      // console.log(this.searchSn)
      if (this.searchSn !== '') {
        // console.log(this.searchSn)
        // console.log(typeof (this.searchSn))
        this.rebateSetTable = []
        this.loading = true
        let that = this
        that.loading = true
        // that.Equipments = []
        that.$axios({
          method: 'get',
          url: '/api/device-base/detail',
          params: {
            sn: that.searchSn
          }
        }).then(function (response) {
          console.log(response)
          const res = response.data
          // console.log(res)
          if (res !== null) {
            that.searchData = JSON.parse(JSON.stringify(res))
            // console.log(that.searchData)
            that.currentPage = 1
            that.rebateSetTable.push(that.searchData)
            // console.log(that.rebateSetTable)
            that.loading = false
          } else {
            alert('没有相应信息')
          }
        }).catch(function (err) {
          that.loading = false
          if (err.response.status === 401) {
            alert('用户未登录或登录已过期')
            localStorage.clear()
            that.$router.push({path: '/user/login/'})
            window.location.reload()
          } else if (err.response.status === 400) {
            that.$axios({
              method: 'get',
              url: '/api/device-base/detail',
              params: {
                assets: that.searchSn
              }
            }).then(function (response) {
              console.log(response)
              const res = response.data
              // console.log(res)
              if (res !== null) {
                that.searchData = JSON.parse(JSON.stringify(res))
                // console.log(that.searchData)
                that.currentPage = 1
                that.rebateSetTable.push(that.searchData)
                // console.log(that.rebateSetTable)
                that.loading = false
              } else {
                alert('没有相应信息')
              }
            }).catch(function (err) {
              that.loading = false
              if (err.response.status === 401) {
                alert('用户未登录或登录已过期')
                localStorage.clear()
                that.$router.push({path: '/user/login/'})
                window.location.reload()
              } else {
                that.$message({
                  type: 'error',
                  message: '未找到数据！'
                })
              }
            })
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
    nameSearch () {
      if (this.rebateSetTable.length !== 0) {
        var data = []
        for (let i = 0; i < this.rebateSetTable.length; i++) {
          if (this.rebateSetTable[i]['device_base_info']['name'].indexOf(this.searchName) !== -1) {
            data.push(this.rebateSetTable[i])
          }
        }
        this.rebateSetTable = data
      }
    },
    // 清除按钮 还原成全部设备信息
    sn_clear () {
      this.loading = true
      this.searchSn = ''
      this.searchName = ''
      this.get_data()
      console.log('更新了')
      this.loading = false
    },
    fatherMethod () {
      console.log('进行了fatherMethod')
      this.sn_clear()
    },
    // 修改维修状态的项的样式
    tagChange (StatusOfRepair) {
      if (StatusOfRepair === '正常') {
        return 'success'
      } else if (StatusOfRepair === '待维修') {
        return 'primary'
      } else {
        return 'danger'
      }
    },
    // 点击维修状态和保养状态的弹窗事件
    openDetails (row, column) {
      // console.log(row)
      if (column['label'] === '维修状态') {
        console.log('第一个弹窗')
        this.repairdialogVisible = true
        this.parentMsg = row
        // this.timer = new Data().getTime()
        // console.log(this.parentMsg)
        // console.log(this.parentMsg['StatusOfRepair'])
        if (this.parentMsg['StatusOfRepair'] === '维修中') {
          this.AddDialogVisible = true
        } else {
          this.AddDialogVisible = false
        }
      } else if (column['label'] === '保养状态') {
        console.log('第二个弹窗')
        this.maintaindialogVisible = true
        this.keepMsg = row
        // console.log(this.keepMsg)
      } else if (column['label'] === '转移信息') {
        console.log('第三个弹窗')
        this.transferdialogVisible = true
        this.TransferMsg = row
        // console.log(this.TransferMsg)
      }
    },
    // 修改保养状态项的样式
    tagMaintenanceChange (StatusOfMaintenance) {
      if (StatusOfMaintenance === '正常') {
        return 'success'
      } else if (StatusOfMaintenance === '待保养') {
        return 'warning'
      } else if (StatusOfMaintenance === '未绑定' || StatusOfMaintenance === 'X') {
        return 'info'
      } else {
        return 'danger'
      }
    },
    // 根据良率修改当前行的颜色
    tableRowClassName ({row, rowIndex}) {
    }
  },
  mounted () {
    this.get_data()
    this.get_name()
    this.get_CategoryRoot()
  },
  beforeDestroy () {
  },
  data () {
    return {
      currentPage: 1,
      pageSize: 10,
      selectdata: {category_root: [], category_child: [], calibration_type: [], status_of_repair: [], status_of_maintenance: []},
      newData: [],
      twoData: [],
      data: [],
      OwnerData: [],
      CategoryChildData: [],
      CalibrationTypeData: [],
      deviceChildCategoryData: [],
      deviceChildCategoryString: '',
      listdata: '',
      CategoryRoottabledata: [],
      searchSn: '',
      searchName: '',
      Time: '',
      allEquipmentInformationData: [],
      transferInformationForAllDevicesData: [],
      maintenanceInformationOfAllEquipmentData: [],
      currentMaintenanceInformationOfAllEquipmentData: [],
      allMaintenanceInformationOfAllEquipmentData: [],
      searchData: [],
      table: [],
      rebateSetTransferTable: [],
      rebateSetTable: [],
      repairData: [],
      parentMsg: [],
      keepMsg: [],
      TransferMsg: [],
      modifyMsg: [],
      loading: true,
      alldisabled: true,
      transferdisabled: true,
      maintenancedisabled: true,
      maintenanceProjectManagement: false,
      currentMaintenancedisabled: true,
      allMaintenancedisabled: true,
      repairdialogVisible: false,
      maintaindialogVisible: false,
      transferdialogVisible: false,
      modifydialogVisible: false,
      dialogVisible: false,
      adddialogVisible: false,
      AddDialogVisible: false
      // filter: {
      //   maintenance_status: [{text: '正常', value: '正常'}, {text: '待保养', value: '待保养'}, {text: '保养超时', value: '保养超时'}, {text: '未绑定', value: '未绑定'}]
      // }
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
  padding: 8px;
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
