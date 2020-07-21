<template>
  <div class="dashboard-container">
    <div class="header_title"><h4>设备详情</h4></div>
    <div v-if="basis_info" class="text box_shadow">
      <p>系列号: {{ basis_info.sn }}</p>
      <p>MAC 地址: {{ basis_info.mac_address }}</p>
      <p>软件版本: {{ basis_info.firmware_version }}</p>
      <p>硬件版本: {{ basis_info.hardware_version }}</p>
    </div>
  </div>
</template>

<script>
import { getDeviceDetailsInfo } from '@/api/app'
export default {
  name: 'Dashboard',
  props: {
    deviceId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      basis_info: null
    }
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    async getDetails() {
      try {
        const res = await getDeviceDetailsInfo({
          device_id: this.deviceId
        })
        this.basis_info = res.basis_info
      } catch (err) {
        throw err
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/settings.scss";
@import "~@/styles/baseTitle.scss";
.el-date-editor--time-select {
  width: 160px;
}
.text {
  margin-top: 30px;
  line-height: 40px;
  p {
    font-size: 14px;
    color: #282828;
  }
}
</style>
