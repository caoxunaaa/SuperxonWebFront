<template>
  <div class="AlarmLimit">
    <div style="width: 100%; height:800px;">
      <div style="height:40px">
        <br>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>后台</el-breadcrumb-item>
          <el-breadcrumb-item>告警管理</el-breadcrumb-item>
          <el-breadcrumb-item>告警界限</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-input placeholder="请输入Pn"  style="width: 300px;"
          v-model="searchPn"  class="input-with-select" clearable>
        <el-button slot="append" icon="el-icon-search" @click="search_doorsillData"
          style="background-color: #409eff; color: #fff; height: 40px; width:60px"></el-button>
        </el-input>
        <el-button @click="get_doorsill" type="primary" style="background-color: #409eff; color: #fff; height: 40px; width:80px;">清 除</el-button>
        <el-button @click="get_addDoorsill" style="background-color: #409eff; color: #fff;">新增告警界限</el-button>
      </div>
      <div>
        <br>
        <el-table
          :data="doorsillData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
          style="width: 99%">
          <el-table-column
            prop="Pn"
            label="PN">
          </el-table-column>
          <el-table-column
            prop="Process"
            label="工序">
          </el-table-column>
          <el-table-column
            prop="ModuleOsa"
            label="产线">
          </el-table-column>
          <el-table-column
            prop="OrderType"
            label="类型">
          </el-table-column>
          <el-table-column
            prop="RedLine"
            label="红色告警">
          </el-table-column>
          <el-table-column
            prop="YellowLine"
            label="黄色告警">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                class="el-icon-edit"
                type="primary" plain
                @click="handleEdit(scope.$index, scope.row)">
              </el-button>
              <el-button
                size="mini"
                icon="el-icon-delete"
                plain
                type="danger"
                v-if="(scope.row.Pn !== 'MODULE' && scope.row.Pn !== 'OSA')"
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
          :total="doorsillData.length">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--新增操作弹窗-->
    <el-dialog
    title="新增告警界限"
    :visible.sync="addDoorsillVisible"
    width="500px"
    append-to-body>
    <el-form :model="addDoorsillruleFrom" :rules="addrules" ref="addDoorsillruleFrom" label-width="100px" class="demo-rulrFrom">
      <el-form-item label="Pn" prop="Pn">
        <el-input v-model="addDoorsillruleFrom.Pn" type="textarea" :rows="2"></el-input>
      </el-form-item>
      <el-form-item label="工序" prop="Process">
        <el-input v-model="addDoorsillruleFrom.Process"></el-input>
      </el-form-item>
      <el-form-item label="产线" prop="Production">
        <el-select v-model="addDoorsillruleFrom.Production" placeholder="请选择产线">
          <el-option label="module" value="module"></el-option>
          <el-option label="osa" value="osa"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="Type">
        <el-select v-model="addDoorsillruleFrom.Type" placeholder="请选择产品类型">
          <el-option
            v-for="item in options[addDoorsillruleFrom.Production]"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="红色告警" prop="R">
        <el-input v-model.number="addDoorsillruleFrom.R"></el-input>
      </el-form-item>
      <el-form-item label="黄色告警" prop="Y">
        <el-input v-model.number="addDoorsillruleFrom.Y"></el-input>
      </el-form-item>
    </el-form>
    <el-button style="width:80px;height:40px;" type="primary" @click="addsubmitForm('addDoorsillruleFrom')">新增</el-button>
    </el-dialog>
    <!--修改操作弹窗-->
    <el-dialog
      title="修改告警界限"
      :visible.sync="doorsillDialogVisible"
      width="500px"
      append-to-body>
      <el-form :model="doorsillruleFrom" :rules="rules" ref="doorsillruleFrom" label-width="100px" class="demo-rulrFrom">
        <el-form-item label="Pn" prop="Pn" >
          <el-input v-model="doorsillruleFrom.Pn" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Process" prop="Process">
          <el-input v-model="doorsillruleFrom.Process" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="产线" prop="Production">
          <el-input v-model="doorsillruleFrom.Production" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="Type">
        <el-input v-model="doorsillruleFrom.Type" :disabled="true"></el-input>
      </el-form-item>
        <el-form-item label="红色告警" prop="R">
          <el-input v-model.number="doorsillruleFrom.R" type="number" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="黄色告警" prop="Y">
          <el-input v-model.number="doorsillruleFrom.Y" type="number" ></el-input>
        </el-form-item>
      </el-form>
      <el-button style="width:80px;height:40px" type="primary" @click="submitForm('doorsillruleFrom')">更新</el-button>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'AlarmLimit',
  components: {
  },
  mounted () {
    this.get_doorsill()
  },
  methods: {
    get_data () {
      let that = this
      that.$axios({
        url: '/display/qaStatisticBroad/qaPnList',
        method: 'get'
      }).then(function (response) {
        console.log(response)
      })
    },
    // 搜索某一Pn的告警门限
    search_doorsillData () {
      this.searchData = []
      if (this.doorsillData.length > 0) {
        for (let i = 0; i < this.doorsillData.length; i++) {
          if (this.doorsillData[i]['Pn'] === this.searchPn) {
            this.searchData.push(this.doorsillData[i])
          }
        }
      }
      this.doorsillData = this.searchData
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
    // 操作按钮 （修改）
    handleEdit (index, row) {
      console.log(index)
      console.log(row)
      this.doorsillDialogVisible = true
      this.doorsillruleFrom.Id = row.Id
      this.doorsillruleFrom.Pn = row.Pn
      this.doorsillruleFrom.Process = row.Process
      this.doorsillruleFrom.Production = row.ModuleOsa
      this.doorsillruleFrom.Type = row.OrderType
      for (let q = 0; q < this.doorsillDefaultData.length; q++) {
        if (row.Pn === this.doorsillDefaultData[q]['Pn'] && row.Process === this.doorsillDefaultData[q]['Process'] && row.ModuleOsa === this.doorsillDefaultData[q]['ModuleOsa'] && row.OrderType === this.doorsillDefaultData[q]['OrderType']) {
          console.log(this.doorsillDefaultData)
          console.log(this.doorsillDefaultData[q]['RedLine'])
          this.doorsillruleFrom.R = this.doorsillDefaultData[q]['RedLine']
          this.doorsillruleFrom.Y = this.doorsillDefaultData[q]['YellowLine']
        }
      }
      console.log(this.doorsillruleFrom.R)
      console.log(typeof (this.doorsillruleFrom.R))
    },
    // 操作按钮 （删除）
    handleDelete (index, row) {
      console.log(row)
      console.log(index)
      let that = this
      that.$confirm('此操作将修改数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$axios({
          url: '/display/background-management/settings-warning-threshold/' + row['Id'],
          method: 'delete'
        }).then(function (response) {
          console.log(response)
          if (response.status === 200) {
            that.$message({
              type: 'success',
              message: '删除告警门限成功！'
            })
            that.get_doorsill()
          } else {
            that.$message({
              type: 'error',
              message: '删除告警门限失败！'
            })
          }
        }).catch(function (err) {
          console.log(err)
          if (err.response.status === 504) {
            that.$message({
              type: 'error',
              message: '服务器未响应！'
            })
          } else if (err.response.status === 403) {
            that.$message({
              type: 'error',
              message: '权限不够！'
            })
          }
        })
      })
    },
    // 新增按钮
    addsubmitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.addDoorsillruleFrom)
          let that = this
          that.$confirm('此操作将修改数据，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            console.log(that.addDoorsillruleFrom.Pn)
            var pndata = []
            for (let i = 0; i < that.addDoorsillruleFrom.Pn.split(/[(\r\n)\r\n]+/).length; i++) {
              if (that.addDoorsillruleFrom.Pn.split(/[(\r\n)\r\n]+/)[i] !== '') {
                pndata.push(that.addDoorsillruleFrom.Pn.split(/[(\r\n)\r\n]+/)[i])
              }
            }
            pndata = Array.from(new Set(pndata))
            console.log(pndata)
            var requestArray = []
            for (let i = 0; i < pndata.length; i++) {
              requestArray.push(that.add_axios(that.addDoorsillruleFrom.Type, that.addDoorsillruleFrom.Production, pndata[i], that.addDoorsillruleFrom.Process, that.addDoorsillruleFrom.Y, that.addDoorsillruleFrom.R))
            }
            that.$axios.all(requestArray).then(that.$axios.spread((...res) => {
              var response = [...res]
              var trueNumber = 0
              var falseNumber = 0
              for (let i = 0; i < response.length; i++) {
                console.log(response[i]['data'])
                if (response[i]['data'] === 'Ok') {
                  trueNumber += 1
                } else {
                  falseNumber += 1
                }
              }
              var messagetext = '新增成功：' + trueNumber + '条，新增失败：' + falseNumber + '条'
              that.$message({
                type: 'warning',
                message: messagetext
              })
              that.addDoorsillVisible = false
              that.get_doorsill()
            }))
          })
        } else {
          console.log('error')
          return false
        }
      })
    },
    // 新增跨域事件
    add_axios (Type, Production, Pn, Process, Y, R) {
      let that = this
      let formData = new FormData()
      formData.append('order_type', Type)
      formData.append('module_osa', Production)
      formData.append('pn', Pn)
      formData.append('process', Process)
      formData.append('yellow_line', Y)
      formData.append('red_line', R)
      return that.$axios({
        url: '/display/background-management/settings-warning-threshold',
        method: 'post',
        data: formData
      })
    },
    // 更新按钮
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.doorsillruleFrom)
          let that = this
          that.$confirm('此操作将修改数据，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let formData = new FormData()
            formData.append('order_type', that.doorsillruleFrom.Type)
            formData.append('module_osa', that.doorsillruleFrom.Production)
            formData.append('pn', that.doorsillruleFrom.Pn)
            formData.append('process', that.doorsillruleFrom.Process)
            formData.append('yellow_line', that.doorsillruleFrom.Y)
            formData.append('red_line', that.doorsillruleFrom.R)
            that.$axios({
              url: '/display/background-management/settings-warning-threshold/' + that.doorsillruleFrom.Id,
              method: 'put',
              data: formData
            }).then(function (response) {
              console.log(response)
              if (response.status === 200) {
                that.$message({
                  type: 'success',
                  message: '修改告警门限成功！'
                })
                that.doorsillDialogVisible = false
                that.get_doorsill()
              } else {
                that.$message({
                  type: 'error',
                  message: '修改告警门限失败！'
                })
              }
            }).catch(function (err) {
              console.log(err)
              if (err.response.status === 504) {
                that.$message({
                  type: 'error',
                  message: '服务器未响应！'
                })
              } else if (err.response.status === 403) {
                that.$message({
                  type: 'error',
                  message: '权限不够！'
                })
              }
            })
          })
        } else {
          console.log('error')
          return false
        }
      })
    },
    // 新增告警界限
    get_addDoorsill () {
      this.addDoorsillVisible = true
    },
    // 获取新增界面搜索框中的数据
    visiblechange (bool) {
      console.log(bool)
      if (bool === true) {
      }
    },
    // 获取告警界限
    get_doorsill () {
      let that = this
      that.$axios({
        url: '/display/warning-related/settings-warning-threshold',
        method: 'get'
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null) {
          console.log(res)
          that.doorsillDefaultData = JSON.parse(JSON.stringify(res))
          console.log(that.doorsillDefaultData)
          that.doorsillData = JSON.parse(JSON.stringify(that.doorsillDefaultData))
          for (let z = 0; z < that.doorsillData.length; z++) {
            const R = that.doorsillData[z]['RedLine']
            that.doorsillData[z]['RedLine'] = that.doorsillR + ' - ' + that.doorsillData[z]['RedLine']
            that.doorsillData[z]['YellowLine'] = R + ' - ' + that.doorsillData[z]['YellowLine']
            if (that.doorsillData[z]['Pn'] === 'DEFAULT') {
              that.doorsillData[z]['Pn'] = '默认'
            }
            if (that.doorsillData[z]['Process'] === 'DEFAULT') {
              console.log(that.doorsillData[z]['Process'])
              that.doorsillData[z]['Process'] = '默认'
            }
          }
          console.log(that.doorsillDefaultData)
          console.log(that.doorsillData)
        }
      })
      that.searchPn = ''
    }
  },
  data () {
    return {
      searchPn: '',
      options: {
        'module': [{
          value: '正常品',
          label: '正常品'
        }, {
          value: '改制返工品',
          label: '改制返工品'
        }],
        'osa': [{
          value: 'OSA成品重工工单',
          label: 'OSA成品重工工单'
        }, {
          value: 'OSA改制产品工单',
          label: 'OSA改制产品工单'
        }, {
          value: 'OSA量产产品工单',
          label: 'OSA量产产品工单'
        }, {
          value: 'OSA试生产产品工单',
          label: 'OSA试生产产品工单'
        }]
      },
      searchData: [],
      currentPage: 1,
      pageSize: 10,
      doorsillR: 0,
      doorsillZ: 100,
      doorsillDefaultData: [],
      doorsillData: [],
      optionsPn: [],
      doorsillDialogVisible: false,
      addDoorsillVisible: false,
      doorsillruleFrom: {
        Id: 0,
        Pn: '',
        Process: '',
        R: 0,
        Y: 0,
        Production: '',
        Type: ''
      },
      addDoorsillruleFrom: {
        Pn: '',
        Process: '',
        R: 0,
        Y: 0,
        Production: '',
        Type: ''
      },
      rules: {
        R: [
          {required: true, message: '请输入红色告警门限', trigger: 'blur'},
          {
            validator: function (rule, value, callback) {
              if (/^100$|^(\d|[1-9]\d)$/.test(value) === false) {
                callback(new Error('请输入0-100内数字'))
              } else {
                // 校验通过
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        Y: [
          {required: true, message: '请输入黄色告警门限', trigger: 'blur'},
          {
            validator: function (rule, value, callback) {
              if (/^100$|^(\d|[1-9]\d)$/.test(value) === false) {
                callback(new Error('请输入0-100内数字'))
              } else {
                // 校验通过
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      },
      addrules: {
        Pn: [
          {required: true, message: '请输入Pn', trigger: 'blur'},
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        Process: [
          {required: true, message: '请输入工序', trigger: 'blur'},
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        Production: [
          {required: true, message: '请选择产线', trigger: 'change'}
        ],
        Type: [
          {required: true, message: '请选择产品类型', trigger: 'change'}
        ],
        R: [
          {required: true, message: '请输入红色告警门限', trigger: 'blur'},
          {
            validator: function (rule, value, callback) {
              if (/^100$|^(\d|[1-9]\d)$/.test(value) === false) {
                callback(new Error('请输入0-100内数字'))
              } else {
                // 校验通过
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        Y: [
          {required: true, message: '请输入黄色告警门限', trigger: 'blur'},
          {
            validator: function (rule, value, callback) {
              if (/^100$|^(\d|[1-9]\d)$/.test(value) === false) {
                callback(new Error('请输入0-100内数字'))
              } else {
                // 校验通过
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
</style>
