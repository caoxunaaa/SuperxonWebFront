<template>
  <div id="OsaWarning">
    <div style="float:left">
      <el-button @click="openDeploy" class="files" type="primary" style="padding: 12px 20px">修改告警门限</el-button>
      <el-dialog
        title="配置告警门限"
        :visible.sync="deployDialogVisible"
        width="1000px"
        append-to-body>
        <AlarmLimit></AlarmLimit>
      </el-dialog>
    </div>
    <div style="float: left" class="demo-input-suffix">
      <b>最小告警投入数：</b><el-input v-model="TotalNum" @change="post_total" style="width: 100px"></el-input>
      <el-checkbox v-model="checked">新增记录</el-checkbox>
      <el-button @click="open_drawer" type="primary" style="margin-left:16px">记录信息</el-button>
      <el-drawer
        title="记录"
        :visible.sync="drawer"
        size="60%">
          <el-calendar style="font-size:5px;height: 50%">
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
          <el-button class="files" type="primary" style="padding: 12px 20px" @click="get_addRecordDialog_button(true)">新增记录</el-button>
          <el-date-picker
            v-model="timeScope"
            type="daterange"
            style="float:left"
            @change="get_time_scope"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <download-excel
          style="float:left"
          :data = "allProcessedData"
          name = "osa段告警处理记录表.xls">
          <el-button class="files" type="primary" style="padding: 12px 20px">导出全部记录</el-button>
          </download-excel>
          <div style="width: 100%;height: 40%;border:1px solid black;overflow:auto">
            <el-table
            :data="cardData"
            style="width: 100%">
            <el-table-column
            label="Pn"
            prop="Pn"
            width="100">
            </el-table-column>
            <el-table-column
            label="工序"
            prop="Process"
            width="100">
            </el-table-column>
            <el-table-column
            label="备注人"
            prop="NoteUser"
            width="100">
            </el-table-column>
            <el-table-column
            label="备注时间"
            prop="CreateTime"
            width="100">
            </el-table-column>
            <el-table-column
            label="备注"
            prop="Note"
            :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column label="文件">
              <template slot-scope="scope">
                <el-link :href="scope.row['FilePath']" >{{scope.row['FilePath']}}</el-link>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="160">
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
          :visible.sync="addRecordDialogVisible"
          width="50%"
          append-to-body
          :close-on-click-modal='false'>
          <h3>新增记录信息</h3>
          <el-form ref="addform" :rules="addrules" :model="addform">
            <el-form-item label="PN">
              <el-input v-model="addform.Pn"></el-input>
            </el-form-item>
            <el-form-item label="工序">
              <el-input v-model="addform.Process"></el-input>
            </el-form-item>
            <el-form-item label="是否为工位告警">
              <el-radio v-model="addform.station" label="true">是</el-radio>
              <el-radio v-model="addform.station" label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="设备" v-if="addform.station === 'true'">
              <el-input v-model="addform.equipment"></el-input>
            </el-form-item>
            <el-form-item label="记录人">
              <el-input v-model="addform.User" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="时间" prop="Time">
              <el-date-picker type="date" placeholder="选择备注日期" v-model="addform.Time" style="width: 100%;" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item label="是否为详细备注">
              <el-radio v-model="addform.radio" label="true">是</el-radio>
              <el-radio v-model="addform.radio" label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="详细备注" v-if="addform.radio === 'true'">
              <el-input v-model="addform.Cause"><template slot="prepend">原因分析</template></el-input>
              <el-input v-model="addform.Temporary"><template slot="prepend">临时措施</template></el-input>
              <el-input v-model="addform.Prevent"><template slot="prepend">预防措施</template></el-input>
            </el-form-item>
            <el-form-item label="备注" v-if="addform.radio === 'false'">
              <el-input v-model="addform.Event"></el-input>
            </el-form-item>
            <el-form-item label="相关文件">
              <input type="file" id="myfile" accept=".zip, .rar">
            </el-form-item>
            <el-form-item>
              <el-button @click="submitForm('addform')" style="background-color: #409eff; color: #fff; height: 40px; width:120px">新增</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-dialog
        :visible.sync="postVisible"
        width="40%"
        append-to-body
        :close-on-click-modal='false'>
        <div>
          <h3>修改备注信息</h3>
          <el-form ref="postform" :rules="postrules" :model="postform">
            <el-form-item label="Id">
              <el-input v-model="postform.Id" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="PN">
              <el-input v-model="postform.Pn"></el-input>
            </el-form-item>
            <el-form-item label="工序">
              <el-input v-model="postform.Process"></el-input>
            </el-form-item>
            <el-form-item label="设备">
              <el-input v-model="postform.DeviceId"></el-input>
            </el-form-item>
            <el-form-item label="原始记录人">
              <el-input v-model="postform.NoteUser" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="修改记录人">
              <el-input v-model="postform.postUser" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="时间" prop="CreateTime">
              <el-date-picker type="date" placeholder="选择备注日期" v-model="postform.CreateTime" style="width: 100%;" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="postform.Note"></el-input>
            </el-form-item>
            <el-form-item label="相关文件">
              <input type="file" id="postmyfile" accept=".zip, .rar">
            </el-form-item>
            <el-form-item>
              <el-button @click="post_form_button('postform')" style="background-color: #409eff; color: #fff; height: 40px; width:120px">修改</el-button>
            </el-form-item>
          </el-form>
        </div>
        </el-dialog>
    </div>
    <div>
      <div style="width: 100%; height:50px;" id="content">
        <!-- <el-button class="files" type="primary" style="padding: 12px 20px" plain v-for="(item,index) in trueNameData" :key="index" @click="currentTab">{{item}}</el-button> -->
        <!-- <el-button class="files" type="primary" style="padding: 12px 20px" plain @click="get_zhoujie_warning">周杰</el-button>
        <el-button class="files" type="primary" style="padding: 12px 20px" plain @click="get_wangbingxue_warning">王滨学</el-button>
        <el-button class="files" type="primary" style="padding: 12px 20px" plain @click="get_zhangzhiling_warning">张志凌</el-button>
        <el-button class="files" type="primary" style="padding: 12px 20px" plain @click="get_yiyousong_warning">弋浏松</el-button> -->
      </div>
    <el-row :gutter="50" id="board">
      <!--module_pn告警看板-->
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <h3 style="background: white">OSA试生产产品 告警</h3>
          <el-table
          :data="testmodulePnData"
          max-height="400"
          @row-click="onlyRowChart"
          :row-class-name="testmodulePnTableRowClassName"
          style="width: 100%;font-size: 10px">
            <el-table-column
              prop="Pn"
              label="PN"
              width="140">
            </el-table-column>
            <el-table-column
              prop="Process"
              label="工序">
            </el-table-column>
            <el-table-column
              prop="TotalInput"
              label="总投入">
            </el-table-column>
            <el-table-column
              prop="FinalPass"
              label="最终良品">
            </el-table-column>
            <el-table-column
              prop="FinalBad"
              label="最终不良品">
            </el-table-column>
            <el-table-column
              prop="FinalPassRate"
              label="最终良率(%)">
            </el-table-column>
            <!-- <el-table-column
              prop="Truename"
              label="负责人">
            </el-table-column> -->
            <el-table-column
              prop="dispose"
              label="是否处理">
            </el-table-column>
          </el-table>
          <h3 style="background: white">OSA量产产品 告警</h3>
          <el-table
          :data="moremodulePnData"
          max-height="400"
          @row-click="onlyRowChart"
          :row-class-name="moremodulePnTableRowClassName"
          style="width: 100%;font-size: 10px">
            <el-table-column
              prop="Pn"
              label="PN"
              width="140">
            </el-table-column>
            <el-table-column
              prop="Process"
              label="工序">
            </el-table-column>
            <el-table-column
              prop="TotalInput"
              label="总投入">
            </el-table-column>
            <el-table-column
              prop="FinalPass"
              label="最终良品">
            </el-table-column>
            <el-table-column
              prop="FinalBad"
              label="最终不良品">
            </el-table-column>
            <el-table-column
              prop="FinalPassRate"
              label="最终良率(%)">
            </el-table-column>
            <!-- <el-table-column
              prop="Truename"
              label="负责人">
            </el-table-column> -->
            <el-table-column
              prop="dispose"
              label="是否处理">
            </el-table-column>
          </el-table>
          <h3 style="background: white">OSA改制产品 告警</h3>
          <el-table
          :data="returnmodulePnData"
          max-height="400"
          @row-click="onlyRowChart"
          :row-class-name="returnmodulePnTableRowClassName"
          style="width: 100%;font-size: 10px">
            <el-table-column
              prop="Pn"
              label="PN"
              width="140">
            </el-table-column>
            <el-table-column
              prop="Process"
              label="工序">
            </el-table-column>
            <el-table-column
              prop="TotalInput"
              label="总投入">
            </el-table-column>
            <el-table-column
              prop="FinalPass"
              label="最终良品">
            </el-table-column>
            <el-table-column
              prop="FinalBad"
              label="最终不良品">
            </el-table-column>
            <el-table-column
              prop="FinalPassRate"
              label="最终良率(%)">
            </el-table-column>
            <!-- <el-table-column
              prop="Truename"
              label="负责人">
            </el-table-column> -->
            <el-table-column
              prop="dispose"
              label="是否处理">
            </el-table-column>
          </el-table>
          <h3 style="background: white">OSA成品重工 告警</h3>
          <el-table
          :data="modulePnData"
          max-height="400"
          @row-click="onlyRowChart"
          :row-class-name="modulePnTableRowClassName"
          style="width: 100%;font-size: 10px">
            <el-table-column
              prop="Pn"
              label="PN"
              width="140">
            </el-table-column>
            <el-table-column
              prop="Process"
              label="工序">
            </el-table-column>
            <el-table-column
              prop="TotalInput"
              label="总投入">
            </el-table-column>
            <el-table-column
              prop="FinalPass"
              label="最终良品">
            </el-table-column>
            <el-table-column
              prop="FinalBad"
              label="最终不良品">
            </el-table-column>
            <el-table-column
              prop="FinalPassRate"
              label="最终良率(%)">
            </el-table-column>
            <!-- <el-table-column
              prop="Truename"
              label="负责人">
            </el-table-column> -->
            <el-table-column
              prop="dispose"
              label="是否处理">
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <!--module_station告警看板-->
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <h3 style="background: white">OSA试生产产品 工位告警</h3>
          <el-table
          :data="warningTestStationData"
          max-height="400"
          @row-click="onlyRowChart"
          :row-class-name="testStationTableRowClassName"
          style="width: 100%;font-size: 10px">
            <el-table-column
              prop="StationId"
              label="设备编号">
            </el-table-column>
            <!-- <el-table-column
              prop="state"
              label="状态"
              width="90">
            </el-table-column> -->
            <el-table-column
              prop="Pn"
              label="在制PN">
            </el-table-column>
            <el-table-column
              prop="LogAction"
              label="工序">
            </el-table-column>
            <el-table-column
              prop="TotalNum"
              label="投入总数">
            </el-table-column>
            <el-table-column
              prop="TotalPass"
              label="通过总数">
            </el-table-column>
            <el-table-column
              prop="PassRate"
              label="良率(%)">
            </el-table-column>
            <!-- <el-table-column
              prop="Truename"
              label="负责人">
            </el-table-column> -->
            <el-table-column
              prop="dispose"
              label="是否处理">
            </el-table-column>
          </el-table>
        </div>
        <div class="grid-content bg-purple">
          <h3 style="background: white">OSA量产产品 工位告警</h3>
          <el-table
          :data="warningMoreStationData"
          max-height="400"
          @row-click="onlyRowChart"
          :row-class-name="moreStationTableRowClassName"
          style="width: 100%;font-size: 10px">
            <el-table-column
              prop="StationId"
              label="设备编号">
            </el-table-column>
            <!-- <el-table-column
              prop="state"
              label="状态"
              width="90">
            </el-table-column> -->
            <el-table-column
              prop="Pn"
              label="在制PN">
            </el-table-column>
            <el-table-column
              prop="LogAction"
              label="工序">
            </el-table-column>
            <el-table-column
              prop="TotalNum"
              label="投入总数">
            </el-table-column>
            <el-table-column
              prop="TotalPass"
              label="通过总数">
            </el-table-column>
            <el-table-column
              prop="PassRate"
              label="良率(%)">
            </el-table-column>
            <!-- <el-table-column
              prop="Truename"
              label="负责人">
            </el-table-column> -->
            <el-table-column
              prop="dispose"
              label="是否处理">
            </el-table-column>
          </el-table>
        </div>
        <div class="grid-content bg-purple">
          <h3 style="background: white">OSA改制产品 工位告警</h3>
          <el-table
          :data="warningReturnStationData"
          max-height="400"
          @row-click="onlyRowChart"
          :row-class-name="moduleReturnStationTableRowClassName"
          style="width: 100%;font-size: 10px">
            <el-table-column
              prop="StationId"
              label="设备编号">
            </el-table-column>
            <!-- <el-table-column
              prop="state"
              label="状态"
              width="90">
            </el-table-column> -->
            <el-table-column
              prop="Pn"
              label="在制PN">
            </el-table-column>
            <el-table-column
              prop="LogAction"
              label="工序">
            </el-table-column>
            <el-table-column
              prop="TotalNum"
              label="投入总数">
            </el-table-column>
            <el-table-column
              prop="TotalPass"
              label="通过总数">
            </el-table-column>
            <el-table-column
              prop="PassRate"
              label="良率(%)">
            </el-table-column>
            <!-- <el-table-column
              prop="Truename"
              label="负责人">
            </el-table-column> -->
            <el-table-column
              prop="dispose"
              label="是否处理">
            </el-table-column>
          </el-table>
        </div>
        <div class="grid-content bg-purple">
          <h3 style="background: white">OSA成品重工 工位告警</h3>
          <el-table
          :data="warningNormalStationData"
          max-height="400"
          @row-click="onlyRowChart"
          :row-class-name="moduleNormalStationTableRowClassName"
          style="width: 100%;font-size: 10px">
            <el-table-column
              prop="StationId"
              label="设备编号">
            </el-table-column>
            <!-- <el-table-column
              prop="state"
              label="状态"
              width="90">
            </el-table-column> -->
            <el-table-column
              prop="Pn"
              label="在制PN">
            </el-table-column>
            <el-table-column
              prop="LogAction"
              label="工序">
            </el-table-column>
            <el-table-column
              prop="TotalNum"
              label="投入总数">
            </el-table-column>
            <el-table-column
              prop="TotalPass"
              label="通过总数">
            </el-table-column>
            <el-table-column
              prop="PassRate"
              label="良率(%)">
            </el-table-column>
            <!-- <el-table-column
              prop="Truename"
              label="负责人">
            </el-table-column> -->
            <el-table-column
              prop="dispose"
              label="是否处理">
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    </div>
  </div>
