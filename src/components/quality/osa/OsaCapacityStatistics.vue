<template>
  <div class="OsaCapacityStatistics">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form>
          <el-form-item style="float:left">
            <el-date-picker
              v-model="valuetime"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item style="float:left">
            <el-button @click="get_all_tableData"
                       style="background-color: #409eff; color: #fff; height: 40px; width:80px; float:left">搜索
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4" :offset="8">
        <el-button @click="dialogTypeConfigVisible = true" type="success">配置类型
        </el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <h3 style="color: #222222">发射耦合汇总</h3>
        <el-table
          max-height="400"
          :data="tableDataTransmitTotalSortByPn"
          border>
          <el-table-column
            align="center"
            prop="Type"
            label="产品类型">
          </el-table-column>
          <el-table-column
            align="center"
            prop="Count"
            label="数量">
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <h3 style="color: #222222">终测汇总</h3>
        <el-table
          max-height="400"
          :data="tableDataFinalTestTotalSortByPn"
          border>
          <el-table-column
            align="center"
            prop="Type"
            label="产品类型">
          </el-table-column>
          <el-table-column
            align="center"
            prop="Count"
            label="数量">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12" v-for="(index, item) in tablePnData" :key="item">
        <b>{{ item }}详情</b>
        <el-table
          max-height="400"
          :data="index"
          :row-style="{height:'20px'}"
          style="width: 100%">
          <el-table-column sortable :show-overflow-tooltip="true" v-for="(items) in PnTableHeader" :key="items"
                           :label="items" :property="items">
            <template slot-scope="scope" style="font-size:5px">
              {{ scope.row[items] }}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <h2>按员工分类</h2>
    <download-excel
      class = "export-excel-wrapper"
      style="margin: 20xp; display: inline"
      :data = "tableWorkerData.发射耦合按员工分类"
      name = "所有员工发射耦合生产产能excel表格.xls"
    >
      <el-button type="primary" class="el-button--small">导出发射耦合按员工分类Excel表格</el-button>
    </download-excel>
    <download-excel
      class = "export-excel-wrapper"
      style="margin: 20xp; display: inline"
      :data = "tableWorkerData.接收耦合按员工分类"
      name = "所有员工接收耦合生产产能excel表格.xls"
    >
      <el-button type="primary" class="el-button--small">导出接收耦合按员工分类Excel表格</el-button>
    </download-excel>
    <download-excel
      class = "export-excel-wrapper"
      style="margin: 20xp; display: inline"
      :data = "tableWorkerData.终测按员工分类"
      name = "所有员工终测生产产能excel表格.xls"
    >
      <el-button type="primary" class="el-button--small">导出终测按员工分类Excel表格</el-button>
    </download-excel>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form>
          <el-form-item style="float:left">
            <el-input v-model="workerIdInput" placeholder="请输入员工工号" clearable></el-input>
          </el-form-item>
          <el-form-item style="float:left">
            <el-button @click="get_worker('发射耦合按员工分类')"
                       style="background-color: #409eff; color: #fff; height: 40px; width:100px; float:left; margin-left: 20px">
              发射耦合
            </el-button>
          </el-form-item>
          <el-form-item style="float:left">
            <el-button @click="get_worker('接收耦合按员工分类')"
                       style="background-color: #409eff; color: #fff; height: 40px; width:100px; float:left; margin-left: 20px">
              接收耦合
            </el-button>
          </el-form-item>
          <el-form-item style="float:left">
            <el-button @click="get_worker('终测按员工分类')"
                       style="background-color: #409eff; color: #fff; height: 40px; width:100px; float:left; margin-left: 20px">
              终测
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-bottom: 50px">
      <el-col :span="24">
        <el-table
          max-height="400"
          :data="workerTableData"
          :row-style="{height:'20px'}"
          style="width: 100%">
          <el-table-column sortable :show-overflow-tooltip="true" v-for="(items) in WorkerTableHeader" :key="items"
                           :label="items" :property="items">
            <template slot-scope="scope" style="font-size:5px">
              {{ scope.row[items] }}
            </template>
          </el-table-column>
        </el-table>

      </el-col>
    </el-row>
    <el-dialog
      v-if="dialogTypeConfigVisible===true"
      title="物料类型分配"
      :visible.sync="dialogTypeConfigVisible"
      width="1200px">
      <div style="border: 1px solid red; width:100%">
        <el-table
          :data="TypeConfigData"
          border>
          <el-table-column
            prop="material"
            label="PN"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.material"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop='type'
            label="类型"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.type"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="确定"
            align="center">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="success"
                icon="el-icon-check"
                @click="TypeConfig(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'OsaCapacityStatistics',
  mounted () {
    this.get_timer()
  },
  watch: {},
  methods: {
    objectSpanMethod ({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          return {
            rowspan: 3,
            colspan: 1
          }
        } else if (rowIndex === 3) {
          return {
            rowspan: 1,
            colspan: 2
          }
        } else if (rowIndex === 4) {
          return {
            rowspan: 3,
            colspan: 1
          }
        } else if (rowIndex === 7) {
          return {
            rowspan: 1,
            colspan: 2
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      } else if (columnIndex === 1) {
        if (rowIndex === 3) {
          return {
            rowspan: 0,
            colspan: 0
          }
        } else if (rowIndex === 7) {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    // 打开页面执行搜索今天的事件
    get_timer () {
      const end = new Date()
      const start = new Date()
      start.setHours(8)
      start.setMinutes(30)
      start.setSeconds(0)
      this.valuetime = [start, end]
      this.time = this.valuetime
      this.startTime = this.moment(this.time[0]).format('YYYY-MM-DD HH:mm:ss')
      this.endTime = this.moment(this.time[1]).format('YYYY-MM-DD HH:mm:ss')
      this.get_all_tableData()
    },
    // 获取所有表格数据
    get_all_tableData () {
      let that = this
      for (let i = 0; i < that.Pnurls.length; i++) {
        that.get_data(that.Pnurls[i][0]).then(function (response) {
          const res = response.data
          if (res !== null) {
            that.tablePnData[that.Pnurls[i][1]] = res
          }
          that.get_table_data()
        })
      }
      console.log('所有PN分类表的数据：', that.tablePnData)
      for (let i = 0; i < that.Workerurls.length; i++) {
        that.get_data(that.Workerurls[i][0]).then(function (response) {
          const res = response.data
          if (res !== null) {
            that.tableWorkerData[that.Workerurls[i][1]] = res
          }
          that.get_table_data()
        })
      }
      console.log('所有员工分类表的数据：', that.tableWorkerData)
    },
    // 绘制图表的数据
    get_table_data () {
      let tableDataTransmit = {}
      this.tableDataTransmitTotalSortByPn = []
      for (let i = 0; i < this.tablePnData['发射耦合按PN分类'].length; i++) {
        if (tableDataTransmit[this.tablePnData['发射耦合按PN分类'][i].Type] === undefined) {
          tableDataTransmit[this.tablePnData['发射耦合按PN分类'][i].Type] = 0
        }
        tableDataTransmit[this.tablePnData['发射耦合按PN分类'][i].Type] += this.tablePnData['发射耦合按PN分类'][i].Count
      }
      for (let key in tableDataTransmit) {
        this.tableDataTransmitTotalSortByPn.push({'Type': key, 'Count': tableDataTransmit[key]})
      }

      let tableDataFinalTest = {}
      this.tableDataFinalTestTotalSortByPn = []
      for (let i = 0; i < this.tablePnData['终测按PN分类'].length; i++) {
        if (tableDataFinalTest[this.tablePnData['终测按PN分类'][i].Type] === undefined) {
          tableDataFinalTest[this.tablePnData['终测按PN分类'][i].Type] = 0
        }
        tableDataFinalTest[this.tablePnData['终测按PN分类'][i].Type] += this.tablePnData['终测按PN分类'][i].Count
      }
      for (let key in tableDataFinalTest) {
        this.tableDataFinalTestTotalSortByPn.push({'Type': key, 'Count': tableDataFinalTest[key]})
      }
    },
    // axios跨域获取数据
    get_data (url) {
      let that = this
      return that.$axios({
        url: url,
        method: 'get',
        params: {
          startTime: that.moment(that.valuetime[0]).format('YYYY-MM-DD HH:mm:ss'),
          endTime: that.moment(that.valuetime[1]).format('YYYY-MM-DD HH:mm:ss')
        }
      })
    },
    // 按员工工号搜索
    get_worker (name) {
      if (this.workerIdInput !== '') {
        var table = []
        var data = this.tableWorkerData[name]
        console.log('按员工工号搜索data:', data)
        for (let i = 0; i < data.length; i++) {
          if (data[i]['Worker'] === this.workerIdInput) {
            table.push(data[i])
          }
        }
        console.log('按员工工号搜索结果:', table)
        this.workerTableData = table
      } else {
        this.$message({
          type: 'error',
          message: '请输入员工工号！'
        })
      }
    },
    // 配置PN类型
    TypeConfig (row) {
      let that = this
      let formData = new FormData()
      if (row.material === '' || row.type === '') {
        that.$message({
          type: 'error',
          message: 'PN, 类型不能为空'
        })
        return
      }
      formData.append('material', row.material)
      formData.append('type', row.type)
      that.$axios({
        url: '/display/product-statistic-query/osa/pro-cap/set-type-config',
        method: 'post',
        data: formData
      }).then(function (response) {
        that.$message({
          type: 'success',
          message: '成功'
        })
        that.get_all_tableData()
        that.dialogTypeConfigVisible = false
      }).catch(function () {
        that.$message({
          type: 'error',
          message: '失败'
        })
      })
    }
  },
  data () {
    return {
      dialogTypeConfigVisible: false,
      TypeConfigData: [{material: '', type: ''}],
      workerIdInput: '',
      workerTableData: [],
      PnData: [],
      Pnurls: [
        ['/display/product-statistic-query/osa/pro-cap/transmit-auto-couple-sorted-by-pn', '发射耦合按PN分类'],
        ['/display/product-statistic-query/osa/pro-cap/terminal-test-sorted-by-pn', '终测按PN分类']
      ],
      Workerurls: [
        ['/display/product-statistic-query/osa/pro-cap/terminal-test-sorted-by-worker', '终测按员工分类'],
        ['/display/product-statistic-query/osa/pro-cap/transmit-auto-couple-sorted-by-worker', '发射耦合按员工分类'],
        ['/display/product-statistic-query/osa/pro-cap/receive-auto-couple-sorted-by-worker', '接收耦合按员工分类']
      ],
      tablePnData: {
        '发射耦合按PN分类': [],
        '终测按PN分类': []
      },
      tableWorkerData: {
        '发射耦合按员工分类': [],
        '接收耦合按员工分类': [],
        '终测按员工分类': []
      },
      PnTableHeader: ['Pn', 'Type', 'Count'],
      WorkerTableHeader: ['Worker', 'Pn', 'Type', 'Count'],
      valuetime: [],
      // 快捷按钮（近一周，近一月，近三月）
      pickerOptions: {
        shortcuts: [{
          text: '今天白班',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setHours(8)
            start.setMinutes(30)
            start.setSeconds(0)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '昨天晚班',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
            start.setHours(20)
            start.setMinutes(30)
            start.setSeconds(0)
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 1)
            end.setHours(8)
            end.setMinutes(30)
            end.setSeconds(0)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '昨天白班',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
            start.setHours(8)
            start.setMinutes(30)
            start.setSeconds(0)
            end.setTime(start.getTime())
            end.setHours(20)
            end.setMinutes(30)
            end.setSeconds(0)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            start.setHours(0)
            start.setMinutes(0)
            start.setSeconds(0)
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 7)
            end.setHours(0)
            end.setMinutes(0)
            end.setSeconds(0)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近半个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 15)
            start.setHours(0)
            start.setMinutes(0)
            start.setSeconds(0)
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 15)
            end.setHours(0)
            end.setMinutes(0)
            end.setSeconds(0)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            start.setHours(0)
            start.setMinutes(0)
            start.setSeconds(0)
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 30)
            end.setHours(0)
            end.setMinutes(0)
            end.setSeconds(0)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      tableDataTransmitTotalSortByPn: [],
      tableDataFinalTestTotalSortByPn: []
    }
  }
}
</script>

<style scoped>
.el-table, .el-table__expanded-cell {
  background-color: rgb(84, 92, 100);
}

.OsaCapacityStatistics >>> .el-table thead {
  color: white !important;
  background-color: rgb(84, 92, 100);
}

.OsaCapacityStatistics >>> .el-table th, .el-table tr {
  background-color: rgb(84, 92, 100);
}

.OsaCapacityStatistics >>> .el-table td, .el-table th.is-leaf {
  border-bottom-width: 0px !important;
  background-color: rgb(84, 92, 100);
  color: white !important;
  border: 1px solid white !important;
}

.el-table >>> tbody tr:hover > td {
  background-color: #90c0f1;
}

.el-table >>> .total-row {
  color: #000000 !important;
  border-bottom-width: 0px !important;
  background-color: #90c0f1 !important;
}

.el-table >>> .select-row {
  color: #000000 !important;
  border-bottom-width: 0px !important;
  background-color: #bcfdaf !important;
}

.el-table >>> .only-row {
  color: #ffffff !important;
  border-bottom-width: 0px !important;
  background-color: rgb(84, 92, 100) !important;
}
</style>
