<template>
  <div class="Query">
    <br>
    <el-table
    border
    :data="tableData"
    :header-cell-style="{'text-align':'center'}"
    style="width: 100%; border:2px solid black">
    <el-table-column
    label="id"
    width="80px">
      <template slot-scope="scope">
        <el-input v-model="scope.row.id" clearable disabled></el-input>
      </template>
    </el-table-column>
    <el-table-column
    width="120px"
    label="trackingNum">
      <template slot-scope="scope">
        <el-input v-model="scope.row.trackingNum" clearable></el-input>
      </template>
    </el-table-column>
    <el-table-column
    width="120px"
    label="sn">
      <template slot-scope="scope">
        <el-input v-model="scope.row.sn" clearable></el-input>
      </template>
    </el-table-column>
    <el-table-column
    width="120px"
    label="model">
      <template slot-scope="scope">
        <el-input v-model="scope.row.model" clearable></el-input>
      </template>
    </el-table-column>
    <el-table-column
    width="120px"
    label="aop">
      <template slot-scope="scope">
        <el-input v-model="scope.row.aop" clearable></el-input>
      </template>
    </el-table-column>
    <el-table-column
    width="120px"
    label="er">
      <template slot-scope="scope">
        <el-input v-model="scope.row.er" clearable></el-input>
      </template>
    </el-table-column>
    <el-table-column
    width="120px"
    label="boxNum">
      <template slot-scope="scope">
        <el-input v-model="scope.row.boxNum" clearable></el-input>
      </template>
    </el-table-column>
    <el-table-column label="boxTime" width="420px">
      <template slot-scope="scope">
        <el-date-picker
          v-model="scope.row.boxTime"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right">
        </el-date-picker>
      </template>
    </el-table-column>
    <el-table-column
    width="120px"
    label="boxHistory">
      <template slot-scope="scope">
        <el-input v-model="scope.row.boxHistory" clearable></el-input>
      </template>
    </el-table-column>
    <el-table-column
    width="120px"
    label="cartonNum">
      <template slot-scope="scope">
        <el-input v-model="scope.row.cartonNum" clearable></el-input>
      </template>
    </el-table-column>
    <el-table-column label="cartonTime" width="420px">
      <template slot-scope="scope">
        <el-date-picker
          v-model="scope.row.cartonTime"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right">
        </el-date-picker>
      </template>
    </el-table-column>
    <el-table-column
    width="120px"
    label="cartonHistory">
      <template slot-scope="scope">
        <el-input v-model="scope.row.cartonHistory" clearable></el-input>
      </template>
    </el-table-column>
    <el-table-column
    width="120px"
    label="bigCar">
      <template slot-scope="scope">
        <el-input v-model="scope.row.bigCar" clearable></el-input>
      </template>
    </el-table-column>
    <el-table-column label="bigCarTime" width="420px">
      <template slot-scope="scope">
        <el-date-picker
          v-model="scope.row.bigCarTime"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right">
        </el-date-picker>
      </template>
    </el-table-column>
    <el-table-column
    width="120px"
    label="bigCarHis">
      <template slot-scope="scope">
        <el-input v-model="scope.row.bigCarHis" clearable></el-input>
      </template>
    </el-table-column>
    <el-table-column
    width="120px"
    label="shipmentPo">
      <template slot-scope="scope">
        <el-input v-model="scope.row.shipmentPo" clearable></el-input>
      </template>
    </el-table-column>
    <el-table-column label="shipmentTime" width="420px">
      <template slot-scope="scope">
        <el-date-picker
          v-model="scope.row.shipmentTime"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right">
        </el-date-picker>
      </template>
    </el-table-column>
    <el-table-column
    width="180px"
    label="shipmentCustomer">
      <template slot-scope="scope">
        <el-input v-model="scope.row.shipmentCustomer" clearable></el-input>
      </template>
    </el-table-column>
    <el-table-column
    width="120px"
    label="shipmentAwb">
      <template slot-scope="scope">
        <el-input v-model="scope.row.shipmentAwb" clearable></el-input>
      </template>
    </el-table-column>
    <el-table-column
    width="150px"
    label="shipmentForward">
      <template slot-scope="scope">
        <el-input v-model="scope.row.shipmentForward" clearable></el-input>
      </template>
    </el-table-column>
    <el-table-column
    width="120px"
    label="shipmentPlace">
      <template slot-scope="scope">
        <el-input v-model="scope.row.shipmentPlace" clearable></el-input>
      </template>
    </el-table-column>
    <el-table-column
    width="150px"
    label="shipmentHistory">
      <template slot-scope="scope">
        <el-input v-model="scope.row.shipmentHistory" clearable></el-input>
      </template>
    </el-table-column>
    <el-table-column
    width="120px"
    label="returnReasons">
      <template slot-scope="scope">
        <el-input v-model="scope.row.returnReasons" clearable></el-input>
      </template>
    </el-table-column>
    <el-table-column label="returnTime" width="420px">
      <template slot-scope="scope">
        <el-date-picker
          v-model="scope.row.returnTime"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right">
        </el-date-picker>
      </template>
    </el-table-column>
    <el-table-column
    width="120px"
    label="returnHistory">
      <template slot-scope="scope">
        <el-input v-model="scope.row.returnHistory" clearable></el-input>
      </template>
    </el-table-column>
    <el-table-column
    width="120px"
    label="reworkHistory">
      <template slot-scope="scope">
        <el-input v-model="scope.row.reworkHistory" clearable></el-input>
      </template>
    </el-table-column>
    </el-table>
    <br>
    <el-row>
      <el-col :span="2" :offset="8">
        <el-button type="primary" style="width:150px" icon="el-icon-delete" @click="get_delect">清空</el-button>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button type="primary" style="width:150px" icon="el-icon-search" @click="get_query">查询</el-button>
      </el-col>
      <el-col :span="5" :offset="1">
        <!-- <el-button type="primary" @click="exportCsv">导出指令</el-button> -->
        <download-excel
          style="width: 170px"
          class = "export-excel-wrapper"
          :data = "excelData"
          name = "物料出库信息excel表格.xls">
          <el-button type="primary" style="width: 170px" :disabled="disabled"><i class="el-icon-download"></i>导出物料出库信息</el-button>
        </download-excel>
      </el-col>
    </el-row>
    <br>
    <el-table
    border
    height="470"
    v-loading="loading"
    style="border: 2px solid black"
    :header-cell-style="{'text-align':'center'}"
    :data="data.slice((currentPage-1)*pageSize,currentPage*pageSize)">
      <el-table-column
      prop="Id"
      label="Id"
      width="120px">
      </el-table-column>
      <el-table-column
      width="120px"
      prop="TrackingNum.String"
      :show-overflow-tooltip="true"
      label="TrackingNum">
      </el-table-column>
      <el-table-column
      width="120px"
      prop="Sn.String"
      :show-overflow-tooltip="true"
      label="Sn">
      </el-table-column>
      <el-table-column
      width="120px"
      prop="Model.String"
      :show-overflow-tooltip="true"
      label="Model">
      </el-table-column>
      <el-table-column
      width="120px"
      prop="Aop.Float64"
      :show-overflow-tooltip="true"
      label="Aop">
      </el-table-column>
      <el-table-column
      width="120px"
      prop="Er.Float64"
      :show-overflow-tooltip="true"
      label="Er">
      </el-table-column>
      <el-table-column
      width="120px"
      prop="BoxNum.String"
      :show-overflow-tooltip="true"
      label="BoxNum">
      </el-table-column>
      <el-table-column
      width="120px"
      prop="BoxTime.String"
      :show-overflow-tooltip="true"
      label="BoxTime">
      </el-table-column>
      <el-table-column
      width="120px"
      prop="BoxHistory.String"
      :show-overflow-tooltip="true"
      label="BoxHistory">
      </el-table-column>
      <el-table-column
      width="120px"
      prop="CartonNum.String"
      :show-overflow-tooltip="true"
      label="CartonNum">
      </el-table-column>
      <el-table-column
      width="120px"
      prop="CartonTime.String"
      :show-overflow-tooltip="true"
      label="CartonTime">
      </el-table-column>
      <el-table-column
      width="120px"
      prop="CartonHistory.String"
      :show-overflow-tooltip="true"
      label="CartonHistory">
      </el-table-column>
      <el-table-column
      width="120px"
      prop="BigCar.String"
      :show-overflow-tooltip="true"
      label="BigCar">
      </el-table-column>
      <el-table-column
      width="120px"
      prop="BigCarTime.String"
      :show-overflow-tooltip="true"
      label="BigCarTime">
      </el-table-column>
      <el-table-column
      width="120px"
      prop="BigCarHis.String"
      :show-overflow-tooltip="true"
      label="BigCarHis">
      </el-table-column>
      <el-table-column
      width="120px"
      prop="ShipmentTime.String"
      :show-overflow-tooltip="true"
      label="ShipmentTime">
      </el-table-column>
      <el-table-column
      width="180px"
      prop="ShipmentCustomer.String"
      :show-overflow-tooltip="true"
      label="ShipmentCustomer">
      </el-table-column>
      <el-table-column
      width="120px"
      prop="ShipmentAwb.String"
      :show-overflow-tooltip="true"
      label="ShipmentAwb">
      </el-table-column>
      <el-table-column
      width="150px"
      prop="ShipmentForward.String"
      :show-overflow-tooltip="true"
      label="ShipmentForward">
      </el-table-column>
      <el-table-column
      width="150px"
      prop="ShipmentPlace.String"
      :show-overflow-tooltip="true"
      label="ShipmentPlace">
      </el-table-column>
      <el-table-column
      width="150px"
      prop="ShipmentHistory.String"
      :show-overflow-tooltip="true"
      label="ShipmentHistory">
      </el-table-column>
      <el-table-column
      width="120px"
      prop="ReturnReasons.String"
      :show-overflow-tooltip="true"
      label="ReturnReasons">
      </el-table-column>
      <el-table-column
      width="120px"
      prop="ShipmentPo.String"
      :show-overflow-tooltip="true"
      label="ShipmentPo">
      </el-table-column>
      <el-table-column
      width="120px"
      prop="ReturnTime.String"
      :show-overflow-tooltip="true"
      label="ReturnTime">
      </el-table-column>
      <el-table-column
      width="120px"
      prop="ReturnHistory.String"
      :show-overflow-tooltip="true"
      label="ReturnHistory">
      </el-table-column>
      <el-table-column
      width="120px"
      prop="ReworkHistory.String"
      :show-overflow-tooltip="true"
      label="ReworkHistory">
      </el-table-column>
    </el-table>
    <div class="block">
            <el-pagination align='center'
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="data.length">
            </el-pagination>
    </div>
    <div style="text-align:justify;">
      <el-collapse v-model="activeNames">
        <el-collapse-item style="border:2px solid black;" title="Model统计" name="1">
          <download-excel
            style="background-color: rgb(84, 92, 100);width:170px"
            class = "export-excel-wrapper"
            :data = "modelNumberData"
            name = "物料出库MODEL统计.xls">
            <el-button type="primary" style="width: 170px" :disabled="Modeldisabled"><i class="el-icon-download"></i>导出MODEL统计</el-button>
          </download-excel>
          <el-table
          border
          height="400"
          style="max-height:400px;border: 1px solid white"
          :cell-style="{padding:0+'px'}"
          :data="modelNumberData">
            <el-table-column
            type="index">
            </el-table-column>
            <el-table-column
              prop="model"
              label="MODEL"
              width="200">
            </el-table-column>
            <el-table-column
              prop="number"
              label="数量"
              width="120"
              sortable>
            </el-table-column>
          </el-table>
        </el-collapse-item>
        <el-collapse-item style="border:2px solid black" title="ShipmentPo统计" name="2">
          <download-excel
            style="background-color: rgb(84, 92, 100);width:170px"
            class = "export-excel-wrapper"
            :data = "ShipmentPoData"
            name = "物料出库ShipmentPo统计.xls">
            <el-button type="primary" style="width: 170px" :disabled="Shipmentdisabled"><i class="el-icon-download"></i>导出ShipmentPo统计</el-button>
          </download-excel>
          <el-table
          border
          height="400"
          style="max-height:400px;border: 1px solid white"
          :cell-style="{padding:0+'px'}"
          :data="ShipmentPoData">
            <el-table-column
            type="index">
            </el-table-column>
            <el-table-column
              prop="po"
              label="ShipmentPo"
              width="200">
            </el-table-column>
            <el-table-column
              prop="number"
              label="数量"
              width="120"
              sortable>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div>
      <h2>批量查询</h2>
      <div>
        <el-select style="float:left" v-model="selectData" placeholder="请选择">
          <el-option
            v-for="item in selectList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input
        style="float:left;width:200px"
          type="textarea"
          :rows="2"
          placeholder="请输入SN"
          v-model="textareaSN">
        </el-input>
        <el-button type="primary" style="width:150px;float:left" icon="el-icon-search" @click="batch_search_data">批量搜索sn</el-button>
        <download-excel
        style="width: 170px"
          class = "export-excel-wrapper"
          :data = "excel"
          name = "批量搜索SN表格.xls">
          <el-button type="primary" style="width: 170px" :disabled="batchDisabled"><i class="el-icon-download"></i>导出批量查询信息</el-button>
        </download-excel>
        <el-table
          height="500"
          width="100%"
          ref="batchdata"
          v-loading="batchloading"
          :data="batchTableData.slice((batchcurrentPage-1)*batchpageSize,batchcurrentPage*batchpageSize)">
          <el-table-column
            type="index">
          </el-table-column>
          <el-table-column :label="item.label" :key="item.index" v-for="item in batchTableHeader"
            :prop="item.label"
            :show-overflow-tooltip="true"
            width="180">
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
            <el-pagination align='center'
            @size-change="batchhandleSizeChange"
            @current-change="batchhandleCurrentChange"
            :current-page="batchcurrentPage"
            :page-sizes="[20]"
            :page-size="batchpageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="batchTableData.length">
            </el-pagination>
    </div>
    </div>
  </div>
