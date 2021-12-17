<template>
  <div class="ModuleInputOutputChart">
    <div>
      <el-date-picker
        v-model="timevalue"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-button @click="get_data" slot="append" icon="el-icon-search" style="background-color: #409eff; color: #fff; height: 40px; width:120px">搜索</el-button>
      <el-select v-model="selectdata" placeholder="请选择系列" :disabled="selectdisabled" @change="get_chart">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="open_drawer" type="primary" style="margin-left:16px">记录</el-button>
    </div>
    <!-- <div style="float:left; width: 200px;height:200px;border: 1px solid black; background-color:red;z-index:100;"></div> -->
    <el-row>
      <el-col :span="3">
        <div style="border:1px solid black; height:750px;width:100%;background:rgb(84, 92, 100)">
          <h3 style="font-size: 10px;color:white">各工序投入产出占比</h3><hr>
          <h3 v-for="(item,index) in everyProportionData" :key="index" style="font-size: 10px;color:white">{{item}}<hr></h3>
        </div>
      </el-col>
      <el-col :span="21">
        <div id="container" style="border: 1px solid black;height:750px;width:100%;background:rgb(84, 92, 100)"></div>
      </el-col>
    </el-row>
      <el-drawer
      title="记录"
      :visible.sync="drawer"
      size="50%">
        <el-calendar style="font-size:5px">
          <template slot="dateCell" slot-scope="{data}">
            <div @click="chooseDay(data)" style="height:100%">
              <b style="margin:0" :class="data.isSelected ? 'is-selected' : ''">
                {{data.day.split('-').slice(0).join('-')}} {{ data.isSelected ? '✔️' : ''}}
              </b>
              <div style="width:100%;" v-for="(item,index) in calendarData" :key="index">
                <i class="el-icon-star-on" v-if="(item).indexOf(data.day.split('-').slice(0).join('-'))!=-1"></i>
              </div>
            </div>
          </template>
        </el-calendar>
        <div style="border-top: 1px solid black">
          <el-button @click="add_button" style="background-color: #409eff; color: #fff; height: 40px; width:120px">新增</el-button>
          <download-excel
          style="float:left"
          :data = "calendarAllData"
          name = "module段投入产出记录表.xls">
          <el-button class="files" type="primary" style="padding: 12px 20px">导出全部记录</el-button>
          </download-excel>
        </div>
        <div style="width: 100%;height: 400px;border:1px solid black;">
          <el-table
          :data="cardData"
          height="400"
          style="width: 100%">
          <el-table-column
          label="备注时间"
          prop="CreateTime"
          width="100">
          </el-table-column>
          <el-table-column
          label="备注人"
          prop="User"
          width="100">
          </el-table-column>
          <el-table-column
          label="备注"
          prop="Event"
          :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column label="图片">
            <template slot-scope="scope">
              <el-image
              :src="scope.row['FilePath']"
              style="width: 150px; height: 80px"
              :preview-src-list="[scope.row['FilePath']]"
              >
              </el-image>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            </template>
          </el-table-column>
          </el-table>
        </div>
      </el-drawer>
      <el-dialog
      :visible.sync="addVisible"
      width="40%"
      append-to-body>
      <div>
        <h3>新增备注信息</h3>
        <el-form ref="form" :model="addform">
          <el-form-item label="备注人">
            <el-input v-model="addform.User" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="备注时间">
            <el-date-picker type="date" placeholder="选择备注日期" v-model="addform.CreataTime" style="width: 100%;" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="addform.Event" type="textarea" placeholder="请输入备注内容" maxlength="300" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="上传图片">
            <input type="file" id="myfile" accept=".jpg,.png">
          </el-form-item>
          <el-form-item>
            <el-button @click="add_form_button" style="background-color: #409eff; color: #fff; height: 40px; width:120px">新增</el-button>
          </el-form-item>
        </el-form>
      </div>
      </el-dialog>
      <el-dialog
      :visible.sync="postVisible"
      width="40%"
      append-to-body
      :close-on-click-modal="false">
      <div>
        <h3>修改备注信息</h3>
        <el-form ref="form" :model="postform">
          <el-form-item label="ID：">
            <el-input v-model="postform.Id" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="备注人：">
            <el-input v-model="postform.User" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="修改备注人：">
            <el-input v-model="postform.postUser" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="备注时间：">
            <el-input v-model="postform.CreateTime" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model="postform.Event" type="textarea" placeholder="请输入备注内容" maxlength="300" show-word-limit></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="post_form_button" style="background-color: #409eff; color: #fff; height: 40px; width:120px">修改</el-button>
          </el-form-item>
        </el-form>
      </div>
      </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import Charts from '@/components/chart/Chart'
