<template>
  <div class="Form">
    <div v-if="isPc">
      <el-row :gutter="20" >
        <el-col :span="24"><div class="grid-content bg-purple"><UpBoard></UpBoard></div></el-col>
      </el-row>
      <el-row :gutter="20" >
        <el-col :span="12"><div class="grid-content bg-purple"><FormTwo></FormTwo></div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple"><FormFour></FormFour></div></el-col>
      </el-row>
    </div>
    <div v-if="bigPc">
      <el-row :gutter="20" >
        <el-col :span="24"><div class="grid-content bg-purple"><BigUpBoard></BigUpBoard></div></el-col>
      </el-row>
      <el-row :gutter="20" >
        <el-col :span="12"><div class="grid-content bg-purple"><BigFormTwo></BigFormTwo></div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple"><BigFormFour></BigFormFour></div></el-col>
      </el-row>
    </div>
    <div v-if="isPhone">
      <el-row :gutter="20" >
        <el-col :span="24"><div class="grid-content bg-purple"><FormOne></FormOne></div></el-col>
      </el-row>
      <el-row :gutter="20" >
        <el-col :span="24"><div class="grid-content bg-purple"><FormTwo></FormTwo></div></el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import UpBoard from '@/components/equipment/modelBoard/UpBoard'
import FormTwo from '@/components/equipment/modelBoard/FormTwo'
import FormFour from '@/components/equipment/modelBoard/FormFour'
import BigUpBoard from '@/components/equipment/modelBoard/BigUpBoard'
import BigFormTwo from '@/components/equipment/modelBoard/BigFromTwo'
import BigFormFour from '@/components/equipment/modelBoard/BigFromFour'
export default {
  name: 'ModelBoard',
  components: {
    UpBoard,
    FormTwo,
    FormFour,
    BigUpBoard,
    BigFormTwo,
    BigFormFour
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
