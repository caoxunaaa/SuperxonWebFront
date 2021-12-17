<template>
  <div class="PTRPost">
    <div style="width: 100%; height:800px;">
  <div class="PTRPost">
        <div style="margin: 0 auto; width: 100%; border: 1px solid black">
          <span style="float:left; font-size:15px">选择表名:</span>
            <el-select size="mini" v-model="table_name" filterable style="width: 300px; float:left"  placeholder="请选择表名">
              <el-option
                v-for="item in table_name_list"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button type="primary" size="mini" style="float:left;" @click="get_index">获取表中索引</el-button>
              <div style="margin: 1px;float:left;display:block;" v-for="(item,index) in table_only_field" :key="index"><span style="font-size:15px">{{item.value}}</span><el-input size="mini" style="width:180px" v-model="table[item.value]"></el-input></div>
              <!-- <el-input style="width:50%" v-for="(item,index) in table_name_list" :key="index" v-model="table[index]"></el-input> -->
              <el-button type="primary" size="mini" style="float:left" @click="get_field">查询数据库</el-button>
        </div>
        <div class="overf" :style="{height: tableHeight + 'px',width:'100%'}">
          <div id="example-container" :style="{height: tableHeight + 'px',width:'100%'}" class="wrapper">
              <HotTable :style="{height: tableHeight + 'px',width:'100%'}" :root="root" ref="testHot" :after-change="get_old_data" :after-renderer="get_rander" :settings="hotSettings"></HotTable>
          </div>
        </div>
        <br>
        <div>
          <span style="width: 10%">备注:</span>
          <el-input v-model="remarkInput" style="width: 70%"></el-input>
          <el-button type="primary" @click="clear_open" style="width:10%">清除</el-button>
          <el-button type="primary" @click="get_submit" style="width:10%">提交</el-button>
        </div>
        {{restext}}
  </div>
    </div>
  </div>
</template>