</template>

<script>
// import Papa from 'papaparse'
export default {
  name: 'Query',
  components: {
  },
  mounted () {
  },
  watch: {
    listData: {
      handler: function (newVal, oldVal) {
        if (this.listData === 0) {
          console.log('搜索完成！')
          this.message.close()
          this.batchloading = false
          console.log(this.batchTableDataOnly)
          var data = []
          for (let i = 0; i < this.batchTableDataOnly.length; i++) {
            data = data.concat(this.batchTableDataOnly[i])
          }
          this.batchTableHeader = this.batchTableHeaderOnly
          this.batchTableData = data
          console.log(this.batchTableData)
          console.log(this.batchTableHeader)
          var headers = this.batchTableHeader
          var table = this.batchTableData
          this.excel = []
          for (let m = 0; m < table.length; m++) {
            var list = {}
            for (let n = 0; n < headers.length; n++) {
              var key = headers[n]['label']
              var value = table[m][headers[n]['label']]
              list[key] = value
            }
            this.excel.push(list)
          }
          console.log(this.excel)
          this.batchDisabled = false
          this.batchloading = false
        }
      },
      deep: true
    },
    batchTableData: {
      handler: function (newVal, oldVal) {
        if (this.batchTableData.length === 0) {
          this.batchDisabled = true
        } else {
          this.batchDisabled = false
        }
      }
    },
    excelData: {
      handler: function (newVal, oldVal) {
        if (this.excelData.length === 0) {
          this.disabled = true
        } else {
          this.disabled = false
        }
      }
    },
    ShipmentPoData: {
      handler: function (newVal, oldVal) {
        if (this.ShipmentPoData.length === 0) {
          this.Shipmentdisabled = true
        } else {
          this.Shipmentdisabled = false
        }
      }
    },
    modelNumberData: {
      handler: function (newVal, oldVal) {
        if (this.modelNumberData.length === 0) {
          this.Modeldisabled = true
        } else {
          this.Modeldisabled = false
        }
      }
    }
  },
  methods: {
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
    // 每页多少条
    batchhandleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.batchpageSize = val
    },
    // 当前页
    batchhandleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.batchcurrentPage = val
    },
    // 查询按钮事件
    get_query () {
      this.submitData = {}
      // console.log(this.tableData[0])
      // console.log(Object.keys(this.tableData[0]))
      var key = Object.keys(this.tableData[0])
      for (let i = 0; i < key.length; i++) {
        if (key[i] === 'boxTime' || key[i] === 'cartonTime' || key[i] === 'shipmentTime' || key[i] === 'bigCarTime' || key[i] === 'returnTime') {
          if (this.tableData[0][key[i]] === null) {
            this.tableData[0][key[i]] = ''
          }
          if (this.tableData[0][key[i]].length === 2) {
            var start = key[i] + 'Start'
            var end = key[i] + 'End'
            this.submitData[start] = this.moment(this.tableData[0][key[i]][0]).format('YYYY-MM-DD HH:mm:ss')
            this.submitData[end] = this.moment(this.tableData[0][key[i]][1]).format('YYYY-MM-DD HH:mm:ss')
          }
        } else {
          if (this.tableData[0][key[i]] !== '') {
            this.submitData[key[i]] = this.tableData[0][key[i]]
          }
        }
        // console.log(key[i])
      }
      // console.log(Object.keys(this.submitData))
      if (Object.keys(this.submitData).length !== 0) {
        // 不为空执行跨域
        this.get_data()
      }
    },
    // 查询数据
    get_data () {
      let that = this
      that.loading = true
      that.excelData = []
      that.modelNumberData = []
      that.ShipmentPoData = []
      var message = that.$message({
        type: 'warning',
        message: '正在搜索中~',
        duration: 0
      })
      that.$axios({
        url: '/display/production-material/shipment-information',
        method: 'get',
        params: that.submitData
      }).then(function (response) {
        console.log(response)
        message.close()
        const res = response.data
        if (res !== null) {
          that.data = res
          var xlsData = JSON.parse(JSON.stringify(res))
          for (let i = 0; i < xlsData.length; i++) {
            var keys = Object.keys(xlsData[i])
            that.obj = {}
            for (let j = 0; j < keys.length; j++) {
              // console.log(typeof (xlsData[i][keys[j]]))
              if ((typeof (xlsData[i][keys[j]])) === 'object') {
                var key = Object.keys(xlsData[i][keys[j]])[0]
                // console.log(xlsData[i][keys[j]][key])
                if (/^0/.test(xlsData[i][keys[j]][key]) === true) {
                  xlsData[i][keys[j]][key] = '\'' + xlsData[i][keys[j]][key]
                }
                that.obj[keys[j]] = String(xlsData[i][keys[j]][key])
              } else {
                if (xlsData[i][keys[j]] === 'id') {
                  if (/^0/.test(xlsData[i][keys[j]][key]) === true) {
                    xlsData[i][keys[j]][key] = '\'' + xlsData[i][keys[j]][key]
                  }
                  that.obj[keys[j]] = String(xlsData[i][keys[j]][key])
                }
              }
            }
            that.excelData.push(that.obj)
          }
          // console.log(that.excelData)
          that.statistics_data()
          that.disabled = false
          that.loading = false
        }
      }).catch(function (err) {
        if (err.response.status === 401) {
          that.loading = false
          message.close()
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
        } else {
          that.$message({
            type: 'error',
            message: '异常！'
          })
        }
      })
    },
    // 统计数据
    statistics_data () {
      let that = this
      var modelData = []
      var setmodel = []
      var PoData = []
      var setpo = []
      var modeltable = []
      var potable = []
      for (let e = 0; e < that.data.length; e++) {
        modelData.push(that.data[e]['Model']['String'])
        PoData.push(that.data[e]['ShipmentPo']['String'])
      }
      // console.log(modelData)
      // console.log(PoData)
      setmodel = Array.from(new Set(modelData))
      setpo = Array.from(new Set(PoData))
      // console.log(setmodel)
      // console.log(setpo)
      for (let n = 0; n < setmodel.length; n++) {
        var num = 0
        for (let m = 0; m < modelData.length; m++) {
          if (modelData[m] === setmodel[n]) {
            num = num + 1
            // console.log('-----')
          }
        }
        modeltable.push({'number': num, 'model': setmodel[n]})
        // setmodel[n] = '共有' + num + '个：' + setmodel[n]
      }
      for (let x = 0; x < setpo.length; x++) {
        var sum = 0
        for (let y = 0; y < PoData.length; y++) {
          if (PoData[y] === setpo[x]) {
            // console.log(PoData[y])
            sum = sum + 1
            // console.log(sum)
          }
        }
        potable.push({'number': sum, 'po': setpo[x]})
        // setpo[x] = '共有' + sum + '个：' + setpo[x]
      }
      // console.log(potable)
      that.modelNumber = String(setmodel.length)
      that.ShipmentPoNumber = String(setpo.length)
      that.modelNumberData = modeltable
      that.ShipmentPoData = potable
    },
    // 批量搜索按钮
    batch_search_data () {
      // console.log(this.selectData)
      // console.log(this.textareaSN.split(/[(\r\n)\r\n]+/))
      // var number = this.textareaSN.split(/[(\r\n)\r\n]+/).length
      let requestPromiseArray = []
      var str = ''
      var data = JSON.parse(JSON.stringify(this.textareaSN.split(/[(\r\n)\r\n]+/)))
      while (data.length > 0) {
        if (data.length >= 100) {
          var sliData = data.slice(0, 100)
          // console.log(sliData)
          // console.log(sliData.length)
          for (let i = 0; i < sliData.length; i++) {
            if (sliData[i] !== '') {
              if (str === '') {
                str = str + sliData[i]
              } else {
                str = str + ',' + sliData[i]
              }
            }
          }
          // console.log(str)
          requestPromiseArray.push(str)
          // data.split(0, 100)
          data = data.slice(100)
          // console.log(data.length)
          // console.log(data)
          str = ''
        } else {
          // console.log(data)
          for (let i = 0; i < data.length; i++) {
            if (data[i] !== '') {
              if (str === '') {
                str = str + data[i]
              } else {
                str = str + ',' + data[i]
              }
            }
          }
          // console.log(str)
          requestPromiseArray.push(str)
          data = []
          str = ''
        }
      }
      // console.log(requestPromiseArray)
      this.get_batch_data(requestPromiseArray)
    },
    // 批量搜索数据
    get_batch_data (array) {
      let that = this
      that.batchloading = true
      that.batchTableDataOnly = []
      that.batchTableHeaderOnly = []
      that.batchTableData = []
      // console.log(array)
      that.listData = array.length
      that.message = that.$message({
        type: 'warning',
        message: '正在搜索中~',
        duration: 0
      })
      // console.log(that.message)
      // console.log(typeof (message))
      for (let i = 0; i < array.length; i++) {
        that.$axios({
          url: '/display/production-material/log-or-ate-by-sn',
          method: 'get',
          params: {
            type: that.selectData,
            snListString: array[i]
          }
        }).then(function (response) {
          console.log(response)
          const res = response.data
          if (res !== null && res.length !== 0) {
            that.batchTableDataOnly.push(res['Data'])
            // console.log(that.batchTableDataOnly)
            // var key = Object.keys(res[0])
            // if (that.batchTableHeaderOnly.length === 0) {
            for (let i = 0; i < res['Head'].length; i++) {
              that.batchTableHeaderOnly.push({'label': res['Head'][i]})
            }
            console.log(that.batchTableHeaderOnly)
            that.listData--
          }
          // if (i === array.length - 1) {
          //   that.message.close()
          // }
          // that.batchloading = false
        }).catch(function (err) {
          // if (i === array.length - 1) {
          //   that.message.close()
          // }
          that.batchloading = false
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
          } else {
            that.$message({
              type: 'error',
              message: '异常！'
            })
          }
        })
      }
      // that.$axios({
      //   url: '/display/production-material/log-or-ate-by-sn',
      //   method: 'get',
      //   params: {
      //     type: that.selectData,
      //     snListString: str
      //   }
      // }).then(function (response) {
      //   console.log(response)
      //   const res = response.data
      //   if (res !== null) {
      //     that.batchTableData = res
      //     var key = Object.keys(res[0])
      //     for (let i = 0; i < key.length; i++) {
      //       that.batchTableHeader.push({'label': key[i]})
      //     }
      //     console.log(that.batchTableHeader)
      //     that.batchDisabled = false
      //   }
      // })
    },
    // exportCsv () {
    //   var csv = Papa.unparse(this.excelData)
    //   let content = new Blob([csv])
    //   let urlObject = window.URL || window.webkitURL || window
    //   let url = urlObject.createObjectURL(content)
    //   let el = document.createElement('a')
    //   el.href = url
    //   el.download = '文件导出.csv'
    //   el.click()
    //   urlObject.revokeObjectURL(url)
    // },
    // 清除按钮
    get_delect () {
      this.tableData = this.copyData
    }
  },
  data () {
    return {
      excel: [],
      selectList: [{
        value: 'log',
        label: 'log'
      }, {
        value: 'ate',
        label: 'ate'
      }, {
        value: 'ate_new',
        label: 'ate_new'
      }],
      message: Object,
      mess: Object,
      selectData: '',
      textareaSN: '',
      activeNames: [],
      batchTableData: [],
      batchTableDataOnly: [],
      batchTableHeader: [],
      batchTableHeaderOnly: [],
      listData: 0,
      currentPage: 1,
      batchcurrentPage: 1,
      pageSize: 20,
      batchpageSize: 20,
      loading: false,
      batchloading: false,
      disabled: true,
      Shipmentdisabled: true,
      Modeldisabled: true,
      batchDisabled: true,
      tableData: [{
        id: '',
        trackingNum: '',
        sn: '',
        model: '',
        aop: '',
        er: '',
        boxNum: '',
        boxTime: [],
        boxHistory: '',
        cartonNum: '',
        cartonTime: [],
        cartonHistory: '',
        bigCar: '',
        bigCarTime: [],
        bigCarHis: '',
        shipmentPo: '',
        shipmentTime: [],
        shipmentCustomer: '',
        shipmentAwb: '',
        shipmentForward: '',
        shipmentPlace: '',
        shipmentHistory: '',
        returnReasons: '',
        returnTime: [],
        returnHistory: '',
        reworkHistory: ''
      }],
      submitData: {},
      copyData: [{
        id: '',
        trackingNum: '',
        sn: '',
        model: '',
        aop: '',
        er: '',
        boxNum: '',
        boxTime: [],
        boxHistory: '',
        cartonNum: '',
        cartonTime: [],
        cartonHistory: '',
        bigCar: '',
        bigCarTime: [],
        bigCarHis: '',
        shipmentPo: '',
        shipmentTime: [],
        shipmentCustomer: '',
        shipmentAwb: '',
        shipmentForward: '',
        shipmentPlace: '',
        shipmentHistory: '',
        returnReasons: '',
        returnTime: [],
        returnHistory: '',
        reworkHistory: ''
      }],
      ShipmentPoNumber: '',
      modelNumber: '',
      ShipmentPoData: [],
      modelNumberData: [],
      data: [],
      obj: {},
      excelData: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.Query >>> .el-table thead {
    color: white !important;
    background-color: rgb(84, 92, 100) !important;
}
.Query >>> .el-table th, .el-table tr{
    color: white !important;
    background-color: rgb(84, 92, 100) !important;
}
.Query >>>.el-table td, .el-table th.is-leaf {
  color: white !important;
  border-bottom-width: 0px !important;
  background-color: rgb(84, 92, 100) !important
}
.el-table, .el-table__expanded-cell {
    background-color: rgb(84, 92, 100);
}
.el-table >>> tbody tr:hover>td {
  background-color:#90c0f1!important
}
</style>
