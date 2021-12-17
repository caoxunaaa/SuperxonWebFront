<template>
  <div id="name" class="FullTraceability">
    <!-- <h3><el-input style="width:200px" v-model="inputSN" placeholder="请输入模块SN号"></el-input>OR<el-input style="width:200px" v-model="inputOsaSN" placeholder="请输入osa SN号"></el-input><el-button @click="get_osaSN" type="primary">搜索</el-button><el-button @click="exportBtn" type="primary">导出Excel</el-button></h3> -->
    <h3>
      <el-radio @change="get_radio" v-model="radio" label="1">模块SN</el-radio>
      <el-radio @change="get_radio" v-model="radio" label="2">osaSN</el-radio>
      <el-input style="width:200px" v-model="inputSN" placeholder="请输入SN号"></el-input>
      <el-button @click="get_osaSN" type="primary">搜索</el-button>
      <el-button @click="exportBtn" type="primary">导出Excel</el-button>
    </h3>
    <div style="border:1px solid yellow">
    </div>
    <!--模块段的追溯-->
    <div ref="module" style="border:2px solid red; width: 100%;">
      <h3 style="background:red;margin:0;color:white;">模块追溯(osaSN):{{osaSN}}</h3>
      <el-collapse v-model="moduleActiveNames" @change="moduleTraceability_handleChange">
        <div style="float:left;margin:12px"><el-checkbox v-model="workOrderChecked" :disabled="workOrderCheckedDisabled"></el-checkbox></div>
        <el-collapse-item style="background:rgb(198, 226, 255);" title="配对信息" name="1">
          <el-table
            border
            max-height="500px"
            :data="workOrderData"
            v-loading="workOrderLoading"
            style="width: 100%">
            <el-table-column :show-overflow-tooltip="true" v-for="(item) in workOlderDataHeader" :key="item[1]" :label="item[1]" :property="item[1]">
              <template slot-scope="scope" style="font-size:5px">
                {{scope.row[item[0]]}}
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
        <div style="float:left;margin:12px"><el-checkbox v-model="PCH_workOrderChecked" :disabled="PCH_workOrderCheckedDisabled"></el-checkbox></div>
        <el-collapse-item style="background:rgb(198, 226, 255);" title="工单信息" name="2">
          <el-table
            border
            max-height="500px"
            :data="PCH_workOrderData"
            v-loading="PCH_workOrderLoading"
            style="width: 100%">
            <el-table-column :show-overflow-tooltip="true" v-for="(item) in PCH_workOlderDataHeader" :key="item[1]" :label="item[1]" :property="item[1]">
              <template slot-scope="scope" style="font-size:5px">
                {{scope.row[item[0]]}}
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
        <div style="float:left;margin:12px"><el-checkbox v-model="firmwareChecked" :disabled="firmwareCheckedDisabled"></el-checkbox></div>
        <el-collapse-item style="background-color:rgb(198, 226, 255);" title="固件版本信息" name="3">
          <el-table
            border
            max-height="500px"
            :data="firmwareData"
            v-loading="firmwareLoading"
            style="width: 100%">
            <el-table-column :show-overflow-tooltip="true" v-for="(item) in firmwareDataHeader" :key="item[1]" :label="item[1]" :property="item[1]">
              <template slot-scope="scope" style="font-size:5px">
                {{scope.row[item[0]]}}
              </template>
            </el-table-column>
            </el-table>
        </el-collapse-item>
        <div style="float:left;margin:12px"><el-checkbox v-model="ate_debugMessageChecked" :disabled="ate_debugMessageCheckedDisabled"></el-checkbox></div>
        <el-collapse-item style="background:rgb(198, 226, 255);" title="常规产品调测信息" name="4">
          <el-table
          border
          max-height="500px"
          :data="ate_debugMessageData"
          v-loading="ate_debugMessageLoading"
          style="width: 100%">
          <el-table-column :show-overflow-tooltip="true" v-for="(item) in ate_debugMessageDataHeader" :key="item[1]" :label="item[1]" :property="item[1]">
            <template slot-scope="scope" style="font-size:5px">
              {{scope.row[item[0]]}}
            </template>
          </el-table-column>
          </el-table>
        </el-collapse-item>
        <div style="float:left;margin:12px"><el-checkbox v-model="ate_new_debugMessageChecked" :disabled="ate_new_debugMessageCheckedDisabled"></el-checkbox></div>
        <el-collapse-item style="background:rgb(198, 226, 255);" title="10G产品调测信息" name="5">
          <el-table
          border
          max-height="500px"
          :data="ate_new_debugMessageData"
          v-loading="ate_new_debugMessageLoading"
          style="width: 100%">
          <el-table-column :show-overflow-tooltip="true" v-for="(item) in ate_new_debugMessageDataHeader" :key="item[1]" :label="item[1]" :property="item[1]">
            <template slot-scope="scope" style="font-size:5px">
              {{scope.row[item[0]]}}
            </template>
          </el-table-column>
          </el-table>
        </el-collapse-item>
        <div style="float:left;margin:12px"><el-checkbox v-model="process_log_debugMessageChecked" :disabled="process_log_debugMessageCheckedDisabled"></el-checkbox></div>
        <el-collapse-item style="background:rgb(198, 226, 255);" title="生产过程相关信息" name="6">
          <el-table
            border
            max-height="500px"
            :data="process_log_debugMessageData"
            v-loading="process_log_debugMessageLoading"
            style="width: 100%">
            <el-table-column :show-overflow-tooltip="true" v-for="(item) in process_log_debugMessageDataHeader" :key="item[1]" :label="item[1]" :property="item[1]">
              <template slot-scope="scope" style="font-size:5px">
                {{scope.row[item[0]]}}
              </template>
            </el-table-column>
            </el-table>
        </el-collapse-item>
        <div style="float:left;margin:12px"><el-checkbox v-model="routine_product_test_indicatorsMessageChecked" :disabled="routine_product_test_indicatorsMessageCheckedDisabled"></el-checkbox></div>
        <el-collapse-item style="background:rgb(198, 226, 255);" title="常规产品测试指标范围" name="7">
          <el-table
            border
            max-height="500px"
            :data="routine_product_test_indicatorsMessageData"
            v-loading="routine_product_test_indicatorsMessageLoading"
            style="width: 100%">
            <el-table-column :show-overflow-tooltip="true" v-for="(item) in routine_product_test_indicatorsMessageDataHeader" :key="item[1]" :label="item[1]" :property="item[1]">
              <template slot-scope="scope" style="font-size:5px">
                {{scope.row[item[0]]}}
              </template>
            </el-table-column>
            </el-table>
        </el-collapse-item>
        <div style="float:left;margin:12px"><el-checkbox v-model="ten_product_test_indicatorsMessageChecked" :disabled="ten_product_test_indicatorsMessageCheckedDisabled"></el-checkbox></div>
        <el-collapse-item style="background:rgb(198, 226, 255);" title="10G产品测试指标范围" name="8">
          <el-table
            border
            max-height="500px"
            :data="ten_product_test_indicatorsMessageData"
            v-loading="ten_product_test_indicatorsMessageLoading"
            style="width: 100%">
            <el-table-column :show-overflow-tooltip="true" v-for="(item) in ten_product_test_indicatorsMessageDataHeader" :key="item[1]" :label="item[1]" :property="item[1]">
              <template slot-scope="scope" style="font-size:5px">
                {{scope.row[item[0]]}}
              </template>
            </el-table-column>
            </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!--OSA段的追溯-->
    <div ref="semi_finished_product" style="border:2px solid red; width: 100%;">
      <h3 style="background:red;margin:0;color:white;">OSA追溯(osaSN):{{osaSN}}</h3>
      <el-collapse v-model="osaActiveNames" @change="osaTraceability_handleChange">
        <div style="float:left;margin:12px"><el-checkbox v-model="testMessageChecked" :disabled="testMessageCheckedDisabled"></el-checkbox></div>
        <el-collapse-item style="background:rgb(198, 226, 255);" title="测试工位人员信息追溯" name="1">
          <el-table
            border
            max-height="500px"
            :data="testMessageData"
            v-loading="testMessageLoading"
            style="width: 100%">
            <el-table-column :show-overflow-tooltip="true" v-for="(item) in testMessageDataHeader" :key="item[1]" :label="item[1]" :property="item[1]">
              <template slot-scope="scope" style="font-size:5px">
                {{scope.row[item[0]]}}
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
        <div style="float:left;margin:12px"><el-checkbox v-model="receive_coupling_traceability_MessageChecked" :disabled="receive_coupling_traceability_MessageCheckedDisabled"></el-checkbox></div>
        <el-collapse-item style="background:rgb(198, 226, 255);" title="接收耦合追溯" name="2">
          <el-table
            border
            max-height="500px"
            :data="receive_coupling_traceability_MessageData"
            v-loading="receive_coupling_traceability_MessageLoading"
            style="width: 100%">
            <el-table-column :show-overflow-tooltip="true" v-for="(item) in receive_coupling_traceability_MessageDataHeader" :key="item[1]" :label="item[1]" :property="item[1]">
              <template slot-scope="scope" style="font-size:5px">
                {{scope.row[item[0]]}}
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
        <div style="float:left;margin:12px"><el-checkbox v-model="emission_tracingMessageChecked" :disabled="emission_tracingMessageCheckedDisabled"></el-checkbox></div>
        <el-collapse-item style="background:rgb(198, 226, 255);" title="发射耦合信息" name="3">
          <el-table
          border
          max-height="500px"
          :data="emission_tracingMessageData"
          v-loading="emission_tracingMessageLoading"
          style="width: 100%">
          <el-table-column :show-overflow-tooltip="true" v-for="(item) in emission_tracingMessageDataHeader" :key="item[1]" :label="item[1]" :property="item[1]">
            <template slot-scope="scope" style="font-size:5px">
              {{scope.row[item[0]]}}
            </template>
          </el-table-column>
          </el-table>
        </el-collapse-item>
        <div style="float:left;margin:12px"><el-checkbox v-model="beginning_testMessageChecked" :disabled="beginning_testMessageCheckedDisabled"></el-checkbox></div>
        <el-collapse-item style="background-color:rgb(198, 226, 255);" title="发端测试信息追溯" name="4">
          <el-table
            border
            max-height="500px"
            :data="beginning_testMessageData"
            v-loading="beginning_testMessageLoading"
            style="width: 100%">
            <el-table-column :show-overflow-tooltip="true" v-for="(item) in beginning_testMessageDataHeader" :key="item[1]" :label="item[1]" :property="item[1]">
              <template slot-scope="scope" style="font-size:5px">
                {{scope.row[item[0]]}}
              </template>
            </el-table-column>
            </el-table>
        </el-collapse-item>
        <div style="float:left;margin:12px"><el-checkbox v-model="closingEnd_testMessageChecked" :disabled="closingEnd_testMessageCheckedDisabled"></el-checkbox></div>
        <el-collapse-item style="background-color:rgb(198, 226, 255);" title="收端测试信息追溯" name="5">
          <el-table
            border
            max-height="500px"
            :data="closingEnd_testMessageData"
            v-loading="closingEnd_testMessageLoading"
            style="width: 100%">
            <el-table-column :show-overflow-tooltip="true" v-for="(item) in closingEnd_testMessageDataHeader" :key="item[1]" :label="item[1]" :property="item[1]">
              <template slot-scope="scope" style="font-size:5px">
                {{scope.row[item[0]]}}
              </template>
            </el-table-column>
            </el-table>
        </el-collapse-item>
        <div style="float:left;margin:12px"><el-checkbox v-model="fqc_traceabilityMessageChecked" :disabled="fqc_traceabilityMessageCheckedDisabled"></el-checkbox></div>
        <el-collapse-item style="background-color:rgb(198, 226, 255);" title="FQC追溯" name="6">
          <el-table
            border
            max-height="500px"
            :data="fqc_traceabilityMessageData"
            v-loading="fqc_traceabilityMessageLoading"
            style="width: 100%">
            <el-table-column :show-overflow-tooltip="true" v-for="(item) in fqc_traceabilityMessageDataHeader" :key="item[1]" :label="item[1]" :property="item[1]">
              <template slot-scope="scope" style="font-size:5px">
                {{scope.row[item[0]]}}
              </template>
            </el-table-column>
            </el-table>
        </el-collapse-item>
        <div style="float:left;margin:12px"><el-checkbox v-model="bracket_traceabilityMessageChecked" :disabled="bracket_traceabilityMessageCheckedDisabled"></el-checkbox></div>
        <el-collapse-item style="background-color:rgb(198, 226, 255);" title="分档信息追溯" name="7">
          <el-table
            border
            max-height="500px"
            :data="bracket_traceabilityMessageData"
            v-loading="bracket_traceabilityMessageLoading"
            style="width: 100%">
            <el-table-column :show-overflow-tooltip="true" v-for="(item) in bracket_traceabilityMessageDataHeader" :key="item[1]" :label="item[1]" :property="item[1]">
              <template slot-scope="scope" style="font-size:5px">
                {{scope.row[item[0]]}}
              </template>
            </el-table-column>
            </el-table>
        </el-collapse-item>
        <div style="float:left;margin:12px"><el-checkbox v-model="restructure_traceabilityMessageChecked" :disabled="restructure_traceabilityMessageCheckedDisabled"></el-checkbox></div>
        <el-collapse-item style="background-color:rgb(198, 226, 255);" title="改制信息追溯" name="8">
          <el-table
            border
            max-height="500px"
            :data="restructure_traceabilityMessageData"
            v-loading="restructure_traceabilityMessageLoading"
            style="width: 100%">
            <el-table-column :show-overflow-tooltip="true" v-for="(item) in restructure_traceabilityMessageDataHeader" :key="item[1]" :label="item[1]" :property="item[1]">
              <template slot-scope="scope" style="font-size:5px">
                {{scope.row[item[0]]}}
              </template>
            </el-table-column>
            </el-table>
        </el-collapse-item>
        <div style="float:left;margin:12px"><el-checkbox v-model="osa_pairing_traceabilityMessageChecked" :disabled="osa_pairing_traceabilityMessageCheckedDisabled"></el-checkbox></div>
        <el-collapse-item style="background-color:rgb(198, 226, 255);" title="OSA配对追溯" name="9">
          <el-table
            border
            max-height="500px"
            :data="osa_pairing_traceabilityMessageData"
            v-loading="osa_pairing_traceabilityMessageLoading"
            style="width: 100%">
            <el-table-column :show-overflow-tooltip="true" v-for="(item) in osa_pairing_traceabilityMessageDataHeader" :key="item[1]" :label="item[1]" :property="item[1]">
              <template slot-scope="scope" style="font-size:5px">
                {{scope.row[item[0]]}}
              </template>
            </el-table-column>
            </el-table>
        </el-collapse-item>
        <div style="float:left;margin:12px"><el-checkbox v-model="workOrderMessageChecked" :disabled="workOrderMessageCheckedDisabled"></el-checkbox></div>
        <el-collapse-item style="background-color:rgb(198, 226, 255);" title="工单信息追溯" name="10">
          <el-table
            border
            max-height="500px"
            :data="workOrderMessageData"
            v-loading="workOrderMessageLoading"
            style="width: 100%">
            <el-table-column :show-overflow-tooltip="true" v-for="(item) in workOrderMessageDataHeader" :key="item[1]" :label="item[1]" :property="item[1]">
              <template slot-scope="scope" style="font-size:5px">
                {{scope.row[item[0]]}}
              </template>
            </el-table-column>
            </el-table>
        </el-collapse-item>
        <div style="float:left;margin:12px"><el-checkbox v-model="originating_database_configuration_traceabilityMessageChecked" :disabled="originating_database_configuration_traceabilityMessageCheckedDisabled"></el-checkbox></div>
        <el-collapse-item style="background-color:rgb(198, 226, 255);" title="发端数据库配置追溯" name="11">
          <el-table
            border
            max-height="500px"
            :data="originating_database_configuration_traceabilityMessageData"
            v-loading="originating_database_configuration_traceabilityMessageLoading"
            style="width: 100%">
            <el-table-column :show-overflow-tooltip="true" v-for="(item) in originating_database_configuration_traceabilityMessageDataHeader" :key="item[1]" :label="item[1]" :property="item[1]">
              <template slot-scope="scope" style="font-size:5px">
                {{scope.row[item[0]]}}
              </template>
            </el-table-column>
            </el-table>
        </el-collapse-item>
        <div style="float:left;margin:12px"><el-checkbox v-model="closingEnd_database_configuration_traceabilityMessageChecked" :disabled="closingEnd_database_configuration_traceabilityMessageCheckedDisabled"></el-checkbox></div>
        <el-collapse-item style="background-color:rgb(198, 226, 255);" title="收端数据库配置追溯" name="12">
          <el-table
            border
            max-height="500px"
            :data="closingEnd_database_configuration_traceabilityMessageData"
            v-loading="closingEnd_database_configuration_traceabilityMessageLoading"
            style="width: 100%">
            <el-table-column :show-overflow-tooltip="true" v-for="(item) in closingEnd_database_configuration_traceabilityMessageDataHeader" :key="item[1]" :label="item[1]" :property="item[1]">
              <template slot-scope="scope" style="font-size:5px">
                {{scope.row[item[0]]}}
              </template>
            </el-table-column>
            </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!--预组追溯-->
    <div ref="pre_group" style="border:2px solid red; width: 100%;">
      <h3 style="background:red;margin:0;color:white;">预组追溯(osaSN):{{osaSN}}</h3>
      <el-collapse v-model="preGroupActiveNames" @change="preGroupTraceability_handleChange">
        <div style="float:left;margin:12px"><el-checkbox v-model="preGroup_traceabilityMessageChecked" :disabled="preGroup_traceabilityMessageCheckedDisabled"></el-checkbox></div>
        <el-collapse-item style="background:rgb(198, 226, 255);" title="预组信息" name="1">
          <el-table
            border
            max-height="500px"
            :data="preGroup_traceabilityMessageData"
            v-loading="preGroup_traceabilityMessageLoading"
            style="width: 100%">
            <el-table-column :show-overflow-tooltip="true" v-for="(item) in preGroup_traceabilityMessageDataHeader" :key="item[1]" :label="item[1]" :property="item[1]">
              <template slot-scope="scope" style="font-size:5px">
                {{scope.row[item[0]]}}
              </template>
            </el-table-column>
          </el-table>
          </el-collapse-item>
        </el-collapse>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'
