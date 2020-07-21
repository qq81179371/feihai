<template>
  <div class="dashboard-container">
    <div class="header_title">
      <h4>监控设置</h4>
      <el-button
        type="primary"
        size="small"
        @click="submitForm"
      >保存</el-button>
    </div>
    <el-form
      ref="networkForm"
      :model="network_config"
      label-width="100px"
      class="box_shadow"
      size="small"
      label-position="left"
    >
      <p class="remind">
        提醒: 预览功能支持RTSP与RTMP,建议使用低码流
      </p>
      <el-form-item label="监控1码流" prop="ip">
        <el-input v-model="network_config.url1" />
      </el-form-item>
      <el-form-item label="监控2码流" prop="netmask">
        <el-input v-model="network_config.url2" />
      </el-form-item>
      <el-form-item label="监控3码流" prop="gateway">
        <el-input v-model="network_config.url3" />
      </el-form-item>
      <el-form-item label="监控4码流" prop="srs_ip">
        <el-input v-model="network_config.url4" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getMonitoringSetParams, postMonitoringSetParams } from '@/api/app'
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
      network_config: {
        url1: '',
        url2: '',
        url3: '',
        url4: ''
      }
    }
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    async submitForm() {
      const msg = this.$message({
        customClass: 'load_message',
        iconClass: 'el-icon-loading',
        duration: 0,
        center: true,
        message: '加载中...'
      })
      try {
        const res = await postMonitoringSetParams({
          device_id:
                typeof this.deviceId === 'number' ? this.deviceId : null,
          device_ids:
                typeof this.deviceId === 'object' ? this.deviceId : null,
          video_preview: this.network_config
        })
        msg.close()
        this.$message({
          message: res.result.text,
          type: 'success'
        })
      } catch (err) {
        msg.close()
        throw err
      }
    },
    async getDetails() {
      try {
        const res = await getMonitoringSetParams({
          device_id: typeof this.deviceId === 'number' ? this.deviceId : null,
          device_ids: typeof this.deviceId === 'object' ? this.deviceId : null
        })
        this.network_config = { ...res.video_preview }
      } catch (err) {
        throw err
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/baseTitle.scss";
@import "~@/styles/settings.scss";
.el-date-editor--time-select {
  width: 160px;
}
.operate_bar {
  margin: 25px 0;
  display: flex;
  align-items: center;
  display: flex;
  align-items: center;
  height: 56px;
}
</style>
