<template>
  <div class="BackstageIndex">
    <div class="nav">
      <el-button style="float:right;background:#30526e;height:45px;color:white">
        <router-link tag="li" :to="{path:'/'}">
        返回前台
        </router-link>
        </el-button>
        <img src="@/assets/logo.png" alt="" style="float:left;height:40px;color:white">
      <p style="margin: 0;font-size:35px;color:white;letter-spacing:8px">优博创数字化工厂后台管理系统</p>
    </div>
    <div style="background-color:#c5d845;width:100%;height:2px"></div>
    <div class="body">
      <el-row :gutter="0">
        <el-col :span="3">
          <leftList></leftList>
        </el-col>
        <el-col :span="21" style="background:rgb(211, 220, 230)">
          <router-view to="/user_mangement"></router-view>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import leftList from '@/components/backstage/LeftList'
export default {
  name: 'BackstageIndex',
  components: {
    leftList
  },
  mounted () {
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  },
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.BackstageIndex{
  margin: 0;
  padding: 0;
}
.nav{
  width:100%;
  height:50px;
  background:#30526e;
  /* border:1px solid black */
}
.body{
  width:100%;
  height:800px;
  background:rgb(211, 220, 230);
  /* border:1px solid black */
}
.el-menu-item{
  padding-left: 0px !important;
  padding-right: 0px;
}
</style>
