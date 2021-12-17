<template>
<div class="BigUpBoard">
  <el-table
    :data="tableData"
    v-loading="loading"
    style="width: 100%;font-size:25px"
    :row-style="{height: '70px'}"
    height="1000">
    <el-table-column
      prop="Pn"
      label="PN"
      width="300">
    </el-table-column>
    <el-table-column
      prop="Sequence"
      label="序列"
      width="100">
    </el-table-column>
    <el-table-column
      prop="Process"
      label="工序"
      width="210">
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
  name: 'BigUpBoard',
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
      var list = []
      for (let n = 0; n < data.length; n++) {
        if (pndata[0] === data[n]['Pn']) {
          list.push(data[n])
        }
      }
      this.tableData = list
      this.only(data, pndata)
    },
    only (data, pndata) {
      var key = 0
      this.timertwo = setInterval(() => {
        var list = []
        if (key < pndata.length) {
          for (let n = 0; n < data.length; n++) {
            if (pndata[key] === data[n]['Pn']) {
              list.push(data[n])
            }
          }
          this.tableData = list
          key += 1
        } else {
          key = 0
          for (let n = 0; n < data.length; n++) {
            if (pndata[key] === data[n]['Pn']) {
              list.push(data[n])
            }
          }
          this.tableData = list
        }
      }, 40 * 1000)
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
      loading: false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-table, .el-table__expanded-cell {
    background-color: rgb(84, 92, 100);
}
.BigUpBoard >>> .el-table thead {
    color: white !important;
}
.BigUpBoard >>> .el-table th, .el-table tr{
    background-color: rgb(84, 92, 100) !important;
}
.BigUpBoard >>>.el-table td, .el-table th.is-leaf {
  padding: 0;
  background-color: rgb(84, 92, 100) !important;
  border-bottom-width: 0px !important;
  color: white;
}
</style>
