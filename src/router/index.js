import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

/** 质量统计 **/
import Quality from '@/components/quality/Quality'
import ModuleQualityPNStatistics from '@/components/quality/module/ModuleQualityPNStatistics'
import ModuleQualityStatisticsByWeekOrMonth from '@/components/quality/module/ModuleQualityStatisticsByWeekOrMonth'
import ModuleQualityWorkOrderStatistics from '@/components/quality/module/ModuleQualityWorkOrderStatistics'
import ModuleQualityResultSattistics from '@/components/quality/module/ModuleQualityResultSattistics'
import ModuleInputOutputBoard from '@/components/quality/module/ModuleInputOutputBoard'
import ModuleInputOutputChart from '@/components/quality/module/ModuleInputOutputChart'
import OsaQualityPNStatistics from '@/components/quality/osa/OsaQualityPNStatistics'
import OsaQualityWorkOrderStatistics from '@/components/quality/osa/OsaQualityWorkOrderStatistics'
import OsaInputOutputBoard from '@/components/quality/osa/OsaInputOutputBoard'
import OsaInputOutputChart from '@/components/quality/osa/OsaInputOutputChart'
import OsaCapacityStatistics from '@/components/quality/osa/OsaCapacityStatistics'
import pregroupQualityWorkOrderStatistics from '@/components/quality/pregroup/pregroupQualityWorkOrderStatistics'
import pregroupPostMessage from '@/components/quality/pregroup/pregroupPostMessage'

import ChildrenEcharts from '@/components/traceability/ChildrenEcharts'
import FullTraceability from '@/components/traceability/FullTraceability'

/** 告警 **/
// import OsaForm from '@/components/equipment/osaform/OsaForm'
import ModuleWarning from '@/components/warning/ModuleWarning'
import ToDayModuleMultiplicativeWarning from '@/components/warning/ToDayModuleMultiplicativeWarning'
import ToDayOsaMultiplicativeWarning from '@/components/warning/ToDayOsaMultiplicativeWarning'
import OsaWarning from '@/components/warning/OsaWarning'
// import OriginatingCoupling from '@/components/equipment/warning/OriginatingCoupling'
import DynamicWarning from '@/components/warning/DynamicWarning'
import Warning from '@/components/warning/Warning'
// import CopyDynamicWarning from '@/components/warning/CopyDynamicWarning'
import DynamicWarning10Gstation from '@/components/warning/DynamicWarning/DynamicWarning10Gstation'
import DynamicWarningOSAstation from '@/components/warning/DynamicWarning/DynamicWarningOSAstation'
import DynamicWarningOLTstation from '@/components/warning/DynamicWarning/DynamicWarningOLTstation'
import DynamicWarningOtherstation from '@/components/warning/DynamicWarning/DynamicWarningOtherstation'

/** 仓库管理 **/
import InventorySupervision from '@/components/inventory/InventorySupervision'
import MaterialGear from '@/components/inventory/MaterialGear'

/** 工位 **/
import StationRealTimeSupervision from '@/components/station/StationRealTimeSupervision'

/** 看板 **/
import ModelBoard from '@/components/equipment/modelBoard/ModelBoard'
import ModuleProject from '@/components/equipment/project/ModuleProject'
import OsaBoard from '@/components/equipment/osaBoard/OsaBoard'
import OsaProject from '@/components/equipment/project/OsaProject'

import AlarmTrendChart from '@/components/equipment/trendChart/AlarmTrendChart'
import User from '@/components/user/User'
import UserLogin from '@/components/user/UserLogin'
import UserRegister from '@/components/user/UserRegister'
import UpdateUser from '@/components/user/UpdateUser'
import Equipment from '@/components/equipment/Equipment'
import VideosLayout from '@/components/video/VideosLayout'
import Video from '@/components/video/Video'
import EquipmentDetailsControls from '@/components/equipment/EquipmentDetailsControls'
import BackstageIndex from '@/components/backstage/BackstageIndex'
import UserManagement from '@/components/backstage/UserManagement'
import UserPermission from '@/components/backstage/UserPermission'
import AlarmLimit from '@/components/backstage/AlarmLimit'
import LearningRecord from '@/components/backstage/LearningRecord'
import MailManagement from '@/components/backstage/MailManagement'
import VoiceAlarm from '@/components/backstage/VoiceAlarm'
import PTRControl from '@/components/backstage/PTRControl'
import PTRControlShow from '@/components/equipment/ptrcontrol/PTRControlShow'
import PTRPost from '@/components/equipment/ptrcontrol/PTRPost'
import K3InspectionSheet from '@/components/equipment/k3/K3InspectionSheet'
import Query from '@/components/equipment/k3/Query'

