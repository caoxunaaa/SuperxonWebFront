<template>
  <div class="PTRPost">
    <h1>PTR修改界面</h1>
    <el-row>
      <el-col :span="21">
        <div style="margin: 0 auto; width: 100%; height: 320px; border: 1px solid black">
          <h4>查询数据库</h4>
          <b>选择表名:</b>
            <el-select v-model="table_name" filterable style="width: 300px"  placeholder="请选择表名">
              <el-option
                v-for="item in table_name_list"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button type="primary" @click="get_index">获取表中索引</el-button>
            <div style="width:100%">
              <p style="margin: 1px;width:100%" v-for="(item,index) in table_only_field" :key="index"><b>{{item.value}}</b><el-input style="width:400px" v-model="table[item.value]"></el-input></p>
              <!-- <el-input style="width:50%" v-for="(item,index) in table_name_list" :key="index" v-model="table[index]"></el-input> -->
              <el-button type="primary" @click="get_field">查询数据库</el-button>
            </div>
        </div>
        <div style="margin: 0 auto;width: 100%; border: 1px solid black">
          <el-table
          :data="oldtable"
          border
          lazy
          max-height="800px"
          :row-style="{height:'20px'}"
          :cell-style="columnStyle"
          :header-cell-style="{background: '#f56c6c'}"
          style="font-size: 10px">
            <el-table-column style="font-size: 10px" width="120" :render-header="renderHeader" :label="item.label" :property="item.property" :key="item.index" v-for="item in tableHead">
            <template slot-scope="scope">
              <span @click="handelAddRow(scope.$index,scope.row)" class="oper-btn">
                <i class="dse-function-icon zeng"></i>
              </span>
              <span v-if="scope.row.status">{{scope.row.name}}</span>
              <el-input @keyup.enter.native="enter_blur($event)" size="mini" v-else @focus="get_old_data(scope.column.property, scope.row[scope.column.property])" @blur="get_data(scope, scope.row, scope.$index)" v-model="scope.row[scope.column.property]"></el-input>
              <!-- {{scope.row[scope.column.property]}} -->
            </template>
          </el-table-column>
          </el-table>
        </div>
        <!-- <div style="margin: 0 auto; width: 50%; height: 800px; border: 1px solid black">
          <h4>{{item}}{{olditem}}</h4>
        </div> -->
        <div style="margin: 0 auto; width: 100%; height: 800px; border: 1px solid black">
          <el-table
          :data="post_index_display_data"
          border
          max-height="800px"
          :row-style="{height:'20px'}"
          :cell-style="{padding:'0px'}"
          style="font-size: 10px">
          <el-table-column width="150" :label="item.label" :property="item.property" :key="item.index" v-for="item in post_index_display_table">
            <template slot-scope="scope">
              <span>{{scope.row[scope.column.property]}}</span>
            </template>
          </el-table-column>
          <el-table-column
          prop="post"
            label="修改项"
          ></el-table-column>
          <el-table-column
          prop="old"
            label="旧值"
          ></el-table-column>
          <el-table-column
          prop="new"
            label="新值"
          ></el-table-column>
          <el-table-column
            label="备注">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remarks"></el-input>
            <!-- <p>{{scope.row.remarks}}</p> -->
          </template>
          </el-table-column>
          <el-table-column
            width="240"
            label="是否改回">
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.time"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
            <!-- <el-input v-model="scope.row.time"></el-input> -->
            <!-- <p>{{scope.row.time}}</p> -->
          </template>
          </el-table-column>
          <el-table-column
          fixed="right"
            label="操作">
            <template slot-scope="scope">
            <el-button
              @click="deleteRow(scope.$index, post_index_display_data)"
              type="text"
              size="small">
              移除
            </el-button>
          </template>
          </el-table-column>
          </el-table>
        </div>
        <el-button type="primary" @click="post_delete_all">移除全部修改数据</el-button>
        <el-button type="primary" @click="get_all_table">确认提交</el-button>
      </el-col>
      <el-col :span="3" style="border: 1px solid black">
        <div style="width:100%;background:green;float:left; border: 1px solid black">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
            v-model="new_list_all">
          </el-input>
        </div>
        <div style="width:50%;background:green;color:white;float:left;">
          <h4>{{list_header}}原始数据</h4>
          <hr>
          <div style="line-height: 21px;font-size: 13px"
            v-html="old_list_all">
          </div>
        </div>
        <div style="width:50%;background:#f56c6c;color:white;float:left;">
          <h4>{{list_header}}修改数据</h4>
          <hr>
          <div style="line-height: 21px;font-size: 13px"
            v-html="post_new_list_all">
          </div>
        </div>
        <el-button type="primary" @click="get_post_batch">确认修改</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'PTRPost',
  components: {
  },
  mounted () {
    this.get_table_name()
  },
  watch: {
    new_list_all: {
      handler: function (newVal, oldVal) {
        // console.log('newVal', newVal)
        // console.log('oldVal', oldVal)
        this.show_new_list_all()
      },
      deep: true
    }
  },
  methods: {
    // enter回车失去焦点
    enter_blur (event) {
      event.target.blur()
    },
    // 显示批量修改的数据
    show_new_list_all () {
      console.log(this.new_list_all)
      if (this.new_list_all !== '') {
        var pp = ''
        for (let i = 0; i < this.new_list_all.split(/[\s\n]/).length; i++) {
          if (this.new_list_all.split(/[\s\n]/)[i] !== '') {
            console.log(this.oldtable)
            if (this.oldtable.length !== 0) {
              if (this.oldtable[i][this.list_header] === this.new_list_all.split(/[\s\n]/)[i]) {
                pp = pp + '<b>' + this.new_list_all.split(/[\s\n]/)[i] + '</b>' + '<hr style="margin:0">'
              } else {
                pp = pp + '<b style="color: black">' + this.new_list_all.split(/[\s\n]/)[i] + '</b>' + '<hr style="margin:0">'
              }
            }
          } else {
            pp = pp + '<b> ' + this.new_list_all.split(/[\s\n]/)[i] + ' </b>' + '<br><hr style="margin:0">'
          }
        }
      }
      this.post_new_list_all = pp
      console.log(pp)
    },
    // 批量修改数据确认按钮
    get_post_batch () {
      if (this.new_list_all !== '' && this.oldtable !== '') {
        console.log('1')
        console.log(this.new_list_all)
        console.log(this.new_list_all.split(/[\s\n]/))
        console.log(this.new_list_all.split(/[(\r\n)\r\n]+/))
        if (this.oldtable.length === this.new_list_all.split(/[\s\n]/).length) {
          console.log('2')
          var newListData = this.new_list_all.split(/[\s\n]/)
          console.log(newListData)
          for (let i = 0; i < newListData.length; i++) {
            if (newListData[i] !== this.oldtable[i][this.list_header]) {
              console.log('3')
              var columns = {$index: i}
              var rows = JSON.parse(JSON.stringify(this.oldtable[i]))
              rows[this.list_header] = newListData[i]
              this.get_old_data(this.list_header, this.oldtable[i][this.list_header])
              this.get_data(columns, rows, columns)
              if (newListData[i] !== '' && this.oldtable[i][this.list_header] !== '') {
                this.oldtable[i][this.list_header] = newListData[i]
              }
            }
          }
          this.old_list_all = ''
          this.new_list_all = ''
          this.list_header = ''
        } else {
          this.message({
            type: 'error',
            message: '修改数据的长度不符！'
          })
        }
      }
    },
    // 为数据库表头添加按钮获取当前列的数据
    renderHeader (h, para) {
      console.log(para.column['label'])
      return (
        h('span', [
          h('el-button', {
            on: {
              click: this.handelAddRow
            },
            props: {
              type: 'danger'
            }
          }, para.column.label)
          // h('span', para.column.label)
        ])
      )
    },
    // 将数据提交给批量操作框
    handelAddRow (listHeader) {
      this.list_header = listHeader['target']['innerText']
      var hh = ''
      if (this.oldtable.length !== 0) {
        for (let i = 0; i < this.oldtable.length; i++) {
          if (this.oldtable[i][this.list_header] !== '') {
            hh = hh + '<b>' + this.oldtable[i][this.list_header] + '</b>' + '<hr style="margin:0">'
          } else {
            hh = hh + '<b>' + this.oldtable[i][this.list_header] + '</b>' + '<br><hr style="margin:0">'
          }
        }
      }
      this.old_list_all = hh
      console.log(hh)
      console.log(this.list_header)
      console.log('添加点击事件')
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
      })
      console.log('获取表名列表中的数据')
    },
    // 获取表中的唯一索引
    get_index () {
      let that = this
      that.oldtable = []
      that.post_index_display_data = []
      that.tableHead = []
      that.table_only_field = []
      that.post_index_display_table = []
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
          console.log(res['OnlyField4Name'].length)
          if (res['OnlyField4Name'].length !== 0) {
            that.table_only_field.push({value: res['OnlyField4Name'], label: res['OnlyField4Name']})
          }
          that.field_show = true
        }
      })
      that.$axios({
        url: '/display/production-parameter/all-field-in-oracle-monitoring-table',
        method: 'get',
        params: {
          monitoring_table: that.table_name
        }
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null) {
          for (let i = 0; i < res.length; i++) {
            that.tableHead.push({'label': res[i], 'property': res[i]})
          }
          console.log(that.tableHead)
        }
      })
      console.log('获取索引列表中的数据')
    },
    // 查询数据库
    get_field () {
      let that = this
      that.oldtable = []
      that.post_index_display_data = []
      that.one_only_field_name = ''
      that.one_only_field_value = ''
      that.two_only_field_name = ''
      that.two_only_field_value = ''
      that.three_only_field_name = ''
      that.three_only_field_value = ''
      that.four_only_field_name = ''
      that.four_only_field_value = ''
      console.log(that.table_only_field)
      var keys = Object.keys(this.table)
      console.log(Object.keys(this.table))
      var value = Object.values(this.table)
      console.log(Object.values(this.table))
      console.log(keys[0])
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
      // if (Object.keys(that.table).length > 0) {
      //   that.one_only_field_name = keys[0]
      //   that.one_only_field_value = value[0]
      //   if (Object.keys(that.table).length > 1) {
      //     that.two_only_field_name = keys[1]
      //     that.two_only_field_value = value[1]
      //     if (Object.keys(that.table).length > 2) {
      //       that.three_only_field_name = keys[2]
      //       that.three_only_field_value = value[2]
      //       if (Object.keys(that.table).length > 1) {
      //         that.four_only_field_name = keys[3]
      //         that.four_only_field_value = value[3]
      //       }
      //     }
      //   }
      // }
      that.$axios({
        url: '/display/production-parameter/production-parameter-by-monitoring-table-and-only-field-and-changed-item',
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
          console.log(that.oldtable)
        } else {
          that.$message({
            type: 'error',
            message: '无相应数据！'
          })
        }
      })
    },
    // 获取旧的数据
    get_old_data (column, row) {
      console.log(column)
      console.log(row)
      this.old_data_name = column
      this.new_data_name = column
      this.old_data = row
    },
    // 获取新的数据添加到表格中
    get_data (column, row, index) {
      console.log(column.$index)
      console.log(column)
      console.log(row)
      console.log(index)
      console.log(this.old_data)
      console.log(row[this.old_data_name])
      // ID与索引项无法进行修改
      if (this.old_data_name !== this.indextable['OnlyField1Name'] && this.old_data_name !== this.indextable['OnlyField2Name'] && this.old_data_name !== this.indextable['OnlyField3Name'] && this.old_data_name !== 'ID') {
        console.log('1')
        if (this.indextable['OnlyField4Name'].length !== 0) {
          console.log('2')
          if (this.old_data_name !== this.indextable['OnlyField4Name']) {
            console.log('3')
            if (this.old_data !== '') {
              console.log('4')
              if (row[this.old_data_name] !== '') {
                console.log('5')
                if (this.old_data !== row[this.old_data_name]) {
                  console.log('6')
                  var judge = true
                  // 先进行判断是否为已修改过的数据
                  if (this.indextable['OnlyField4Name'].length !== 0) {
                    console.log('7')
                    for (let i = 0; i < this.post_index_display_data.length; i++) {
                      if (this.post_index_display_data[i][this.indextable['OnlyField1Name']] === row[this.indextable['OnlyField1Name']] && this.post_index_display_data[i][this.indextable['OnlyField2Name']] === row[this.indextable['OnlyField2Name']] && this.post_index_display_data[i][this.indextable['OnlyField3Name']] === row[this.indextable['OnlyField3Name']] && this.post_index_display_data[i][this.indextable['OnlyField4Name']] === row[this.indextable['OnlyField4Name']] && this.old_data_name === this.post_index_display_data[i]['post']) {
                        console.log(this.post_index_display_data[i])
                        console.log(row)
                        if (row[this.old_data_name] !== this.post_index_display_data[i]['old']) {
                          this.post_index_display_data[i]['new'] = row[this.old_data_name]
                        } else {
                          this.post_index_display_data.splice(i, 1)
                        }
                        judge = false
                      }
                    }
                  } else {
                    for (let i = 0; i < this.post_index_display_data.length; i++) {
                      if (this.post_index_display_data[i][this.indextable['OnlyField1Name']] === row[this.indextable['OnlyField1Name']] && this.post_index_display_data[i][this.indextable['OnlyField2Name']] === row[this.indextable['OnlyField2Name']] && this.post_index_display_data[i][this.indextable['OnlyField3Name']] === row[this.indextable['OnlyField3Name']]) {
                        console.log(this.post_index_display_data[i])
                        console.log(row)
                      }
                    }
                  }
                  console.log(judge)
                  if (judge === true) {
                    this.item = row[this.old_data_name]
                    var obj = {}
                    if (this.indextable['OnlyField1Name'].length !== 0) {
                      obj[this.indextable['OnlyField1Name']] = row[this.indextable['OnlyField1Name']]
                    }
                    if (this.indextable['OnlyField2Name'].length !== 0) {
                      obj[this.indextable['OnlyField2Name']] = row[this.indextable['OnlyField2Name']]
                    }
                    if (this.indextable['OnlyField3Name'].length !== 0) {
                      obj[this.indextable['OnlyField3Name']] = row[this.indextable['OnlyField3Name']]
                    }
                    if (this.indextable['OnlyField4Name'].length !== 0) {
                      obj[this.indextable['OnlyField4Name']] = row[this.indextable['OnlyField4Name']]
                    }
                    // this.column_index.push(column.$index)
                    let num = 0
                    for (let i = 0; i < this.tableHead.length; i++) {
                      if (this.tableHead[i]['label'] !== this.old_data_name) {
                        num += 1
                      } else {
                        console.log(num)
                        obj['column_index'] = num
                      }
                    }
                    obj['row_index'] = column.$index
                    obj['old'] = this.old_data
                    obj['post'] = this.old_data_name
                    obj['new'] = this.item
                    obj['remarks'] = ''
                    this.post_index_display_data.push(obj)
                    console.log(this.post_index_display_data)
                    this.number += 1
                    // console.log(this.column_index)
                    // console.log(this.row_index)
                  }
                }
              } else {
                this.$message({
                  type: 'error',
                  message: '修改后的值无法为空！'
                })
                this.oldtable[column.$index][this.old_data_name] = this.old_data
              }
            } else {
              this.$message({
                type: 'error',
                message: '旧值为空的项无法进行修改！'
              })
              this.oldtable[column.$index][this.old_data_name] = this.old_data
            }
          } else {
            this.$message({
              type: 'error',
              message: 'ID项与索引项无法进行修改！'
            })
            this.oldtable[column.$index][this.old_data_name] = this.old_data
          }
        } else {
          if (this.old_data !== '') {
            if (row[this.old_data_name] !== '') {
              if (this.old_data !== row[this.old_data_name]) {
                var judgethree = true
                // 先进行判断是否为已修改过的数据
                if (this.indextable['OnlyField4Name'].length !== 0) {
                  for (let i = 0; i < this.post_index_display_data.length; i++) {
                    if (this.post_index_display_data[i][this.indextable['OnlyField1Name']] === row[this.indextable['OnlyField1Name']] && this.post_index_display_data[i][this.indextable['OnlyField2Name']] === row[this.indextable['OnlyField2Name']] && this.post_index_display_data[i][this.indextable['OnlyField3Name']] === row[this.indextable['OnlyField3Name']] && this.post_index_display_data[i][this.indextable['OnlyField4Name']] === row[this.indextable['OnlyField4Name']] && this.old_data_name === this.post_index_display_data[i]['post']) {
                      console.log(this.post_index_display_data[i])
                      console.log(row)
                      if (row[this.old_data_name] !== this.post_index_display_data[i]['old']) {
                        this.post_index_display_data[i]['new'] = row[this.old_data_name]
                      } else {
                        this.post_index_display_data.splice(i, 1)
                      }
                      judgethree = false
                    }
                  }
                } else {
                  for (let i = 0; i < this.post_index_display_data.length; i++) {
                    if (this.post_index_display_data[i][this.indextable['OnlyField1Name']] === row[this.indextable['OnlyField1Name']] && this.post_index_display_data[i][this.indextable['OnlyField2Name']] === row[this.indextable['OnlyField2Name']] && this.post_index_display_data[i][this.indextable['OnlyField3Name']] === row[this.indextable['OnlyField3Name']]) {
                      console.log(this.post_index_display_data[i])
                      console.log(row)
                    }
                  }
                }
                console.log(judgethree)
                if (judgethree === true) {
                  this.item = row[this.old_data_name]
                  var objthree = {}
                  if (this.indextable['OnlyField1Name'].length !== 0) {
                    objthree[this.indextable['OnlyField1Name']] = row[this.indextable['OnlyField1Name']]
                  }
                  if (this.indextable['OnlyField2Name'].length !== 0) {
                    objthree[this.indextable['OnlyField2Name']] = row[this.indextable['OnlyField2Name']]
                  }
                  if (this.indextable['OnlyField3Name'].length !== 0) {
                    objthree[this.indextable['OnlyField3Name']] = row[this.indextable['OnlyField3Name']]
                  }
                  if (this.indextable['OnlyField4Name'].length !== 0) {
                    objthree[this.indextable['OnlyField4Name']] = row[this.indextable['OnlyField4Name']]
                  }
                  // this.column_index.push(column.$index)
                  let num = 0
                  for (let i = 0; i < this.tableHead.length; i++) {
                    if (this.tableHead[i]['label'] !== this.old_data_name) {
                      num += 1
                    } else {
                      console.log(num)
                      objthree['column_index'] = num
                    }
                  }
                  objthree['row_index'] = column.$index
                  objthree['old'] = this.old_data
                  objthree['post'] = this.old_data_name
                  objthree['new'] = this.item
                  objthree['remarks'] = ''
                  this.post_index_display_data.push(objthree)
                  console.log(this.post_index_display_data)
                  this.number += 1
                  // console.log(this.column_index)
                  // console.log(this.row_index)
                }
              }
            } else {
              this.$message({
                type: 'error',
                message: '修改后的值无法为空！'
              })
              this.oldtable[column.$index][this.old_data_name] = this.old_data
            }
          } else {
            this.$message({
              type: 'error',
              message: '旧值为空的项无法进行修改！'
            })
            this.oldtable[column.$index][this.old_data_name] = this.old_data
          }
        }
      } else {
        this.$message({
          type: 'error',
          message: 'ID项与索引项无法进行修改！'
        })
        this.oldtable[column.$index][this.old_data_name] = this.old_data
      }
      // this.olditem = this.index_display_value_table + this.old_data_name + '旧数据为：' + this.old_data + ',新数据为：' + this.item
    },
    // 提交按钮
    get_all_table () {
      let that = this
      let formdata = new FormData()
      formdata.append('username', localStorage.getItem('username'))
      formdata.append('nickname', localStorage.getItem('nickname'))
      formdata.append('update_time', that.moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
      formdata.append('monitoring_table', that.table_name)
      console.log(that.post_index_display_data)
      if (that.post_index_display_data.length !== 0) {
        for (let i = 0; i < that.post_index_display_data.length; i++) {
          formdata.append('only_field_1_name', that.indextable['OnlyField1Name'])
          formdata.append('only_field_1_value', that.post_index_display_data[i][that.indextable['OnlyField1Name']])
          formdata.append('only_field_2_name', that.indextable['OnlyField2Name'])
          formdata.append('only_field_2_value', that.post_index_display_data[i][that.indextable['OnlyField2Name']])
          formdata.append('only_field_3_name', that.indextable['OnlyField3Name'])
          formdata.append('only_field_3_value', that.post_index_display_data[i][that.indextable['OnlyField3Name']])
          if (that.indextable['OnlyField4Name'].length !== 0) {
            formdata.append('only_field_4_name', that.indextable['OnlyField4Name'])
            formdata.append('only_field_4_value', that.post_index_display_data[i][that.indextable['OnlyField4Name']])
          } else {
            formdata.append('only_field_4_name', '')
            formdata.append('only_field_4_value', '')
          }
          formdata.append('changed_item', that.post_index_display_data[i]['post'])
          formdata.append('old_value', that.post_index_display_data[i]['old'])
          formdata.append('new_value', that.post_index_display_data[i]['new'])
          if (that.post_index_display_data[i]['time'] !== null && that.post_index_display_data[i]['time'] !== undefined) {
            formdata.append('update_reason', 'callback:' + that.moment(that.post_index_display_data[i]['time']).format('YYYY-MM-DD HH:mm:ss'))
          } else {
            formdata.append('update_reason', that.post_index_display_data[i]['remarks'])
          }
          console.log(formdata.getAll('update_reason'))
          that.$axios({
            url: '/display/background-management/production-parameter-record',
            method: 'put',
            data: formdata
          }).then(function (response) {
            console.log(response)
            if (response.status === 200) {
              that.$message({
                type: 'success',
                message: '修改成功！'
              })
            }
          }).catch(function (error) {
            if (error.response.status === 403) {
              that.$message({
                type: 'error',
                message: '无修改权限！'
              })
            } else if (error.response.status === 401) {
              that.$message({
                type: 'error',
                message: '未登录,请登录后再提交！'
              })
            } else {
              that.$message({
                type: 'error',
                message: '提交失败，请重新提交！'
              })
            }
          })
        }
      } else {
        that.$message({
          type: 'error',
          message: '暂无修改的数据！'
        })
      }
    },
    // 移除全部数据
    post_delete_all () {
      if (this.post_index_display_data.length !== 0) {
        for (let i = 0; i < this.post_index_display_data.length; i++) {
          var o = this.post_index_display_data
          this.deleteRow(0, o)
          i = i - 1
        }
      } else {
        this.$message({
          type: 'error',
          message: '当前暂无修改数据'
        })
      }
    },
    // 移除
    deleteRow (index, rows) {
      console.log(rows)
      console.log(index)
      // console.log(rows[index]['old'])
      for (let i = 0; i < this.oldtable.length; i++) {
        if (this.oldtable[i][this.indextable['OnlyField1Name']] === rows[index][this.indextable['OnlyField1Name']] && this.oldtable[i][this.indextable['OnlyField2Name']] === rows[index][this.indextable['OnlyField2Name']] && this.oldtable[i][this.indextable['OnlyField3Name']] === rows[index][this.indextable['OnlyField3Name']]) {
          if (this.indextable['OnlyField4Name'].length !== 0) {
            if (this.oldtable[i][this.indextable['OnlyField4Name']] === rows[index][this.indextable['OnlyField4Name']]) {
              // 还原数据
              console.log(this.oldtable[i][rows[index]['post']])
              this.oldtable[i][rows[index]['post']] = rows[index]['old']
            }
          } else {
            // 还原数据
            console.log(this.oldtable[i][rows[index]['post']])
            this.oldtable[i][rows[index]['post']] = rows[index]['old']
          }
        }
        console.log(this.oldtable[i][this.indextable['OnlyField1Name']])
      }
      this.post_index_display_data = rows.slice(0, index).concat(rows.slice(index + 1))
      // console.log(rows.slice(0, index))
      // console.log(rows.slice(index + 1))
    },
    // 修改单元格颜色
    columnStyle ({row, column, rowIndex, columnIndex}) {
      var res = 'padding: 0;'
      if (rowIndex % 2 === 0) {
        res = res + 'background-color:oldlace'
      } else {
        res = res + 'background-color:#f0f9eb'
      }
      if (this.post_index_display_data.length !== 0) {
        // console.log(this.post_index_display_data)
        for (let i = 0; i < this.post_index_display_data.length; i++) {
          if (columnIndex === this.post_index_display_data[i]['column_index'] && rowIndex === this.post_index_display_data[i]['row_index']) {
            res = 'background-color: red; color: #67C23A; padding: 0'
          }
        }
      }
      return res
    }
  },
  data () {
    return {
      number: 0,
      style_data: [],
      data: [],
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
      field_show: false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
body{
  text-align: center;
}
</style>
