<template>
  <div class="PTRControlShow">
    <h3>PTR修改记录查询</h3>
    <div>
      <div style="height: 60px">
        <el-form :model="ruleForm" ref="ruleForm" label-width="10px">
          <el-form-item style="float:left">
            <el-select v-model="ruleForm.username" filterable clearable placeholder="请选择修改人">
              <el-option
                  v-for="item in userData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="float:left">
            <el-select v-model="ruleForm.tableName" filterable clearable placeholder="请选择修改表">
              <el-option
                  v-for="item in tableNameData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="float:left">
            <el-date-picker
              v-model="ruleForm.updateTimeStart"
              type="datetime"
              placeholder="选择起始日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item style="float:left">
            <el-date-picker
              v-model="ruleForm.updateTimeEnd"
              type="datetime"
              placeholder="选择截止日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item style="float:left">
            <el-button type="primary" style="width:100px" icon="el-icon-search" @click="search_ptr_message">搜索</el-button>
          </el-form-item>
          <el-form-item style="float:left">
          <download-excel
            class = "export-excel-wrapper"
            :data = "ptrData"
            name = "PTR修改记录表格.xls">
            <el-button type="primary" >导出Excel表格</el-button>
          </download-excel>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div>
      <el-table
      border
      lazy
      :data="ptrData">
      <el-table-column
        :label="item[1]"
        :key="item[1]"
        v-for="item in batchTableHeader"
        :property="item[1]"
        sortable
        :show-overflow-tooltip="true">
        <template slot-scope="scope" style="font-size:5px">
          {{scope.row[item[0]]}}
        </template>
      </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PTRControlShow',
  components: {
  },
  mounted () {
    this.get_data()
    this.get_select_data()
  },
  methods: {
    // 获取下拉类表数据
    get_select_data () {
      let that = this
      that.$axios({
        method: 'get',
        url: '/api/userInfo/getallusername'
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null) {
          for (let p = 0; p < res['userInfosResp'].length; p++) {
            that.userData.push({'label': res['userInfosResp'][p]['nickname'], 'value': res['userInfosResp'][p]['nickname']})
          }
        }
      }).catch(function (err) {
        console.log(err)
        that.$message({
          type: 'error',
          message: '获取用户列表失败！'
        })
      })
      that.$axios({
        url: '/display/production-parameter/all-production-parameter-relation-field',
        method: 'get'
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null && res.length > 0) {
          for (let i = 0; i < res.length; i++) {
            that.tableNameData.push({value: res[i]['MonitoringTable'], label: res[i]['MonitoringTable']})
          }
        }
      }).catch(function (err) {
        console.log(err)
        that.$message({
          type: 'error',
          message: '获取数据库列表失败！'
        })
      })
    },
    // 获取全部信息
    get_data () {
      let that = this
      that.$axios({
        url: '/display/production-parameter/production-ptr-record',
        method: 'get'
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null) {
          for (let i = 0; i < res.length; i++) {
            var test = res[i]['FieldName1'] + ':' + res[i]['FieldValue1'] + res[i]['FieldName2'] + ':' + res[i]['FieldValue2'] + res[i]['FieldName3'] + ':' + res[i]['FieldValue3'] + res[i]['FieldName4'] + ':' + res[i]['FieldValue4']
            res[i]['indexes'] = test
          }
          that.ptrData = res
        }
      }).catch(function (err) {
        console.log(err)
        that.$message({
          type: 'error',
          message: '获取全部信息数据失败！'
        })
      })
    },
    // 搜索ptr信息
    search_ptr_message () {
      console.log(this.ruleForm)
      var updateTimeStart = ''
      var updateTimeEnd = ''
      if (this.ruleForm['updateTimeStart'] !== null && this.ruleForm['updateTimeStart'] !== '') {
        updateTimeStart = this.moment(this.ruleForm['updateTimeStart']).format('YYYY-MM-DD HH:mm:ss')
      }
      if (this.ruleForm['updateTimeEnd'] !== null && this.ruleForm['updateTimeEnd'] !== '') {
        updateTimeEnd = this.moment(this.ruleForm['updateTimeEnd']).format('YYYY-MM-DD HH:mm:ss')
      }
      let that = this
      that.$axios({
        url: '/display/production-parameter/production-ptr-record',
        method: 'get',
        params: {
          username: this.ruleForm['username'],
          tableName: this.ruleForm['tableName'],
          updateTimeStart: updateTimeStart,
          updateTimeEnd: updateTimeEnd
        }
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null) {
          for (let i = 0; i < res.length; i++) {
            var test = res[i]['FieldName1'] + ':' + res[i]['FieldValue1'] + res[i]['FieldName2'] + ':' + res[i]['FieldValue2'] + res[i]['FieldName3'] + ':' + res[i]['FieldValue3'] + res[i]['FieldName4'] + ':' + res[i]['FieldValue4']
            res[i]['indexes'] = test
          }
          that.ptrData = res
        }
      }).catch(function (err) {
        console.log(err)
        that.$message({
          type: 'error',
          message: '搜索ptr信息数据失败！'
        })
      })
    },
    // 清空搜索表格数据
    get_delect () {
      this.tableData = this.copyData
    }
  },
  data () {
    return {
      ptrData: [],
      tableNameData: [],
      userData: [],
      batchTableHeader: [
        ['User', '修改人'],
        ['UpdateTime', '修改时间'],
        ['Note', '备注'],
        ['TableName', '表名'],
        ['indexes', '索引'],
        ['Result', '修改结果']
      ],
      ruleForm: {
        username: '',
        tableName: '',
        updateTimeStart: '',
        updateTimeEnd: ''
      },
      tableData: [{
        id: '',
        username: '',
        nickname: '',
        monitoring_table: '',
        only_field_1_name: '',
        only_field_1_value: '',
        only_field_2_name: '',
        only_field_2_value: '',
        only_field_3_name: '',
        only_field_3_value: '',
        only_field_4_name: '',
        only_field_4_value: '',
        changed_item: '',
        old_value: '',
        new_value: '',
        update_time: [],
        update_reason: ''
      }],
      copyData: [{
        id: '',
        username: '',
        nickname: '',
        monitoring_table: '',
        only_field_1_name: '',
        only_field_1_value: '',
        only_field_2_name: '',
        only_field_2_value: '',
        only_field_3_name: '',
        only_field_3_value: '',
        only_field_4_name: '',
        only_field_4_value: '',
        changed_item: '',
        old_value: '',
        new_value: '',
        update_time: [],
        update_reason: ''
      }],
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
.PTRControlShow >>> .el-table thead {
    color: white !important;
    background-color: rgb(84, 92, 100) !important;
}
.PTRControlShow >>> .el-table th, .el-table tr{
    color: white !important;
    background-color: rgb(84, 92, 100) !important;
}
.PTRControlShow >>>.el-table td, .el-table th.is-leaf {
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
