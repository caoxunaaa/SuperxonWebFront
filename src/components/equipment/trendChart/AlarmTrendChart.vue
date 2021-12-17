<template>
  <div class="AlarmTrendChart">
    <!--搜索-->
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="grid-content bg-purple" style="height:60px;background-color: white">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="10px" class="demo-ruleForm">
              <el-form-item  prop="value2" style="float:left">
              <el-date-picker
              v-model="ruleForm.value2"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item  prop="searchPn" style="float:left">
              <el-select v-model="ruleForm.type" placeholder="请选择">
                <el-option label="模块工位良率" value="模块工位良率"></el-option>
                <el-option label="模块直通率" value="模块直通率"></el-option>
                <el-option label="OSA工位良率" value="OSA工位良率"></el-option>
                <el-option label="OSA直通率" value="OSA直通率"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-button slot="append" icon="el-icon-search" @click="submitForm('ruleForm')"
            style="background-color: #409eff; color: #fff; height: 40px; width:80px; float:left" ></el-button>
        </div>
      </el-col>
    </el-row>
    <br>
    <el-row :gutter="20">
      <!--柱状图 1-->
      <el-col :span="24"><div class="grid-content bg-purple">
        <div style="width:100%;height:400px;border:1px solid #909399">
          <XChart :id="id1" :option="option1" style="height:600px"></XChart>
        </div>
    </div></el-col>
    </el-row>
  </div>
</template>

<script>
import XChart from '@/components/chart/Chart'
import Highcharts from 'highcharts'
export default {
  name: 'AlarmTrendChart',
  components: {
    XChart
  },
  mounted () {
    this.get_timer()
  },
  methods: {
    // 打开页面执行搜索最近一周的事件
    get_timer () {
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
      this.ruleForm.value2 = [start, end]
      this.ruleForm.type = '模块工位良率'
      console.log(this.ruleForm.value2)
      this.time = this.ruleForm.value2
      this.startTime = this.moment(this.time[0]).format('YYYY-MM-DD HH:mm:ss')
      this.endTime = this.moment(this.time[1]).format('YYYY-MM-DD HH:mm:ss')
      this.get_tableData()
    },
    // 点击搜索按钮后触发该事件
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let that = this
          console.log(that.ruleForm.value2)
          console.log(that.ruleForm.type)
          that.time = that.ruleForm.value2
          that.startTime = that.moment(that.time[0]).format('YYYY-MM-DD HH:mm:ss')
          that.endTime = that.moment(that.time[1]).format('YYYY-MM-DD HH:mm:ss')
          console.log(that.startTime)
          console.log(that.endTime)
          that.dataCount = []
          that.dataToal = []
          that.datax = []
          that.get_tableData()
        }
      })
    },
    // 获取趋势图数据
    get_tableData () {
      let that = this
      that.$axios({
        method: 'get',
        url: '/display/trend-chart/warning-statistic-daily',
        params: {
          startTime: that.startTime,
          endTime: that.endTime,
          classification: that.ruleForm.type
        }
      }).then(function (response) {
        console.log(response)
        if (response.data !== null) {
          console.log(response.data)
          const res = response.data
          that.option1.title.text = that.startTime.slice(0, 10) + '至' + that.endTime.slice(0, 10) + ' ' + that.ruleForm.type + ' 告警趋势图'
          // console.log(typeof (res[0]['Count']))
          // console.log(typeof (res[0]['Total']))
          that.dataProportion = []
          for (var i = 0; i < res.length; i++) {
            that.dataCount.push(res[i]['Count'])
            that.dataToal.push(res[i]['Total'])
            if (res[i]['Total'] === 0) {
              that.dataProportion.push(res[i]['Total'])
            } else {
              that.dataProportion.push(Number((((res[i]['Count'] * 100) / res[i]['Total']).toFixed(2))))
            }
            console.log(that.dataProportion)
            res[i]['DateTime'] = that.moment(res[i]['DateTime']).format('YYYY-MM-DD HH:mm:ss')
            // console.log(res[i]['DateTime'])
            res[i]['DateTime'] = res[i]['DateTime'].slice(5, 10) + ' '
            console.log(res[i]['DateTime'])
            that.datax.push(res[i]['DateTime'])
          }
          // for (var x = 1; x <)
          console.log(that.dataCount)
          console.log(that.dataToal)
          console.log(typeof (that.datax[0]))
          that.option1.xAxis.categories = that.datax
          that.option1.series[0].data = that.dataToal
          that.option1.series[1].data = that.dataCount
          that.option1.series[2].data = that.dataProportion
          if (that.option1.xAxis.categories.length <= 30) {
            that.option1.xAxis.tickInterval = 0
          } else if (that.option1.xAxis.categories.length > 30 && that.option1.xAxis.categories.length <= 90) {
            that.option1.xAxis.tickInterval = 7
          } else if (that.option1.xAxis.categories.length > 90) {
            that.option1.xAxis.tickInterval = 30
          }
          Highcharts.chart(that.id1, that.option1)
        } else {
          that.$message({
            type: 'error',
            message: '暂无数据！'
          })
        }
      }).catch(function (err) {
        console.log(err)
        if (err.response.status === 401) {
          alert('用户未登录或登录已过期')
          localStorage.clear()
          that.$router.push({path: '/user/login/'})
          window.location.reload()
        } else if (err.response.status === 403) {
          that.$message({
            type: 'error',
            message: '权限不够！'
          })
        } else if (err.response.status === 404) {
          that.$message({
            type: 'error',
            message: '未找到数据！'
          })
        } else if (err.response.status === 504) {
          that.$message({
            type: 'error',
            message: '服务器未响应！'
          })
        }
      })
    }
  },
  data () {
    return {
      id1: 'high1',
      dataCount: [],
      dataToal: [],
      dataProportion: [],
      datax: [],
      time: [],
      startTime: '',
      endTime: '',
      ruleForm: {
        value2: [],
        type: ''
      },
      rules: {
        type: {required: true, message: '请选择', trigger: 'change'},
        value2: {required: true, message: '请选择时间', trigger: 'change'}
      },
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
      },
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      value2: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      option1: {
        chart: {
          type: 'areaspline'
        },
        title: {
          text: '告警趋势图'
        },
        legend: {
          layout: 'vertical',
          align: 'left',
          verticalAlign: 'top',
          x: 150,
          y: 20,
          floating: true,
          borderWidth: 1,
          itemHoverStyle: {
            color: '#000000'
          },
          backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        xAxis: {
          categories: [],
          tickInterval: 0,
          crosshair: true,
          title: {
            text: '日期'
          }
        },
        yAxis: [{
          title: {
            text: '总数及告警数'
          }
        }, {
          title: {
            text: ''
          },
          minPadding: 0,
          maxPadding: 0,
          max: 100,
          min: 0,
          opposite: true,
          labels: {
            format: '{value}%'
          }
        }],
        plotOptions: {
          areaspline: {
            fillOpacity: 0.5
          }
        },
        series: [{
          name: '总数',
          data: []
        }, {
          name: '告警数',
          color: 'rgba(255, 0, 0, 1)',
          data: []
        }, {
          name: '占比',
          type: 'spline',
          yAxis: 1,
          data: [],
          tooltip: {
            valueSuffix: '%'
          }
        }]
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
</style>