</template>

<script>
import AlarmLimit from '@/components/backstage/AlarmLimit.vue'
import VoiceAlarm from '@/components/backstage/VoiceAlarm.vue'
export default {
  name: 'OsaWarning',
  components: {
    AlarmLimit,
    VoiceAlarm
  },
  mounted () {
    this.get_doorsill()
    // this.getScreen()
    this.get_all_processed_data()
    this.get_correspond_data()
    // this.get_module_pn()
    // this.get_data()
    // this.handleSpeak('模块产线：SOGX6299-ISIGH-AL产品直通率异常，请周杰，李奕立即处理！')
  },
  watch: {
    deployDialogVisible: {
      handler (newVal, oldVal) {
        if (this.deployDialogVisible === true) {
          console.log('打开限制门限弹窗')
        } else if (this.deployDialogVisible === false) {
          console.log('更新页面数据')
          this.get_today_porcessed_data()
        }
      },
      deep: true
    }
  },
  methods: {
    // 获取时间范围内的记录
    get_time_scope () {
      let that = this
      console.log(that.timeScope)
      var start = this.moment(that.timeScope[0]).format('YYYY-MM-DD')
      var end = this.moment(that.timeScope[1]).format('YYYY-MM-DD')
      var data = []
      for (let i = 0; i < that.allProcessedData.length; i++) {
        if (that.allProcessedData[i]['CreateTime'] <= end && that.allProcessedData[i]['CreateTime'] >= start) {
          data.push(that.allProcessedData[i])
        }
      }
      console.log(data)
      that.allProcessedData = data
    },
    // 获取所有告警记录
    get_all_processed_data () {
      let that = this
      that.$axios({
        url: '/display/product-statistic-query/calendar-event-record-about-warning/all',
        method: 'get',
        params: {
          type: 'osa'
        }
      }).then(function (response) {
        console.log('所有告警记录:', response)
        const res = response.data
        if (res !== null) {
          that.allProcessedData = res
          var test = []
          for (let i = 0; i < res.length; i++) {
            test.push(res[i]['CreateTime'])
          }
          that.calendarData = Array.from(new Set(test))
        }
      }).catch(function (err) {
        console.log(err)
        that.$message({
          type: 'error',
          message: '获取所有告警记录失败！'
        })
      })
    },
    // 获取今日告警已处理记录
    get_today_porcessed_data () {
      let that = this
      that.$axios({
        url: '/display/product-statistic-query/calendar-event-record-about-warning/',
        method: 'get',
        params: {
          date: that.moment(new Date()).format('YYYY-MM-DD'),
          type: 'osa'
        }
      }).then(function (response) {
        console.log('今日已处理问题记录：', response)
        const res = response.data
        var data = []
        if (res !== null) {
          for (let i = 0; i < res.length; i++) {
            data.push(res[i]['DeviceId'] + res[i]['Pn'] + res[i]['Process'])
          }
        }
        that.get_data(data)
      }).catch(function (err) {
        console.log(err)
      })
    },
    // 记录信息按钮
    open_drawer () {
      this.drawer = true
      this.cardData = []
    },
    onlyRowChart (row, column, event) {
      if (this.checked === true) {
        console.log(row)
        this.addform['Pn'] = row.Pn
        if (row.StationId !== undefined) {
          this.addform['equipment'] = row.StationId
        }
        if (row.LogAction !== undefined) {
          this.addform['Process'] = row.LogAction
        } else {
          this.addform['Process'] = row.Process
        }
        this.get_addRecordDialog_button(false)
      }
    },
    // 点击日历事件
    chooseDay (dataTime) {
      let that = this
      that.$axios({
        url: '/display/product-statistic-query/calendar-event-record-about-warning/',
        method: 'get',
        params: {
          date: dataTime['day'],
          type: 'osa'
        }
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== []) {
          for (let i = 0; i < res.length; i++) {
            if (res[i]['FilePath'] !== '') {
              res[i]['FilePath'] = 'http://172.20.3.12:8002' + res[i]['FilePath']
            }
            if (res[i]['IsDetail'] === 0) {
              res[i]['IsDetail'] = '否'
            } else {
              res[i]['IsDetail'] = '是'
            }
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
    // 新增记录按钮
    get_addRecordDialog_button (abs) {
      if (abs === true) {
        this.clear_addform()
      }
      if (localStorage.getItem('nickname') === null) {
        alert('用户未登录或登录已过期')
        localStorage.clear()
        this.$router.push({path: '/user/login/'})
        window.location.reload()
      } else {
        this.addRecordDialogVisible = true
        this.addform['User'] = localStorage.getItem('nickname')
      }
    },
    // 新增表单提交
    submitForm (formName) {
      var submit = false
      if (this.addform['radio'] === 'true') {
        if (this.addform['Cause'] === '' && this.addform['Temporary'] === '' && this.addform['Prevent'] === '') {
          this.$message({
            type: 'error',
            message: '未填写备注！无法提交'
          })
        } else {
          submit = true
        }
      } else {
        if (this.addform['Event'] === '') {
          this.$message({
            type: 'error',
            message: '未填写备注！无法提交'
          })
        } else {
          submit = true
        }
      }
      if (submit === true) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.addform)
            console.log(document.getElementById('myfile'))
            let that = this
            that.$confirm('此操作将新增数据, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let formData = new FormData()
              const myfile = document.getElementById('myfile').files[0]
              formData.append('type', that.addform['type'])
              formData.append('pn', that.addform['Pn'])
              formData.append('process', that.addform['Process'])
              if (that.addform['station'] === 'true') {
                formData.append('device_id', that.addform['equipment'])
              } else {
                formData.append('device_id', '')
              }
              var text = ''
              if (that.addform['radio'] === 'true') {
                formData.append('is_detail', 1)
                text = '原因分析:' + that.addform['Cause'] + '。临时措施:' + that.addform['Temporary'] + '。预防措施:' + that.addform['Prevent']
                formData.append('note', text)
              } else {
                formData.append('is_detail', 0)
                formData.append('note', that.addform['Event'])
              }
              formData.append('note_user', that.addform['User'])
              formData.append('create_time', that.addform['Time'])
              if (myfile !== undefined) {
                formData.append('file', myfile, myfile.name)
              } else {
                formData.append('file', '')
              }
              that.$axios({
                url: '/display/product-statistic-query/calendar-event-record-about-warning/',
                method: 'post',
                data: formData
              }).then(function (response) {
                console.log(response)
                that.$message({
                  type: 'success',
                  message: '新增成功！'
                })
                that.addRecordDialogVisible = false
                that.clear_addform()
                that.get_today_porcessed_data()
                that.get_all_processed_data()
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
          } else {
            return false
          }
        })
      }
    },
    // 清空新增表单
    clear_addform () {
      this.addform = {
        type: 'osa',
        Pn: '',
        Process: '',
        station: 'true',
        equipment: '',
        User: '',
        Time: '',
        radio: 'true',
        Event: '',
        Cause: '',
        Temporary: '',
        Prevent: ''
      }
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
        if (localStorage.getItem('nickname') === row['NoteUser']) {
          this.postform = JSON.parse(JSON.stringify(row))
          this.postform['postUser'] = localStorage.getItem('nickname')
          console.log(this.postform)
          this.postVisible = true
        } else {
          this.$message({
            type: 'error',
            message: '仅限记录人可修改！'
          })
        }
      }
    },
    // 删除操作
    handleDelete (index, row) {
      let that = this
      that.$confirm('此操作将删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (localStorage.getItem('nickname') === null) {
          alert('用户未登录或登录已过期')
          localStorage.clear()
          that.$router.push({path: '/user/login/'})
          window.location.reload()
        } else {
          if (localStorage.getItem('nickname') === row['NoteUser']) {
            that.$axios({
              url: '/display/product-statistic-query/calendar-event-record-about-warning/' + row['Id'],
              method: 'delete'
            }).then(function (response) {
              console.log(response)
              if (response.status === 200) {
                that.$message({
                  type: 'success',
                  message: '删除成功！'
                })
                that.get_all_processed_data()
                that.drawer = false
              } else {
                that.$message({
                  type: 'error',
                  message: '删除失败！'
                })
              }
            }).catch(function (err) {
              console.log(err)
              if (err.response.status === 504) {
                that.$message({
                  type: 'error',
                  message: '服务器未响应！'
                })
              } else if (err.response.status === 403) {
                that.$message({
                  type: 'error',
                  message: '权限不够！'
                })
              } else {
                that.$message({
                  type: 'error',
                  message: '获取数据失败！'
                })
              }
            })
          }
        }
      })
    },
    // 修改表单提交
    post_form_button (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.postform)
          let that = this
          that.$confirm('此操作将修改数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let formData = new FormData()
            const myfile = document.getElementById('postmyfile').files[0]
            formData.append('type', that.postform['Type'])
            formData.append('pn', that.postform['Pn'])
            formData.append('process', that.postform['Process'])
            formData.append('device_id', that.postform['DeviceId'])
            formData.append('is_detail', 1)
            formData.append('note', that.postform['Note'])
            formData.append('note_user', that.postform['postUser'])
            formData.append('create_time', that.postform['CreateTime'])
            if (myfile !== undefined) {
              formData.append('file', myfile, myfile.name)
            } else {
              formData.append('file', '')
            }
            that.$axios({
              url: '/display/product-statistic-query/calendar-event-record-about-warning/' + that.postform['Id'],
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
              that.get_all_processed_data()
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
        } else {
          return false
        }
      })
    },
    // 修改最小投入数后重新获取数据
    post_total () {
      this.get_doorsill()
      // this.getScreen()
      this.get_correspond_data()
      // this.get_module_pn()
      this.get_today_porcessed_data()
    },
    // 打开弹窗配置门限表
    openDeploy () {
      this.deployDialogVisible = true
    },
    openDeployVoice () {
      this.VoicedeployDialogVisible = true
    },
    // 获取告警门限对应表
    get_doorsill () {
      let that = this
      that.$axios({
        method: 'get',
        url: '/display/warning-related/settings-warning-threshold'
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null) {
          for (let i = 0; i < res.length; i++) {
            if (res[i]['Pn'] === 'MODULE' && res[i]['OrderType'] === '正常品') {
              that.doorsillR = res[i]['RedLine']
              that.doorsillY = res[i]['YellowLine']
            }
          }
          that.doorsillData = res
        }
      })
    },
    // 确认告警消息
    currentTab (item) {
      // console.log(item)
      console.log(item.path[0].innerText)
      // console.log(typeof ((item.path[0].innerText)))
      // console.log(this.moduleStationData)
      console.log(this.keepData)
      // 获取过期时间
      var data = new Date()
      var min = data.getMinutes()
      data.setMinutes(min + 40)
      if (this.keepData.length === 0) {
        this.keepData = JSON.parse(JSON.stringify(this.moduleBoardStationWarningData))
        for (let i = 0; i < this.keepData.length; i++) {
          this.keepData[i]['time'] = this.moment(data).format('YYYY-MM-DD HH:mm:ss')
        }
      } else {
        var otherData = []
        for (let n = 0; n < this.keepData.length; n++) {
          if (this.keepData[n]['Truename'] !== item.path[0].innerText) {
            otherData.push(this.keepData[n])
          }
        }
        this.keepData = otherData
        for (let j = 0; j < this.moduleBoardStationWarningData.length; j++) {
          if (this.moduleBoardStationWarningData[j]['Truename'] === item.path[0].innerText) {
            this.keepData.push(this.moduleBoardStationWarningData[j])
          }
        }
        for (let m = 0; m < this.keepData.length; m++) {
          if (this.keepData[m]['Truename'] === item.path[0].innerText) {
            this.keepData[m]['time'] = this.moment(data).format('YYYY-MM-DD HH:mm:ss')
          }
        }
      }
      console.log(this.keepData)
      this.$message({
        type: 'success',
        message: item.path[0].innerText + '， 已确认收到告警信息！'
      })
      this.handleSpeak()
      // if (this.keepData.length >= 0) {
      //   console.log('这里')
      //   console.log(this.keepData.length)
      //   var copykeepdata = []
      //   for (let r = 0; r < this.keepData.length; r++) {
      //     if (this.keepData[r]['Truename'] !== item.path[0].innerText) {
      //       console.log(this.keepData[r]['Truename'])
      //       copykeepdata.push(this.keepData[r])
      //     }
      //   }
      //   console.log(copykeepdata)
      //   this.keepData = copykeepdata
      //   console.log(this.keepData)
      //   for (let m = 0; m < this.moduleStationDataR.length; m++) {
      //     if (this.moduleBoardStationWarningData[m]['Truename'] === item.path[0].innerText) {
      //       // 获取过期时间
      //       var data = new Date()
      //       var min = data.getMinutes()
      //       data.setMinutes(min + 40)
      //       // console.log(this.moment(data).format('YYYY-MM-DD HH:mm:ss'))
      //       this.keepData.push({'time': this.moment(data).format('YYYY-MM-DD HH:mm:ss'), 'Pn': this.moduleBoardStationWarningData[m]['Pn'], 'Truename': this.moduleBoardStationWarningData[m]['Truename'], 'StationId': this.moduleBoardStationWarningData[m]['StationId'], 'LogAction': this.moduleBoardStationWarningData[m]['LogAction']})
      //       // console.log(this.keepData)
      //     }
      //   }
      //   console.log(this.moduleStationData)
      //   this.$message({
      //     type: 'success',
      //     message: item.path[0].innerText + '， 已确认收到告警信息！'
      //   })
      //   this.handleSpeak()
      // }
    },
    // 语音播报
    handleSpeak () {
      var data = JSON.parse(JSON.stringify(this.moduleBoardStationWarningData))
      // clearInterval(this.timer3)
      console.log(data)
      console.log(this.moduleStationData)
      console.log(this.moduleStationDataR)
      if (data.length !== 0 && data !== [] && data !== null) {
        const synth = window.speechSynthesis
        const msg = new SpeechSynthesisUtterance()
        synth.cancel(msg)
        this.textData = []
        this.text = ''
        var time = new Date()
        if (this.keepData.length > 0) {
          for (let q = 0; q < data.length; q++) {
            for (let w = 0; w < this.keepData.length; w++) {
              if (data[q]['Pn'] === this.keepData[w]['Pn'] && data[q]['StationId'] === this.keepData[w]['StationId'] && data[q]['LogAction'] === this.keepData[w]['LogAction'] && data[q]['Truename'] === this.keepData[w]['Truename']) {
                if (this.moment(time).format('YYYY-MM-DD HH:mm:ss') <= this.keepData[w]['time']) {
                  console.log(this.keepData[w], '没有超出过期时间')
                  data.splice(q, 1)
                } else {
                  // console.log(this.keepData[w], '超出')
                }
              }
            }
          }
        } else {
          console.log('未点击按钮')
        }
        console.log(data)
        console.log(this.keepData)
        for (let m = 0; m < data.length; m++) {
          this.textData.push('模块产线：' + String(data[m]['StationId']) + '台位产品良率异常，请' + data[m]['Truename'] + '立即处理！')
        }
        for (let j = 0; j < this.textData.length; j++) {
          this.text = this.text + this.textData[j]
        }
        console.log(this.text)
        msg.text = this.text// 文字内容
        msg.lang = 'zh-CN'//  使用的语言:中文
        msg.volume = 1 //  声音音量：1
        msg.rate = 1 //  语速：1
        msg.pitch = 1 //  音高：1
        synth.speak(msg)
      } else {
        console.log('暂无语音告警内容')
      }
      // if (this.moduleStationData.length !== 0 && this.moduleStationData !== null) {
      //   const synth = window.speechSynthesis
      //   const msg = new SpeechSynthesisUtterance()
      //   synth.cancel(msg)
      //   // console.log(this.moduleStationData)
      //   // console.log(this.keepData)
      //   this.textData = []
      //   this.text = ''
      //   var time = new Date()
      //   if (this.keepData.length > 0) {
      //     for (let q = 0; q < this.moduleStationData.length; q++) {
      //       for (let w = 0; w < this.keepData.length; w++) {
      //         if (this.moduleStationData[q]['Pn'] === this.keepData[w]['Pn'] && this.moduleStationData[q]['StationId'] === this.keepData[w]['StationId'] && this.moduleStationData[q]['LogAction'] === this.keepData[w]['LogAction'] && this.moduleStationData[q]['Truename'] === this.keepData[w]['Truename']) {
      //           if (this.moment(time).format('YYYY-MM-DD HH:mm:ss') <= this.keepData[w]['time']) {
      //             console.log(this.keepData[w], '没有超出过期时间')
      //             this.moduleStationData.splice(q, 1)
      //           } else {
      //             // console.log(this.keepData[w], '超出')
      //           }
      //         }
      //       }
      //     }
      //   } else {
      //     console.log('未点击按钮')
      //   }
      //   console.log(this.moduleStationData)
      //   console.log(this.moduleStationDataR)
      //   for (let i = 0; i < this.moduleStationDataR.length; i++) {
      //     for (let jh = 0; jh < this.moduleStationData.length; jh++) {
      //       if (this.moduleStationDataR[i]['Pn'] === this.moduleStationData[jh]['Pn'] && this.moduleStationDataR[i]['LogAction'] === this.moduleStationData[jh]['LogAction'] && this.moduleStationData[jh]['StationId'] === this.moduleStationDataR[i]['StationId']) {
      //         console.log(this.moduleStationData[jh]['Truename'])
      //         this.textData.push('模块产线：' + String(this.moduleStationData[jh]['StationId']) + '台位产品良率异常，请' + this.moduleStationData[jh]['Truename'] + '立即处理！')
      //       }
      //     }
      //   }
      //   // for (let i = 0; i < this.rowDataR.length; i++) {
      //   //   for (let p = 0; p < this.correspondName.length; p++) {
      //   //     if (this.warningStationData[i]['Truename'] === this.correspondName[p]) {
      //   //       this.textData.push('模块产线：' + String(this.warningStationData[i]['StationId']) + '台位产品良率异常，请' + this.correspondName[p] + '立即处理！')
      //   //     }
      //   //   }
      //   // }
      //   // const text = '模块产线：' + this.warningStationData[0]['StationId'] + '台位产品良率异常，请周杰，李奕立即处理！'
      //   console.log(this.textData)
      //   for (let j = 0; j < this.textData.length; j++) {
      //     this.text = this.text + this.textData[j]
      //   }
      //   console.log(this.text)
      //   this.numbertime = parseInt(50 / (this.textData.length * 7))
      //   console.log(this.numbertime)
      //   msg.text = this.text// 文字内容
      //   msg.lang = 'zh-CN'//  使用的语言:中文
      //   msg.volume = 1 //  声音音量：1
      //   msg.rate = 1 //  语速：1
      //   msg.pitch = 1 //  音高：1
      //   // synth.speak(msg)
      //   this.timer3 = setInterval(() => {
      //     synth.speak(msg)
      //     console.log('+1', msg)
      //   }, 7000)
      //   // setTimeout(() => {
      //   //   clearInterval(this.timer3)
      //   //   console.log('shijiandaole')
      //   // }, 90 * 1000)
      // }
    },
    // 获取对应文件
    get_correspond_data () {
      let that = this
      that.$axios({
        method: 'get',
        url: '/display/warning-related/person-in-charge-warning-info'
      }).then(function (response) {
        const res = response.data
        console.log(response)
        if (res !== null) {
          that.correspondData = res
          // console.log(that.correspondData)
          for (let i = 0; i < that.correspondData.length; i++) {
            if (that.correspondData[i]['ModuleOsa'] === 'osa') {
              console.log('osa')
              that.correspondName.push(that.correspondData[i]['Nickname'])
            }
          }
          // console.log(that.correspondName)
          that.trueNameData = [...new Set(that.correspondName)]
          that.setTimer()
          that.get_today_porcessed_data()
          // that.get_module_pn()
          // that.get_module_station()
        }
      })
    },
    // 修改osa段试生产品的颜色
    testmodulePnTableRowClassName ({row, rowIndex}) {
      if (rowIndex < this.testpnDataR.length) {
        // console.log('1')
        return 'osawarningthree-row'
      } else if (rowIndex >= this.testpnDataR.length && rowIndex < (this.testpnDataR.length + this.testpnDataY.length)) {
        // console.log('2')
        return 'success-row'
      } else {
        // console.log('3')
        return 'osawarningone-row'
      }
    },
    // 修改osa段量产产品的颜色
    moremodulePnTableRowClassName ({row, rowIndex}) {
      if (rowIndex < this.morepnDataR.length) {
        // console.log('1')
        return 'osawarningthree-row'
      } else if (rowIndex >= this.morepnDataR.length && rowIndex < (this.morepnDataR.length + this.morepnDataY.length)) {
        // console.log('2')
        return 'success-row'
      } else {
        // console.log('3')
        return 'osawarningone-row'
      }
    },
    // 修改osa段正常品的颜色
    modulePnTableRowClassName ({row, rowIndex}) {
      if (rowIndex < this.pnDataR.length) {
        // console.log('1')
        return 'osawarningthree-row'
      } else if (rowIndex >= this.pnDataR.length && rowIndex < (this.pnDataR.length + this.pnDataY.length)) {
        // console.log('2')
        return 'success-row'
      } else {
        // console.log('3')
        return 'osawarningone-row'
      }
    },
    // 修改osa段改制返工品的颜色
    returnmodulePnTableRowClassName ({row, rowIndex}) {
      if (rowIndex < this.returnpnDataR.length) {
        // console.log('1')
        return 'osawarningthree-row'
      } else if (rowIndex >= this.returnpnDataR.length && rowIndex < (this.returnpnDataR.length + this.returnpnDataY.length)) {
        // console.log('2')
        return 'success-row'
      } else {
        // console.log('3')
        return 'osawarningone-row'
      }
    },
    // 工位
    testStationTableRowClassName ({row, rowIndex}) {
      if (rowIndex < this.testStationDataR.length) {
        // console.log('1')
        return 'osawarningthree-row'
      } else if (rowIndex >= this.testStationDataR.length && rowIndex < (this.testStationDataR.length + this.testStationDataY.length)) {
        // console.log('2')
        return 'success-row'
      } else {
        // console.log('3')
        return 'osawarningone-row'
      }
    },
    moreStationTableRowClassName ({row, rowIndex}) {
      if (rowIndex < this.moreStationDataR.length) {
        // console.log('1')
        return 'osawarningthree-row'
      } else if (rowIndex >= this.moreStationDataR.length && rowIndex < (this.moreStationDataR.length + this.moreStationDataY.length)) {
        // console.log('2')
        return 'success-row'
      } else {
        // console.log('3')
        return 'osawarningone-row'
      }
    },
    // 修改osa段返工品工位告警的颜色
    moduleReturnStationTableRowClassName ({row, rowIndex}) {
      if (rowIndex < this.returnStationDataR.length) {
        return 'osawarningthree-row'
      } else if (rowIndex >= this.returnStationDataR.length && rowIndex < (this.returnStationDataR.length + this.returnStationDataY.length)) {
        return 'success-row'
      } else {
        return 'osawarningone-row'
      }
    },
    // 修改osa段正常品工位告警的颜色
    moduleNormalStationTableRowClassName ({row, rowIndex}) {
      if (rowIndex < this.normalStationDataR.length) {
        return 'osawarningthree-row'
      } else if (rowIndex >= this.normalStationDataR.length && rowIndex < (this.normalStationDataR.length + this.normalStationDataY.length)) {
        return 'success-row'
      } else {
        return 'osawarningone-row'
      }
    },
    // 加载页面时获取当前屏幕的尺寸
    getScreen () {
      let that = this
      window.onresize = () => {
        window.screenWidth = document.body.clientWidth
        that.screenWidth = window.screenWidth
        // console.log(that.screenWidth)
      }
      // console.log(that.screenWidth)
      // console.log(typeof (that.screenWidth))
      if (that.screenWidth < 600) {
        that.isPc = false
        that.bigPc = false
      } else if (that.screenWidth > 3000) {
        that.isPc = false
        that.bigPc = true
        console.log('大屏幕')
      }
    },
    // 开启定时器
    setTimer: function () {
      console.log('开起了定时器')
      this.timer = setInterval(() => {
        this.get_today_porcessed_data()
      }, 1000 * 60 * 20)
      this.timer2 = setInterval(() => {
        // 获取面板上工位告警数据
        this.get_board_station_warning_data()
      }, 1000 * 60 * 2)
    },
    // 获取面板上工位告警数据
    get_board_station_warning_data () {
      var Normal = JSON.parse(JSON.stringify(this.normalStationDataR))
      var Return = JSON.parse(JSON.stringify(this.returnStationDataR))
      var More = JSON.parse(JSON.stringify(this.moreStationDataR))
      var Test = JSON.parse(JSON.stringify(this.testStationDataR))
      this.moduleBoardStationWarningData = Normal.concat(Return.concat(More.concat(Test)))
      console.log(this.moduleBoardStationWarningData)
      this.handleSpeak()
    },
    // 判定告警是否处理
    determine_whether_to_process (test, data) {
      var whether = 0
      console.log(test, data)
      for (let i = 0; i < data.length; i++) {
        if (data[i] === test) {
          whether = 1
        }
      }
      if (whether === 1) {
        return true
      } else {
        return false
      }
    },
    // 获取OSA成品重工告警信息
    get_osa_normal_pn (data) {
      let that = this
      const start = this.moment(new Date(new Date().setHours(8, 0, 0, 0))).format('YYYY-MM-DD HH:mm:ss')
      const end = this.moment(new Date(new Date().setHours(8, 0, 0, 0) + 24 * 60 * 60 * 1000)).format('YYYY-MM-DD HH:mm:ss')
      that.$axios({
        method: 'get',
        url: '/display/product-operation-info/osa/warning-view/warning-info-in-time-period-by-work-order-type',
        params: {
          startTime: start,
          endTime: end,
          workOrderType: 'OSA成品重工工单'
        }
      }).then(function (response) {
        // console.log(response)
        const res = response.data
        console.log('OSA成品重工工单', response)
        if (res !== null) {
          that.PnListNormal = []
          that.modulePnData = []
          that.tablePn = []
          that.pnDataR = []
          that.pnDataY = []
          that.pnDataG = []
          that.tablePnData = []
          for (let i = 0; i < res.length; i++) {
            const num = Number(res[i]['FinalPassRate'])
            const sum = res[i]['TotalInput']
            if (num !== 100 && sum >= that.TotalNum) {
              that.tablePn.push(res[i])
            }
          }
          for (let j = 0; j < that.tablePn.length; j++) {
            const num = Number(that.tablePn[j]['FinalPassRate'])
            const mun = Number(that.tablePn[j]['RedLine'])
            const sum = Number(that.tablePn[j]['YellowLine'])
            if (num < mun) {
              that.pnDataR.push(that.tablePn[j])
            } else if (num >= mun && num < sum) {
              that.pnDataY.push(that.tablePn[j])
            } else if (num >= sum) {
              that.pnDataG.push(that.tablePn[j])
            }
          }
          // console.log(that.pnDataR)
          // console.log(that.pnDataY)
          // console.log(that.pnDataG)
          if (that.pnDataR.length > 1) {
            for (let r = 0; r < that.pnDataR.length; r++) {
              for (let rr = 0; rr < that.pnDataR.length - 1; rr++) {
                const bm = Number(that.pnDataR[rr]['FinalPassRate'])
                const am = Number(that.pnDataR[rr + 1]['FinalPassRate'])
                if (bm > am) {
                  const vm = that.pnDataR[rr]
                  that.pnDataR[rr] = that.pnDataR[rr + 1]
                  that.pnDataR[rr + 1] = vm
                }
              }
            }
          }
          if (that.pnDataY.length > 1) {
            for (let r = 0; r < that.pnDataY.length; r++) {
              for (let rr = 0; rr < that.pnDataY.length - 1; rr++) {
                const bm = Number(that.pnDataY[rr]['FinalPassRate'])
                const am = Number(that.pnDataY[rr + 1]['FinalPassRate'])
                if (bm > am) {
                  const vm = that.pnDataY[rr]
                  that.pnDataY[rr] = that.pnDataY[rr + 1]
                  that.pnDataY[rr + 1] = vm
                }
              }
            }
          }
          if (that.pnDataG.length > 1) {
            for (let r = 0; r < that.pnDataG.length; r++) {
              for (let rr = 0; rr < that.pnDataG.length - 1; rr++) {
                const bm = Number(that.pnDataG[rr]['FinalPassRate'])
                const am = Number(that.pnDataG[rr + 1]['FinalPassRate'])
                if (bm > am) {
                  const vm = that.pnDataG[rr]
                  that.pnDataG[rr] = that.pnDataG[rr + 1]
                  that.pnDataG[rr + 1] = vm
                }
              }
            }
          }
          // console.log(that.pnDataR)
          // console.log(that.pnDataY)
          // console.log(that.pnDataG)
          that.tablePnData.push.apply(that.tablePnData, that.pnDataR)
          that.tablePnData.push.apply(that.tablePnData, that.pnDataY)
          that.tablePnData.push.apply(that.tablePnData, that.pnDataG)
          // console.log(that.trueNameData)
          // console.log(that.correspondData)
          for (let t = 0; t < that.tablePnData.length; t++) {
            for (let q = 0; q < that.correspondData.length; q++) {
              if (that.tablePnData[t]['Pn'].slice(0, 8) === that.correspondData[q]['Pn']) {
                that.$set(that.tablePnData[t], 'Truename', that.correspondData[q]['Nickname'])
              }
            }
          }
          for (let i = 0; i < that.tablePnData.length; i++) {
            var test = that.tablePnData[i]['Pn'] + that.tablePnData[i]['Process']
            if (that.determine_whether_to_process(test, data) === true) {
              that.tablePnData[i]['dispose'] = '已处理'
            } else {
              that.tablePnData[i]['dispose'] = ''
            }
          }
          that.modulePnData = that.tablePnData
        } else {
          that.modulePnData = []
        }
      }).catch(function (err) {
        if (err.response.status === 504) {
          that.$message({
            type: 'error',
            message: '服务器未响应！'
          })
        } else if (err.response.status === 404) {
          that.$message({
            type: 'error',
            message: '未找到数据！'
          })
        } else if (err.response.status === 403) {
          that.$message({
            type: 'error',
            message: '权限不够！'
          })
        }
      })
    },
    // 获取OSA改制产品告警信息
    get_osa_return_pn (data) {
      let that = this
      const start = this.moment(new Date(new Date().setHours(8, 0, 0, 0))).format('YYYY-MM-DD HH:mm:ss')
      const end = this.moment(new Date(new Date().setHours(8, 0, 0, 0) + 24 * 60 * 60 * 1000)).format('YYYY-MM-DD HH:mm:ss')
      const work = 'OSA改制产品工单'
      that.$axios({
        method: 'get',
        url: '/display/product-operation-info/osa/warning-view/warning-info-in-time-period-by-work-order-type',
        params: {
          startTime: start,
          endTime: end,
          workOrderType: work
        }
      }).then(function (response) {
        // console.log(response)
        const res = response.data
        console.log('OSA改制产品工单', response)
        if (res !== null && res.length > 0) {
          that.PnList = []
          that.returnmodulePnData = []
          that.returntablePn = []
          that.returnpnDataR = []
          that.returnpnDataY = []
          that.returnpnDataG = []
          that.returntablePnData = []
          for (let i = 0; i < res.length; i++) {
            const num = Number(res[i]['FinalPassRate'])
            const sum = res[i]['TotalInput']
            if (num !== 100 && sum >= that.TotalNum) {
              that.returntablePn.push(res[i])
            }
          }
          // console.log(that.returntablePn)
          // console.log(typeof (Number(that.returntablePn[0]['FinalPassRate'].replace('%', ''))))
          for (let j = 0; j < that.returntablePn.length; j++) {
            const num = Number(that.returntablePn[j]['FinalPassRate'])
            const mun = Number(that.returntablePn[j]['RedLine'])
            const sum = Number(that.returntablePn[j]['YellowLine'])
            if (num < mun) {
              that.returnpnDataR.push(that.returntablePn[j])
            } else if (num >= mun && num < sum) {
              that.returnpnDataY.push(that.returntablePn[j])
            } else if (num >= sum) {
              that.returnpnDataG.push(that.returntablePn[j])
            }
          }
          // console.log(that.returnpnDataR)
          // console.log(that.returnpnDataY)
          // console.log(that.returnpnDataG)
          if (that.returnpnDataR.length > 1) {
            for (let r = 0; r < that.returnpnDataR.length; r++) {
              for (let rr = 0; rr < that.returnpnDataR.length - 1; rr++) {
                const bm = Number(that.returnpnDataR[rr]['FinalPassRate'])
                const am = Number(that.returnpnDataR[rr + 1]['FinalPassRate'])
                if (bm > am) {
                  const vm = that.returnpnDataR[rr]
                  that.returnpnDataR[rr] = that.returnpnDataR[rr + 1]
                  that.returnpnDataR[rr + 1] = vm
                }
              }
            }
          }
          if (that.returnpnDataY.length > 1) {
            for (let r = 0; r < that.returnpnDataY.length; r++) {
              for (let rr = 0; rr < that.returnpnDataY.length - 1; rr++) {
                const bm = Number(that.returnpnDataY[rr]['FinalPassRate'])
                const am = Number(that.returnpnDataY[rr + 1]['FinalPassRate'])
                if (bm > am) {
                  const vm = that.returnpnDataY[rr]
                  that.returnpnDataY[rr] = that.returnpnDataY[rr + 1]
                  that.returnpnDataY[rr + 1] = vm
                }
              }
            }
          }
          if (that.returnpnDataG.length > 1) {
            for (let r = 0; r < that.returnpnDataG.length; r++) {
              for (let rr = 0; rr < that.returnpnDataG.length - 1; rr++) {
                const bm = Number(that.returnpnDataG[rr]['FinalPassRate'])
                const am = Number(that.returnpnDataG[rr + 1]['FinalPassRate'])
                if (bm > am) {
                  const vm = that.returnpnDataG[rr]
                  that.returnpnDataG[rr] = that.returnpnDataG[rr + 1]
                  that.returnpnDataG[rr + 1] = vm
                }
              }
            }
          }
          // console.log(that.returnpnDataR)
          // console.log(that.returnpnDataY)
          // console.log(that.returnpnDataG)
          that.returntablePnData.push.apply(that.returntablePnData, that.returnpnDataR)
          that.returntablePnData.push.apply(that.returntablePnData, that.returnpnDataY)
          that.returntablePnData.push.apply(that.returntablePnData, that.returnpnDataG)
          // console.log(that.returntablePnData)
          // console.log(that.correspondData)
          // console.log(that.trueNameData)
          for (let t = 0; t < that.returntablePnData.length; t++) {
            for (let q = 0; q < that.correspondData.length; q++) {
              if (that.returntablePnData[t]['Pn'].slice(0, 8) === that.correspondData[q]['Pn']) {
                that.$set(that.returntablePnData[t], 'Truename', that.correspondData[q]['Nickname'])
              }
            }
          }
          // for (let q = 0; q < that.correspondData.length; q++) {
          //   const Nickname = that.correspondData[q]['Nickname']
          //   const PnList = that.correspondData[q]['PnList'].split(',')
          //   that.PnList.push({Nickname, PnList})
          // }
          // console.log(that.PnList)
          // for (let t = 0; t < that.returntablePnData.length; t++) {
          //   for (let y = 0; y < that.trueNameData.length; y++) {
          //     for (let u = 0; u < that.PnList.length; u++) {
          //       for (let p = 0; p < that.PnList[u]['PnList'].length; p++) {
          //         if (that.returntablePnData[t]['Pn'].slice(0, 8) === that.PnList[u]['PnList'][p]) {
          //           that.$set(that.returntablePnData[t], 'Truename', that.PnList[u]['Nickname'])
          //         }
          //       }
          //     }
          //   }
          // }
          for (let i = 0; i < that.returntablePnData.length; i++) {
            var test = that.returntablePnData[i]['Pn'] + that.returntablePnData[i]['Process']
            if (that.determine_whether_to_process(test, data) === true) {
              that.returntablePnData[i]['dispose'] = '已处理'
            } else {
              that.returntablePnData[i]['dispose'] = ''
            }
          }
          that.returnmodulePnData = that.returntablePnData
          // that.warningPnData = JSON.parse(JSON.stringify(that.tablePn))
          // console.log(that.moremodulePnData)
        } else {
          that.returnmodulePnData = []
        }
      }).catch(function (err) {
        if (err.response.status === 504) {
          that.$message({
            type: 'error',
            message: '服务器未响应！'
          })
        } else if (err.response.status === 404) {
          that.$message({
            type: 'error',
            message: '未找到数据！'
          })
        } else if (err.response.status === 403) {
          that.$message({
            type: 'error',
            message: '权限不够！'
          })
        }
      })
    },
    // 获取OSA量产产品告警信息
    get_osa_more_pn (data) {
      let that = this
      const start = this.moment(new Date(new Date().setHours(8, 0, 0, 0))).format('YYYY-MM-DD HH:mm:ss')
      const end = this.moment(new Date(new Date().setHours(8, 0, 0, 0) + 24 * 60 * 60 * 1000)).format('YYYY-MM-DD HH:mm:ss')
      const work = 'OSA量产产品工单'
      that.$axios({
        method: 'get',
        url: '/display/product-operation-info/osa/warning-view/warning-info-in-time-period-by-work-order-type',
        params: {
          startTime: start,
          endTime: end,
          workOrderType: work
        }
      }).then(function (response) {
        // console.log(response)
        const res = response.data
        console.log('OSA改制产品工单', response)
        if (res !== null && res.length > 0) {
          that.PnListMore = []
          that.moremodulePnData = []
          that.moretablePn = []
          that.morepnDataR = []
          that.morepnDataY = []
          that.morepnDataG = []
          that.moretablePnData = []
          for (let i = 0; i < res.length; i++) {
            const num = Number(res[i]['FinalPassRate'])
            const sum = res[i]['TotalInput']
            if (num !== 100 && sum >= that.TotalNum) {
              that.moretablePn.push(res[i])
            }
          }
          // console.log(that.moretablePn)
          // console.log(typeof (Number(that.moretablePn[0]['FinalPassRate'].replace('%', ''))))
          for (let j = 0; j < that.moretablePn.length; j++) {
            const num = Number(that.moretablePn[j]['FinalPassRate'])
            const mun = Number(that.moretablePn[j]['RedLine'])
            const sum = Number(that.moretablePn[j]['YellowLine'])
            if (num < mun) {
              that.morepnDataR.push(that.moretablePn[j])
            } else if (num >= mun && num < sum) {
              that.morepnDataY.push(that.moretablePn[j])
            } else if (num >= sum) {
              that.morepnDataG.push(that.moretablePn[j])
            }
          }
          // console.log(that.morepnDataR)
          // console.log(that.morepnDataY)
          // console.log(that.morepnDataG)
          if (that.morepnDataR.length > 1) {
            for (let r = 0; r < that.morepnDataR.length; r++) {
              for (let rr = 0; rr < that.morepnDataR.length - 1; rr++) {
                const bm = Number(that.morepnDataR[rr]['FinalPassRate'])
                const am = Number(that.morepnDataR[rr + 1]['FinalPassRate'])
                if (bm > am) {
                  const vm = that.morepnDataR[rr]
                  that.morepnDataR[rr] = that.morepnDataR[rr + 1]
                  that.morepnDataR[rr + 1] = vm
                }
              }
            }
          }
          if (that.morepnDataY.length > 1) {
            for (let r = 0; r < that.morepnDataY.length; r++) {
              for (let rr = 0; rr < that.morepnDataY.length - 1; rr++) {
                const bm = Number(that.morepnDataY[rr]['FinalPassRate'])
                const am = Number(that.morepnDataY[rr + 1]['FinalPassRate'])
                if (bm > am) {
                  const vm = that.morepnDataY[rr]
                  that.morepnDataY[rr] = that.morepnDataY[rr + 1]
                  that.morepnDataY[rr + 1] = vm
                }
              }
            }
          }
          if (that.morepnDataG.length > 1) {
            for (let r = 0; r < that.morepnDataG.length; r++) {
              for (let rr = 0; rr < that.morepnDataG.length - 1; rr++) {
                const bm = Number(that.morepnDataG[rr]['FinalPassRate'])
                const am = Number(that.morepnDataG[rr + 1]['FinalPassRate'])
                if (bm > am) {
                  const vm = that.morepnDataG[rr]
                  that.morepnDataG[rr] = that.morepnDataG[rr + 1]
                  that.morepnDataG[rr + 1] = vm
                }
              }
            }
          }
          // console.log(that.morepnDataR)
          // console.log(that.morepnDataY)
          // console.log(that.morepnDataG)
          that.moretablePnData.push.apply(that.moretablePnData, that.morepnDataR)
          that.moretablePnData.push.apply(that.moretablePnData, that.morepnDataY)
          that.moretablePnData.push.apply(that.moretablePnData, that.morepnDataG)
          // console.log(that.moretablePnData)
          // console.log(that.correspondData)
          // console.log(that.trueNameData)
          for (let t = 0; t < that.moretablePnData.length; t++) {
            for (let q = 0; q < that.correspondData.length; q++) {
              if (that.moretablePnData[t]['Pn'].slice(0, 8) === that.correspondData[q]['Pn']) {
                that.$set(that.moretablePnData[t], 'Truename', that.correspondData[q]['Nickname'])
              }
            }
          }
          // for (let q = 0; q < that.correspondData.length; q++) {
          //   const Nickname = that.correspondData[q]['Nickname']
          //   const PnList = that.correspondData[q]['PnList'].split(',')
          //   that.PnList.push({Nickname, PnList})
          // }
          // console.log(that.PnList)
          // for (let t = 0; t < that.moretablePnData.length; t++) {
          //   for (let y = 0; y < that.trueNameData.length; y++) {
          //     for (let u = 0; u < that.PnList.length; u++) {
          //       for (let p = 0; p < that.PnList[u]['PnList'].length; p++) {
          //         if (that.moretablePnData[t]['Pn'].slice(0, 8) === that.PnList[u]['PnList'][p]) {
          //           that.$set(that.moretablePnData[t], 'Truename', that.PnList[u]['Nickname'])
          //         }
          //       }
          //     }
          //   }
          // }
          for (let i = 0; i < that.moretablePnData.length; i++) {
            var test = that.moretablePnData[i]['Pn'] + that.moretablePnData[i]['Process']
            if (that.determine_whether_to_process(test, data) === true) {
              that.moretablePnData[i]['dispose'] = '已处理'
            } else {
              that.moretablePnData[i]['dispose'] = ''
            }
          }
          that.moremodulePnData = that.moretablePnData
          // that.warningPnData = JSON.parse(JSON.stringify(that.tablePn))
          // console.log(that.moremodulePnData)
        } else {
          that.moremodulePnData = []
        }
      }).catch(function (err) {
        if (err.response.status === 504) {
          that.$message({
            type: 'error',
            message: '服务器未响应！'
          })
        } else if (err.response.status === 404) {
          that.$message({
            type: 'error',
            message: '未找到数据！'
          })
        } else if (err.response.status === 403) {
          that.$message({
            type: 'error',
            message: '权限不够！'
          })
        }
      })
    },
    // 获取OSA试生产产品告警信息
    get_osa_test_pn (data) {
      let that = this
      const start = this.moment(new Date(new Date().setHours(8, 0, 0, 0))).format('YYYY-MM-DD HH:mm:ss')
      const end = this.moment(new Date(new Date().setHours(8, 0, 0, 0) + 24 * 60 * 60 * 1000)).format('YYYY-MM-DD HH:mm:ss')
      const work = 'OSA试生产产品工单'
      that.$axios({
        method: 'get',
        url: '/display/product-operation-info/osa/warning-view/warning-info-in-time-period-by-work-order-type',
        params: {
          startTime: start,
          endTime: end,
          workOrderType: work
        }
      }).then(function (response) {
        // console.log(response)
        const res = response.data
        console.log('OSA试生产产品工单', response)
        if (res !== null && res.length > 0) {
          that.PnListMore = []
          that.testmodulePnData = []
          that.testtablePn = []
          that.testpnDataR = []
          that.testpnDataY = []
          that.testpnDataG = []
          that.testtablePnData = []
          for (let i = 0; i < res.length; i++) {
            const num = Number(res[i]['FinalPassRate'])
            const sum = res[i]['TotalInput']
            if (num !== 100 && sum >= that.TotalNum) {
              that.testtablePn.push(res[i])
            }
          }
          // console.log(that.testtablePn)
          // console.log(typeof (Number(that.testtablePn[0]['FinalPassRate'].replace('%', ''))))
          for (let j = 0; j < that.testtablePn.length; j++) {
            const num = Number(that.testtablePn[j]['FinalPassRate'])
            const mun = Number(that.testtablePn[j]['RedLine'])
            const sum = Number(that.testtablePn[j]['YellowLine'])
            if (num < mun) {
              that.testpnDataR.push(that.testtablePn[j])
            } else if (num >= mun && num < sum) {
              that.testpnDataY.push(that.testtablePn[j])
            } else if (num >= sum) {
              that.testpnDataG.push(that.testtablePn[j])
            }
          }
          // console.log(that.testpnDataR)
          // console.log(that.testpnDataY)
          // console.log(that.testpnDataG)
          if (that.testpnDataR.length > 1) {
            for (let r = 0; r < that.testpnDataR.length; r++) {
              for (let rr = 0; rr < that.testpnDataR.length - 1; rr++) {
                const bm = Number(that.testpnDataR[rr]['FinalPassRate'])
                const am = Number(that.testpnDataR[rr + 1]['FinalPassRate'])
                if (bm > am) {
                  const vm = that.testpnDataR[rr]
                  that.testpnDataR[rr] = that.testpnDataR[rr + 1]
                  that.testpnDataR[rr + 1] = vm
                }
              }
            }
          }
          if (that.testpnDataY.length > 1) {
            for (let r = 0; r < that.testpnDataY.length; r++) {
              for (let rr = 0; rr < that.testpnDataY.length - 1; rr++) {
                const bm = Number(that.testpnDataY[rr]['FinalPassRate'])
                const am = Number(that.testpnDataY[rr + 1]['FinalPassRate'])
                if (bm > am) {
                  const vm = that.testpnDataY[rr]
                  that.testpnDataY[rr] = that.testpnDataY[rr + 1]
                  that.testpnDataY[rr + 1] = vm
                }
              }
            }
          }
          if (that.testpnDataG.length > 1) {
            for (let r = 0; r < that.testpnDataG.length; r++) {
              for (let rr = 0; rr < that.testpnDataG.length - 1; rr++) {
                const bm = Number(that.testpnDataG[rr]['FinalPassRate'])
                const am = Number(that.testpnDataG[rr + 1]['FinalPassRate'])
                if (bm > am) {
                  const vm = that.testpnDataG[rr]
                  that.testpnDataG[rr] = that.testpnDataG[rr + 1]
                  that.testpnDataG[rr + 1] = vm
                }
              }
            }
          }
          console.log(that.testpnDataR)
          console.log(that.testpnDataY)
          console.log(that.testpnDataG)
          that.testtablePnData.push.apply(that.testtablePnData, that.testpnDataR)
          that.testtablePnData.push.apply(that.testtablePnData, that.testpnDataY)
          that.testtablePnData.push.apply(that.testtablePnData, that.testpnDataG)
          // console.log(that.testtablePnData)
          // console.log(that.correspondData)
          // console.log(that.trueNameData)
          for (let t = 0; t < that.testtablePnData.length; t++) {
            for (let q = 0; q < that.correspondData.length; q++) {
              if (that.testtablePnData[t]['Pn'].slice(0, 8) === that.correspondData[q]['Pn']) {
                that.$set(that.testtablePnData[t], 'Truename', that.correspondData[q]['Nickname'])
              }
            }
          }
          // for (let q = 0; q < that.correspondData.length; q++) {
          //   const Nickname = that.correspondData[q]['Nickname']
          //   const PnList = that.correspondData[q]['PnList'].split(',')
          //   that.PnList.push({Nickname, PnList})
          // }
          // console.log(that.PnList)
          // for (let t = 0; t < that.testtablePnData.length; t++) {
          //   for (let y = 0; y < that.trueNameData.length; y++) {
          //     for (let u = 0; u < that.PnList.length; u++) {
          //       for (let p = 0; p < that.PnList[u]['PnList'].length; p++) {
          //         if (that.testtablePnData[t]['Pn'].slice(0, 8) === that.PnList[u]['PnList'][p]) {
          //           that.$set(that.testtablePnData[t], 'Truename', that.PnList[u]['Nickname'])
          //         }
          //       }
          //     }
          //   }
          // }
          for (let i = 0; i < that.testtablePnData.length; i++) {
            var test = that.testtablePnData[i]['Pn'] + that.testtablePnData[i]['Process']
            if (that.determine_whether_to_process(test, data) === true) {
              that.testtablePnData[i]['dispose'] = '已处理'
            } else {
              that.testtablePnData[i]['dispose'] = ''
            }
          }
          that.testmodulePnData = that.testtablePnData
          // that.warningPnData = JSON.parse(JSON.stringify(that.tablePn))
          // console.log(that.testmodulePnData)
        } else {
          that.testmodulePnData = []
        }
      }).catch(function (err) {
        if (err.response.status === 504) {
          that.$message({
            type: 'error',
            message: '服务器未响应！'
          })
        } else if (err.response.status === 404) {
          that.$message({
            type: 'error',
            message: '未找到数据！'
          })
        } else if (err.response.status === 403) {
          that.$message({
            type: 'error',
            message: '权限不够！'
          })
        }
      })
    },
    // 获取module_pn数据
    get_data (data) {
      this.get_osa_normal_pn(data)
      this.get_osa_return_pn(data)
      this.get_osa_more_pn(data)
      this.get_osa_test_pn(data)
      this.get_osa_normal_station(data)
      this.get_osa_return_station(data)
      this.get_osa_more_station(data)
      this.get_osa_test_station(data)
    },
    // 获取module_station工位数据
    // OSA成品重工工位数据
    get_osa_normal_station (data) {
      let that = this
      const start = this.moment(new Date(new Date().setHours(8, 0, 0, 0))).format('YYYY-MM-DD HH:mm:ss')
      const end = this.moment(new Date(new Date().setHours(8, 0, 0, 0) + 24 * 60 * 60 * 1000)).format('YYYY-MM-DD HH:mm:ss')
      const work = 'OSA成品重工工单'
      that.$axios({
        method: 'get',
        url: '/display/product-operation-info/osa/warning-view/warning-info-with-station-in-time-period-by-work-order-type',
        params: {
          startTime: start,
          endTime: end,
          workOrderType: work
        }
      }).then(function (response) {
        console.log('OSA成品重工 工位', response)
        const res = response.data
        if (res !== null) {
          that.normalTableStation = []
          that.normalStationDataR = []
          that.normalStationDataY = []
          that.normalStationDataG = []
          that.normalTableStationData = []
          that.warningNormalStationData = []
          for (let i = 0; i < res.length; i++) {
            const num = Number(res[i]['PassRate'])
            const sum = res[i]['TotalNum']
            if (num !== 100 && sum >= that.TotalNum) {
              that.normalTableStation.push(res[i])
            }
          }
          console.log(that.normalTableStation)
        }
        for (let j = 0; j < that.normalTableStation.length; j++) {
          const num = Number(that.normalTableStation[j]['PassRate'])
          const mun = Number(that.normalTableStation[j]['RedLine'])
          const sum = Number(that.normalTableStation[j]['YellowLine'])
          if (num < mun) {
            that.normalStationDataR.push(that.normalTableStation[j])
          } else if (num >= mun && num < sum) {
            that.normalStationDataY.push(that.normalTableStation[j])
          } else if (num >= sum) {
            that.normalStationDataG.push(that.normalTableStation[j])
          }
        }
        console.log(that.normalStationDataR)
        console.log(that.normalStationDataY)
        console.log(that.normalStationDataG)
        if (that.normalStationDataR.length > 1) {
          for (let r = 0; r < that.normalStationDataR.length; r++) {
            for (let rr = 0; rr < that.normalStationDataR.length - 1; rr++) {
              const bm = Number(that.normalStationDataR[rr]['PassRate'])
              const am = Number(that.normalStationDataR[rr + 1]['PassRate'])
              if (bm > am) {
                const vm = that.normalStationDataR[rr]
                that.normalStationDataR[rr] = that.normalStationDataR[rr + 1]
                that.normalStationDataR[rr + 1] = vm
              }
            }
          }
        }
        if (that.normalStationDataY.length > 1) {
          for (let r = 0; r < that.normalStationDataY.length; r++) {
            for (let rr = 0; rr < that.normalStationDataY.length - 1; rr++) {
              const bm = Number(that.normalStationDataY[rr]['PassRate'])
              const am = Number(that.normalStationDataY[rr + 1]['PassRate'])
              if (bm > am) {
                const vm = that.normalStationDataY[rr]
                that.normalStationDataY[rr] = that.normalStationDataY[rr + 1]
                that.normalStationDataY[rr + 1] = vm
              }
            }
          }
        }
        if (that.normalStationDataG.length > 1) {
          for (let r = 0; r < that.normalStationDataG.length; r++) {
            for (let rr = 0; rr < that.normalStationDataG.length - 1; rr++) {
              const bm = Number(that.normalStationDataG[rr]['PassRate'])
              const am = Number(that.normalStationDataG[rr + 1]['PassRate'])
              if (bm > am) {
                const vm = that.normalStationDataG[rr]
                that.normalStationDataG[rr] = that.normalStationDataG[rr + 1]
                that.normalStationDataG[rr + 1] = vm
              }
            }
          }
        }
        console.log(that.normalStationDataR)
        console.log(that.normalStationDataY)
        console.log(that.normalStationDataG)
        that.normalTableStationData.push.apply(that.normalTableStationData, that.normalStationDataR)
        that.normalTableStationData.push.apply(that.normalTableStationData, that.normalStationDataY)
        that.normalTableStationData.push.apply(that.normalTableStationData, that.normalStationDataG)
        for (let t = 0; t < that.normalTableStationData.length; t++) {
          for (let q = 0; q < that.correspondData.length; q++) {
            if (that.normalTableStationData[t]['Pn'].slice(0, 8) === that.correspondData[q]['Pn']) {
              that.$set(that.normalTableStationData[t], 'Truename', that.correspondData[q]['Nickname'])
            }
          }
        }
        for (let i = 0; i < that.normalTableStationData.length; i++) {
          var test = that.normalTableStationData[i]['StationId'] + that.normalTableStationData[i]['Pn'] + that.normalTableStationData[i]['LogAction']
          if (that.determine_whether_to_process(test, data) === true) {
            that.normalTableStationData[i]['dispose'] = '已处理'
          } else {
            that.normalTableStationData[i]['dispose'] = ''
          }
        }
        that.moduleNormalStationData = that.normalTableStationData
        for (let r = 0; r < that.normalTableStationData.length; r++) {
          that.warningNormalStationData.push(that.normalTableStationData[r])
        }
        // // 未完成语音告警
        // setTimeout(() => (
        //   // that.moduleStationData = []
        //   // that.moduleStationDataR = []
        //   // that.moduleStationData = that.warningNormalStationData.concat(that.warningReturnStationData)
        //   // that.moduleStationDataR = that.normalStationDataR.concat(that.returnStationDataR)
        //   that.handleSpeak()
        // ), 10000)
      })
    },
    // OSA改制产品工位数据
    get_osa_return_station (data) {
      let that = this
      const start = this.moment(new Date(new Date().setHours(8, 0, 0, 0))).format('YYYY-MM-DD HH:mm:ss')
      const end = this.moment(new Date(new Date().setHours(8, 0, 0, 0) + 24 * 60 * 60 * 1000)).format('YYYY-MM-DD HH:mm:ss')
      const work = 'OSA改制产品工单'
      that.$axios({
        method: 'get',
        url: '/display/product-operation-info/osa/warning-view/warning-info-with-station-in-time-period-by-work-order-type',
        params: {
          startTime: start,
          endTime: end,
          workOrderType: work
        }
      }).then(function (response) {
        console.log('OSA改制产品 工位', response)
        const res = response.data
        if (res !== null) {
          that.returnTableStation = []
          that.returnStationDataR = []
          that.returnStationDataY = []
          that.returnStationDataG = []
          that.returnTableStationData = []
          that.warningReturnStationData = []
          for (let i = 0; i < res.length; i++) {
            const num = Number(res[i]['PassRate'])
            const sum = res[i]['TotalNum']
            if (num !== 100 && sum >= that.TotalNum) {
              that.returnTableStation.push(res[i])
            }
          }
          console.log(that.returnTableStation)
        }
        for (let j = 0; j < that.returnTableStation.length; j++) {
          const num = Number(that.returnTableStation[j]['PassRate'])
          const mun = Number(that.returnTableStation[j]['RedLine'])
          const sum = Number(that.returnTableStation[j]['YellowLine'])
          if (num < mun) {
            that.returnStationDataR.push(that.returnTableStation[j])
          } else if (num >= mun && num < sum) {
            that.returnStationDataY.push(that.returnTableStation[j])
          } else if (num >= sum) {
            that.returnStationDataG.push(that.returnTableStation[j])
          }
        }
        console.log(that.returnStationDataR)
        console.log(that.returnStationDataY)
        console.log(that.returnStationDataG)
        if (that.returnStationDataR.length > 1) {
          for (let r = 0; r < that.returnStationDataR.length; r++) {
            for (let rr = 0; rr < that.returnStationDataR.length - 1; rr++) {
              const bm = Number(that.returnStationDataR[rr]['PassRate'])
              const am = Number(that.returnStationDataR[rr + 1]['PassRate'])
              if (bm > am) {
                const vm = that.returnStationDataR[rr]
                that.returnStationDataR[rr] = that.returnStationDataR[rr + 1]
                that.returnStationDataR[rr + 1] = vm
              }
            }
          }
        }
        if (that.returnStationDataY.length > 1) {
          for (let r = 0; r < that.returnStationDataY.length; r++) {
            for (let rr = 0; rr < that.returnStationDataY.length - 1; rr++) {
              const bm = Number(that.returnStationDataY[rr]['PassRate'])
              const am = Number(that.returnStationDataY[rr + 1]['PassRate'])
              if (bm > am) {
                const vm = that.returnStationDataY[rr]
                that.returnStationDataY[rr] = that.returnStationDataY[rr + 1]
                that.returnStationDataY[rr + 1] = vm
              }
            }
          }
        }
        if (that.returnStationDataG.length > 1) {
          for (let r = 0; r < that.returnStationDataG.length; r++) {
            for (let rr = 0; rr < that.returnStationDataG.length - 1; rr++) {
              const bm = Number(that.returnStationDataG[rr]['PassRate'])
              const am = Number(that.returnStationDataG[rr + 1]['PassRate'])
              if (bm > am) {
                const vm = that.returnStationDataG[rr]
                that.returnStationDataG[rr] = that.returnStationDataG[rr + 1]
                that.returnStationDataG[rr + 1] = vm
              }
            }
          }
        }
        console.log(that.returnStationDataR)
        console.log(that.returnStationDataY)
        console.log(that.returnStationDataG)
        that.returnTableStationData.push.apply(that.returnTableStationData, that.returnStationDataR)
        that.returnTableStationData.push.apply(that.returnTableStationData, that.returnStationDataY)
        that.returnTableStationData.push.apply(that.returnTableStationData, that.returnStationDataG)
        for (let t = 0; t < that.returnTableStationData.length; t++) {
          for (let q = 0; q < that.correspondData.length; q++) {
            if (that.returnTableStationData[t]['Pn'].slice(0, 8) === that.correspondData[q]['Pn']) {
              that.$set(that.returnTableStationData[t], 'Truename', that.correspondData[q]['Nickname'])
            }
          }
        }
        for (let i = 0; i < that.returnTableStationData.length; i++) {
          var test = that.returnTableStationData[i]['StationId'] + that.returnTableStationData[i]['Pn'] + that.returnTableStationData[i]['LogAction']
          if (that.determine_whether_to_process(test, data) === true) {
            that.returnTableStationData[i]['dispose'] = '已处理'
          } else {
            that.returnTableStationData[i]['dispose'] = ''
          }
        }
        that.moduleReturnStationData = that.returnTableStationData
        for (let r = 0; r < that.returnTableStationData.length; r++) {
          that.warningReturnStationData.push(that.returnTableStationData[r])
        }
        // setTimeout(() => (
        //   that.handleSpeak()
        // ), 10000)
        // 未完成语音告警
      })
    },
    // OSA量产产品工单
    get_osa_more_station (data) {
      let that = this
      const start = this.moment(new Date(new Date().setHours(8, 0, 0, 0))).format('YYYY-MM-DD HH:mm:ss')
      const end = this.moment(new Date(new Date().setHours(8, 0, 0, 0) + 24 * 60 * 60 * 1000)).format('YYYY-MM-DD HH:mm:ss')
      const work = 'OSA量产产品工单'
      that.$axios({
        method: 'get',
        url: '/display/product-operation-info/osa/warning-view/warning-info-with-station-in-time-period-by-work-order-type',
        params: {
          startTime: start,
          endTime: end,
          workOrderType: work
        }
      }).then(function (response) {
        console.log('OSA量产产品 工位', response)
        const res = response.data
        if (res !== null) {
          that.moreTableStation = []
          that.moreStationDataR = []
          that.moreStationDataY = []
          that.moreStationDataG = []
          that.moreTableStationData = []
          that.warningMoreStationData = []
          for (let i = 0; i < res.length; i++) {
            const num = Number(res[i]['PassRate'])
            const sum = res[i]['TotalNum']
            if (num !== 100 && sum >= that.TotalNum) {
              that.moreTableStation.push(res[i])
            }
          }
          console.log(that.moreTableStation)
        }
        for (let j = 0; j < that.moreTableStation.length; j++) {
          const num = Number(that.moreTableStation[j]['PassRate'])
          const mun = Number(that.moreTableStation[j]['RedLine'])
          const sum = Number(that.moreTableStation[j]['YellowLine'])
          if (num < mun) {
            that.moreStationDataR.push(that.moreTableStation[j])
          } else if (num >= mun && num < sum) {
            that.moreStationDataY.push(that.moreTableStation[j])
          } else if (num >= sum) {
            that.moreStationDataG.push(that.moreTableStation[j])
          }
        }
        console.log(that.moreStationDataR)
        console.log(that.moreStationDataY)
        console.log(that.moreStationDataG)
        if (that.moreStationDataR.length > 1) {
          for (let r = 0; r < that.moreStationDataR.length; r++) {
            for (let rr = 0; rr < that.moreStationDataR.length - 1; rr++) {
              const bm = Number(that.moreStationDataR[rr]['PassRate'])
              const am = Number(that.moreStationDataR[rr + 1]['PassRate'])
              if (bm > am) {
                const vm = that.moreStationDataR[rr]
                that.moreStationDataR[rr] = that.moreStationDataR[rr + 1]
                that.moreStationDataR[rr + 1] = vm
              }
            }
          }
        }
        if (that.moreStationDataY.length > 1) {
          for (let r = 0; r < that.moreStationDataY.length; r++) {
            for (let rr = 0; rr < that.moreStationDataY.length - 1; rr++) {
              const bm = Number(that.moreStationDataY[rr]['PassRate'])
              const am = Number(that.moreStationDataY[rr + 1]['PassRate'])
              if (bm > am) {
                const vm = that.moreStationDataY[rr]
                that.moreStationDataY[rr] = that.moreStationDataY[rr + 1]
                that.moreStationDataY[rr + 1] = vm
              }
            }
          }
        }
        if (that.moreStationDataG.length > 1) {
          for (let r = 0; r < that.moreStationDataG.length; r++) {
            for (let rr = 0; rr < that.moreStationDataG.length - 1; rr++) {
              const bm = Number(that.moreStationDataG[rr]['PassRate'])
              const am = Number(that.moreStationDataG[rr + 1]['PassRate'])
              if (bm > am) {
                const vm = that.moreStationDataG[rr]
                that.moreStationDataG[rr] = that.moreStationDataG[rr + 1]
                that.moreStationDataG[rr + 1] = vm
              }
            }
          }
        }
        console.log(that.moreStationDataR)
        console.log(that.moreStationDataY)
        console.log(that.moreStationDataG)
        that.moreTableStationData.push.apply(that.moreTableStationData, that.moreStationDataR)
        that.moreTableStationData.push.apply(that.moreTableStationData, that.moreStationDataY)
        that.moreTableStationData.push.apply(that.moreTableStationData, that.moreStationDataG)
        for (let t = 0; t < that.moreTableStationData.length; t++) {
          for (let q = 0; q < that.correspondData.length; q++) {
            if (that.moreTableStationData[t]['Pn'].slice(0, 8) === that.correspondData[q]['Pn']) {
              that.$set(that.moreTableStationData[t], 'Truename', that.correspondData[q]['Nickname'])
            }
          }
        }
        for (let i = 0; i < that.moreTableStationData.length; i++) {
          var test = that.moreTableStationData[i]['StationId'] + that.moreTableStationData[i]['Pn'] + that.moreTableStationData[i]['LogAction']
          if (that.determine_whether_to_process(test, data) === true) {
            that.moreTableStationData[i]['dispose'] = '已处理'
          } else {
            that.moreTableStationData[i]['dispose'] = ''
          }
        }
        that.moduleNormalStationData = that.moreTableStationData
        for (let r = 0; r < that.moreTableStationData.length; r++) {
          that.warningMoreStationData.push(that.moreTableStationData[r])
        }
        // // 未完成语音告警
        // setTimeout(() => (
        //   // that.moduleStationData = []
        //   // that.moduleStationDataR = []
        //   // that.moduleStationData = that.warningMoreStationData.concat(that.warningReturnStationData)
        //   // that.moduleStationDataR = that.normalStationDataR.concat(that.returnStationDataR)
        //   that.handleSpeak()
        // ), 10000)
      })
    },
    // OSA试生产产品工单
    get_osa_test_station (data) {
      let that = this
      const start = this.moment(new Date(new Date().setHours(8, 0, 0, 0))).format('YYYY-MM-DD HH:mm:ss')
      const end = this.moment(new Date(new Date().setHours(8, 0, 0, 0) + 24 * 60 * 60 * 1000)).format('YYYY-MM-DD HH:mm:ss')
      const work = 'OSA试生产产品工单'
      that.$axios({
        method: 'get',
        url: '/display/product-operation-info/osa/warning-view/warning-info-with-station-in-time-period-by-work-order-type',
        params: {
          startTime: start,
          endTime: end,
          workOrderType: work
        }
      }).then(function (response) {
        console.log('OSA试生产产品 工位', response)
        const res = response.data
        if (res !== null) {
          that.testTableStation = []
          that.testStationDataR = []
          that.testStationDataY = []
          that.testStationDataG = []
          that.testTableStationData = []
          that.warningTestStationData = []
          for (let i = 0; i < res.length; i++) {
            const num = Number(res[i]['PassRate'])
            const sum = res[i]['TotalNum']
            if (num !== 100 && sum >= that.TotalNum) {
              that.testTableStation.push(res[i])
            }
          }
          console.log(that.testTableStation)
        }
        for (let j = 0; j < that.testTableStation.length; j++) {
          const num = Number(that.testTableStation[j]['PassRate'])
          const mun = Number(that.testTableStation[j]['RedLine'])
          const sum = Number(that.testTableStation[j]['YellowLine'])
          if (num < mun) {
            that.testStationDataR.push(that.testTableStation[j])
          } else if (num >= mun && num < sum) {
            that.testStationDataY.push(that.testTableStation[j])
          } else if (num >= sum) {
            that.testStationDataG.push(that.testTableStation[j])
          }
        }
        console.log(that.testStationDataR)
        console.log(that.testStationDataY)
        console.log(that.testStationDataG)
        if (that.testStationDataR.length > 1) {
          for (let r = 0; r < that.testStationDataR.length; r++) {
            for (let rr = 0; rr < that.testStationDataR.length - 1; rr++) {
              const bm = Number(that.testStationDataR[rr]['PassRate'])
              const am = Number(that.testStationDataR[rr + 1]['PassRate'])
              if (bm > am) {
                const vm = that.testStationDataR[rr]
                that.testStationDataR[rr] = that.testStationDataR[rr + 1]
                that.testStationDataR[rr + 1] = vm
              }
            }
          }
        }
        if (that.testStationDataY.length > 1) {
          for (let r = 0; r < that.testStationDataY.length; r++) {
            for (let rr = 0; rr < that.testStationDataY.length - 1; rr++) {
              const bm = Number(that.testStationDataY[rr]['PassRate'])
              const am = Number(that.testStationDataY[rr + 1]['PassRate'])
              if (bm > am) {
                const vm = that.testStationDataY[rr]
                that.testStationDataY[rr] = that.testStationDataY[rr + 1]
                that.testStationDataY[rr + 1] = vm
              }
            }
          }
        }
        if (that.testStationDataG.length > 1) {
          for (let r = 0; r < that.testStationDataG.length; r++) {
            for (let rr = 0; rr < that.testStationDataG.length - 1; rr++) {
              const bm = Number(that.testStationDataG[rr]['PassRate'])
              const am = Number(that.testStationDataG[rr + 1]['PassRate'])
              if (bm > am) {
                const vm = that.testStationDataG[rr]
                that.testStationDataG[rr] = that.testStationDataG[rr + 1]
                that.testStationDataG[rr + 1] = vm
              }
            }
          }
        }
        console.log(that.testStationDataR)
        console.log(that.testStationDataY)
        console.log(that.testStationDataG)
        that.testTableStationData.push.apply(that.testTableStationData, that.testStationDataR)
        that.testTableStationData.push.apply(that.testTableStationData, that.testStationDataY)
        that.testTableStationData.push.apply(that.testTableStationData, that.testStationDataG)
        for (let t = 0; t < that.testTableStationData.length; t++) {
          for (let q = 0; q < that.correspondData.length; q++) {
            if (that.testTableStationData[t]['Pn'].slice(0, 8) === that.correspondData[q]['Pn']) {
              that.$set(that.testTableStationData[t], 'Truename', that.correspondData[q]['Nickname'])
            }
          }
        }
        for (let i = 0; i < that.testTableStationData.length; i++) {
          var test = that.testTableStationData[i]['StationId'] + that.testTableStationData[i]['Pn'] + that.testTableStationData[i]['LogAction']
          if (that.determine_whether_to_process(test, data) === true) {
            that.testTableStationData[i]['dispose'] = '已处理'
          } else {
            that.testTableStationData[i]['dispose'] = ''
          }
        }
        that.moduleNormalStationData = that.testTableStationData
        for (let r = 0; r < that.testTableStationData.length; r++) {
          that.warningTestStationData.push(that.testTableStationData[r])
        }
        // // 未完成语音告警
        // setTimeout(() => (
        //   // that.moduleStationData = []
        //   // that.moduleStationDataR = []
        //   // that.moduleStationData = that.warningTestStationData.concat(that.warningReturnStationData)
        //   // that.moduleStationDataR = that.testStationDataR.concat(that.returnStationDataR)
        //   that.handleSpeak()
        // ), 10000)
      })
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
    clearInterval(this.timer2)
    clearInterval(this.timer3)
  },
  data () {
    return {
      addform: {
        type: 'osa',
        Pn: '',
        Process: '',
        station: 'true',
        equipment: '',
        User: '',
        Time: '',
        radio: 'true',
        Event: '',
        Cause: '',
        Temporary: '',
        Prevent: ''
      },
      addrules: {
        Time: [
          {required: true, message: '请选择日期', trigger: 'change'}
        ]
      },
      postrules: {
        CreateTime: [
          {required: true, message: '请选择日期', trigger: 'change'}
        ]
      },
      checked: false,
      postform: {},
      text: '',
      TotalNum: 50,
      doorsillR: 0,
      doorsillY: 0,
      numbertime: 0,
      timeScope: '',
      allProcessedData: [],
      calendarData: [],
      cardData: [],
      doorsillData: [],
      keepData: [],
      trueNameData: [],
      rowDataR: [],
      rowDataY: [],
      rowDataG: [],
      pnDataR: [],
      pnDataY: [],
      pnDataG: [],
      returnpnDataR: [],
      returnpnDataY: [],
      returnpnDataG: [],
      returntablePnData: [],
      returnmodulePnData: [],
      moremodulePnData: [],
      morepnDataR: [],
      morepnDataY: [],
      morepnDataG: [],
      moretablePnData: [],
      testmodulePnData: [],
      testpnDataR: [],
      testpnDataY: [],
      testpnDataG: [],
      testtablePnData: [],
      returntablePn: [],
      normalTableStation: [],
      normalStationDataR: [],
      normalStationDataY: [],
      normalStationDataG: [],
      normalTableStationData: [],
      moduleNormalStationData: [],
      warningNormalStationData: [],
      returnTableStation: [],
      returnStationDataR: [],
      returnStationDataY: [],
      returnStationDataG: [],
      returnTableStationData: [],
      moduleReturnStationData: [],
      warningReturnStationData: [],
      moreTableStation: [],
      moreStationDataR: [],
      moreStationDataY: [],
      moreStationDataG: [],
      moreTableStationData: [],
      moduleMoreStationData: [],
      warningMoreStationData: [],
      testTableStation: [],
      testStationDataR: [],
      testStationDataY: [],
      testStationDataG: [],
      testTableStationData: [],
      moduleTestStationData: [],
      warningTestStationData: [],
      correspondName: [],
      PnList: [],
      PnListMore: [],
      PnListTest: [],
      PnListNormal: [],
      correspondData: [],
      textData: [],
      tablePn: [],
      warningPnData: [],
      stationNumber: 0,
      pnNumber: 0,
      warningStationData: [],
      tableStation: [],
      tableStationData: [],
      tablePnData: [],
      modulePnData: [],
      moduleStationData: [],
      moduleStationDataR: [],
      moduleBoardStationWarningData: [],
      drawer: false,
      postVisible: false,
      pnLoading: false,
      stationLoading: false,
      isPc: true,
      isPhone: false,
      bigPc: false,
      deployDialogVisible: false,
      VoicedeployDialogVisible: false,
      addRecordDialogVisible: false,
      screenWidth: document.body.clientWidth
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
#board >>> .el-table th, .el-table tr{
    background-color: rgb(168, 47, 25) !important;
    color:white
}
#board>>>.osawarningone-row {
    background: rgb(161, 194, 100) !important;
    color: white;
}
#board>>>.success-row {
    background-color: rgb(238, 170, 43) !important;
    color: white;
}
#board>>>.osawarningthree-row {
    background: rgb(168, 47, 25) !important;
    color: white;
}
#board >>> tbody tr:hover>td {
  background-color: #90c0f1;
}
#OsaWarning >>> .el-calendar-table .el-calendar-day {
  height: 50px;
}
#OsaWarning >>> .el-calendar__body {
  padding: 0
}
</style>