Vue.use(Router)

export default new Router({
  routes: [
    /** 首页 **/
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    /** 登录注册 **/
    {
      path: '/user',
      component: User,
      children: [
        {path: 'login', component: UserLogin},
        {path: 'register', component: UserRegister},
        {path: 'update_user', component: UpdateUser}
      ]
    },
    /** 仓管 **/
    {
      path: '/inventory',
      component: InventorySupervision,
      children: [
        {path: 'material_gear', component: MaterialGear}
      ]
    },
    /** 告警 **/
    {
      path: '/warning',
      component: Warning,
      children: [
        {path: 'dynamic_warning_10G_station', component: DynamicWarning10Gstation},
        {path: 'dynamic_warning_osa_station', component: DynamicWarningOSAstation},
        {path: 'dynamic_warning_olt_station', component: DynamicWarningOLTstation},
        {path: 'dynamic_warning_other_station', component: DynamicWarningOtherstation},
        {path: 'module_warning', component: ModuleWarning},
        {path: 'toDay_module_multiplicative_warning', component: ToDayModuleMultiplicativeWarning},
        {path: 'toDay_osa_multiplicative_warning', component: ToDayOsaMultiplicativeWarning},
        {path: 'osa_warning', component: OsaWarning},
        // {path: 'osa_originating_coupling', component: OriginatingCoupling},
        {path: 'dynamic_warning', component: DynamicWarning}
      ]
    },
    /** 质量统计 **/
    {
      path: '/quality',
      component: Quality,
      children: [
        {path: 'module_quality_pn_statistics', component: ModuleQualityPNStatistics},
        {path: 'module_quality_statistics_by_week_or_month', component: ModuleQualityStatisticsByWeekOrMonth},
        {path: 'module_quality_workorder_statistics', component: ModuleQualityWorkOrderStatistics},
        {path: 'module_quality_result_statistics', component: ModuleQualityResultSattistics},
        {path: 'module_input_output_board', component: ModuleInputOutputBoard},
        {path: 'module_input_output_chart', component: ModuleInputOutputChart},
        {path: 'osa_quality_pn_statistics', component: OsaQualityPNStatistics},
        {path: 'osa_quality_workorder_statistics', component: OsaQualityWorkOrderStatistics},
        {path: 'osa_input_output_board', component: OsaInputOutputBoard},
        {path: 'osa_input_output_chart', component: OsaInputOutputChart},
        {path: 'osa_capacity_statistics', component: OsaCapacityStatistics},
        {path: 'pregroup_quality_pn_statistics', component: pregroupQualityWorkOrderStatistics},
        {path: 'pregroup_post_message', component: pregroupPostMessage},
        {path: 'full_traceability', component: FullTraceability},
        {path: 'children_echarts', component: ChildrenEcharts}
      ]
    },
    /** 设备 */
    {
      path: '/equipment',
      component: Equipment,
      children: [
        {path: 'model_board', component: ModelBoard},
        {path: 'osa_board', component: OsaBoard},
        {path: 'device_module_board', component: ModelBoard},
        // {path: 'device_osa_form', component: OsaForm},
        {path: 'videos_layout', component: VideosLayout},
        {path: 'EquipmentDetailsControls', component: EquipmentDetailsControls},
        {path: 'module_project', component: ModuleProject},
        {path: 'osa_project', component: OsaProject},
        {path: 'alarm_trend_chart', component: AlarmTrendChart},
        {path: 'ptr_control_show', component: PTRControlShow},
        {path: 'ptr_post', component: PTRPost},
        {path: 'station_real_time_supervision', component: StationRealTimeSupervision},
        {path: 'k3_inspection_sheet', component: K3InspectionSheet},
        {path: 'query', component: Query}
      ]
    },
    /** 后台**/
    {
      path: '/backstage',
      component: BackstageIndex,
      redirect: '/user_mangement',
      children: [
        {path: 'user_mangement', component: UserManagement},
        {path: 'backstage_index', component: BackstageIndex},
        {path: 'user_permission', component: UserPermission},
        {path: 'alarm_limit', component: AlarmLimit},
        {path: 'learning_record', component: LearningRecord},
        {path: 'mail_management', component: MailManagement},
        {path: 'voice_alarm', component: VoiceAlarm},
        {path: 'ptr_control', component: PTRControl}
      ]
    },
    /** 学习资源**/
    {
      path: '/video',
      component: Video,
      children: [
        {path: 'video', component: Video}
      ]
    }
  ]
})
