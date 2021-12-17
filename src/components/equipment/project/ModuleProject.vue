<template>
  <div class="ModuleProject">
    <h1 style="align:center">产品计划</h1>
    <el-button class="el-button--small" style="background-color: #409eff; color: #fff;height:40px; width:110px;padding:0;font-size:5px;" type="primary" @click="add_project">新增</el-button>
    <el-table
    :data="projectData"
    stripe
    max-height="800"
    style="width: 100%">
      <el-table-column
        prop="Id"
        label="ID"
        width="60">
      </el-table-column>
      <el-table-column
        prop="Pn"
        label="PN">
      </el-table-column>
      <el-table-column
        prop="Type"
        label="产品类型">
      </el-table-column>
      <el-table-column
        prop="Customers"
        label="客户代码">
      </el-table-column>
      <el-table-column
        prop="Code"
        label="产品代码">
      </el-table-column>
      <el-table-column
        prop="PlanToPay"
        label="计划交付">
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
    <!-- 新增产品计划弹窗 -->
    <el-dialog
    title="新增产品计划"
    :visible.sync="addProjectDialogVisible"
    width="40%">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="产品类型" prop="Type">
      <el-input v-model="ruleForm.Type"></el-input>
    </el-form-item>
    <el-form-item label="客户代码" prop="Customers">
      <el-input v-model="ruleForm.Customers"></el-input>
    </el-form-item>
    <el-form-item label="产品代码" prop="Code">
      <el-input v-model="ruleForm.Code"></el-input>
    </el-form-item>
    <el-form-item label="Pn" prop="Pn">
      <el-input v-model="ruleForm.Pn"></el-input>
    </el-form-item>
    <el-form-item label="计划交付" prop="PlanToPay">
      <el-input v-model.number="ruleForm.PlanToPay"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
    </el-form-item>
    </el-form>
  </el-dialog>
  <!-- 修改产品计划弹窗 -->
    <el-dialog
    title="修改产品计划"
    :visible.sync="modifyProjectDialogVisible"
    width="40%">
    <el-form :model="modifyruleForm" :rules="modifyrules" ref="modifyruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="产品类型" prop="Type">
      <el-input v-model="modifyruleForm.Type"></el-input>
    </el-form-item>
    <el-form-item label="客户代码" prop="Customers">
      <el-input v-model="modifyruleForm.Customers"></el-input>
    </el-form-item>
    <el-form-item label="产品代码" prop="Code">
      <el-input v-model="modifyruleForm.Code"></el-input>
    </el-form-item>
    <el-form-item label="Pn" prop="Pn">
      <el-input v-model="modifyruleForm.Pn"></el-input>
    </el-form-item>
    <el-form-item label="计划交付" prop="PlanToPay">
      <el-input v-model.number="modifyruleForm.PlanToPay"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="modifysubmitForm('modifyruleForm')">修改</el-button>
    </el-form-item>
    </el-form>
  </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ModuleProject',
  components: {
  },
  mounted () {
    this.get_module_project()
  },
  methods: {
    // 操作按钮 （修改）
    handleEdit (index, row) {
      console.log(index)
      console.log(row['Id'])
      this.modifyruleForm.Type = row['Type']
      this.modifyruleForm.Customers = row['Customers']
      this.modifyruleForm.Code = row['Code']
      this.modifyruleForm.Pn = row['Pn']
      this.modifyruleForm.PlanToPay = row['PlanToPay']
      this.modifyId = row['Id']
      this.modifyProjectDialogVisible = true
    },
    // 确认修改产品计划按钮
    modifysubmitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let that = this
          that.$axios({
            method: 'put',
            url: '/display/product-operation-info/product-plan/plan-info/' + that.modifyId,
            data: {
              Type: that.modifyruleForm.Type,
              Customers: that.modifyruleForm.Customers,
              Code: that.modifyruleForm.Code,
              Pn: that.modifyruleForm.Pn,
              PlanToPay: that.modifyruleForm.PlanToPay
            }
          }).then(function (response) {
            console.log(response)
            if (response.status === 200) {
              that.$message({
                type: 'success',
                message: '修改产品计划成功！'
              })
              that.modifyProjectDialogVisible = false
              that.get_module_project()
            } else {
              that.$message({
                type: 'error',
                message: '修改产品计划失败！'
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
        } else {
          console.log('error')
          return false
        }
      })
    },
    // 操作按钮 （删除）
    handleDelete (index, row) {
      // let that = this
      console.log(index)
      console.log(row['Id'])
      let that = this
      that.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$axios({
          method: 'delete',
          url: '/display/product-operation-info/product-plan/plan-info/' + row['Id']
        }).then(function (response) {
          console.log(response)
          if (response.status === 200) {
            that.$message({
              type: 'success',
              message: '删除成功！'
            })
            that.get_module_project()
          } else {
            that.$message({
              type: 'error',
              message: '删除失败！'
            })
          }
        }).catch(function (err) {
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
    // 新增产品计划弹窗
    add_project () {
      this.addProjectDialogVisible = true
    },
    // 新增产品计划按钮
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let that = this
          that.$axios({
            method: 'post',
            url: '/display/product-operation-info/product-plan/plan-info',
            data: {
              Type: that.ruleForm.Type,
              Customers: that.ruleForm.Customers,
              Code: that.ruleForm.Code,
              Pn: that.ruleForm.Pn,
              PlanToPay: that.ruleForm.PlanToPay
            }
          }).then(function (response) {
            console.log(response)
            if (response.status === 200) {
              that.$message({
                type: 'success',
                message: '新增产品计划成功！'
              })
              that.addProjectDialogVisible = false
              that.get_module_project()
            } else {
              that.$message({
                type: 'error',
                message: '新增产品计划失败！'
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
        } else {
          console.log('error')
          return false
        }
      })
    },
    // 获取所有产品计划任务
    get_module_project () {
      let that = this
      that.$axios({
        method: 'get',
        url: '/display/product-operation-info/product-plan/plan-info'
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null) {
          that.projectData = res
        }
      })
    }
  },
  data () {
    return {
      projectData: [],
      modifyId: '',
      addProjectDialogVisible: false,
      modifyProjectDialogVisible: false,
      ruleForm: {
        Type: '',
        Customers: '',
        Code: '',
        Pn: '',
        PlanToPay: ''
      },
      rules: {
        Type: [
          { required: true, message: '请输入产品类型', trigger: 'blur' }
        ],
        Customers: [
          { required: true, message: '请输入客户代码', trigger: 'blur' }
        ],
        Code: [
          { required: true, message: '请输入产品代码', trigger: 'blur' }
        ],
        Pn: [
          { required: true, message: '请输入Pn', trigger: 'blur' }
        ],
        PlanToPay: [
          { required: true, message: '请输入计划交付', trigger: 'blur' },
          {type: 'number', message: '必须为数字值'}
        ]
      },
      modifyruleForm: {
        Type: '',
        Customers: '',
        Code: '',
        Pn: '',
        PlanToPay: ''
      },
      modifyrules: {
        Type: [
          { required: true, message: '请输入产品类型', trigger: 'blur' }
        ],
        Customers: [
          { required: true, message: '请输入客户代码', trigger: 'blur' }
        ],
        Code: [
          { required: true, message: '请输入产品代码', trigger: 'blur' }
        ],
        Pn: [
          { required: true, message: '请输入Pn', trigger: 'blur' }
        ],
        PlanToPay: [
          { required: true, message: '请输入计划交付', trigger: 'blur' },
          {type: 'number', message: '必须为数字值'}
        ]
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
</style>
