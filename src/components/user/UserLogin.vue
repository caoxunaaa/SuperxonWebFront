<template>
  <div class="userlogin">
    <el-row :gutter="20">
      <el-col :lg="{span:8,offset:8}" :xs="{span:22, offset:1}">
        <div class="grid-content bg-purple" style="background-color: white">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="ruleForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="ruleForm.password" show-password></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">立即登录</el-button>
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
  name: 'UserLogin',
  data () {
    return {
      all_users: [],
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
      }
    }
  },
  mounted () {
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let that = this
          let formData = new FormData()
          formData.append('username', that.ruleForm['username'])
          formData.append('password', that.ruleForm['password'])
          that.$axios({
            method: 'post',
            url: '/api/user/login',
            data: formData
          }).then(function (response) {
            console.log(response)
            console.log(response.status)
            if (response.status === 200) {
              const res = response.data
              console.log(res)
              console.log(res)
              localStorage.setItem('Token', res['accessToken'])
              localStorage.setItem('username', res['name'])
              let token = res['accessToken']
              console.log(token)
              console.log(typeof (token))
              that.$axios({
                url: '/api/userInfo/getuserinfo',
                method: 'get',
                params: {
                  username: res['name']
                }
              }).then(function (responseOnly) {
                if (responseOnly.status === 200) {
                  localStorage.setItem('nickname', responseOnly.data['nickname'])
                  localStorage.setItem('phone', responseOnly.data['phone'])
                  localStorage.setItem('email', responseOnly.data['email'])
                  that.$message({
                    type: 'success',
                    message: '登录成功,自动跳转到首页！'
                  })
                  setTimeout(() => {
                    that.$router.push({path: '/'})
                    window.location.reload()
                  }, 1000)
                }
              })
            } else {
              that.$message({
                type: 'error',
                message: '用户名不存在或密码错误！'
              })
            }
          }).catch(function (err) {
            console.log(err)
            that.$message({
              type: 'error',
              message: '用户名不存在或密码错误！'
            })
          })
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
