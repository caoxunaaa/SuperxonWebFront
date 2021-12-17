<template>
  <div class="userregister">
    <el-row :gutter="20">
      <el-col :lg="{span:8,offset:8}" :xs="{span:22, offset:1}">
        <div class="grid-content bg-purple" style="background-color: white">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="账户" prop="username">
              <el-input v-model="ruleForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="ruleForm.password" show-password></el-input>
            </el-form-item>
            <el-form-item label="重复密码" prop="password_again">
              <el-input v-model="ruleForm.password_again" show-password></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="nickname">
              <el-input v-model="ruleForm.nickname"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="ruleForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="ruleForm.email">
                <template slot="append">@superxon.com</template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'UserRegister',
  data () {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      email: '',
      ruleForm: {
        username: '',
        password: '',
        password_again: '',
        nickname: '',
        phone: '',
        email: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入账户(英文，数字，小数点)', trigger: 'blur'},
          {min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur'},
          {
            validator: function (rule, value, callback) {
              if (/^[A-Za-z0-9.]{2,50}$/.test(value) === false) {
                callback(new Error('请输入账户(英文，数字，小数点)'))
              } else {
                // 校验通过
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        nickname: [
          {required: true, message: '请输入姓名(中文)', trigger: 'blur'},
          {min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur'},
          {
            validator: function (rule, value, callback) {
              // 校验中文的正则：/^[\u4e00-\u9fa5]{0,}$/
              if (/^[\u4e00-\u9fa5]+$/.test(value) === false) {
                callback(new Error('请输入中文姓名'))
              } else {
                // 校验通过
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, message: '长度最少为 6 个字符', trigger: 'blur'}
        ],
        password_again: [
          {required: true, message: '请重复密码', trigger: 'blur'},
          {min: 6, message: '长度最少为 6 个字符', trigger: 'blur'},
          { validator: validatePass2, trigger: 'blur', required: true }
        ],
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
          {required: true, message: '请输入邮箱前缀(英文，数字，小数点)', trigger: 'blur'},
          {min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur'},
          {
            validator: function (rule, value, callback) {
              if (/^[A-Za-z0-9.]{2,50}$/.test(value) === false) {
                callback(new Error('请输入邮箱前缀(英文，数字，小数点)'))
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
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let that = this
          if (that.ruleForm['password'] === that.ruleForm['password_again']) {
            that.email = ''
            that.email = that.ruleForm['email'] + '@superxon.com'
            // console.log(that.ruleForm)
            // console.log('进入注册')
            that.$axios({
              method: 'post',
              url: '/api/user/register',
              params: {
                username: that.ruleForm['username'],
                password: that.ruleForm['password'],
                pwagain: that.ruleForm['password_again'],
                phone: that.ruleForm['phone'],
                nickname: that.ruleForm['nickname'],
                email: that.email
              }
            }).then(function (response) {
              if (response.status === 200) {
                that.$message({
                  type: 'success',
                  message: '注册成功！3秒后自动跳转到登录页面！'
                })
                setTimeout(() => {
                  that.$router.push({path: '/user/login/'})
                }, 3000)
              } else {
                that.$message({
                  type: 'error',
                  message: '注册失败！'
                })
              }
            }).catch(function (err) {
              if (err.response.status === 400) {
                that.$message({
                  type: 'error',
                  message: '用户名已存在！'
                })
              }
            })
          } else {
            that.$message({
              type: 'error',
              message: '两次密码不一致！'
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
</style>
