<template>
  <div class="LeftList">
    <el-row class="tac">
      <h4 style="background:#30526e;margin: 0px 0px;color:white">欢迎回来，{{username}}</h4>
      <div style="height:1px;background-color:white"></div>
      <el-col :span="24">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#30526e"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-menu-item index="user_mangement">
            <template slot="title">
            <router-link tag="li" :to="{path:'/backstage/user_mangement'}">
              <i class="el-icon-user-solid"></i>
              <span>用户管理</span>
            </router-link>
            </template>
          </el-menu-item>
          <el-menu-item index="user_permission">
            <router-link tag="li" :to="{path:'/backstage/user_permission'}">
              <i class="el-icon-view"></i>
              <span>用户权限</span>
            </router-link>
          </el-menu-item>
          <el-submenu  index="1" style="border-left: 1px solid #717171;">
            <template slot="title">
              <i class="el-icon-warning"></i>
              <span>告警管理</span>
            </template>
            <el-menu-item index="alarm_limit">
              <router-link tag="li" :to="{path:'/backstage/alarm_limit'}">
                <span>告警界限</span>
              </router-link>
            </el-menu-item>
            <el-menu-item index="voice_alarm">
              <router-link tag="li" :to="{path:'/backstage/voice_alarm'}">
                <span>告警责任人</span>
              </router-link>
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="learning_record">
            <router-link tag="li" :to="{path:'/backstage/learning_record'}">
              <i class="el-icon-document"></i>
              <span>学习记录</span>
            </router-link>
          </el-menu-item>
          <el-menu-item index="mail_management">
            <router-link tag="li" :to="{path:'/backstage/mail_management'}">
              <i class="el-icon-s-promotion"></i>
              <span>邮件管理</span>
            </router-link>
          </el-menu-item>
          <el-menu-item index="ptr_control">
            <router-link tag="li" :to="{path:'/backstage/ptr_control'}">
              <i class="el-icon-edit-outline"></i>
              <span>PTR管理</span>
            </router-link>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'LeftList',
  components: {
  },
  mounted () {
    this.username = localStorage.getItem('nickname')
  },
  methods: {
  },
  data () {
    return {
      username: ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.LeftList{
  height: 800px;
  background:#30526e
}
.el-menu-item{
  padding-left: 0px !important;
  padding-right: 0px;
}
.el-submenu>>>.el-menu-item {
  min-width: 100px !important;
}
</style>