<script>
import { HotTable } from '@handsontable-pro/vue'
import '../../../../node_modules/handsontable-pro/dist/handsontable.full.css'
// import Handsontable from 'handsontable-pro'
export default {
  name: 'PTRPost',
  components: {
    HotTable
  },
  mounted () {
    this.get_table_name()
  },
  watch: {
  },
  methods: {
    // 提交按钮 SOEX6376-XSGB-ZT 5200391A
    get_submit () {
      var nickname = ''
      var time = this.moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      if (this.remarkInput !== '') {
        if (localStorage.getItem('nickname') === null) {
          alert('用户未登录或登录已过期')
          localStorage.clear()
          this.$router.push({path: '/user/login/'})
          window.location.reload()
        } else {
          nickname = localStorage.getItem('nickname')
          console.log('表名：', this.table_name)
          console.log('用户名：', nickname)
          console.log('时间：', time)
          console.log('备注', this.remarkInput)
          console.log(this.hotSettings.data)
          console.log(this.hotSettingsData)
          if (this.changeData.length !== 0) {
            var row = []
            for (let i = 0; i < this.changeData.length; i++) {
              row.push(Number(this.changeData[i].split(',')[0]))
            }
            row = Array.from(new Set(row))
            console.log(row)
            this.rowNumber = row.length
            let requestArray = []
            for (let j = 0; j < row.length; j++) {
              requestArray.push(this.submit_axios(nickname, time, this.remarkInput, this.table_name, this.hotSettingsHeaderData, this.hotSettingsData[row[j]], this.hotSettings.data[row[j]]))
            }
            let that = this
            that.$axios.all(requestArray).then(that.$axios.spread((...res) => {
              var response = [...res]
              that.trueNumber = 0
              that.falseNumber = 0
              for (let i = 0; i < response.length; i++) {
                console.log(response[i]['data'])
                if (response[i]['data'] === 'Ok') {
                  that.trueNumber += 1
                } else {
                  that.falseNumber += 1
                }
              }
              var messagetext = '修改成功：' + that.trueNumber + '条，修改失败：' + that.falseNumber + '条'
              that.restext = messagetext
              console.log(messagetext)
              that.$message({
                type: 'warning',
                message: messagetext
              })
              that.clear_open()
              // let flagByRequest = true
              // let flagByRequestIndex = ''
              // [...resp].forEach((item, index) => {
              //   if (!item.data.success) {
              //     flagByRequest = false
              //     flagByRequestIndex += index + ','
              //   }
              // })
              // if (flagByRequest) {
              //   console.log(flagByRequestIndex)
              // }
            }))
            // this.$nextTick(() => {
            //   console.log(this.trueNumber, this.falseNumber)
            //   this.$message({
            //     type: 'success',
            //     message: '提交成功!'
            //   })
            //   this.clear_open()
            // })
          }
        }
      } else {
        this.$message({
          type: 'error',
          message: '备注为必填项！'
        })
      }
    },
    // 提交跨域
    submit_axios (user, updateTime, note, tableName, tableHeads, tableOldDatas, tableNewDatas) {
      var tableOldDatasText = ''
      for (let i = 0; i < tableOldDatas.length; i++) {
        if (i === 0) {
          tableOldDatasText = tableOldDatas[i]
        } else {
          tableOldDatasText = tableOldDatasText + ',' + tableOldDatas[i]
        }
      }
      var tableNewDatasText = ''
      for (let i = 0; i < tableNewDatas.length; i++) {
        if (i === 0) {
          tableNewDatasText = tableNewDatas[i]
        } else {
          tableNewDatasText = tableNewDatasText + ',' + tableNewDatas[i]
        }
      }
      let that = this
      let formdata = new FormData()
      formdata.append('user', user)
      formdata.append('updateTime', updateTime)
      formdata.append('note', note)
      formdata.append('tableName', tableName)
      formdata.append('tableHeads', tableHeads)
      formdata.append('tableOldDatas', tableOldDatasText)
      formdata.append('tableNewDatas', tableNewDatasText)
      return that.$axios({
        url: '/display/production-parameter/production-ptr',
        method: 'put',
        data: formdata
      })
    },
    // 清除按钮
    clear_open () {
      this.get_field()
      this.remarkInput = ''
    },
    // 获取表名列表中的数据
    get_table_name () {
      let that = this
      that.table_name_list = []
      that.$axios({
        url: '/display/production-parameter/all-production-parameter-relation-field',
        method: 'get'
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null && res.length > 0) {
          for (let i = 0; i < res.length; i++) {
            that.table_name_list.push({value: res[i]['MonitoringTable'], label: res[i]['MonitoringTable']})
          }
        }
      }).catch(function (error) {
        console.log(error)
        that.$message({
          type: 'error',
          message: '获取表名列表中的数据失败！'
        })
      })
    },
    // 获取表中的唯一索引
    get_index () {
      let that = this
      that.oldtable = []
      that.$refs.testHot.hotInstance.clear()
      that.post_index_display_data = []
      that.tableHead = []
      that.hotSettings.colHeaders = []
      // that.hotSettings.data = []
      // that.hotSettings.columns = []
      that.table_only_field = []
      that.post_index_display_table = []
      const m = that.$message({
        type: 'info',
        message: '正在查询中...',
        duration: 0
      })
      that.$axios({
        url: '/display/production-parameter/production-parameter-relation-field-by-table-name',
        method: 'get',
        params: {
          table_name: that.table_name
        }
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res.length !== 0) {
          that.indextable = res
          if (that.indextable['OnlyField1Name'].length !== 0) {
            that.post_index_display_table.push({'label': that.indextable['OnlyField1Name'], 'property': that.indextable['OnlyField1Name']})
          }
          if (that.indextable['OnlyField2Name'].length !== 0) {
            that.post_index_display_table.push({'label': that.indextable['OnlyField2Name'], 'property': that.indextable['OnlyField2Name']})
          }
          if (that.indextable['OnlyField3Name'].length !== 0) {
            that.post_index_display_table.push({'label': that.indextable['OnlyField3Name'], 'property': that.indextable['OnlyField3Name']})
          }
          if (that.indextable['OnlyField4Name'].length !== 0) {
            that.post_index_display_table.push({'label': that.indextable['OnlyField4Name'], 'property': that.indextable['OnlyField4Name']})
          }
          that.table_only_field.push({value: res['OnlyField1Name'], label: res['OnlyField1Name']})
          that.table_only_field.push({value: res['OnlyField2Name'], label: res['OnlyField2Name']})
          that.table_only_field.push({value: res['OnlyField3Name'], label: res['OnlyField3Name']})
          if (res['OnlyField4Name'].length !== 0) {
            that.table_only_field.push({value: res['OnlyField4Name'], label: res['OnlyField4Name']})
          }
          that.field_show = true
        }
      }).catch(function (error) {
        console.log(error)
        that.$message({
          type: 'error',
          message: '获取表中的唯一索引数据失败！'
        })
      })
      that.$axios({
        url: '/display/production-parameter/all-field-in-oracle-monitoring-table',
        method: 'get',
        params: {
          table_name: that.table_name
        }
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null) {
          var text = ''
          for (let i = 0; i < res.length; i++) {
            that.tableHead.push({'label': res[i], 'property': res[i]})
            if (i === 0) {
              text = res[i]
            } else {
              text = text + ',' + res[i]
            }
            that.hotSettings.colHeaders.push(res[i])
          }
          that.hotSettingsHeaderData = text
          // console.log(that.tableHead)
        }
        m.close()
      }).catch(function (error) {
        console.log(error)
        m.close()
        that.$message({
          type: 'error',
          message: '获取索引列表中的数据失败！'
        })
      })
      // console.log('获取索引列表中的数据')
    },
    // 查询数据库
    get_field () {
      let that = this
      that.oldtable = []
      that.$refs.testHot.hotInstance.clear()
      that.changeData = []
      that.post_index_display_data = []
      that.one_only_field_name = ''
      that.one_only_field_value = ''
      that.two_only_field_name = ''
      that.two_only_field_value = ''
      that.three_only_field_name = ''
      that.three_only_field_value = ''
      that.four_only_field_name = ''
      that.four_only_field_value = ''
      // console.log(that.table_only_field)
      var keys = Object.keys(this.table)
      // console.log(Object.keys(this.table))
      var value = Object.values(this.table)
      // console.log(Object.values(this.table))
      // console.log(keys[0])
      // for (let i = 0; i < keys.length; i++) {
      //   that.data.push({keys[i]: value[i]})
      // }
      if (that.table_only_field.length > 0) {
        that.one_only_field_name = that.table_only_field[0]['label']
        for (let i = 0; i < keys.length; i++) {
          if (keys[i] === that.one_only_field_name) {
            that.one_only_field_value = value[i]
          }
        }
        if (that.table_only_field.length > 1) {
          that.two_only_field_name = that.table_only_field[1]['label']
          for (let i = 0; i < keys.length; i++) {
            if (keys[i] === that.two_only_field_name) {
              that.two_only_field_value = value[i]
            }
          }
          if (that.table_only_field.length > 2) {
            that.three_only_field_name = that.table_only_field[2]['label']
            for (let i = 0; i < keys.length; i++) {
              if (keys[i] === that.three_only_field_name) {
                that.three_only_field_value = value[i]
              }
            }
            if (that.table_only_field.length > 3) {
              that.four_only_field_name = that.table_only_field[3]['label']
              for (let i = 0; i < keys.length; i++) {
                if (keys[i] === that.four_only_field_name) {
                  that.four_only_field_value = value[i]
                }
              }
            }
          }
        }
      }
      if (that.four_only_field_name !== '') {
        that.hotSettings.fixedColumnsLeft = 5
      } else {
        that.hotSettings.fixedColumnsLeft = 4
      }
      const m = that.$message({
        type: 'info',
        message: '正在查询中...',
        duration: 0
      })
      that.$axios({
        url: '/display/production-parameter/production-parameter-by-monitoring-table-and-field',
        method: 'get',
        params: {
          monitoring_table: that.table_name,
          only_field_1_name: that.one_only_field_name,
          only_field_1_value: that.one_only_field_value,
          only_field_2_name: that.two_only_field_name,
          only_field_2_value: that.two_only_field_value,
          only_field_3_name: that.three_only_field_name,
          only_field_3_value: that.three_only_field_value,
          only_field_4_name: that.four_only_field_name,
          only_field_4_value: that.four_only_field_value
        }
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res.length !== 0) {
          that.oldtable = res
          // console.log(res[0])
          if (that.hotSettings.colHeaders[that.hotSettings.colHeaders.length - 1] === 'slot') {
            that.hotSettings.colHeaders.splice(that.hotSettings.colHeaders.length - 1, 1)
          }
          that.hotSettings.columns = []
          // that.hotSettings.data = []
          that.hotSettings.columns.push({type: 'text'})
          for (let n = 0; n < Object.keys(res[0]).length; n++) {
            that.hotSettings.columns.push({type: 'text'})
          }
          for (let m = 0; m < res.length; m++) {
            that.hotSettings.data[m] = []
            for (let i = 0; i < that.hotSettings.colHeaders.length; i++) {
              // console.log(that.hotSettings.colHeaders[i])
              that.hotSettings.data[m].push(res[m][that.hotSettings.colHeaders[i]])
            }
            that.hotSettings.data[m].push(m)
          }
          // console.log(that.hotSettings.colHeaders)
          // console.log(that.hotSettings.columns)
          that.hotSettingsData = JSON.parse(JSON.stringify(that.hotSettings.data))
          m.close()
        } else {
          that.$message({
            type: 'error',
            message: '无相应数据！'
          })
        }
      }).catch(function (error) {
        console.log(error)
        m.close()
        if (error.response.status === 403) {
          that.$message({
            type: 'error',
            message: '无权限！'
          })
        } else if (error.response.status === 401) {
          that.$message({
            type: 'error',
            message: '未登录,请登录后再提交！'
          })
        } else {
          that.$message({
            type: 'error',
            message: '获取数据失败！'
          })
        }
      })
    },
    // 获取修改后的表格数据
    get_old_data (e) {
      console.log('e', e)
      console.log(this.hotSettingsData)
      console.log(this.hotSettings.data, this.hotSettings.data[this.hotSettings.data.length - 1])
      if (e !== null && e.length >= 1) {
        for (let i = 0; i < e.length; i++) {
          if (e[i][2] !== e[i][3] && e[i][2] !== null && e[i][3] !== null) {
            var test = String(e[i][0]) + ',' + String(e[i][1])
            if (e[i][3] === this.hotSettingsData[e[i][0]][e[i][1]]) {
              this.changeData = this.changeData.filter(function (element, index) {
                return element !== test
              })
            } else {
              this.changeData.push(test)
            }
          }
        }
      }
    },
    get_judge (row, col) {
      var test = String(row) + ',' + String(col)
      var judge = false
      for (let i = 0; i < this.changeData.length; i++) {
        if (this.changeData[i] === test) {
          judge = true
        }
      }
      if (judge === false) {
        return false
      } else {
        return true
      }
    },
    // 渲染时修改表格颜色02.02.05.00005
    get_rander (TD, row, col, prop, value, cellProperties) {
      // console.log(TD, row, col, prop, value, cellProperties)
      // console.log(this.changeData)
      if (row % 2 === 0) {
        // console.log(TD)
        TD.style.background = '#c2ffb4'
      }
      this.$nextTick(() => {
        if (this.get_judge(row, col) === true) {
          TD.style.background = 'red'
        }
      })
      // if (this.changeData.length !== 0) {
      //   console.log('有修改项')
      //   console.log(this.changeData)
      // }
    }
  },
  data () {
    return {
      restext: '',
      trueNumber: 0,
      falseNumber: 0,
      rowNumber: 0,
      remarkInput: '',
      hotSettingsData: [],
      changeData: [],
      innerHeight: window.innerHeight, // 获取窗口高度
      tableHeight: (window.innerHeight / 2), // 设置第一个div的高度为窗口高度的一半
      old_solt: 0,
      columnNumber: 0,
      new_data: '',
      number: 0,
      style_data: [],
      data: [],
      hotSettingsHeaderData: '',
      tableHead: [],
      list_header: '',
      new_list_all: '',
      old_list_all: '',
      post_new_list_all: '',
      item: '',
      olditem: '',
      old_data: '',
      old_data_name: '',
      new_data_name: '',
      one_only_field_name: '',
      one_only_field_value: '',
      two_only_field_name: '',
      two_only_field_value: '',
      three_only_field_name: '',
      three_only_field_value: '',
      four_only_field_name: '',
      four_only_field_value: '',
      table_name: '',
      oldtable: [],
      indextable: [],
      index_display_value_table: [],
      post_index_display_table: [],
      post_index_display_data: [],
      table_name_list: [],
      table_only_field: [],
      table: {},
      sub_boolean: true,
      field_show: false,
      root: 'test-hot',
      hotSettings: {
        // data: [['sample', 'data']],
        data: [ // 数据可以是二维数组，也可以是数组对象
        ],
        // colHeaders: true,
        startRows: 200, // 行列范围
        startCols: 200,
        minRows: 0, // 最小行列
        minCols: 10,
        maxRows: 200, // 最大行列
        maxCols: 200,
        // width: 800,
        // colWidths: 20,
        rowHeaders: true, // 行表头，可以使布尔值（行序号），可以使字符串（左侧行表头相同显示内容，可以解析html），也可以是数组（左侧行表头单独显示内容）。
        colHeaders: [], // 自定义列表头or 布尔值
        // minSpareCols: 2, // 列留白
        // minSpareRows: 2, // 行留白
        // currentRowClassName: 'currentRow', //为选中行添加类名，可以更改样式
        // currentColClassName: 'currentCol',//为选中列添加类名
        autoWrapRow: true, // 自动换行
        // contextMenu: {
        //   items: {
        //     'row_above': {
        //       name: '上方插入一行'
        //     },
        //     'row_below': {
        //       name: '下方插入一行'
        //     },
        //     'col_left': {
        //       name: '左方插入列'
        //     },
        //     'col_right': {
        //       name: '右方插入列'
        //     },
        //     'hsep1': '---------', // 提供分隔线
        //     'remove_row': {
        //       name: '删除行'
        //     },
        //     'remove_col': {
        //       name: '删除列'
        //     },
        //     'make_read_only': {
        //       name: '只读'
        //     },
        //     'borders': {
        //       name: '表格线'
        //     },
        //     'copy': {
        //       name: '复制'
        //     },
        //     'cut': {
        //       name: '剪切'
        //     },
        //     'commentsAddEdit': {
        //       name: '添加备注'
        //     },
        //     'commentsRemove': {
        //       name: '取消备注'
        //     },
        //     'freeze_column': {
        //       name: '固定列'
        //     },
        //     'unfreeze_column': {
        //       name: '取消列固定'
        //     },
        //     'hsep2': '---------'
        //   }
        // },
        afterChange: function (changes, source) { // 数据改变时触发此方法
          console.log(this.getData(), changes, source)
          // this.testFunc()
        },
        licenseKey: '4d522-5237a-55f42-6653a-d1494',
        manualColumnFreeze: true, // 手动固定列  ?
        manualColumnMove: false, // 手动移动列
        manualRowMove: true, // 手动移动行
        manualColumnResize: true, // 手工更改列距
        manualRowResize: true, // 手动更改行距
        comments: true, // 添加注释  ?
        cell: [ // ???
          {row: 1, col: 1, comment: {value: 'this is test'}}
        ],
        customBorders: [], // 添加边框
        columnSorting: false, // 排序
        stretchH: 'none', // 根据宽度横向扩展，last:只扩展最后一列，none：默认不扩展
        fillHandle: true, // 选中拖拽复制 possible values: true, false, "horizontal", "vertical"
        fixedColumnsLeft: 6, // 固定左边列数
        fixedRowsTop: 0, // 固定上边列数
        mergeCells: [ // 合并
          // {row: 1, col: 1, rowspan: 3, colspan: 3},  //指定合并，从（1,1）开始行3列3合并成一格
          // {row: 3, col: 4, rowspan: 2, colspan: 2}
        ],
        columns: [ // 添加每一列的数据类型和一些配置
        ]
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
body{
  text-align: center;
}
.overf{
  border: 1px solid black;
  background: white;
  width: 100%;
  height: 400px;
  overflow: hidden;
}
#example-container{
  overflow: auto;
  width: 100%;
  height: 100%;
}
</style>
