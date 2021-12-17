<template>
<div class="UpBoard">
  <el-table
    :data="tableData"
    v-loading="loading"
    :cell-style="{padding:0}"
    style="width: 100%;"
    :row-style="{height: '20px'}"
    height="450">
    <el-table-column
      prop="Pn"
      label="PN">
    </el-table-column>
    <el-table-column
      prop="Sequence"
      label="序列">
    </el-table-column>
    <el-table-column
      prop="Process"
      label="工序">
    </el-table-column>
    <el-table-column
      prop="TotalInvestment"
      label="总投入">
    </el-table-column>
    <el-table-column
      prop="OnceOk"
      label="一次良品">
    </el-table-column>
    <el-table-column
      prop="OnceBad"
      label="一次不良品">
    </el-table-column>
    <el-table-column
      prop="OncePassRate"
      label="直通率">
    </el-table-column>
    <el-table-column
      prop="TotalInput"
      label="总输入">
    </el-table-column>
    <el-table-column
      prop="FinalOk"
      label="最终良品">
    </el-table-column>
    <el-table-column
      prop="FinalBad"
      label="最终不良品">
    </el-table-column>
    <el-table-column
      prop="FinalPassRate"
      label="最终良率">
    </el-table-column>
    <el-table-column
      prop="AccTotalTest"
      label="累计总数">
    </el-table-column>
    <el-table-column
      prop="AccOk"
      label="累计良品">
    </el-table-column>
    <el-table-column
      prop="AccBad"
      label="累计不良品">
    </el-table-column>
    <el-table-column
      prop="AccPassRate"
      label="累计良率">
    </el-table-column>
  </el-table>
</div>
</template>

<script>
export default {
  name: 'UpBoard',
  mounted () {
    clearInterval(this.timerone)
    clearInterval(this.timertwo)
    this.timer1()
    this.get_pn()
  },
  methods: {
    timer1 () {
      this.timerone = setInterval(() => {
        this.get_pn()
      }, 1000 * 60 * 30)
    },
    get_pn () {
      let that = this
      that.loading = true
      that.$axios({
        url: '/display/product-operation-info/module/overview/all-module-info-today',
        method: 'get'
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null) {
          console.log(res)
          var data = []
          for (let i = 0; i < res.length; i++) {
            if (res[i]['TotalInput'] >= 50) {
              data.push(res[i])
            }
          }
          console.log(data)
          that.loading = false
          that.alldata = data
          that.timer2(data)
        }
      })
    },
    timer2 (data) {
      var pndata = []
      for (let i = 0; i < data.length; i++) {
        pndata.push(data[i]['Pn'])
      }
      pndata = Array.from(new Set(pndata))
      console.log(pndata)
      this.only(data, pndata)
      this.key = 0
      this.timertwo = setInterval(() => {
        this.only(data, pndata)
      }, 40 * 1000)
    },
    only (data, pndata) {
      var list = []
      console.log('key', this.key, 'pndata', pndata)
      if (this.key < pndata.length) {
        for (let n = 0; n < data.length; n++) {
          if (pndata[this.key] === data[n]['Pn']) {
            list.push(data[n])
          }
        }
        this.tableData = list
        this.key += 1
        console.log()
      } else {
        this.key = 0
        for (let n = 0; n < data.length; n++) {
          if (pndata[this.key] === data[n]['Pn']) {
            list.push(data[n])
          }
        }
        this.tableData = list
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.timerone)
    clearInterval(this.timertwo)
  },
  data () {
    return {
      PN: '',
      alldata: [],
      tableData: [],
      loading: false,
      key: 0
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-table, .el-table__expanded-cell {
    background-color: rgb(84, 92, 100);
}
.UpBoard >>> .el-table thead {
    color: white !important;
}
.UpBoard >>> .el-table th, .el-table tr{
    background-color: rgb(84, 92, 100) !important;
}
.UpBoard >>>.el-table td, .el-table th.is-leaf {
  padding: 0;
  background-color: rgb(84, 92, 100) !important;
  border-bottom-width: 0px !important;
  color: white;
}
</style>
