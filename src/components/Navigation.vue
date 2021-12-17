<template>
  <div id="navigation">
    <el-menu
      :default-active="activeIndex"
      :router="true"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item ><router-link tag="li" :to="{path:'/'}">首页</router-link></el-menu-item>
      <el-submenu  index="1" style="border-left: 1px solid #717171;">
        <template slot="title">模块产线</template>
        <el-menu-item index="device_module_board" style="border-left: 1px solid #717171"><router-link tag="li" :to="{path:'/equipment/device_module_board'}">模块产线运行看板</router-link></el-menu-item>
        <el-submenu index="1-2">
          <template slot="title">模块产线告警看板</template>
          <el-menu-item index="module_warning"><router-link tag="li" :to="{path:'/warning/module_warning'}">模块产线告警看板</router-link></el-menu-item>
          <el-menu-item index="toDay_module_multiplicative_warning"><router-link tag="li" :to="{path:'/warning/toDay_module_multiplicative_warning'}">模块产线告警累乘良率</router-link></el-menu-item>
        </el-submenu>
        <!-- <el-menu-item index="dynamic_warning"><router-link tag="li" :to="{path:'/equipment/dynamic_warning'}">模块动态告警看板</router-link></el-menu-item> -->
        <el-menu-item index="module_project"><router-link tag="li" :to="{path:'/equipment/module_project'}">模块产品计划管理</router-link></el-menu-item>
      </el-submenu>

      <el-submenu  index="2" style="border-right: 1px solid #717171;">
        <template slot="title">模块质量统计</template>
        <el-menu-item index="module_quality_pn_statistics" ><router-link tag="li" :to="{path:'/quality/module_quality_pn_statistics'}">通过PN统计</router-link></el-menu-item>
        <el-menu-item index="module_quality_workorder_statistics" ><router-link tag="li" :to="{path:'/quality/module_quality_workorder_statistics'}">通过工单号统计</router-link></el-menu-item>
        <el-menu-item index="module_quality_result_statistics" ><router-link tag="li" :to="{path:'/quality/module_quality_result_statistics'}">测试结果查询</router-link></el-menu-item>
        <el-submenu index="2-2">
          <template slot="title">模块投入产出查询</template>
          <el-menu-item index="module_input_output_board" ><router-link tag="li" :to="{path:'/quality/module_input_output_board'}">模块投入产出统计</router-link></el-menu-item>
          <el-menu-item index="module_input_output_chart" ><router-link tag="li" :to="{path:'/quality/module_input_output_chart'}">模块投入产出3D图</router-link></el-menu-item>
        </el-submenu>
        <el-menu-item index="module_quality_statistics_by_week_or_month" ><router-link tag="li" :to="{path:'/quality/module_quality_statistics_by_week_or_month'}">按月按周统计</router-link></el-menu-item>
      </el-submenu>

      <el-submenu  index="3">
        <template slot="title">Osa产线</template>
        <el-menu-item index="osa_board"><router-link tag="li" :to="{path:'/equipment/osa_board'}">OSA产线运行看板</router-link></el-menu-item>
        <el-submenu index="3-2">
          <template slot="title">Osa产线告警看板</template>
          <el-menu-item index="osa_warning"><router-link tag="li" :to="{path:'/warning/osa_warning'}">OSA产线告警看板</router-link></el-menu-item>
          <el-menu-item index="toDay_osa_multiplicative_warning"><router-link tag="li" :to="{path: '/warning/toDay_osa_multiplicative_warning'}">Osa产产线告警累乘良率</router-link></el-menu-item>
        </el-submenu>
      </el-submenu>

      <el-submenu  index="4" style="border-right: 1px solid #717171;">
        <template slot="title">OSA质量统计</template>
        <el-menu-item index="osa_quality_pn_statistics" ><router-link tag="li" :to="{path:'/quality/osa_quality_pn_statistics'}">通过PN统计</router-link></el-menu-item>
        <el-menu-item index="osa_quality_workorder_statistics" ><router-link tag="li" :to="{path:'/quality/osa_quality_workorder_statistics'}">通过工单号统计</router-link></el-menu-item>
        <el-submenu index="4-2">
          <template slot="title">OSA投入产出查询</template>
          <el-menu-item index="osa_input_output_board"><router-link tag="li" :to="{path: '/quality/osa_input_output_board'}">OSA投入产出统计</router-link></el-menu-item>
          <el-menu-item index="osa_input_output_chart"><router-link tag="li" :to="{path: '/quality/osa_input_output_chart'}">OSA投入产出3D图</router-link></el-menu-item>
        </el-submenu>
        <el-menu-item index="osa_capacity_statistics"><router-link tag="li" :to="{path:'/quality/osa_capacity_statistics'}">OSA生产产能统计</router-link></el-menu-item>
      </el-submenu>

      <el-submenu  index="5" style="border-right: 1px solid #717171;">
        <template slot="title">预组质量统计</template>
        <el-menu-item index="pregroup_quality_pn_statistics" ><router-link tag="li" :to="{path:'/quality/pregroup_quality_pn_statistics'}">通过工单号统计</router-link></el-menu-item>
        <el-menu-item index="pregroup_post_message" ><router-link tag="li" :to="{path:'/quality/pregroup_post_message'}">录入操作界面</router-link></el-menu-item>
      </el-submenu>

      <el-menu-item  index="alarm_trend_chart"><router-link tag="li" :to="{path:'/equipment/alarm_trend_chart'}">告警趋势图</router-link></el-menu-item>

      <el-submenu index="6" style="border-right: 1px solid #717171;">
        <template slot="title">PTR</template>
        <el-menu-item  index="ptr_control_show"><router-link tag="li" :to="{path:'/equipment/ptr_control_show'}">PTR监控</router-link></el-menu-item>
        <el-menu-item  index="ptr_post"><router-link tag="li" :to="{path:'/equipment/ptr_post'}">PTR修改</router-link></el-menu-item>
      </el-submenu>

      <el-submenu index="7">
        <template slot="title">工位动态告警</template>
        <el-menu-item  index="dynamic_warning_10G_station"><router-link tag="li" :to="{path:'/warning/dynamic_warning_10G_station'}">10G产线</router-link></el-menu-item>
        <el-menu-item  index="dynamic_warning_osa_station"><router-link tag="li" :to="{path:'/warning/dynamic_warning_osa_station'}">OSA产线</router-link></el-menu-item>
        <el-menu-item  index="dynamic_warning_olt_station"><router-link tag="li" :to="{path:'/warning/dynamic_warning_olt_station'}">OLT产线</router-link></el-menu-item>
        <el-menu-item  index="dynamic_warning_other_station"><router-link tag="li" :to="{path:'/warning/dynamic_warning_other_station'}">其他产线</router-link></el-menu-item>
      </el-submenu>

      <el-menu-item  index="station_real_time_supervision"><router-link tag="li" :to="{path:'/equipment/station_real_time_supervision'}">工位实时监管</router-link></el-menu-item>

      <el-submenu index="8">
        <template slot="title">仓库监管</template>
        <el-menu-item  index="material_gear"><router-link tag="li" :to="{path:'/inventory/material_gear'}">档位监管</router-link></el-menu-item>
        <el-menu-item  index="k3_inspection_sheet"><router-link tag="li" :to="{path:'/equipment/k3_inspection_sheet'}">入库检验</router-link></el-menu-item>
        <el-menu-item  index="query"><router-link tag="li" :to="{path:'/equipment/query'}">物料出库</router-link></el-menu-item>
      </el-submenu>

      <el-menu-item  index="EquipmentDetailsControls"><router-link tag="li" :to="{path:'/equipment/EquipmentDetailsControls'}">设备管控</router-link></el-menu-item>
      <el-menu-item  index="videos_layout"><router-link tag="li" :to="{path:'/equipment/videos_layout'}">学习资源</router-link></el-menu-item>

      <el-menu-item index="full_traceability"><router-link tag="li" :to="{path: '/quality/full_traceability'}">全追溯</router-link></el-menu-item>

      <div style="float: right" v-if="logged">
        <el-submenu index="9">
        <template slot="title" >{{username}}</template>
        <el-menu-item index="update_user"><router-link tag="li" :to="{path:'/user/update_user'}">修改用户信息</router-link></el-menu-item>
        <el-menu-item index="6-2" @click="logout">退出登录</el-menu-item>
        <el-menu-item index="user_mangement" v-if="backstage"><router-link tag="li" :to="{path:'/backstage/user_mangement'}">到后台</router-link></el-menu-item>
      </el-submenu>
      </div>
      <div v-else>
        <el-menu-item  style="float: right"><router-link tag="li" :to="{path:'/user/login'}">登录</router-link></el-menu-item>
        <el-menu-item  style="float: right"><router-link tag="li" :to="{path:'/user/register'}">注册</router-link></el-menu-item>
      </div>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'Navigation',
  data () {
    return {
      activeIndex: '1',
      logged: false,
      backstage: false,
      username: '',
      timer: ''
      // proscenium: true
    }
  },
  mounted () {
    this.proscenium = true
    this.getuser()
  },
  methods: {
    handleSelect (key, keyPath) {
      this.activeIndex = key
    },
    getuser () {
      let that = this
      that.logged = localStorage.getItem('Token') !== null
      if (that.logged === true) {
        that.username = localStorage.getItem('nickname')
        if (that.username === '管理者') {
          that.backstage = true
        }
      }
    },
    logout () {
      localStorage.clear()
      this.$router.push({path: '/'})
      window.location.reload()
    }
    // go_backstage () {
    //   // this.proscenium = false
    //   localStorage.setItem('backstage', 'true')
    //   // localStorage.setItem('backstage', '222')
    // }
  }
}
</script>

<style>
  #navigation {
    margin-bottom: 20px;
  }
  .atooltip {
  background:rgba(255, 255, 255, 0.5) !important;
  font-size: 1px !important;
  max-height: 10px !important;
  max-width:200px !important;
  }
  /* .atooltip{
    background:red !important
  } */
</style>
