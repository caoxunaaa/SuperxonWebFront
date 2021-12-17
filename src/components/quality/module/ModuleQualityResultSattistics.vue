<template>
  <div class="ModuleQualityResultSattistics">
    <div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="10px" class="demo-ruleForm">
        <el-form-item  prop="productModel" style="float:left">
          <el-input placeholder="请输入产品型号"  style="width: 200px;"
          v-model="ruleForm.productModel"  class="input-with-select"></el-input>
        </el-form-item>
        <el-form-item  style="float:left">
          <el-input placeholder="请输入工单号"  style="width: 200px;"
          v-model="workOrderNumber"  class="input-with-select"></el-input>
        </el-form-item>
        <el-form-item  style="float:left">
          <el-input placeholder="请输入BOM"  style="width: 200px;"
          v-model="Bom"  class="input-with-select"></el-input>
        </el-form-item>
        <el-form-item  style="float:left">
          <el-input  placeholder="请输入工序"  style="width: 200px;"
          v-model="workingProcedure"  class="input-with-select"></el-input>
        </el-form-item>
      </el-form>
      <el-button slot="append" icon="el-icon-search" @click="submitForm('ruleForm')"
        style="background-color: #409eff; color: #fff; height: 40px; width:80px; float:left" ></el-button>
      <!-- <el-input placeholder="请输入产品型号"  style="width: 200px;"
      v-model="productModel"  class="input-with-select" >
      </el-input>
      <el-input placeholder="请输入工单号"  style="width: 200px;"
      v-model="workOrderNumber"  class="input-with-select" >
      </el-input>
      <el-input placeholder="请输入BOM"  style="width: 200px;"
      v-model="Bom"  class="input-with-select" >
      </el-input>
      <el-input placeholder="请输入工序"  style="width: 200px;"
      v-model="workingProcedure"  class="input-with-select" >
      </el-input>
      <el-button slot="append" icon="el-icon-search" @click="Search"
      style="background-color: #409eff; color: #fff; height: 40px; width:80px"></el-button> -->
    </div>
    <br>
    <br>
    <br>
    <div style="background-color:rgb(84, 92, 100);">
    <download-excel
            class = "export-excel-wrapper"
            style="float:left;background-color:rgb(84, 92, 100);"
            :data = "data"
            name = "模块测试结果搜索excel表格.xls"
          >
            <el-button type="primary" class="el-button--small" style="padding:0">导出Excel表格</el-button>
        </download-excel>
        <hr>
    <el-table
          :data="data.slice((currentPage-1)*pageSize,currentPage*pageSize)"
          v-loading="loading"
          style="width: 100%"
          height="1200">
          <el-table-column
            label="ID"
            type="index"
            width="40">
          </el-table-column>
          <el-table-column
            prop="PartNumber"
            label="PARTNUMBER"
            width="180">
          </el-table-column>
          <el-table-column
            prop="Version"
            label="VERSION"
            width="100">
          </el-table-column>
          <el-table-column
            prop="DtFlag"
            label="DT_FLAG"
            width="120">
          </el-table-column>
          <el-table-column
            prop="TemperFlag"
            label="TEMPER_FLAG"
            width="80">
          </el-table-column>
          <el-table-column
            prop="TxPowerMin.Float64"
            label="TXPOWMIN"
            width="100">
          </el-table-column>
          <el-table-column
            prop="TxPowerMax.Float64"
            label="TXPOWMAX"
            width="100">
          </el-table-column>
          <el-table-column
            prop="TrackingErrorMax.Float64"
            label="TRACKINGERRORMAX"
            width="100">
          </el-table-column>
          <el-table-column
            prop="TxErMin.Float64"
            label="TXERMIN"
            width="100">
          </el-table-column>
          <el-table-column
            prop="TxErMax.Float64"
            label="TXERMAX"
            width="100">
          </el-table-column>
          <el-table-column
            prop="TxBiasMin.Float64"
            label="TXBIASMIN"
            width="100">
          </el-table-column>
          <el-table-column
            prop="TxBiasMax.Float64"
            label="TXBIASMAX"
            width="100">
          </el-table-column>
          <el-table-column
            prop="TxCrossMin.Float64"
            label="TXCROSSMIN"
            width="100">
          </el-table-column>
          <el-table-column
            prop="TxCrossMax.Float64"
            label="TXCROSSMAX"
            width="100">
          </el-table-column>
          <el-table-column
            prop="TxMargin.Float64"
            label="TXMARGIN"
            width="100">
          </el-table-column>
          <el-table-column
            prop="Smsr.Float64"
            label="SMSR"
            width="100">
          </el-table-column>
          <el-table-column
            prop="OverLoad.Float64"
            label="OVERLOAD"
            width="100">
          </el-table-column>
          <el-table-column
            prop="Sens.Float64"
            label="SENS"
            width="100">
          </el-table-column>
          <el-table-column
            prop="SdasSert.Float64"
            label="SDASSERT"
            width="100">
          </el-table-column>
          <el-table-column
            prop="SddeasSert.Float64"
            label="SDDEASSERT"
            width="100">
          </el-table-column>
          <el-table-column
            prop="TxPowPrec.Float64"
            label="TX_POW_PREC"
            width="100">
          </el-table-column>
          <el-table-column
            prop="RxPowPrec.Float64"
            label="RX_POW_PREC"
            width="100">
          </el-table-column>
          <el-table-column
            prop="FirmWareVersion.String"
            label="FIRMWARE_VER"
            width="100">
          </el-table-column>
          <el-table-column
            prop="FepNumber.String"
            label="FEP_NUMBER"
            width="150">
          </el-table-column>
        </el-table>
        <div class="block">
                  <el-pagination align='center'
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[15]"
                  :page-size="pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="data.length">
                  </el-pagination>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'ModuleQualityResultSattistics',
  components: {

  },
  mounted () {
  },
  methods: {
    // 左图表每页多少条
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pageSize = val
    },
    // 左图表当前页
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.currentPage = val
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          console.log(this.ruleForm.productModel)
          console.log(this.workOrderNumber)
          // if (this.workOrderNumber.length === 0) {
          //   this.workOrderNumber = null
          // }
          console.log(this.Bom)
          // if (this.Bom === null) {
          //   this.Bom = null
          // }
          console.log(this.workingProcedure)
          // if (this.workingProcedure.length === 0) {
          //   this.workingProcedure = null
          // }
          this.cancel && this.cancel()
          let that = this
          that.$axios({
            url: '/display/product-statistic-query/module/settings-params',
            method: 'get',
            params: {
              pn: that.ruleForm.productModel,
              process: that.workOrderNumber,
              bomId: that.Bom,
              workOrderId: that.workingProcedure
            },
            cancelToken: new axios.CancelToken((c) => {
              // 存储一个cancel函数用于取消本次的网络请求
              that.cancel = c
            })
          }).then(function (response) {
            if (response.data !== null) {
              console.log(response.data)
              that.data = response.data
              that.loading = false
            }
          }).catch(function (err) {
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
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  data () {
    return {
      cancel: null,
      currentPage: 1,
      pageSize: 15,
      productModel: '',
      workOrderNumber: '',
      Bom: '',
      loading: false,
      workingProcedure: '',
      data: [],
      ruleForm: {
        productModel: ''
      },
      rules: {
        productModel: {required: true, message: '请输入产品型号', trigger: 'blur'}
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.ModuleQualityResultSattistics{
  padding: 0;
  margin: 0;
}
.el-table, .el-table__expanded-cell {
    background-color: rgb(84, 92, 100);
}
.ModuleQualityResultSattistics >>> .el-table thead {
    color: white !important;
    background-color: rgb(84, 92, 100) !important;
}
.ModuleQualityResultSattistics >>> .el-table th, .el-table tr{
    background-color: rgb(84, 92, 100) !important;
}
.ModuleQualityResultSattistics >>>.el-table td, .el-table th.is-leaf {
  background-color: rgb(84, 92, 100);
  border-bottom-width: 0px !important;
  color: white;
}
.el-table >>> tbody tr:hover>td {
  background-color: #90c0f1;
}
</style>
