<template>
  <div class="warp">
    <search-bar>
      <info-title :info-title="infoTitle" />
    </search-bar>
    <div class="details_box">
      <el-tabs
        v-model="activeName"
        :tab-position="tabPosition"
        class="tabs"
        lazy
      >
        <el-tab-pane label="系统设置" name="系统设置">
          <sys-config
            v-if="system_parameter && activeName === `系统设置`"
            :device-id="deviceId"
            :config-params="system_parameter"
            :edit-type="editType"
            :basic-data="deviceCommonParams.device_output_resolution"
            @handleGetDevicePlace="handleGetDevicePlace"
            @handleGetDeviceParams="handleGetDeviceParams"
          />
        </el-tab-pane>
        <el-tab-pane label="高级设置" name="高级设置">
          <advan-set
            v-if="setParams && activeName === `高级设置`"
            :device-id="deviceId"
            @handleGetDeviceParams="handleGetDeviceParams"
          />
        </el-tab-pane>
        <el-tab-pane v-if="editType" label="物联模块" name="物联模块">
          <lot-mod-info
            v-if="setParams && activeName === `物联模块`"
            :basic-data="deviceCommonParams"
            :device-id="deviceId"
            @handleGetDeviceParams="handleGetDeviceParams"
          />
        </el-tab-pane>
        <el-tab-pane v-if="editType" label="物联设备" name="物联设备">
          <lot-device-list
            v-if="setParams && activeName === `物联设备`"
            :basic-data="deviceCommonParams"
            :device-id="deviceId"
            @handleGetDeviceParams="handleGetDeviceParams"
          />
        </el-tab-pane>
        <el-tab-pane label="网络设置" name="网络设置">
          <networkSetting
            v-if="setParams && activeName === `网络设置`"
            :device-id="deviceId"
            @handleGetDeviceParams="handleGetDeviceParams"
          />
        </el-tab-pane>
        <el-tab-pane v-if="editType" label="设备详情" name="设备详情">
          <deviceDetails
            v-if="setParams && activeName === `设备详情`"
            :device-id="deviceId"
            @handleGetDeviceParams="handleGetDeviceParams"
          />
        </el-tab-pane>
        <el-tab-pane v-if="false" label="VLAN设置" name="VLAN设置">
          <vlanSet
            v-if="setParams && activeName === `VLAN设置`"
            :basic-data="deviceCommonParams.iot_module_types"
            :device-id="deviceId"
            @handleGetDeviceParams="handleGetDeviceParams"
          />
        </el-tab-pane>
        <el-tab-pane label="音频设置" name="音频设置">
          <audioSet
            v-if="setParams && activeName === `音频设置`"
            :device-id="deviceId"
            @handleGetDeviceParams="handleGetDeviceParams"
          />
        </el-tab-pane>
        <el-tab-pane v-if="editType" label="监控设置" name="监控设置">
          <monitoringSet
            v-if="setParams && activeName === `监控设置`"
            :device-id="deviceId"
            @handleGetDeviceParams="handleGetDeviceParams"
          />
        </el-tab-pane>
        <el-tab-pane
          v-if="editType"
          label="传感器设置"
          name="传感器设置"
        ><sensorSet
          v-if="setParams && activeName === `传感器设置`"
          :basic-data="deviceCommonParams"
          :device-id="deviceId"
          @handleGetDeviceParams="handleGetDeviceParams"
        /></el-tab-pane>
        <el-tab-pane v-if="editType" label="物联控制码" name="物联控制码">
          <lotControlCode
            v-if="setParams && activeName === `物联控制码`"
            :basic-data="deviceCommonParams"
            :device-id="deviceId"
            @handleGetDeviceParams="handleGetDeviceParams"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getDevicePlace, getDeviceParams } from '@/api/app'
import searchBar from '@/components/searchbar'
import infoTitle from './components/infoTitle'
import sysConfig from './components/sysConfig'
import advanSet from './components/advanSet'
import lotModInfo from './components/lotModInfo'
import lotDeviceList from './components/lotDeviceList'
import networkSetting from './components/networkSettings'
import deviceDetails from './components/deviceDetails'
import lotControlCode from './components/lotControlCode'
import monitoringSet from './components/monitoringSet'
import audioSet from './components/audioSet'
import sensorSet from './components/sensorSet'
import vlanSet from './components/vlanSet'
export default {
  components: {
    lotControlCode,
    networkSetting,
    deviceDetails,
    monitoringSet,
    lotDeviceList,
    lotModInfo,
    searchBar,
    sensorSet,
    infoTitle,
    sysConfig,
    audioSet,
    advanSet,
    vlanSet
  },
  data() {
    return {
      deviceCommonParams: {
        device_output_resolution: []
      },
      activeName: '系统设置',
      tabPosition: 'left',
      editType: null, // 1: 单个设置, 0: 批量设置
      setParams: null,
      infoTitle: '',
      deviceId: null,
      system_parameter: null
    }
  },
  created() {},
  mounted() {
    this.editType = Number(this.$route.query.editType)
    this.setParams = JSON.parse(this.$route.query.params)
    if (this.editType) {
      this.infoTitle = `位置: ${this.setParams.place}`
      this.deviceId = this.setParams.id
    } else {
      this.infoTitle = `批量设置: 共选择了${this.setParams.length}个位置`
      this.deviceId = this.setParams.map(e => e.id)
    }
    this.handleGetDevicePlace()
    this.handleGetDeviceParams()
  },
  methods: {
    async handleGetDeviceParams() {
      try {
        const res = await getDeviceParams({
          device_id: typeof this.deviceId === 'number' ? this.deviceId : null,
          device_ids: typeof this.deviceId === 'object' ? this.deviceId : null
        })
        this.deviceCommonParams = res
      } catch (err) {
        throw err
      }
    },
    async handleGetDevicePlace() {
      try {
        const res = await getDevicePlace({
          device_id: typeof this.deviceId === 'number' ? this.deviceId : null,
          device_ids: typeof this.deviceId === 'object' ? this.deviceId : null
        })
        this.system_parameter = res.system_parameter
      } catch (err) {
        throw err
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.warp {
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0px;
  width: 100%;
  .details_box {
    height: 100%;
    .tabs {
      height: 100%;
      /deep/ .is-active {
        color: #5d5d5d;
      }
      // /deep/ .el-tabs__nav-wrap {
      //   padding-top: 20px;
      // }
      /deep/ .el-tabs__item {
        text-align: left;
        height: 40px;
        line-height: 40px;
        padding-left: 20px;
        font-size: 12px;
        &:hover {
          color: #5d5d5d;
        }
      }
      /deep/ .el-tabs__header {
        width: 180px;
      }
      /deep/ .el-tabs__active-bar {
        background: #e4e7ed;
      }
      /deep/ .is-active {
        background: #e6fded;
      }
      /deep/ .el-tabs__content {
        height: calc(100% - 30px);
        padding: 0 0 30px 0;
        box-sizing: border-box;
      }
    }
  }
}
</style>
