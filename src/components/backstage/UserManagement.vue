<template>
  <div class="UserManagement">
  <div style="width: 100%; height:800px;">
    <div style="height:40px">
      <br>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>后台</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row :gutter="20">
      <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <el-button>新增用户</el-button>
        </div>
      </el-col>
      <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    </el-row>
    <el-table
    :data="userData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
    style="width: 99%">
      <el-table-column
        prop="username"
        label="账户名">
      </el-table-column>
      <el-table-column
        prop="nickname"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号码">
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
      :total="userData.length">
      </el-pagination>
    </div>
  </div>
    <!--修改操作弹窗-->
    <el-dialog
      title="修改用户信息"
      :visible.sync="userDialogVisible"
      width="500px">
      <el-form :model="ruleFrom" :rules="rules" ref="ruleForm" label-width="100px" class="demo-rulrFrom">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleFrom.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="nickname">
          <el-input v-model="ruleFrom.nickname" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="ruleFrom.phone"></el-input>
        </el-form-item>
      </el-form>
      <el-button style="width:80px;height:40px;" type="primary" @click="submitForm('ruleForm')">更新</el-button>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UserManagement',
  components: {
  },
  mounted () {
    this.get_user()
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
    // 操作按钮 （修改）
    handleEdit (index, row) {
      console.log(index)
      this.ruleFrom.username = row['username']
      this.ruleFrom.nickname = row['nickname']
      this.ruleFrom.email = row['email']
      this.ruleFrom.phone = row['phone']
      this.userDialogVisible = true
    },
    // 操作按钮 （删除）
    handleDelete (index, row) {
      console.log(row)
      console.log(index)
    },
    // 更新按钮
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm)
          let that = this
          that.$confirm('此操作将修改数据，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
          })
        }
      })
    },
    // 获取用户信息
    get_user () {
      let that = this
      that.userData = []
      that.$axios({
        method: 'get',
        url: '/api/userInfo/getallusername'
      }).then(function (response) {
        console.log(response)
        const res = response.data
        console.log(res)
        // if (res !== null) {
        //   for (let i = 0; i < res.length; i++) {
        //     if (res[i]['IsSuperuser'] === false) {
        //       console.log('1')
        //       res[i]['IsSuperuser'] = '否'
        //     } else if (res[i]['IsSuperuser'] === true) {
        //       console.log('2')
        //       res[i]['IsSuperuser'] = '是'
        //     }
        //   }
        //   that.userData = res
        // }
        if (res !== null) {
          that.userData = res.userInfosResp
        }
      })
    }
  },
  data () {
    return {
      currentPage: 1,
      pageSize: 10,
      userData: [],
      userDialogVisible: false,
      ruleFrom: {
        username: '',
        nickname: '',
        email: '',
        phone: ''
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            validator: function (rule, value, callback) {
              // 校验手机号码的正则：/^(13[0-9]|14[0-9]|15[0-9]|16[6]|18[0-9]|19[6,9]|17[0-9])\d{8}$/i
              if (/^(13[0-9]|14[0-9]|15[0-9]|16[6]|18[0-9]|19[6,9]|17[0-9])\d{8}$/i.test(value) === false) {
                callback(new Error('请输入正确格式的手机号码'))
              } else {
                // 校验通过
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            validator: function (rule, value, callback) {
              // 校验手机号码的正则：/^(13[0-9]|14[0-9]|15[0-9]|16[6]|18[0-9]|19[6,9]|17[0-9])\d{8}$/i
              if (/^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(value) === false) {
                callback(new Error('请输入正确格式的邮箱'))
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

.el-row {
    margin-bottom: 20px;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