export default {
  name: 'FullTraceability',
  components: {
  },
  mounted () {
  },
  // 监听所有区域内的数据是否获取到了
  watch: {
    workOrderData: {
      handler (newVal, oldVal) {
        console.log('这里', newVal)
        if (newVal.length !== 0) {
          this.workOrderCheckedDisabled = false
        } else {
          this.workOrderCheckedDisabled = true
          this.workOrderChecked = false
        }
      }
    },
    PCH_workOrderData: {
      handler (newVal, oldVal) {
        if (newVal.length !== 0) {
          this.PCH_workOrderCheckedDisabled = false
        } else {
          this.PCH_workOrderCheckedDisabled = true
          this.PCH_workOrderChecked = false
        }
      }
    },
    firmwareData: {
      handler (newVal, oldVal) {
        if (newVal.length !== 0) {
          this.firmwareCheckedDisabled = false
        } else {
          this.firmwareCheckedDisabled = true
          this.firmwareChecked = false
        }
      }
    },
    routine_product_test_indicatorsMessageData: {
      handler (newVal, oldVal) {
        if (newVal.length !== 0) {
          this.routine_product_test_indicatorsMessageCheckedDisabled = false
        } else {
          this.routine_product_test_indicatorsMessageCheckedDisabled = true
          this.routine_product_test_indicatorsMessageChecked = false
        }
      }
    },
    ten_product_test_indicatorsMessageData: {
      handler (newVal, oldVal) {
        if (newVal.length !== 0) {
          this.ten_product_test_indicatorsMessageCheckedDisabled = false
        } else {
          this.ten_product_test_indicatorsMessageCheckedDisabled = true
          this.ten_product_test_indicatorsMessageChecked = false
        }
      }
    },
    ate_debugMessageData: {
      handler (newVal, oldVal) {
        if (newVal.length !== 0) {
          this.ate_debugMessageCheckedDisabled = false
        } else {
          this.ate_debugMessageCheckedDisabled = true
          this.ate_debugMessageChecked = false
        }
      }
    },
    ate_new_debugMessageData: {
      handler (newVal, oldVal) {
        if (newVal.length !== 0) {
          this.ate_new_debugMessageCheckedDisabled = false
        } else {
          this.ate_new_debugMessageCheckedDisabled = true
          this.ate_new_debugMessageChecked = false
        }
      }
    },
    process_log_debugMessageData: {
      handler (newVal, oldVal) {
        if (newVal.length !== 0) {
          this.process_log_debugMessageCheckedDisabled = false
        } else {
          this.process_log_debugMessageCheckedDisabled = true
          this.process_log_debugMessageChecked = false
        }
      }
    },
    testMessageData: {
      handler (newVal, oldVal) {
        if (newVal.length !== 0) {
          this.testMessageCheckedDisabled = false
        } else {
          this.testMessageCheckedDisabled = true
          this.testMessageChecked = false
        }
      }
    },
    receive_coupling_traceability_MessageData: {
      handler (newVal, oldVal) {
        if (newVal.length !== 0) {
          this.receive_coupling_traceability_MessageCheckedDisabled = false
        } else {
          this.receive_coupling_traceability_MessageCheckedDisabled = true
          this.receive_coupling_traceability_MessageChecked = false
        }
      }
    },
    beginning_testMessageData: {
      handler (newVal, oldVal) {
        if (newVal.length !== 0) {
          this.beginning_testMessageCheckedDisabled = false
        } else {
          this.beginning_testMessageCheckedDisabled = true
          this.beginning_testMessageChecked = false
        }
      }
    },
    closingEnd_testMessageData: {
      handler (newVal, oldVal) {
        if (newVal.length !== 0) {
          this.closingEnd_testMessageCheckedDisabled = false
        } else {
          this.closingEnd_testMessageCheckedDisabled = true
          this.closingEnd_testMessageChecked = false
        }
      }
    },
    osa_pairing_traceabilityMessageData: {
      handler (newVal, oldVal) {
        if (newVal.length !== 0) {
          this.osa_pairing_traceabilityMessageCheckedDisabled = false
        } else {
          this.osa_pairing_traceabilityMessageCheckedDisabled = true
          this.osa_pairing_traceabilityMessageChecked = false
        }
      }
    },
    fqc_traceabilityMessageData: {
      handler (newVal, oldVal) {
        if (newVal.length !== 0) {
          this.fqc_traceabilityMessageCheckedDisabled = false
        } else {
          this.fqc_traceabilityMessageCheckedDisabled = true
          this.fqc_traceabilityMessageChecked = false
        }
      }
    },
    workOrderMessageData: {
      handler (newVal, oldVal) {
        if (newVal.length !== 0) {
          this.workOrderMessageCheckedDisabled = false
        } else {
          this.workOrderMessageCheckedDisabled = true
          this.workOrderMessageChecked = false
        }
      }
    },
    emission_tracingMessageData: {
      handler (newVal, oldVal) {
        if (newVal.length !== 0) {
          this.emission_tracingMessageCheckedDisabled = false
        } else {
          this.emission_tracingMessageCheckedDisabled = true
          this.emission_tracingMessageChecked = false
        }
      }
    },
    originating_database_configuration_traceabilityMessageData: {
      handler (newVal, oldVal) {
        if (newVal.length !== 0) {
          this.originating_database_configuration_traceabilityMessageCheckedDisabled = false
        } else {
          this.originating_database_configuration_traceabilityMessageCheckedDisabled = true
          this.originating_database_configuration_traceabilityMessageChecked = false
        }
      }
    },
    closingEnd_database_configuration_traceabilityMessageData: {
      handler (newVal, oldVal) {
        if (newVal.length !== 0) {
          this.closingEnd_database_configuration_traceabilityMessageCheckedDisabled = false
        } else {
          this.closingEnd_database_configuration_traceabilityMessageCheckedDisabled = true
          this.closingEnd_database_configuration_traceabilityMessageChecked = false
        }
      }
    },
    bracket_traceabilityMessageData: {
      handler (newVal, oldVal) {
        if (newVal.length !== 0) {
          this.bracket_traceabilityMessageCheckedDisabled = false
        } else {
          this.bracket_traceabilityMessageCheckedDisabled = true
          this.bracket_traceabilityMessageChecked = false
        }
      }
    },
    restructure_traceabilityMessageData: {
      handler (newVal, oldVal) {
        if (newVal.length !== 0) {
          this.restructure_traceabilityMessageCheckedDisabled = false
        } else {
          this.restructure_traceabilityMessageCheckedDisabled = true
          this.restructure_traceabilityMessageChecked = false
        }
      }
    },
    preGroup_traceabilityMessageData: {
      handler (newVal, oldVal) {
        if (newVal.length !== 0) {
          this.preGroup_traceabilityMessageCheckedDisabled = false
        } else {
          this.preGroup_traceabilityMessageCheckedDisabled = true
          this.preGroup_traceabilityMessageChecked = false
        }
      }
    }
  },
  methods: {
    handleScroll () {
      console.log(document.documentElement.scrollTop, document.documentElement.scrollHeight)
    },
    // 点击小标题，跨域获取对应区域的数据
    moduleTraceability_handleChange (val) {
      if (this.moduleVal.length < val.length && this.osaSN !== '') {
        console.log(this.osaSN)
        if (val[val.length - 1] === '1') {
          this.get_osaSN_workOrderData(this.osaSN)
        } else if (val[val.length - 1] === '2') {
          this.get_osaSN_PCH_workOrderData(this.osaSN)
        } else if (val[val.length - 1] === '3') {
          this.get_osaSN_firmware(this.osaSN)
        } else if (val[val.length - 1] === '4') {
          this.get_osaSN_ate_debug_message(this.osaSN)
        } else if (val[val.length - 1] === '5') {
          this.get_osaSN_ate_new_debug_message(this.osaSN)
        } else if (val[val.length - 1] === '6') {
          this.get_osaSN_process_log_debug_message(this.osaSN)
        } else if (val[val.length - 1] === '7') {
          this.get_routine_test_message(this.osaSN)
        } else if (val[val.length - 1] === '8') {
          this.get_ten_test_message(this.osaSN)
        }
      } else if (this.moduleVal.length < val.length && this.osaSN === '') {
        this.$message({
          type: 'error',
          message: '未获取到osaSN！'
        })
      }
    },
    osaTraceability_handleChange (val) {
      if (this.osaVal.length < val.length && this.osaSN !== '') {
        if (val[val.length - 1] === '1') {
          this.get_osaSN_test_message(this.osaSN)
        } else if (val[val.length - 1] === '2') {
          this.get_osaSN_receive_coupling_message(this.osaSN)
        } else if (val[val.length - 1] === '3') {
          this.get_emission_tracing_message(this.osaSN)
        } else if (val[val.length - 1] === '4') {
          this.get_beginning_test_message(this.osaSN)
        } else if (val[val.length - 1] === '5') {
          this.get_closing_end_test_message(this.osaSN)
        } else if (val[val.length - 1] === '6') {
          this.get_fqc_traceability_message(this.osaSN)
        } else if (val[val.length - 1] === '7') {
          this.get_bracket_traceability_message(this.osaSN)
        } else if (val[val.length - 1] === '8') {
          this.get_restructure_traceability_message(this.osaSN)
        } else if (val[val.length - 1] === '9') {
          this.get_osa_pairing_traceability_message(this.osaSN)
        }
      } else if (this.osaVal.length < val.length && this.osaSN === '') {
        this.$message({
          type: 'error',
          message: '未获取到osaSN！'
        })
      }
    },
    preGroupTraceability_handleChange (val) {
      if (this.preGroupVal.length < val.length && this.osaSN !== '') {
        console.log(this.osaSN)
        if (val[val.length - 1] === '1') {
          this.get_proGroup_message(this.osaSN)
        }
      } else if (this.preGroupVal.length < val.length && this.osaSN === '') {
        this.$message({
          type: 'error',
          message: '未获取到osaSN！'
        })
      }
    },
    get_radio () {
      this.inputSN = ''
    },
    // 获取osaSN信息 SPXNCN213902IP 2A62186003630
    get_osaSN () {
      let that = this
      that.workOrderData = []
      that.PCH_workOrderData = []
      that.firmwareData = []
      that.ate_debugMessageData = []
      that.ate_new_debugMessageData = []
      that.process_log_debugMessageData = []
      that.routine_product_test_indicatorsMessageData = []
      that.ten_product_test_indicatorsMessageData = []
      that.testMessageData = []
      that.receive_coupling_traceability_MessageData = []
      that.beginning_testMessageData = []
      that.closingEnd_testMessageData = []
      that.osa_pairing_traceabilityMessageData = []
      that.fqc_traceabilityMessageData = []
      that.workOrderMessageData = []
      that.emission_tracingMessageData = []
      that.originating_database_configuration_traceabilityMessageData = []
      that.closingEnd_database_configuration_traceabilityMessageData = []
      that.bracket_traceabilityMessageData = []
      that.restructure_traceabilityMessageData = []
      that.preGroup_traceabilityMessageData = []
      that.moduleVal = []
      that.osaVal = []
      that.preGroupVal = []
      if (that.radio === '2') {
        that.osaSN = that.inputSN
        that.copySN = JSON.parse(JSON.stringify(that.inputSN))
      } else {
        that.$axios({
          url: '/display/production-trace/get-osa-sn-by-sn',
          method: 'get',
          params: {
            sn: that.inputSN
          }
        }).then(function (response) {
          console.log(response)
          const res = response.data
          if (res !== null) {
            console.log(res['Data'])
            var osaSN = ''
            for (let i = 0; i < res['Data'].length; i++) {
              osaSN = osaSN + res['Data'][i]['OSA_SN'] + ','
            }
            if (osaSN !== '') {
              that.osaSN = osaSN
              that.copySN = JSON.parse(JSON.stringify(osaSN))
            }
          }
        })
      }
    },
    // 获取osaSN下的工单信息
    get_osaSN_workOrderData (osaSN) {
      let that = this
      that.$axios({
        url: '/display/production-trace/module/get-work-order-by-osa-sn',
        method: 'get',
        params: {
          osa_sn: osaSN
        }
      }).then(function (response) {
        console.log('获取osaSN下的工单信息', response)
        const res = response.data
        if (res !== null) {
          // that.workOlderDataHeader = res['Head']
          console.log(res)
          that.workOrderData = res['Data']
        }
      }).catch(function () {
        that.workOrderLoading = false
      })
    },
    // 通过PCH获取osaSN工单信息
    get_osaSN_PCH_workOrderData (osaSN) {
      let that = this
      that.PCH_workOrderLoading = true
      that.$axios({
        url: '/display/production-trace/module/get-work-order-by-osa-sn',
        method: 'get',
        params: {
          osa_sn: osaSN
        }
      }).then(function (response) {
        console.log('获取osaSN下的工单信息', response)
        const res = response.data
        if (res !== null) {
          var MANUFACTURE_GROUP = ''
          for (let i = 0; i < res['Data'].length; i++) {
            MANUFACTURE_GROUP = MANUFACTURE_GROUP + res['Data'][i]['MANUFACTURE_GROUP'] + ','
          }
          console.log(MANUFACTURE_GROUP)
          that.$axios({
            url: '/display/production-trace/module/get-work-order-by-pch',
            method: 'get',
            params: {
              pch: MANUFACTURE_GROUP
            }
          }).then(function (response) {
            console.log(response)
            that.PCH_workOrderLoading = false
            const res = response.data
            if (res !== null) {
              // that.PCH_workOlderDataHeader = res['Head']
              that.PCH_workOrderData = res['Data']
            }
          }).catch(function () {
            that.PCH_workOrderLoading = false
          })
        }
      }).catch(function () {
        that.PCH_workOrderLoading = false
      })
    },
    // 通过osaSN获取固件版本
    get_osaSN_firmware (osaSN) {
      let that = this
      that.firmwareLoading = true
      that.$axios({
        url: '/display/production-trace/module/get-firmware-by-osa-sn',
        method: 'get',
        params: {
          osa_sn: osaSN
        }
      }).then(function (response) {
        console.log(response)
        that.firmwareLoading = false
        const res = response.data
        if (res !== null) {
          that.firmwareData = res['Data']
          var BOM = ''
          for (let i = 0; i < res['Data'].length; i++) {
            BOM = BOM + res['Data'][i]['BOM'] + ','
          }
          that.get_routine_test_message(BOM)
          that.get_ten_test_message(BOM)
          // that.firmwareDataHeader = res['Head']
        }
      }).catch(function () {
        that.firmwareLoading = false
      })
    },
    // 通过bom获取常规产品测试指标范围
    get_routine_test_message (osaSN) {
      let that = this
      that.routine_product_test_indicatorsMessageLoading = true
      that.$axios({
        url: '/display/production-trace/module/get-firmware-by-osa-sn',
        method: 'get',
        params: {
          osa_sn: osaSN
        }
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null) {
          var BOM = ''
          for (let i = 0; i < res['Data'].length; i++) {
            BOM = BOM + res['Data'][i]['BOM'] + ','
          }
          that.$axios({
            method: 'get',
            url: '/display/production-trace/module/get-auto-dt-spec-ate-by-bom',
            params: {
              bom: BOM
            }
          }).then(function (response) {
            console.log('常规产品测试指标范围', response)
            that.routine_product_test_indicatorsMessageLoading = false
            const res = response.data
            if (res !== null) {
              that.routine_product_test_indicatorsMessageData = res['Data']
            }
          }).catch(function () {
            that.routine_product_test_indicatorsMessageLoading = false
          })
        }
      }).catch(function () {
        that.routine_product_test_indicatorsMessageLoading = false
      })
    },
    // 通过bom获取10G产品测试指标范围
    get_ten_test_message (osaSN) {
      let that = this
      that.ten_product_test_indicatorsMessageLoading = true
      that.$axios({
        url: '/display/production-trace/module/get-firmware-by-osa-sn',
        method: 'get',
        params: {
          osa_sn: osaSN
        }
      }).then(function (response) {
        console.log(response)
        const res = response.data
        if (res !== null) {
          var BOM = ''
          for (let i = 0; i < res['Data'].length; i++) {
            BOM = BOM + res['Data'][i]['BOM'] + ','
          }
          that.$axios({
            method: 'get',
            url: '/display/production-trace/module/get-auto-dt-spec-ate-new-by-bom',
            params: {
              bom: BOM
            }
          }).then(function (response) {
            console.log('10G产品测试指标范围', response)
            that.ten_product_test_indicatorsMessageLoading = false
            const res = response.data
            if (res !== null) {
              that.ten_product_test_indicatorsMessageData = res['Data']
            }
          }).catch(function () {
            that.ten_product_test_indicatorsMessageLoading = false
          })
        }
      }).catch(function () {
        that.ten_product_test_indicatorsMessageLoading = false
      })
    },
    // 通过osaSN获取调试信息ate
    get_osaSN_ate_debug_message (osaSN) {
      let that = this
      that.ate_debugMessageLoading = true
      that.$axios({
        url: '/display/production-trace/module/get-result-ate-by-osa-sn',
        method: 'get',
        params: {
          osa_sn: osaSN
        }
      }).then(function (response) {
        console.log(response)
        that.ate_debugMessageLoading = false
        const res = response.data
        if (res !== null) {
          that.ate_debugMessageData = res['Data']
          // that.ate_debugMessageDataHeader = res['Head']
        }
      }).catch(function () {
        that.ate_debugMessageLoading = false
      })
    },
    // 通过osaSN获取调试信息ate_new
    get_osaSN_ate_new_debug_message (osaSN) {
      let that = this
      that.ate_new_debugMessageLoading = true
      that.$axios({
        url: '/display/production-trace/module/get-result-ate-new-by-osa-sn',
        method: 'get',
        params: {
          osa_sn: osaSN
        }
      }).then(function (response) {
        console.log(response)
        that.ate_new_debugMessageLoading = false
        const res = response.data
        if (res !== null) {
          that.ate_new_debugMessageData = res['Data']
          // that.ate_new_debugMessageDataHeader = res['Head']
        }
      }).catch(function () {
        that.ate_new_debugMessageLoading = false
      })
    },
    // 通过osaSN获取调试信息process_log
    get_osaSN_process_log_debug_message (osaSN) {
      let that = this
      that.process_log_debugMessageLoading = true
      that.$axios({
        url: '/display/production-trace/module/get-process-log-by-osa-sn',
        method: 'get',
        params: {
          osa_sn: osaSN
        }
      }).then(function (response) {
        console.log(response)
        that.process_log_debugMessageLoading = false
        const res = response.data
        if (res !== null) {
          that.process_log_debugMessageData = res['Data']
          // that.process_log_debugMessageDataHeader = res['Head']
        }
      }).catch(function () {
        that.process_log_debugMessageLoading = false
      })
    },
    // 通过OSA_SN获得测试信息
    get_osaSN_test_message (osaSN) {
      let that = this
      that.testMessageLoading = true
      that.$axios({
        url: '/display/production-trace/osa/get-process-log-by-osa-sn',
        method: 'get',
        params: {
          osa_sn: osaSN
        }
      }).then(function (response) {
        console.log('通过OSA_SN获得测试信息', response)
        that.testMessageLoading = false
        const res = response.data
        if (res !== null) {
          that.testMessageData = res['Data']
        }
      }).catch(function () {
        that.testMessageLoading = false
      })
    },
    // 通过OSA_SN获得接收耦合信息
    get_osaSN_receive_coupling_message (osaSN) {
      let that = this
      that.receive_coupling_traceability_MessageLoading = true
      that.$axios({
        url: '/display/production-trace/osa/get-auto-dt-recv-auto-couple-by-osa-sn',
        method: 'get',
        params: {
          osa_sn: osaSN
        }
      }).then(function (response) {
        console.log('通过OSA_SN获得接收耦合信息', response)
        that.receive_coupling_traceability_MessageLoading = false
        const res = response.data
        if (res !== null) {
          that.receive_coupling_traceability_MessageData = res['Data']
        }
      }).catch(function () {
        that.restructure_traceabilityMessageLoading = false
      })
    },
    // 发射耦合追溯
    get_emission_tracing_message (osaSN) {
      let that = this
      that.emission_tracingMessageLoading = true
      that.$axios({
        url: '/display/production-trace/osa/get-auto-dt-transmit-auto-couple-by-osa-sn',
        method: 'get',
        params: {
          osa_sn: osaSN
        }
      }).then(function (response) {
        console.log('发射耦合追溯', response)
        that.emission_tracingMessageLoading = false
        const res = response.data
        if (res !== null) {
          that.emission_tracingMessageData = res['Data']
        }
      }).catch(function () {
        that.emission_tracingMessageLoading = false
      })
    },
    // 发端测试信息追溯
    get_beginning_test_message (osaSN) {
      let that = this
      that.beginning_testMessageLoading = true
      that.$axios({
        url: '/display/production-trace/osa/get-auto-dt-results-liv-by-osa-sn',
        method: 'get',
        params: {
          osa_sn: osaSN
        }
      }).then(function (response) {
        console.log('发端测试信息追溯', response)
        that.beginning_testMessageLoading = false
        const res = response.data
        if (res !== null) {
          that.beginning_testMessageData = res['Data']
        }
      }).catch(function () {
        that.beginning_testMessageLoading = false
      })
    },
    // 收端测试信息追溯
    get_closing_end_test_message (osaSN) {
      let that = this
      that.closingEnd_testMessageLoading = true
      that.$axios({
        url: '/display/production-trace/osa/get-auto-dt-results-optics-data-by-osa-sn',
        method: 'get',
        params: {
          osa_sn: osaSN
        }
      }).then(function (response) {
        console.log('收端测试信息追溯', response)
        that.closingEnd_testMessageLoading = false
        const res = response.data
        if (res !== null) {
          that.closingEnd_testMessageData = res['Data']
        }
      }).catch(function () {
        that.closingEnd_testMessageLoading = false
      })
    },
    // FQC追溯
    get_fqc_traceability_message (osaSN) {
      let that = this
      that.fqc_traceabilityMessageLoading = true
      that.$axios({
        url: '/display/production-trace/osa/get-auto-dt-results-osa-fqc-by-osa-sn',
        method: 'get',
        params: {
          osa_sn: osaSN
        }
      }).then(function (response) {
        console.log('FQC追溯', response)
        that.fqc_traceabilityMessageLoading = false
        const res = response.data
        if (res !== null) {
          that.fqc_traceabilityMessageData = res['Data']
        }
      }).catch(function () {
        that.fqc_traceabilityMessageLoading = false
      })
    },
    // 分档信息追溯
    get_bracket_traceability_message (osaSN) {
      let that = this
      that.bracket_traceabilityMessageLoading = true
      that.$axios({
        url: '/display/production-trace/osa/get-optics-data-by-osa-sn',
        method: 'get',
        params: {
          osa_sn: osaSN
        }
      }).then(function (response) {
        console.log('分档信息追溯', response)
        that.bracket_traceabilityMessageLoading = false
        const res = response.data
        if (res !== null) {
          that.bracket_traceabilityMessageData = res['Data']
        }
      }).catch(function () {
        that.bracket_traceabilityMessageLoading = false
      })
    },
    // 改制信息追溯
    get_restructure_traceability_message (osaSN) {
      let that = this
      that.restructure_traceabilityMessageLoading = true
      that.$axios({
        url: '/display/production-trace/osa/get-auto-dt-osa-restructuring-by-osa-sn',
        method: 'get',
        params: {
          osa_sn: osaSN
        }
      }).then(function (response) {
        console.log('改制信息追溯', response)
        that.restructure_traceabilityMessageLoading = false
        const res = response.data
        if (res !== null) {
          that.restructure_traceabilityMessageData = res['Data']
        }
      }).catch(function () {
        that.restructure_traceabilityMessageLoading = false
      })
    },
    // OSA配对追溯
    get_osa_pairing_traceability_message (osaSN) {
      let that = this
      that.osa_pairing_traceabilityMessageLoading = true
      that.$axios({
        url: '/display/production-trace/osa/get-auto-dt-results-osa-tracking-by-osa-sn',
        method: 'get',
        params: {
          osa_sn: osaSN
        }
      }).then(function (response) {
        console.log('OSA配对追溯', response)
        that.osa_pairing_traceabilityMessageLoading = false
        const res = response.data
        if (res !== null) {
          that.osa_pairing_traceabilityMessageData = res['Data']
          console.log(that.osa_pairing_traceabilityMessageData)
          var LOTNO = ''
          var PN = ''
          for (let i = 0; i < res['Data'].length; i++) {
            LOTNO = LOTNO + res['Data'][i]['LOTNO'] + ','
            PN = PN + res['Data'][i]['PN'] + ','
          }
          console.log(LOTNO)
          console.log(PN)
          that.get_PCH_work_order_message(LOTNO)
          that.get_PN_originating_database_configuration_traceability_message(PN)
          that.get_PN_closingEnd_database_configuration_traceability_message(PN)
        }
      }).catch(function () {
        that.osa_pairing_traceabilityMessageLoading = false
      })
    },
    // 通过PCH获得工单信息
    get_PCH_work_order_message (LOTNO) {
      let that = this
      that.workOrderMessageLoading = true
      that.$axios({
        url: '/display/production-trace/osa/get-sgd-scdd-trx-by-pch',
        method: 'get',
        params: {
          pch: LOTNO
        }
      }).then(function (response) {
        console.log('通过PCH获得工单信息', response)
        that.workOrderMessageLoading = false
        const res = response.data
        if (res !== null) {
          that.workOrderMessageData = res['Data']
        }
      }).catch(function () {
        that.workOrderMessageLoading = false
      })
    },
    // 通过Pn获得发端数据库配置信息
    get_PN_originating_database_configuration_traceability_message (PN) {
      let that = this
      that.originating_database_configuration_traceabilityMessageLoading = true
      that.$axios({
        url: '/display/production-trace/osa/get-auto-dt-spec-liv-by-pn',
        method: 'get',
        params: {
          pn: PN
        }
      }).then(function (response) {
        console.log()
        that.originating_database_configuration_traceabilityMessageLoading = false
        const res = response.data
        if (res !== null) {
          that.originating_database_configuration_traceabilityMessageData = res['Data']
        }
      }).catch(function () {
        that.originating_database_configuration_traceabilityMessageLoading = false
      })
    },
    // 通过Pn获得收端数据库配置信息
    get_PN_closingEnd_database_configuration_traceability_message (PN) {
      let that = this
      that.closingEnd_database_configuration_traceabilityMessageLoading = true
      that.$axios({
        url: '/display/production-trace/osa/get-auto-dt-spec-apd-by-pn',
        method: 'get',
        params: {
          pn: PN
        }
      }).then(function (response) {
        console.log('通过Pn获得收端数据库配置信息', response)
        that.closingEnd_database_configuration_traceabilityMessageLoading = false
        const res = response.data
        if (res !== null) {
          that.closingEnd_database_configuration_traceabilityMessageData = res['Data']
        }
      }).catch(function () {
        that.closingEnd_database_configuration_traceabilityMessageLoading = false
      })
    },
    // 预组追溯
    get_proGroup_message (osaSN) {
      let that = this
      that.preGroup_traceabilityMessageLoading = true
      that.$axios({
        url: '/display/production-trace/prepare/get-prepare-assemble-by-osa-sn',
        method: 'get',
        params: {
          osa_sn: osaSN
        }
      }).then(function (response) {
        console.log('预组追溯', response)
        that.preGroup_traceabilityMessageLoading = false
        const res = response.data
        if (res !== null) {
          that.preGroup_traceabilityMessageData = res
        }
      }).catch(function () {
        that.preGroup_traceabilityMessageLoading = false
      })
    },
    // 点击导出excel表格的按钮 （处理需要导出的数据）
    exportBtn () {
      var data = []
      var name = []
      if (this.workOrderChecked === true) {
        data.push(this.workOrderData)
        name.push('配对信息')
      }
      if (this.PCH_workOrderChecked === true) {
        data.push(this.PCH_workOrderData)
        name.push('工单信息追溯')
      }
      if (this.firmwareChecked === true) {
        data.push(this.firmwareData)
        name.push('固件版本信息追溯')
      }
      if (this.ate_debugMessageChecked === true) {
        data.push(this.ate_debugMessageData)
        name.push('常规产品调测信息')
      }
      if (this.ate_new_debugMessageChecked === true) {
        data.push(this.ate_new_debugMessageData)
        name.push('10G产品调测信息')
      }
      if (this.process_log_debugMessageChecked === true) {
        data.push(this.process_log_debugMessageData)
        name.push('生产过程相关信息')
      }
      if (this.routine_product_test_indicatorsMessageChecked === true) {
        data.push(this.routine_product_test_indicatorsMessageData)
        name.push('常规产品测试指标范围')
      }
      if (this.ten_product_test_indicatorsMessageChecked === true) {
        data.push(this.ten_product_test_indicatorsMessageData)
        name.push('10G产品测试指标范围')
      }
      if (this.testMessageChecked === true) {
        data.push(this.testMessageData)
        name.push('测试工位人员信息追溯')
      }
      if (this.receive_coupling_traceability_MessageChecked === true) {
        data.push(this.receive_coupling_traceability_MessageData)
        name.push('接收耦合追溯')
      }
      if (this.beginning_testMessageChecked === true) {
        data.push(this.beginning_testMessageData)
        name.push('发端测试信息追溯')
      }
      if (this.closingEnd_testMessageChecked === true) {
        data.push(this.closingEnd_testMessageData)
        name.push('收端测试信息追溯')
      }
      if (this.osa_pairing_traceabilityMessageChecked === true) {
        data.push(this.osa_pairing_traceabilityMessageData)
        name.push('OSA配对追溯')
      }
      if (this.fqc_traceabilityMessageChecked === true) {
        data.push(this.fqc_traceabilityMessageData)
        name.push('FQC追溯')
      }
      if (this.workOrderMessageChecked === true) {
        data.push(this.workOrderMessageData)
        name.push('工单信息追溯')
      }
      if (this.emission_tracingMessageChecked === true) {
        data.push(this.emission_tracingMessageData)
        name.push('发射耦合追溯')
      }
      if (this.originating_database_configuration_traceabilityMessageChecked === true) {
        data.push(this.originating_database_configuration_traceabilityMessageData)
        name.push('发端数据库配置追溯')
      }
      if (this.closingEnd_database_configuration_traceabilityMessageChecked === true) {
        data.push(this.closingEnd_database_configuration_traceabilityMessageData)
        name.push('收端数据库配置追溯')
      }
      if (this.bracket_traceabilityMessageChecked === true) {
        data.push(this.bracket_traceabilityMessageData)
        name.push('分档信息追溯')
      }
      if (this.restructure_traceabilityMessageChecked === true) {
        data.push(this.restructure_traceabilityMessageData)
        name.push('改制信息追溯')
      }
      if (this.preGroup_traceabilityMessageChecked === true) {
        data.push(this.preGroup_traceabilityMessageData)
        name.push('预组追溯')
      }
      this.exportExcel(name, data)
    },
    workbook2blob (workbook) {
    // 生成excel的配置项
      var wopts = {
        // 要生成的文件类型
        bookType: 'xlsx',
        // // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        bookSST: false,
        type: 'binary'
      }
      var wbout = XLSX.write(workbook, wopts)
      // 将字符串转ArrayBuffer
      function s2ab (s) {
        var buf = new ArrayBuffer(s.length)
        var view = new Uint8Array(buf)
        for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
        return buf
      }
      let buf = s2ab(wbout)
      var blob = new Blob([buf], {
        type: 'application/octet-stream'
      })
      return blob
    },
    // 将blob对象 创建bloburl,然后用a标签实现弹出下载框
    openDownloadDialog (blob, fileName) {
      if (typeof blob === 'object' && blob instanceof Blob) {
        blob = URL.createObjectURL(blob) // 创建blob地址
      }
      var aLink = document.createElement('a')
      aLink.href = blob
      // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，有时候 file:///模式下不会生效
      aLink.download = fileName || ''
      var event
      if (window.MouseEvent) event = new MouseEvent('click')
      //   移动端
      else {
        event = document.createEvent('MouseEvents')
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      }
      aLink.dispatchEvent(event)
    },
    exportExcel (name, data) {
      console.log('data', data)
      console.log('name', name)
      var wb = XLSX.utils.book_new()
      for (let i = 0; i < data.length; i++) {
        let sheetdata = data[i]
        var sheet = XLSX.utils.json_to_sheet(sheetdata)
        XLSX.utils.book_append_sheet(wb, sheet, name[i])
      }
      // let sheet1data = [{ department: '行政部', count: 2 }, { department: '前端部', count: 3 }]
      // let sheet2data = [{ name: '张三', do: '整理文件' }, { name: '李四', do: '打印' }]
      // let sheet3data = [{ name: '王五', do: 'Vue' }, { name: '二楞', do: 'react' }]
      // var sheet1 = XLSX.utils.json_to_sheet(sheet1data)
      // var sheet2 = XLSX.utils.json_to_sheet(sheet2data)
      // var sheet3 = XLSX.utils.json_to_sheet(sheet3data)
      // console.log(sheet1, sheet2, sheet3, 'sheet123')
      // // 创建一个新的空的workbook
      // var wb = XLSX.utils.book_new()
      // XLSX.utils.book_append_sheet(wb, sheet1, '部门统计')
      // XLSX.utils.book_append_sheet(wb, sheet2, '行政部')
      // XLSX.utils.book_append_sheet(wb, sheet3, '前端部')
      const workbookBlob = this.workbook2blob(wb)
      this.openDownloadDialog(workbookBlob, this.inputSN + '追溯报表.xlsx')
    }
  },
  data () {
    return {
      moduleVal: [],
      osaVal: [],
      preGroupVal: [],
      moduleActiveNames: [],
      osaActiveNames: [],
      preGroupActiveNames: [],
      inputSN: '',
      radio: '1',
      copySN: '',
      osaSN: '',
      // 工单
      workOrderTrue: '',
      workOrderData: [],
      workOrderLoading: false,
      workOrderChecked: false,
      workOrderCheckedDisabled: true,
      workOlderDataHeader: [['PARTNUMBER', '型号'], ['MANUFACTURE_GROUP', '工单号'], ['BOSA_GROUP', 'BOSA料号'], ['PCBA1_GROUP', 'PCBA1料号'], ['BOSA_SN', 'BOSA_SN'], ['PCBA1_SN', 'PCBA1_SN'], ['MODIFYDATE', '配对时间']],
      // PCH工单
      PCH_workOrderTrue: '',
      PCH_workOrderData: [],
      PCH_workOrderLoading: false,
      PCH_workOrderChecked: false,
      PCH_workOrderCheckedDisabled: true,
      PCH_workOlderDataHeader: [['PARTNUMBER', '型号'], ['VERSION', 'BOM'], ['PCH_TC', '工单号'], ['PCH_TC_COUNT', '工单数量'], ['MATERIEL_CODE', '物料代码'], ['CSXLMFW', '条码范围'], ['STATE', '状态'], ['PCH_TC_DATE', '下单时间'], ['BOSA_LH', 'BOSA料号'], ['TOSA_LH', 'TOSA料号'], ['ROSA_LH', 'ROSA料号'], ['PCBA_LH', 'PCBA料号'], ['BOSA_PCH', 'POSA批次号'], ['TOSA_PCH', 'TOSA批次号'], ['ROSA_PCH', 'ROSA批次号'], ['PCBA_PCH', 'PCBA批次号'], ['LPRKCW', '仓位'], ['PCH_LX', '工单类型']],
      // 固件版本
      firmwareTrue: '',
      firmwareData: [],
      firmwareLoading: false,
      firmwareChecked: false,
      firmwareCheckedDisabled: true,
      firmwareDataHeader: [['PN', '型号'], ['BOM', 'BOM'], ['INNER_SN', 'BOSA SN'], ['BOSA_BATCH', 'BOSA批次号'], ['TESTDATE', '测试时间'], ['FIRMWARE', '固件版本']],
      // 调试ate
      ate_debugMessageTrue: '',
      ate_debugMessageData: [],
      ate_debugMessageLoading: false,
      ate_debugMessageChecked: false,
      ate_debugMessageCheckedDisabled: true,
      ate_debugMessageDataHeader: [['PARTNUMBER', '型号'], ['VERSION', 'BOM'], ['TESTDATE', '测试时间'], ['MODULESN', '模块SN'], ['OPTICSSN', 'BOSA SN'], ['TEMPERATURE', '起测温度'], ['AMBIENTTEMPER', '温度标志'], ['ERRORCODE', '不良代码'], ['STATUS', '测试结果'], ['TXAOP', '光功率'], ['TXER', '消光比'], ['OVERLOAD', '过载'], ['SENSITIVITY', '灵敏度'], ['SDASSERT', 'SDA'], ['SDDASSERT', 'SDD']],
      // 调试ate_new
      ate_new_debugMessageTrue: '',
      ate_new_debugMessageData: [],
      ate_new_debugMessageLoading: false,
      ate_new_debugMessageChecked: false,
      ate_new_debugMessageCheckedDisabled: true,
      ate_new_debugMessageDataHeader: [['PARTNUMBER', '型号'], ['VERSION', 'BOM'], ['TESTDATE', '测试时间'], ['MODULESN', '模块SN'], ['OPTICSSN', 'BOSA SN'], ['TEMPERATURE', '起测温度'], ['AMBIENTTEMPER', '温度标志'], ['TESTFLAG', '测试工序'], ['ERRORCODE', '不良代码'], ['STATUS', '测试结果'], ['TXAOP', '光功率'], ['TXER', '消光比'], ['MARGING', '眼图裕量'], ['TXCROSS', '交叉点'], ['TXOFFPOWER', '发端关断光功率'], ['RXAMP', '功耗'], ['OVERLOAD', '过载'], ['SENSITIVITY', '灵敏度'], ['SDASSERT', 'SDA'], ['SDDASSERT', 'SDD'], ['A2_IBIAS', 'IBIAS'], ['A2_TXMON', '发端监控光功率'], ['TEC_TEMPERATURE', 'TEC温度']],
      // 调试process_log
      process_log_debugMessageTrue: '',
      process_log_debugMessageData: [],
      process_log_debugMessageLoading: false,
      process_log_debugMessageChecked: false,
      process_log_debugMessageCheckedDisabled: true,
      process_log_debugMessageDataHeader: [['PN', '型号'], ['SN', 'BOSA SN'], ['OPERATOR', '操作员'], ['LOG_ACTION', '测试工序'], ['ACTION_TIME', '测试时间'], ['PARAMETER', '状态'], ['P_VALUE', '测试结果'], ['COMMENTS', '现象描述'], ['SOFTVERSION', '软件版本'], ['STATIONID', '工位号'], ['RUNTIME', '用时'], ['RUNCOUNT', '测试次数'], ['COMMITVER', '软件编号'], ['PCH_TC', '工单号']],
      // 常规产品测试指标范围
      routine_product_test_indicatorsMessageTrue: '',
      routine_product_test_indicatorsMessageData: [],
      routine_product_test_indicatorsMessageLoading: false,
      routine_product_test_indicatorsMessageChecked: false,
      routine_product_test_indicatorsMessageCheckedDisabled: true,
      routine_product_test_indicatorsMessageDataHeader: [['PARTNUMBER', '型号'], ['VERSION', 'BOM'], ['DT_FLAG', '工序标志'], ['TEMPER_FLAG', '温度标志'], ['TEMPERMIN', '温度最小值'], ['TEMPERMAX', '温度最大值'], ['TXPOWMIN', '光功率最小值'], ['TXPOWMAX', '光功率最大值'], ['TXERMIN', '消光比最小值'], ['TXERMAX', '消光比最大值'], ['TXDISPOWMAX', '关断光功率最大值'], ['OVERLOAD', '过载'], ['SENS', '灵敏度'], ['SDASSERT', 'SDA'], ['SDDEASSERT', 'SDD']],
      // 10G产品测试指标范围
      ten_product_test_indicatorsMessageTrue: '',
      ten_product_test_indicatorsMessageData: [],
      ten_product_test_indicatorsMessageLoading: false,
      ten_product_test_indicatorsMessageChecked: false,
      ten_product_test_indicatorsMessageCheckedDisabled: true,
      ten_product_test_indicatorsMessageDataHeader: [['PARTNUMBER', '型号'], ['VERSION', 'BOM'], ['DT_FLAG', '工序标志'], ['TEMPER_FLAG', '温度标志'], ['TEMPERMIN', '温度最小值'], ['TEMPERMAX', '温度最大值'], ['TXPOWMIN', '光功率最小值'], ['TXPOWMAX', '光功率最大值'], ['TXBIASMIN', 'IBIAS最小值'], ['TXBIASMAX', 'IBIAS最大值'], ['TXERMIN', '消光比最小值'], ['TXERMAX', '消光比最大值'], ['TXCROSSMIN', '交叉点最小值'], ['TXCROSSMAX', '交叉点最大值'], ['TXMARGIN', '眼图裕量最小值'], ['TXDISPOWMAX', '关断电功率最大值'], ['TRACKINGERRORMAX', '调试光功率最大值'], ['OVERLOAD', '过载'], ['SENS', '灵敏度'], ['SDASSERT', 'SDA'], ['SDDEASSERT', 'SDD']],
      // 测试信息追溯
      testMessageTrue: '',
      testMessageData: [],
      testMessageLoading: false,
      testMessageChecked: false,
      testMessageCheckedDisabled: true,
      testMessageDataHeader: [['PN', '型号'], ['SN', '条码号'], ['OPERATOR', '操作员工'], ['LOG_ACTION', '工序'], ['ACTION_TIME', '生产日期'], ['P_VALUE', '测试结果'], ['COMMENTS', '测试过程记录'], ['SOFTVERSION', '软件版本'], ['STATIONID', '生产工位'], ['RUNCOUNT', '测试次数'], ['PCH_TC', '工单号']],
      // 接收耦合追溯
      receive_coupling_traceability_MessageTrue: '',
      receive_coupling_traceability_MessageData: [],
      receive_coupling_traceability_MessageLoading: false,
      receive_coupling_traceability_MessageChecked: false,
      receive_coupling_traceability_MessageCheckedDisabled: true,
      receive_coupling_traceability_MessageDataHeader: [['PN', '型号'], ['WORKNUM', '工单号'], ['INSNAME', '生产工位'], ['WORKER', '操作员工'], ['TESTTIME', '生产日期'], ['SN', '条码号'], ['STATUS', '测试结果'], ['VBR', '击穿电压'], ['RESCRT', '耦合IOP'], ['RESCRTEND', '照胶后IOP']],
      // 发端测试信息追溯
      beginning_testMessageTrue: '',
      beginning_testMessageData: [],
      beginning_testMessageLoading: false,
      beginning_testMessageChecked: false,
      beginning_testMessageCheckedDisabled: true,
      beginning_testMessageDataHeader: [['PN', '型号'], ['SN', '条码号'], ['ERRORCODE', '错误代码'], ['TEMPER', '温度'], ['PO_IO', '1G 功率'], ['IM_IO', '背光电流'], ['TC_FLAG', '工序'], ['COMPARE_PO', '1G 对比'], ['TESTDATE', '生产日期'], ['PO_IO_10G', '10G 功率'], ['TC_PO_10G', '10G 对比'], ['EA', 'EA']],
      // 收端测试信息追溯
      closingEnd_testMessageTrue: '',
      closingEnd_testMessageData: [],
      closingEnd_testMessageLoading: false,
      closingEnd_testMessageChecked: false,
      closingEnd_testMessageCheckedDisabled: true,
      closingEnd_testMessageDataHeader: [['PN', '型号'], ['SN', '条码号'], ['ERRORCODE', '错误代码'], ['APD_T_VBR', '1.25G 击穿电压'], ['APD_T_IOP', '1.25G IOP'], ['APD_T_GAIN', '1.25G 增益'], ['APD_D_DATE', '生产日期'], ['APD_T_IR', '1.25G ICC'], ['TC_FLAG', '工序'], ['APD_T_VBR_2G', '2.5G 击穿电压'], ['APD_T_IOP_2G', '2.5G IOP'], ['APD_T_GAIN_2G', '2.5G 增益'], ['APD_T_IR_2G', '2.5G ICC'], ['DELTA_IOP', '1.25G IOP对比百分比'], ['DELTA_IOP_2G', '2.5G IOP对比百分比']],
      // OSA配对追溯
      osa_pairing_traceabilityMessageTrue: '',
      osa_pairing_traceabilityMessageData: [],
      osa_pairing_traceabilityMessageLoading: false,
      osa_pairing_traceabilityMessageChecked: false,
      osa_pairing_traceabilityMessageCheckedDisabled: true,
      osa_pairing_traceabilityMessageDataHeader: [['PN', '型号'], ['SN', '条码号'], ['LOTNO', '工单号'], ['LD_LOTNO', 'LD批次号'], ['LD_WORKNO', 'LD序列号'], ['TX_MART', 'LD料号'], ['TXDATETIME', '配对时间'], ['SEMIFINISHED_SN', '半成品条码']],
      // FQC追溯
      fqc_traceabilityMessageTrue: '',
      fqc_traceabilityMessageData: [],
      fqc_traceabilityMessageLoading: false,
      fqc_traceabilityMessageChecked: false,
      fqc_traceabilityMessageCheckedDisabled: true,
      fqc_traceabilityMessageDataHeader: [['PN', '型号'], ['SN', '条码号'], ['CREATEDATE', '生产日期']],
      // 工单信息追溯
      workOrderMessageTrue: '',
      workOrderMessageData: [],
      workOrderMessageLoading: false,
      workOrderMessageChecked: false,
      workOrderMessageCheckedDisabled: true,
      workOrderMessageDataHeader: [['PARTNUMBER', '型号'], ['VERSION', 'BOM'], ['PCH_TC', '工单号'], ['PCH_TC_COUNT', '工单数量'], ['MATERIEL_CODE', '物料号'], ['CSXLMFW', '序列号'], ['STATE', '测试结果'], ['PCH_TC_DATE', '结案日期'], ['BOSA_LH', 'BOSA料号'], ['TOSA_LH', 'TOSA料号'], ['ROSA_LH', 'ROSA料号'], ['BOSA_PCH', 'BOSA批次号'], ['TOSA_PCH', 'TOSA批次号'], ['ROSA_PCH', 'ROSA批次号'], ['PCH_LX', '工单类型']],
      // 发射耦合追溯
      emission_tracingMessageTrue: '',
      emission_tracingMessageData: [],
      emission_tracingMessageLoading: false,
      emission_tracingMessageChecked: false,
      emission_tracingMessageCheckedDisabled: true,
      emission_tracingMessageDataHeader: [['PN', '型号'], ['WORKNUM', '工单号'], ['INSNAME', '生产工位'], ['WORKER', '操作员工'], ['TESTTIME', '生产日期'], ['SN', '条码号'], ['STATUS', '测试结果'], ['PWRUOK', '第一次耦合值'], ['PWREND', '焊后值'], ['PWRZOK', '第二次耦合值'], ['PWRZMAX', '耦合最大值']],
      // 发端数据库配置追溯
      originating_database_configuration_traceabilityMessageTrue: '',
      originating_database_configuration_traceabilityMessageData: [],
      originating_database_configuration_traceabilityMessageLoading: false,
      originating_database_configuration_traceabilityMessageChecked: false,
      originating_database_configuration_traceabilityMessageCheckedDisabled: true,
      originating_database_configuration_traceabilityMessageDataHeader: [['PN', '型号'], ['TESTTYPE', '工序'], ['PO_IOMIN', '1G功率下限'], ['PO_IOMAX', '1G功率上限'], ['TC_PO', '1G TC对比'], ['PO_IOMIN_10G', '10G功率下限'], ['PO_IOMAX_10G', '10G功率上限'], ['TC_PO_10G', '10G TC对比'], ['TC_PO_POSITIVE', '1G TC对比正上限'], ['TC_PO_10G_POSITIVE', '10G TC对比正上限'], ['COUPLE_DELTAPO', '1G耦合对比'], ['COUPLE_DELTAPO_10G', '10G耦合对比'], ['COUPLE_DELTAPO_POSITIVE', '1G耦合对比正上限'], ['COUPLE_DELTAPO_10G_POSITIVE', '10G耦合对比正上限'], ['PO_IOMIN_10G_D2SECOND', '10G容错值'], ['PO_IOMIN_1G_D2SECOND', '1G容错值']],
      // 收端数据库配置追溯
      closingEnd_database_configuration_traceabilityMessageTrue: '',
      closingEnd_database_configuration_traceabilityMessageData: [],
      closingEnd_database_configuration_traceabilityMessageLoading: false,
      closingEnd_database_configuration_traceabilityMessageChecked: false,
      closingEnd_database_configuration_traceabilityMessageCheckedDisabled: true,
      closingEnd_database_configuration_traceabilityMessageDataHeader: [['PN', '型号'], ['DT_FLAG', '工序'], ['IOP_MIN', '1.25G IOP 下限'], ['IOP_MAX', '1.25G IOP 上限'], ['GAIN_MIN', '增益'], ['IOP_2G_MIN', '2.5G IOP 下限'], ['IOP_2G_MAX', '2.5G IOP 上限'], ['DELTA_IOP_NEG', '1.25G IOP 对比百分比'], ['DELTA_IOP_2G_NEG', '2.5G IOP 对比百分比']],
      // 分档信息追溯
      bracket_traceabilityMessageTrue: '',
      bracket_traceabilityMessageData: [],
      bracket_traceabilityMessageLoading: false,
      bracket_traceabilityMessageChecked: false,
      bracket_traceabilityMessageCheckedDisabled: true,
      bracket_traceabilityMessageDataHeader: [['PN', '型号'], ['SN', '条码号'], ['IOP', 'IOP'], ['GAIN', '增益'], ['PF', '1G 功率'], ['TESTDATE', '生产日期'], ['APD_T_IOP', 'APD IOP'], ['APD_T_GAIN', 'APD增益'], ['APD_D_DATE', 'APD生产日期'], ['PF_10G', '10G 功率'], ['OSA_CLASS', '分档档位']],
      // 改制信息追溯
      restructure_traceabilityMessageTrue: '',
      restructure_traceabilityMessageData: [],
      restructure_traceabilityMessageLoading: false,
      restructure_traceabilityMessageChecked: false,
      restructure_traceabilityMessageCheckedDisabled: true,
      restructure_traceabilityMessageDataHeader: [['PN', '型号'], ['SN', '条码号'], ['PN_ORIGINAL', '改制前型号'], ['SN_ORIGINAL', '改制前条码号'], ['RESTRUCTURING_TIME', '生产日期'], ['OPERATOR', '操作员工'], ['BATCH', '批次信息']],
      // 预组追溯
      preGroup_traceabilityMessageTrue: '',
      preGroup_traceabilityMessageData: [],
      preGroup_traceabilityMessageLoading: false,
      preGroup_traceabilityMessageChecked: false,
      preGroup_traceabilityMessageCheckedDisabled: true,
      preGroup_traceabilityMessageDataHeader: [['Id', 'ID'], ['WorkerId', '员工工号'], ['WorkOrderNum', '工单号'], ['Pn', 'PN'], ['Bom', 'BOM'], ['StationId', '工位号'], ['Process', '工序'], ['ItemCode', '设备编号'], ['MaterialNum', '物料编号'], ['GlueId', '胶水ID'], ['StartTime', '开始时间'], ['EndTime', '结束时间'], ['Sn', 'SN'], ['TotalCount', '总数'], ['FailCount', '失败数'], ['Tco', 'TOC']]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.el-table >>> tbody tr:hover>td {
  background-color: #90c0f1;
}
.FullTraceability >>> .el-collapse-item__header {
  background-color: rgba(0,0,0,.0) !important;
}
.FullTraceability >>> .el-collapse-item__wrap {
  background-color: rgba(0,0,0,.0) !important;
}
.FullTraceability >>> .el-collapse-item__content {
  padding-bottom: 0
}

</style>
