<template>
  <div class="MaterialGear">
    <el-button
      size="mini"
      type="success"
      icon="el-icon-plus"
      @click="ScreenAddDialog">展示物料
    </el-button>
<!--    <el-button-->
<!--      size="mini"-->
<!--      type="primary"-->
<!--      icon="el-icon-plus"-->
<!--      @click="UsedAddDialog">使用-->
<!--    </el-button>-->
    <div style="border: 1px solid black;margin:10px" v-for="(item,key,index) in AllBaseLdData" :key="index">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-table
            :data="item"
            style="border: 1px solid black">
            <el-table-column
              prop="MaterialNum"
              label="物料"
              align="center">
            </el-table-column>
            <el-table-column
              prop='Gear'
              label="档位"
              align="center">
            </el-table-column>
            <el-table-column
              prop='Note'
              label="档位备注"
              align="center">
              <template slot-scope="scope">
                <el-tag>{{ scope.row.Note }}</el-tag>
                <el-button
                  size="mini"
                  type="info"
                  icon="el-icon-edit-outline"
                  @click="NoteSetDialog(scope.$index, scope.row)"></el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop='ScreenNum'
              label="今日筛选"
              align="center">
              <template slot-scope="scope">
                <el-tag>{{ scope.row.ScreenNum }}</el-tag>
                <el-button
                  size="mini"
                  type="success"
                  icon="el-icon-edit-outline"
                  @click="ScreenUpdateDialog(scope.$index, scope.row)"></el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop='UsedNum'
              label="今日使用"
              align="center">
              <template slot-scope="scope">
                <el-tag>{{ scope.row.UsedNum }}</el-tag>
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit-outline"
                  @click="UsedUpdateDialog(scope.$index, scope.row)"></el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop='Storage'
              label="库存总量"
              align="center">
              <template slot-scope="scope">
                <el-tag>{{ scope.row.Storage }}</el-tag>
                <el-button
                  size="mini"
                  type="warning"
                  icon="el-icon-edit-outline"
                  @click="CorrectionDialog(scope.$index, scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      title="筛选新增"
      :visible.sync="dialogScreenAddVisible"
      width="1200px">
      <div style="border: 1px solid red; width:100%">
        <el-table
          :data="ScreenAddData"
          border>
          <el-table-column
            prop="MaterialNum"
            label="物料"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.MaterialNum"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop='BatchNum'
            label="批次号"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.BatchNum"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop='Gear'
            label="档位"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.Gear"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop='ScreenNum'
            label="筛选数量"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.ScreenNum"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop='ScreenDate'
            label="筛选日期"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.ScreenDate"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="确定"
            align="center">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="success"
                icon="el-icon-check"
                @click="ScreenAdd(scope.row)" ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog
      title="使用新增"
      :visible.sync="dialogUsedAddVisible"
      width="1200px">
      <div style="border: 1px solid red; width:100%">
        <el-table
          :data="UsedAddData"
          border>
          <el-table-column
            prop="MaterialNum"
            label="物料"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.MaterialNum"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop='Gear'
            label="档位"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.Gear"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop='UsedNum'
            label="使用数量"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.UsedNum"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop='UsedDate'
            label="使用日期"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.UsedDate"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="确定"
            align="center">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="success"
                icon="el-icon-check"
                @click="UsedAdd(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>

      </div>
    </el-dialog>
    <el-dialog
      v-if="dialogScreenUpdateVisible===true"
      title="筛选修改"
      :visible.sync="dialogScreenUpdateVisible"
      width="1200px">
      <div style="border: 1px solid red; width:100%">
        <el-table
          :data="ScreenUpdateData"
          border>
          <el-table-column

            prop="MaterialNum"
            label="物料"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.MaterialNum" :disabled="true"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop='BatchNum'
            label="批次号"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.BatchNum"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop='Gear'
            label="档位"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.Gear" :disabled="true"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop='ScreenNum'
            label="筛选数量"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.ScreenNum"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop='ScreenDate'
            label="筛选日期"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.ScreenDate" :disabled="true"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="确定"
            align="center">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="success"
                icon="el-icon-check"
                @click="ScreenUpdate(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>

      </div>
    </el-dialog>
    <el-dialog
      v-if="dialogUsedUpdateVisible===true"
      title="使用修改"
      :visible.sync="dialogUsedUpdateVisible"
      width="1200px">
      <div style="border: 1px solid red; width:100%">
        <el-table
          :data="UsedUpdateData"
          border>
          <el-table-column
            prop="MaterialNum"
            label="物料"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.MaterialNum" :disabled="true"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop='Gear'
            label="档位"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.Gear" :disabled="true"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop='UsedNum'
            label="使用数量"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.UsedNum"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop='UsedDate'
            label="使用日期"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.UsedDate" :disabled="true"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="确定"
            align="center">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="success"
                icon="el-icon-check"
                @click="UsedUpdate(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog
      v-if="dialogCorrectionVisible===true"
      title="库存修正"
      :visible.sync="dialogCorrectionVisible"
      width="1200px">
      <div style="border: 1px solid red; width:100%">
        <el-table
          :data="CorrectionData"
          border>
          <el-table-column
            prop="MaterialNum"
            label="物料"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.MaterialNum" :disabled="true"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop='Gear'
            label="档位"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.Gear" :disabled="true"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop='Correction'
            label="修正数量（可以为负数）"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.Correction"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="确定"
            align="center">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="success"
                icon="el-icon-check"
                @click="CorrectionSet(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog
      v-if="dialogNoteSetVisible===true"
      title="档位备注"
      :visible.sync="dialogNoteSetVisible"
      width="1200px">
      <div style="border: 1px solid red; width:100%">
        <el-table
          :data="NoteSetData"
          border>
          <el-table-column
            prop="MaterialNum"
            label="物料"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.MaterialNum" :disabled="true"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop='Gear'
            label="档位"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.Gear" :disabled="true"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop='Note'
            label="备注"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.Note"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="确定"
            align="center">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="success"
                icon="el-icon-check"
                @click="NoteSet(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'MaterialGear',
  components: {},
  data () {
    return {
      num: true,
      dialogScreenAddVisible: false,
      dialogScreenUpdateVisible: false,
      dialogUsedAddVisible: false,
      dialogUsedUpdateVisible: false,
      dialogCorrectionVisible: false,
      dialogNoteSetVisible: false,
      // 先进行表格的构造
      AllBaseLdData: {'03.02.01.00181': [{MaterialNum: '', Gear: '', Note: '', ScreenNum: 0, UsedNum: 0, Storage: 0}]},
      ScreenAddData: [{
        MaterialNum: '',
        BatchNum: '',
        Gear: '',
        ScreenNum: 0,
        ScreenDate: String(this.moment(new Date()).format('YYYY-MM-DD'))
      }],
      ScreenUpdateData: [{
        MaterialNum: '',
        BatchNum: '',
        Gear: '',
        ScreenNum: 0,
        ScreenDate: String(this.moment(new Date()).format('YYYY-MM-DD'))
      }],
      UsedAddData: [{
        MaterialNum: '',
        Gear: '',
        UsedNum: 0,
        UsedDate: String(this.moment(new Date()).format('YYYY-MM-DD'))
      }],
      UsedUpdateData: [{
        MaterialNum: '',
        Gear: '',
        UsedNum: 0,
        UsedDate: String(this.moment(new Date()).format('YYYY-MM-DD'))
      }],
      CorrectionData: [{
        MaterialNum: '',
        Gear: '',
        Correction: 0
      }],
      NoteSetData: [{
        MaterialNum: '',
        Gear: '',
        Note: ''
      }]
    }
  },
  mounted () {
    this.GetAllBaseLdData()
  },
  methods: {
    // 获取全部的数据
    GetAllBaseLdData () {
      this.AllBaseLdData = {'03.02.01.00181': [{MaterialNum: '', Gear: '', Note: '', ScreenNum: 0, UsedNum: 0, Storage: 0}]}
      let time = String(this.moment(new Date()).format('YYYY-MM-DD'))
      let that = this
      that.$axios({
        url: '/display/production-material/base-ld-statistic',
        method: 'get',
        params: {
          date: time
        }
      }).then(function (response) {
        let res = response.data
        // 合并同料号
        for (let i = 0; i < res.length; i++) {
          if (!Array.isArray(that.AllBaseLdData[res[i].MaterialNum])) {
            that.AllBaseLdData[res[i].MaterialNum] = new Array(0)
          }
          that.AllBaseLdData[res[i].MaterialNum].push(res[i])
        }
        that.AllBaseLdData['03.02.01.00181'].splice(0, 1)
        console.log('获取完成', that.AllBaseLdData)
      }).catch(function (error) {
        console.log(error)
        that.$message({
          type: 'error',
          message: '获取数据失败！'
        })
      })
    },
    ScreenUpdateDialog (index, row) {
      this.dialogScreenUpdateVisible = true
      this.ScreenUpdateData[0].MaterialNum = row.MaterialNum
      this.ScreenUpdateData[0].BatchNum = ''
      this.ScreenUpdateData[0].Gear = row.Gear
      this.ScreenUpdateData[0].ScreenNum = row.ScreenNum
    },
    UsedUpdateDialog (index, row) {
      this.dialogUsedUpdateVisible = true
      this.UsedUpdateData[0].MaterialNum = row.MaterialNum
      this.UsedUpdateData[0].Gear = row.Gear
      this.UsedUpdateData[0].UsedNum = row.UsedNum
    },
    CorrectionDialog (index, row) {
      this.dialogCorrectionVisible = true
      this.CorrectionData[0].MaterialNum = row.MaterialNum
      this.CorrectionData[0].Gear = row.Gear
      this.CorrectionData[0].Correction = 0
    },
    NoteSetDialog (index, row) {
      this.dialogNoteSetVisible = true
      this.NoteSetData[0].MaterialNum = row.MaterialNum
      this.NoteSetData[0].Gear = row.Gear
      this.NoteSetData[0].Note = row.Note
    },
    ScreenAddDialog () {
      this.dialogScreenAddVisible = true
      this.ScreenAddData = [{
        MaterialNum: '',
        BatchNum: '',
        Gear: '',
        ScreenNum: 0,
        ScreenDate: String(this.moment(new Date()).format('YYYY-MM-DD'))
      }]
    },
    UsedAddDialog () {
      this.dialogUsedAddVisible = true
      this.UsedAddDate = [{
        MaterialNum: '',
        Gear: '',
        UsedNum: 0,
        UsedDate: String(this.moment(new Date()).format('YYYY-MM-DD'))
      }]
    },

    ScreenAdd (row) {
      let that = this
      let formData = new FormData()
      if (row.MaterialNum === '' || row.BatchNum === '' || row.Gear === '') {
        that.$message({
          type: 'error',
          message: '料号，批次号，档位不能为空'
        })
        return
      }
      formData.append('material_num', row.MaterialNum)
      formData.append('batch_num', row.BatchNum)
      formData.append('gear', row.Gear)
      formData.append('screen_num', row.ScreenNum)
      formData.append('screen_date', String(that.moment(new Date()).format('YYYY-MM-DD')))
      that.$axios({
        url: '/display/production-material/base-ld-screen',
        method: 'post',
        data: formData
      }).then(function (response) {
        that.$message({
          type: 'success',
          message: '新增成功'
        })
        that.GetAllBaseLdData()
        that.dialogScreenAddVisible = false
      }).catch(function (err) {
        that.$message({
          type: 'error',
          message: '新增失败,' + err.response.data
        })
      })
    },
    ScreenUpdate (row) {
      let that = this
      let formData = new FormData()
      if (row.MaterialNum === '' || row.BatchNum === '' || row.Gear === '') {
        that.$message({
          type: 'error',
          message: '料号，批次号，档位不能为空'
        })
        return
      }
      formData.append('material_num', row.MaterialNum)
      formData.append('batch_num', row.BatchNum)
      formData.append('gear', row.Gear)
      formData.append('screen_num', row.ScreenNum)
      formData.append('screen_date', String(that.moment(new Date()).format('YYYY-MM-DD')))
      that.$axios({
        url: '/display/production-material/base-ld-screen',
        method: 'put',
        data: formData
      }).then(function (response) {
        that.$message({
          type: 'success',
          message: '修改成功'
        })
        that.GetAllBaseLdData()
        that.dialogScreenUpdateVisible = false
      }).catch(function () {
        that.$message({
          type: 'error',
          message: '修改失败,可能没有这个批号，请先新增'
        })
      })
    },
    UsedAdd (row) {
      let that = this
      let formData = new FormData()
      if (row.MaterialNum === '' || row.Gear === '') {
        that.$message({
          type: 'error',
          message: '料号，档位不能为空'
        })
        return
      }
      console.log(row)
      formData.append('material_num', row.MaterialNum)
      formData.append('gear', row.Gear)
      formData.append('used_num', row.UsedNum)
      formData.append('used_date', String(that.moment(new Date()).format('YYYY-MM-DD')))
      that.$axios({
        url: '/display/production-material/base-ld-used',
        method: 'post',
        data: formData
      }).then(function (response) {
        that.$message({
          type: 'success',
          message: '新增成功'
        })
        that.GetAllBaseLdData()
        that.dialogUsedAddVisible = false
      }).catch(function (err) {
        that.$message({
          type: 'error',
          message: '新增失败,' + err.response.data
        })
      })
    },
    UsedUpdate (row) {
      let that = this
      let formData = new FormData()
      if (row.MaterialNum === '' || row.Gear === '') {
        that.$message({
          type: 'error',
          message: '料号，档位不能为空'
        })
        return
      }
      formData.append('material_num', row.MaterialNum)
      formData.append('gear', row.Gear)
      formData.append('used_num', row.UsedNum)
      formData.append('used_date', String(that.moment(new Date()).format('YYYY-MM-DD')))
      that.$axios({
        url: '/display/production-material/base-ld-used',
        method: 'put',
        data: formData
      }).then(function (response) {
        that.$message({
          type: 'success',
          message: '修改成功'
        })
        that.GetAllBaseLdData()
        that.dialogUsedUpdateVisible = false
      }).catch(function () {
        that.$message({
          type: 'error',
          message: '修改失败'
        })
      })
    },
    CorrectionSet (row) {
      let that = this
      let formData = new FormData()
      if (row.MaterialNum === '' || row.Gear === '') {
        that.$message({
          type: 'error',
          message: '料号，档位不能为空'
        })
        return
      }
      formData.append('material_num', row.MaterialNum)
      formData.append('gear', row.Gear)
      formData.append('correction', row.Correction)
      that.$axios({
        url: '/display/production-material/base-ld-correction',
        method: 'post',
        data: formData
      }).then(function (response) {
        that.$message({
          type: 'success',
          message: '修正成功'
        })
        that.GetAllBaseLdData()
        that.dialogCorrectionVisible = false
      }).catch(function () {
        that.$message({
          type: 'error',
          message: '修正失败'
        })
      })
    },
    NoteSet (row) {
      let that = this
      let formData = new FormData()
      if (row.Note === '') {
        that.$message({
          type: 'error',
          message: '料号，档位不能为空'
        })
        return
      }
      formData.append('material_num', row.MaterialNum)
      formData.append('gear', row.Gear)
      formData.append('note', row.Note)
      that.$axios({
        url: '/display/production-material/base-ld-note',
        method: 'put',
        data: formData
      }).then(function (response) {
        that.$message({
          type: 'success',
          message: '修改成功'
        })
        that.GetAllBaseLdData()
        that.dialogNoteSetVisible = false
      }).catch(function () {
        that.$message({
          type: 'error',
          message: '修改失败'
        })
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
/*.MaterialGear >>> .el-table td {*/
/*  padding: 0px !important*/
/*}*/

/*.MaterialGear >>> .el-table th {*/
/*  padding: 0px !important*/
/*}*/

/*.el-table >>> .cell {*/
/*  padding: 0px;*/
/*  line-height: normal;*/
/*  font-size: 4px;*/
/*}*/
</style>
