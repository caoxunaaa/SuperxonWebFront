<template>
  <div class="hello">
    <h2>{{ msg }}</h2>
    <!-- <div :style="{background-image: 'url(' + img + ')'}"></div> -->
    <img src="@/assets/main.jpg" alt="" width="80%">
    <!-- <el-row gutter="20">
      <el-col :span="6" style="background: black;padding-top: 4px">
        <router-link :to="{path:'/quality/module_quality_pn_statistics'}"><img src="@/assets/3816fa52-dca0-4e44-bf61-587588633009.png" alt="" width="100%"></router-link>
        <b style="color: white">通过PN搜索</b>
      </el-col>
      <el-col :span="6">
        <router-link :to="{path:'/quality/module_quality_pn_statistics'}"><img src="@/assets/3816fa52-dca0-4e44-bf61-587588633009.png" alt="" width="100%"></router-link>
      </el-col>
      <el-col :span="6">
        <router-link :to="{path:'/quality/module_quality_pn_statistics'}"><img src="@/assets/3816fa52-dca0-4e44-bf61-587588633009.png" alt="" width="100%"></router-link>
      </el-col>
      <el-col :span="6">
        <router-link :to="{path:'/quality/module_quality_pn_statistics'}"><img src="@/assets/3816fa52-dca0-4e44-bf61-587588633009.png" alt="" width="100%"></router-link>
      </el-col>
    </el-row> -->
    <!-- <img src="@/assets/assets/3816fa52-dca0-4e44-bf61-587588633009.png"> -->
    <!-- <button @click="get_highchart"></button> -->
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  components: {
  },
  data () {
    return {
      msg: '欢迎来到Superxon数字化管理平台',
      img: require('../assets/main.jpg')
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
