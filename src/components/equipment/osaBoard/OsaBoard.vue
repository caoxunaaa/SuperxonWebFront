<template>
  <div class="OsaBoard">
    <div v-if="isPc">
      <el-row :gutter="20" >
        <el-col :span="24"><div class="grid-content bg-purple"><OsaUpBoard></OsaUpBoard></div></el-col>
      </el-row>
      <el-row :gutter="20" >
        <el-col :span="12"><div class="grid-content bg-purple"><OsaFormTwo></OsaFormTwo></div></el-col>
        <!-- <el-col :span="12"><div class="grid-content bg-purple"><OsaFormFour></OsaFormFour></div></el-col> -->
      </el-row>
    </div>
    <div v-if="bigPc">
      <el-row :gutter="20" >
        <el-col :span="24"><div class="grid-content bg-purple"><OsaBigUpBoard></OsaBigUpBoard></div></el-col>
      </el-row>
      <el-row :gutter="20" >
        <el-col :span="12"><div class="grid-content bg-purple"><OsaBigFormTwo></OsaBigFormTwo></div></el-col>
        <!-- <el-col :span="12"><div class="grid-content bg-purple"><OsaBigFormFour></OsaBigFormFour></div></el-col> -->
      </el-row>
    </div>
  </div>
</template>

<script>
import OsaUpBoard from '@/components/equipment/osaBoard/OsaUpBoard'
import OsaFormTwo from '@/components/equipment/osaBoard/OsaFormTwo'
import OsaFormFour from '@/components/equipment/osaBoard/OsaFormFour'
import OsaBigUpBoard from '@/components/equipment/osaBoard/OsaBigUpBoard'
import OsaBigFormTwo from '@/components/equipment/osaBoard/OsaBigFormTwo'
import OsaBigFormFour from '@/components/equipment/osaBoard/OsaBigFormFour'
export default {
  name: 'OsaBoard',
  components: {
    OsaUpBoard,
    OsaFormTwo,
    OsaFormFour,
    OsaBigUpBoard,
    OsaBigFormTwo,
    OsaBigFormFour
  },
  data () {
    return {
      isPc: true,
      isPhone: false,
      bigPc: false,
      screenWidth: document.body.clientWidth
    }
  },
  mounted () {
    this.getScreen()
  },
  methods: {
    // 加载页面时获取当前屏幕的尺寸
    getScreen () {
      let that = this
      window.onresize = () => {
        window.screenWidth = document.body.clientWidth
        that.screenWidth = window.screenWidth
      }
      if (that.screenWidth < 600) {
        that.isPc = false
        that.isPhone = true
        that.bigPc = false
      } else if (that.screenWidth > 3000) {
        that.isPc = false
        that.isPhone = false
        that.bigPc = true
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.el-row {
    margin-bottom: 20px;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 0px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f2fefc;
  }
</style>
