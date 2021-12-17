<template>
  <div class="UpdateUser">
    <el-row :gutter="20">
      <el-col :lg="{span:8,offset:8}" :xs="{span:22, offset:1}">
        <div class="grid-content bg-purple" style="background-color: white">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="账户" prop="username">
              <el-input v-model="ruleForm.username" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="nickname">
              <el-input v-model="ruleForm.nickname" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="ruleForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="ruleForm.email">
                <template slot="append">@superxon.com</template>
              </el-input>
            </el-form-item>
            <el-form-item label="旧密码" prop="old_password">
              <el-input v-model="ruleForm.old_password" show-password></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="password">
              <el-input v-model="ruleForm.password" show-password></el-input>
            </el-form-item>
            <el-form-item label="重复密码" prop="password_again">
              <el-input v-model="ruleForm.password_again" show-password></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
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
  name: 'UpdateUser',
  components: {
  },
  mounted () {
    this.get_user_information()
  },
  methods: {
    // 获取用户信息
    get_user_information () {
      this.ruleForm.username = localStorage.getItem('username')
      this.ruleForm.nickname = localStorage.getItem('nickname')
      let that = this
      that.$axios({
        url: '/api/userInfo/getuserinfo',
        method: 'get',
        params: {
          username: that.ruleForm.username
        }
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null) {
          if (res['email'].split('@')[1] === 'superxon.com') {
            that.ruleForm.email = res['email'].split('@')[0]
          } else {
            that.ruleForm.email = ''
          }
          that.ruleForm.phone = res['phone']
        }
      })
    },
    // 修改
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm)
          let that = this
          let formData = new FormData()
          formData.append('username', that.ruleForm.username)
          formData.append('nickname', that.ruleForm.nickname)
          formData.append('oldPassword', that.ruleForm.old_password)
          formData.append('newPassword', that.ruleForm.password)
          formData.append('newPwagain', that.ruleForm.password_again)
          formData.append('phone', that.ruleForm.phone)
          formData.append('email', that.ruleForm.email + '@superxon.com')
          that.$axios({
            url: '/api/user/update',
            method: 'put',
            data: formData
          }).then(function (response) {
            console.log(response)
            if (response.status === 200) {
              that.$message({
                type: 'success',
                message: '修改成功！自动跳转到登录界面！'
              })
              setTimeout(() => {
                localStorage.clear()
                window.location.reload()
                clearTimeout(that.timer)
                that.$router.push({path: '/user/login'})
                window.location.reload()
              }, 1000)
            } else {
              that.$message({
                type: 'error',
                message: '修改失败!'
              })
            }
          }).catch(function (err) {
            if (err.response.status === 504) {
              that.$message({
                type: 'error',
                message: '服务器未响应！'
              })
            } else {
              that.$message({
                type: 'error',
                message: '修改失败!'
              })
            }
          })
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
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
      ruleForm: {
        username: '',
        old_password: '',
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
        old_password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, message: '长度最少为 6 个字符', trigger: 'blur'}
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >

</style>