import Highcharts from 'highcharts'
import $ from 'jquery'
export default {
  name: 'ModuleInputOutputChart',
  components: {
    Charts
  },
  mounted () {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime())
    start.setHours(0)
    start.setMinutes(0)
    start.setSeconds(0)
    end.setTime(start.getTime() + 3600 * 1000 * 24)
    end.setHours(0)
    end.setMinutes(0)
    end.setSeconds(0)
    this.timevalue = [start, end]
    this.get_process_sort()
    this.get_card_data()
  },
  watch: {
    options: {
      handler (newVal, oldVal) {
        if (this.options.length !== 0) {
          this.selectdisabled = false
        }
      },
      deep: true
    }
  },
  methods: {
    // 获取日历组件的所有事件记录
    get_card_data () {
      let that = this
      that.$axios({
        url: '/display/product-statistic-query/calendar-event-record/all',
        method: 'get',
        params: {
          type: that.type
        }
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null) {
          that.calendarAllData = res
          var test = []
          for (let i = 0; i < res.length; i++) {
            test.push(res[i]['CreateTime'])
          }
          that.calendarData = Array.from(new Set(test))
        }
      }).catch(function (error) {
        console.log(error)
        that.$message({
          type: 'error',
          message: '获取日期事件数据失败！'
        })
      })
    },
    get_rotation () {
      // console.log(this.rotationA)
      // console.log(this.rotationB)
      // console.log(this.rotationC)
    },
    // 获取工序的顺序
    get_process_sort () {
      // let that = this
      // that.$axios({
      //   url: '/display/product-statistic-query/input-and-output-summary-process-sort-ini',
      //   method: 'get'
      // }).then(function (response) {
      //   console.log(response)
      //   const res = response.data
      //   if (res !== null) {
      //     console.log(res)
      //     var data = res
      //     console.log(Object.values(data))
      //   }
      // }).catch(function (error) {
      //   console.log(error)
      //   that.$message({
      //     type: 'error',
      //     message: '获取工序顺序数据失败！'
      //   })
      // })
    },
    // 获取数据
    get_data () {
      this.options = []
      // console.log(this.timevalue)
      if (this.timevalue !== null) {
        var start = this.moment(this.timevalue[0]).format('YYYY-MM-DD HH:mm:ss')
        var end = this.moment(this.timevalue[1]).format('YYYY-MM-DD HH:mm:ss')
        // console.log(start, end)
        let that = this
        var mess = that.$message({
          type: 'warning',
          message: '正在搜索数据中~',
          duration: 0
        })
        that.cancel && that.cancel()
        that.$axios({
          method: 'get',
          url: '/display/product-statistic-query/input-and-output-summary-by-production-series-and-date',
          params: {
            startTime: start,
            endTime: end
          },
          cancelToken: new axios.CancelToken((c) => {
            // 存储一个cancel函数用于取消本次的网络请求
            that.cancel = c
          })
        }).then(function (response) {
          mess.close()
          console.log(response)
          const res = response.data
          if (res !== null) {
            that.chartdata = res
            var code = Object.keys(res)
            // console.log(that.chartdata)
            var selet = []
            for (let k = 0; k < code.length; k++) {
              selet.push({'value': code[k], 'label': code[k]})
            }
            that.options = selet
            // that.selectdata = selet[0]['value']
            that.selectdata = '10G_PON系列'
            that.get_chart()
          }
        }).catch(function (error) {
          console.log(error)
          mess.close()
          if (error.response.status === 403) {
            that.$message({
              type: 'error',
              message: '无查询权限！'
            })
          } else if (error.response.status === 401) {
            that.$message({
              type: 'error',
              message: '未登录,请登录后再查询！'
            })
          } else {
            that.$message({
              type: 'error',
              message: '查询失败！'
            })
          }
        })
      }
    },
    // 作图
    get_chart () {
      // console.log(this.selectdata)
      var series = []
      var time = []
      // console.log(this.chartdata[this.selectdata])
      var code = Object.keys(this.chartdata[this.selectdata])
      // console.log(code)
      for (let i = 0; i < code.length; i++) {
        var bum = Object.keys(this.chartdata[this.selectdata][code[i]])
        for (let k = 0; k < bum.length; k++) {
          var zAxis = {name: bum[k], stack: k, data: []}
          // console.log(this.chartdata[this.selectdata][code[i]][bum[k]])
          if (this.chartdata[this.selectdata][code[i]][bum[k]]['Input'] > this.chartdata[this.selectdata][code[i]][bum[k]]['Pass']) {
            zAxis['data'].push({'name': code[i], 'y': this.chartdata[this.selectdata][code[i]][bum[k]]['Input'], 'pass': this.chartdata[this.selectdata][code[i]][bum[k]]['Pass']})
          } else {
            zAxis['data'].push({'name': code[i], 'y': this.chartdata[this.selectdata][code[i]][bum[k]]['Input'], 'pass': this.chartdata[this.selectdata][code[i]][bum[k]]['Input']})
          }
          time.push(code[i])
          series.push(zAxis)
        }
      }
      time = Array.from(new Set(time))
      if (time.length > 1) {
        for (let t = 0; t < time.length - 1; t++) {
          for (let f = 0; f < time.length - 1 - t; f++) {
            if (Date.parse(time[f]) > Date.parse(time[f + 1])) {
              var d = time[f]
              time[f] = time[f + 1]
              time[f + 1] = d
            }
          }
        }
      }
      console.log(time)
      // console.log(series)
      var process = []
      // for (let x = 0; x < code.length; x++) {
      // process = process.concat(Object.keys(this.chartdata[this.selectdata][code[x]]))
      // }
      // process = Array.from(new Set(process))
      process = this.process_sort
      // console.log(process)
      var da = []
      for (let n = 0; n < process.length; n++) {
        var sum = {'name': process[n], 'stack': n, 'data': []}
        for (let m = 0; m < series.length; m++) {
          if (process[n] === series[m]['name']) {
            // console.log(sum['data'])
            // console.log(series[m]['data'])
            sum['data'] = sum['data'].concat(series[m]['data'])
          }
        }
        da.push(sum)
      }
      series = da
      console.log(series)
      this.every_proportion(series)
      var input = 0
      for (let x = 0; x < series[1]['data'].length; x++) {
        input = input + series[1]['data'][x]['y']
      }
      // console.log(input)
      var out = 0
      for (let x = 0; x < series[7]['data'].length; x++) {
        out = out + series[7]['data'][x]['pass']
      }
      // console.log(out)
      var subtitleText = '(' + series[1]['name'] + '——投入:' + String(input) + '  ' + series[7]['name'] + '——通过:' + String(out) + ')'
      var text = '投入产出占比' + String((out * 100 / input).toFixed(2)) + '%'
      // this.option1.zAxis.categories = process
      // this.option1.series = series
      // this.option1.title.text = this.selectdata
      // this.option1.zAxis.max = process.length - 1
      // this.option1.chart.options3d.depth = (process.length * 33)
      let that = this
      const chart = Highcharts.chart('container', {
        chart: {
          backgroundColor: {
            linearGradient: [0, 0, 500, 500],
            stops: [
              [0, 'rgb(84, 92, 100)'],
              [1, 'rgb(84, 92, 100)']
            ]
          },
          type: 'column',
          options3d: {
            enabled: true,
            alpha: 20,
            beta: 0,
            depth: (process.length * 100),
            viewDistance: 5,
            frame: {
              bottom: {
                size: 1,
                color: 'rgba(0, 0, 0, 0.05)'
              }
            }
          }
        },
        title: {
          text: text,
          style: {
            color: 'white'
          }
        },
        subtitle: {
          text: subtitleText,
          style: {
            color: 'white'
          }
        },
        xAxis: {
          categories: time,
          // type: 'category',
          gridLineWidth: 1,
          title: {
            text: '时间',
            style: {
              color: '#E0E0E3'
            }
          },
          gridLineColor: '#707073',
          labels: {
            useHTML: true,
            formatter: function () {
              if (new Date(this.value).getDay() % 7 === 6 || new Date(this.value).getDay() % 7 === 0) {
                return '<span style="color: red;">' + this.value + '</span>'
              } else {
                return '<span style="color: white;">' + this.value + '</span>'
              }
            }
          }
        },
        yAxis: [{
          min: 0,
          title: {
            text: '数量(个)',
            style: {
              color: '#E0E0E3'
            }
          },
          gridLineColor: '#707073',
          labels: {
            style: {
              color: '#E0E0E3'
            }
          }
        }],
        zAxis: {
          min: 0,
          max: process.length - 1,
          title: {
            text: '工序',
            style: {
              color: '#E0E0E3'
            }
          },
          categories: process,
          gridLineColor: '#707073',
          labels: {
            style: {
              color: '#E0E0E3'
            }
          }
        },
        tooltip: {
          // shared: true,
          formatter: function () {
            return '<b>时间：' + this.point.name + '</b><br><b>总投入：' + this.point.y + '</b><br><b>通过：' + this.point.pass + '</b>'
          }
        },
        plotOptions: {
          series: {
            groupZPadding: 50,
            depth: 50,
            groupPadding: 0,
            grouping: false,
            events: {
              // 图例点击的事件
              legendItemClick: function (e) {
                var series = this.chart.series
                var mode = that.getVisibleMode(series, this.name)
                var enableDefault = false
                if (!this.visible) {
                  console.log(this.visible, this.name)
                  enableDefault = true
                } else if (mode === 'all-visible') {
                  series.forEach((series, k) => {
                    series.hide()
                  })
                  this.show()
                } else if (mode === 'all-hidden') {
                  series.forEach((series, k) => {
                    series.show()
                  })
                } else {
                  enableDefault = true
                }
                return enableDefault
              }
            }
          },
          column: {
            grouping: false,
            shadow: false,
            borderWidth: 0,
            dataLabels: {
              enabled: false
            }
          }
        },
        legend: {
          enabled: true
        },
        credits: {
          enabled: false // 禁用网址
        },
        series: series
      })
      // 鼠标控制旋转的功能
      $(chart.container).on('mousedown.hc touchstart.hc', function (eStart) {
        eStart = chart.pointer.normalize(eStart)
        var posX = eStart.pageX
        var posY = eStart.pageY
        var alpha = chart.options.chart.options3d.alpha
        var beta = chart.options.chart.options3d.beta
        var sensitivity = 1 // lower is more sensitive
        $(document).on({
          'mousemove.hc touchdrag.hc': function (e) {
            // Run beta
            var newBeta = beta + (posX - e.pageX) / sensitivity
            chart.options.chart.options3d.beta = newBeta
            // Run alpha
            var newAlpha = alpha + (e.pageY - posY) / sensitivity
            chart.options.chart.options3d.alpha = newAlpha
            chart.redraw(false)
          },
          'mouseup touchend': function () {
            $(document).off('.hc')
          }
        })
      })
      // 控制滑块旋转的功能
      // $('#sliders input').on('input change', function () {
      //   chart.options.chart.options3d[this.id] = this.value
      //   document.getElementById('alpha-value').innerHTML = chart.options.chart.options3d.alpha
      //   document.getElementById('beta-value').innerHTML = chart.options.chart.options3d.beta
      //   chart.redraw(false)
      // })
    },
    // 计算每一个工序的投入产出占比
    every_proportion (series) {
      console.log(series)
      var data = []
      var pass = 0
      for (let x = 0; x < series[1]['data'].length; x++) {
        pass = pass + series[1]['data'][x]['y']
      }
      for (let i = 0; i < series.length; i++) {
        var input = 0
        for (let k = 0; k < series[i]['data'].length; k++) {
          input = input + series[i]['data'][k]['pass']
        }
        var proportion = series[i]['name'] + ':' + (input * 100 / pass).toFixed(2) + '%'
        data.push(proportion)
      }
      this.everyProportionData = data
    },
    // 打开备注右侧窗
    open_drawer () {
      this.drawer = true
      this.cardData = []
    },
    // 点击日历事件
    chooseDay (dataTime) {
      let that = this
      that.$axios({
        url: '/display/product-statistic-query/calendar-event-record/',
        method: 'get',
        params: {
          date: dataTime['day'],
          type: that.type
        }
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== []) {
          for (let i = 0; i < res.length; i++) {
            res[i]['FilePath'] = 'http://172.20.3.12:8002' + res[i]['FilePath']
          }
          that.cardData = res
        } else {
          that.cardData = []
        }
      }).catch(function (err) {
        console.log(err)
        that.$message({
          type: 'error',
          message: '获取当天的事件数据失败！'
        })
      })
    },
    // 新增操作
    add_button () {
      this.addVisible = true
      if (localStorage.getItem('nickname') === null) {
        alert('用户未登录或登录已过期')
        localStorage.clear()
        this.$router.push({path: '/user/login/'})
        window.location.reload()
      } else {
        this.addform['User'] = localStorage.getItem('nickname')
      }
    },
    // 新增表单提交
    add_form_button () {
      console.log(this.addform)
      let that = this
      that.$confirm('此操作将新增数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let formData = new FormData()
        const myfile = document.getElementById('myfile').files[0]
        console.log(that.addform['CreataTime'])
        formData.append('create_time', that.addform['CreataTime'])
        formData.append('event', that.addform['Event'])
        formData.append('user', that.addform['User'])
        formData.append('type', that.type)
        if (myfile !== undefined) {
          // formData.append('FileExists', 'true')
          formData.append('image', myfile, myfile.name)
        } else {
          // formData.append('FileExists', 'false')
          formData.append('image', '')
        }
        that.$axios({
          url: '/display/product-statistic-query/calendar-event-record/',
          method: 'post',
          data: formData
        }).then(function (response) {
          console.log(response)
          that.$message({
            type: 'success',
            message: '新增备注数据成功！'
          })
          that.drawer = false
          that.addVisible = false
          that.get_card_data()
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
          } else {
            that.$message({
              type: 'error',
              message: '修改备注数据失败！'
            })
          }
        })
      })
    },
    // 修改操作
    handleEdit (index, row) {
      console.log(index, row)
      if (localStorage.getItem('nickname') === null) {
        alert('用户未登录或登录已过期')
        localStorage.clear()
        this.$router.push({path: '/user/login/'})
        window.location.reload()
      } else {
        if (localStorage.getItem('nickname') === row['User']) {
          this.postform = JSON.parse(JSON.stringify(row))
          this.postform['postUser'] = localStorage.getItem('nickname')
          this.postVisible = true
        } else {
          this.$message({
            type: 'error',
            message: '仅限记录人可修改！'
          })
        }
      }
    },
    // 修改表单提交
    post_form_button () {
      console.log(this.postform)
      let that = this
      that.$confirm('此操作将修改数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let formData = new FormData()
        formData.append('create_time', that.postform['CreateTime'])
        formData.append('event', that.postform['Event'])
        formData.append('user', that.postform['postUser'])
        formData.append('type', that.type)
        that.$axios({
          url: '/display/product-statistic-query/calendar-event-record/' + that.postform['Id'],
          method: 'put',
          data: formData
        }).then(function (response) {
          console.log(response)
          that.$message({
            type: 'success',
            message: '修改成功！'
          })
          that.drawer = false
          that.postVisible = false
          that.get_card_data()
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
          } else {
            that.$message({
              type: 'error',
              message: '修改备注数据失败！'
            })
          }
        })
      })
    },
    // 3d图图例事件
    getVisibleMode (series, serieName) {
      console.log(series, serieName)
      var allVisible = true
      var allHidden = true
      for (let i = 0; i < series.length; i++) {
        if (series[i].name === serieName) {
          continue
        }
        // &= 按位运算用法：a &= b 等价于 a = a & b (值为 0 / 1)
        allVisible &= series[i].visible
        allHidden &= (!series[i].visible)
      }
      if (allVisible && !allHidden) {
        console.log('1')
        return 'all-visible'
      }
      if (allHidden && !allVisible) {
        console.log('2')
        return 'all-hidden'
      }
      if (allHidden && allVisible) {
        console.log('3')
      }
      if (!allHidden && !allVisible) {
        console.log('4')
      }
      return 'other-cases'
    }
  },
  data () {
    return {
      drawer: false,
      cancel: null, // 存放取消的请求方法
      rotationA: 0,
      rotationB: 0,
      rotationC: 0,
      id1: 'high1',
      process_sort: ['TUN_10G', 'TUNING', 'TEST_10G_LOW', 'TESTING_LOW', 'TEST_10G_HIGH', 'TESTING_HIGH', 'TEST_10G', 'TESTING'],
      calendarAllData: [],
      chartdata: [],
      cardData: [],
      calendarData: [],
      options: [],
      postform: {},
      addform: {},
      everyProportionData: [],
      inputcolor: 'rgba(165,170,217,.5)',
      passcolor: 'rgba(165,170,217,1)',
      selectdata: '',
      type: 'module',
      selectdisabled: true,
      addVisible: false,
      postVisible: false,
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
      timevalue: [],
      option1: {}
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.container{
  background-color:rgb(84, 92, 100)!important
}
.ModuleInputOutputChart >>> .el-calendar-table .el-calendar-day {
  height: 50px;
}
.is-selected {
  color: #f35858;
}
</style>
