<template>
  <div class="VoiceAlarm">
    <div style="width: 100%; height:800px;">
      <div style="height:40px">
        <br>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>后台</el-breadcrumb-item>
          <el-breadcrumb-item>告警管理</el-breadcrumb-item>
          <el-breadcrumb-item>告警责任人</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-input placeholder="请输入Pn"  style="width: 300px;"
          v-model="searchPn"  class="input-with-select" clearable>
        <el-button slot="append" icon="el-icon-search" @click="search_personLiable"
          style="background-color: #409eff; color: #fff; height: 40px; width:60px"></el-button>
        </el-input>
        <el-button @click="get_data" type="primary" style="background-color: #409eff; color: #fff; height: 40px; width:80px;">清 除</el-button>
        <el-button @click="get_addpersonLiable" style="background-color: #409eff; color: #fff;">新增告警界限</el-button>
      </div>
      <div>
        <br>
        <el-table
          :data="personLiable.slice((currentPage-1)*pageSize,currentPage*pageSize)"
          style="width: 99%">
          <el-table-column
            prop="Id"
            label="ID">
          </el-table-column>
          <el-table-column
            prop="ModuleOsa"
            label="产线">
          </el-table-column>
          <el-table-column
            prop="Pn"
            label="PN">
          </el-table-column>
          <el-table-column
            prop="Nickname"
            label="责任人">
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
          :total="personLiable.length">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--新增操作弹窗-->
    <el-dialog
    title="新增告警责任人"
    :visible.sync="addpersonVisible"
    width="500px"
    append-to-body>
    <el-form :model="addpersonruleFrom" :rules="addrules" ref="addpersonruleFrom" label-width="100px" class="demo-rulrFrom">
      <el-form-item label="产线" prop="ModuleOsa">
        <el-select v-model="addpersonruleFrom.ModuleOsa" placeholder="请选择产线">
          <el-option label="module" value="module"></el-option>
          <el-option label="osa" value="osa"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Pn" prop="Pn">
        <el-input v-model="addpersonruleFrom.Pn"></el-input>
      </el-form-item>
      <el-form-item label="责任人" prop="nickname">
        <el-select v-model="addpersonruleFrom.nickname" filterable placeholder="请选择责任人"
        style="width:250px" @change="get_add_username">
          <el-option
            v-for="item in nameData"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="账户名" prop="username">
        <el-input v-model="addpersonruleFrom.username" :disabled="true"></el-input>
      </el-form-item>
    </el-form>
    <el-button style="width:80px;height:40px;" type="primary" @click="addsubmitForm('addpersonruleFrom')">新增</el-button>
    </el-dialog>
    <el-dialog
      title="修改告警责任人"
      :visible.sync="personVisible"
      width="500px"
      append-to-body>
      <el-form :model="personruleFrom" :rules="rules" ref="personruleFrom" label-width="100px" class="demo-rulrFrom">
        <el-form-item label="产线" prop="ModuleOsa" >
          <el-input v-model="personruleFrom.ModuleOsa" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Pn" prop="Pn" >
          <el-input v-model="personruleFrom.Pn" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="责任人" prop="nickname">
        <el-select v-model="personruleFrom.nickname" filterable placeholder="请选择责任人"
        style="width:250px" @change="get_username">
          <el-option
            v-for="item in nameData"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="账户名" prop="username">
          <el-input v-model="personruleFrom.username" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <el-button style="width:80px;height:40px" type="primary" @click="submitForm('personruleFrom')">更新</el-button>
    </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'VoiceAlarm',
  components: {
  },
  mounted () {
    this.get_data()
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
    // 搜索某一Pn的责任人
    search_personLiable () {
      this.searchData = []
      if (this.personLiable.length > 0) {
        for (let i = 0; i < this.personLiable.length; i++) {
          if (this.personLiable[i]['Pn'] === this.searchPn) {
            this.searchData.push(this.personLiable[i])
          }
        }
      }
      this.personLiable = this.searchData
    },
    // 获取用户名下拉列表
    get_name () {
      let that = this
      that.nameData = []
      that.$axios({
        url: '/api/userInfo/getallusername',
        method: 'get'
      }).then(function (response) {
        const res = response.data['userInfosResp']
        that.nameList = res
        console.log(res)
        if (res !== null) {
          for (let i = 0; i < res.length; i++) {
            that.nameData.push({
              label: res[i]['nickname'],
              value: res[i]['nickname']
            })
          }
          console.log(that.nameData)
        }
      })
    },
    // 获取选中的责任人的username
    get_add_username () {
      let that = this
      if (that.nameList !== null) {
        console.log(that.nameList)
        console.log(that.addpersonruleFrom.nickname)
        for (let k = 0; k < that.nameList.length; k++) {
          if (that.addpersonruleFrom.nickname === that.nameList[k]['nickname']) {
            that.addpersonruleFrom.username = that.nameList[k]['username']
          }
        }
      }
    },
    get_username () {
      let that = this
      if (that.nameList !== null) {
        console.log(that.nameList)
        console.log(that.personruleFrom.nickname)
        for (let k = 0; k < that.nameList.length; k++) {
          if (that.personruleFrom.nickname === that.nameList[k]['nickname']) {
            that.personruleFrom.username = that.nameList[k]['username']
          }
        }
      }
    },
    // 新增告警责任人弹窗
    get_addpersonLiable () {
      this.addpersonVisible = true
      this.get_name()
    },
    // 新增按钮
    addsubmitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.addpersonruleFrom)
          let that = this
          that.$confirm('此操作将修改数据，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let formData = new FormData()
            formData.append('username', that.addpersonruleFrom.username)
            formData.append('nickname', that.addpersonruleFrom.nickname)
            formData.append('module_osa', that.addpersonruleFrom.ModuleOsa)
            formData.append('pn', that.addpersonruleFrom.Pn)
            that.$axios({
              url: '/display/background-management/person-in-charge-warning-info',
              method: 'post',
              data: formData
            }).then(function (response) {
              console.log(response)
              if (response.status === 200) {
                that.$message({
                  type: 'success',
                  message: '新增告警负责人成功！'
                })
                that.addpersonVisible = false
                that.get_data()
              } else {
                that.$message({
                  type: 'error',
                  message: '新增告警责任人失败！'
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
    // 操作按钮 （修改）
    handleEdit (index, row) {
      console.log(index)
      console.log(row)
      this.personVisible = true
      this.get_name()
      this.personruleFrom.Id = row.Id
      this.personruleFrom.Pn = row.Pn
      this.personruleFrom.ModuleOsa = row.ModuleOsa
      this.personruleFrom.nickname = row.Nickname
      this.personruleFrom.username = row.Username
    },
    // 操作按钮（删除）
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
          url: '/display/background-management/person-in-charge-warning-info/' + row['Id'],
          method: 'delete'
        }).then(function (response) {
          console.log(response)
          if (response.status === 200) {
            that.$message({
              type: 'success',
              message: '删除告警责任人成功！'
            })
            that.get_data()
          } else {
            that.$message({
              type: 'error',
              message: '删除告警责任人失败！'
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
    // 更新按钮
    submitForm (formName) {
      console.log('1')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.personruleFrom)
          let that = this
          that.$confirm('此操作将修改数据，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let formData = new FormData()
            formData.append('username', that.personruleFrom.username)
            formData.append('nickname', that.personruleFrom.nickname)
            formData.append('module_osa', that.personruleFrom.ModuleOsa)
            formData.append('pn', that.personruleFrom.Pn)
            that.$axios({
              url: '/display/background-management/person-in-charge-warning-info/' + that.personruleFrom.Id,
              method: 'put',
              data: formData
            }).then(function (response) {
              if (response.status === 200) {
                that.$message({
                  type: 'success',
                  message: '修改告警负责人成功！'
                })
                that.personVisible = false
                that.get_data()
              } else {
                that.$message({
                  type: 'error',
                  message: '修改告警负责人失败！'
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
    // 获取责任人文件
    get_data () {
      let that = this
      that.personLiable = []
      that.$axios({
        method: 'get',
        url: '/display/warning-related/person-in-charge-warning-info'
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null) {
          that.personLiable = res
        }
      })
    }
  },
  data () {
    return {
      searchPn: '',
      searchData: [],
      currentPage: 1,
      pageSize: 10,
      addpersonVisible: false,
      personVisible: false,
      nameList: [],
      nameData: [],
      items: [],
      personLiable: [],
      addpersonruleFrom: {
        Pn: '',
        ModuleOsa: '',
        nickname: '',
        username: ''
      },
      personruleFrom: {
        Id: '',
        Pn: '',
        ModuleOsa: '',
        nickname: '',
        username: ''
      },
      rules: {
        nickname: [
          {required: true, message: '请选择责任人', trigger: 'change'}
        ]
      },
      addrules: {
        Pn: [
          {required: true, message: '请输入Pn', trigger: 'blur'}
        ],
        ModuleOsa: [
          {required: true, message: '请选择产线', trigger: 'change'}
        ],
        nickname: [
          {required: true, message: '请选择责任人', trigger: 'change'}
        ]
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >

</style>
