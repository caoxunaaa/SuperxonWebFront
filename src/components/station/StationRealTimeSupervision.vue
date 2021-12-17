<template>
  <div id="StationRealTimeSupervision">
    <div>
      <el-date-picker
        v-model="valueTime"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-button @click="post_time" slot="append" style="background-color: #409eff; color: #fff; height: 40px; width:80px" icon="el-icon-search"></el-button>
      <el-button @click="clear_time" slot="append" style="background-color: #409eff; color: #fff; height: 40px; width:80px">重置</el-button>
    </div>
    <CouplingStation v-bind:message="timeData"></CouplingStation>
    <br>
    <ReceivingCoupling v-bind:message="timeData"></ReceivingCoupling>
    <br>
    <SingleLightInitialMeasurementStation v-bind:message="timeData"></SingleLightInitialMeasurementStation>
  </div>
</template>

<script>
import SingleLightInitialMeasurementStation from '@/components/station/SingleLightInitialMeasurementStation'
import CouplingStation from '@/components/station/CouplingStation'
import ReceivingCoupling from '@/components/station/ReceivingCoupling'
export default {
  name: 'StationRealTimeSupervision',
  components: {
    CouplingStation,
    SingleLightInitialMeasurementStation,
    ReceivingCoupling
  },
  mounted () {
  },
  methods: {
    // 修改时间
    post_time () {
      console.log(this.valueTime)
      this.timeData['startTime'] = this.moment(this.valueTime[0]).format('YYYY-MM-DD HH:mm:ss')
      this.timeData['endTime'] = this.moment(this.valueTime[1]).format('YYYY-MM-DD HH:mm:ss')
      this.timeData = {'startTime': this.moment(this.valueTime[0]).format('YYYY-MM-DD HH:mm:ss'), 'endTime': this.moment(this.valueTime[1]).format('YYYY-MM-DD HH:mm:ss')}
      console.log(this.timeData)
    },
    // 清除时间
    clear_time () {
      this.valueTime = null
      this.timeData = {'startTime': null, 'endTime': null}
    }
  },
  data () {
    return {
      valueTime: '',
      timeData: {},
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            start.setHours(0)
            start.setMinutes(0)
            start.setSeconds(0)
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 7)
            end.setHours(0)
            end.setMinutes(0)
            end.setSeconds(0)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            start.setHours(0)
            start.setMinutes(0)
            start.setSeconds(0)
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 30)
            end.setHours(0)
            end.setMinutes(0)
            end.setSeconds(0)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            start.setHours(0)
            start.setMinutes(0)
            start.setSeconds(0)
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 90)
            end.setHours(0)
            end.setMinutes(0)
            end.setSeconds(0)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  }
}
</script>

<style scoped>
</style>
