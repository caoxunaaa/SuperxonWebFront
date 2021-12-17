<template>
  <div id='EquipmentDetailsControls'>
    <h3>设备详情&管控</h3>
    <el-row :gutter="20">

        <EquipmentDetailAndManages></EquipmentDetailAndManages>

      <!-- <el-col :lg="4" :sm="2" :xs="0">
        <EquipmentAddOption></EquipmentAddOption>
      </el-col> -->
    </el-row>
  </div>
</template>

<script>
import EquipmentDetailAndManages from '@/components/equipment/PageItems/EquipmentDetailAndManages'
export default {
  name: 'EquipmentDetailsControls',
  components: {EquipmentDetailAndManages}
}
</script>

<style scoped>
  h3 {
    text-align: center;
  }
</style>
