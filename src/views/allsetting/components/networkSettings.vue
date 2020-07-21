<template>
  <div class="dashboard-container">
    <div class="header_title">
      <h4>网络设置</h4>
      <el-button type="primary" size="small" @click="submitForm">保存</el-button>
    </div>
    <el-form
      v-if="network_config"
      ref="networkForm"
      :model="network_config"
      label-width="150px"
      class="box_shadow"
      size="small"
      :rules="rules"
      label-position="left"
    >
      <el-form-item v-if="typeof deviceId === 'number'" label="IP地址" prop="ip">
        <el-input v-model="network_config.ip" />
      </el-form-item>
      <el-form-item v-if="typeof deviceId === 'number'" label="子网掩码" prop="netmask">
        <el-input v-model="network_config.netmask" />
      </el-form-item>
      <el-form-item v-if="typeof deviceId === 'number'" label="默认网关" prop="gateway">
        <el-input v-model="network_config.gateway" />
      </el-form-item>
      <el-form-item label="服务器IP地址" prop="bms_ip">
        <el-input v-model="network_config.bms_ip" />
        <el-checkbox v-model="network_config.find_server_auto" name="type">自动查找服务器</el-checkbox>
      </el-form-item>
      <el-form-item label="直播服务器IP地址" prop="srs_ip">
        <el-input v-model="network_config.srs_ip" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { validIP } from '@/utils/validate'
import { getDeviceNetworkInfo, changeDeviceNetworkInfo } from '@/api/app'
export default {
  name: 'Dashboard',
  props: {
    deviceId: {
      type: Number || Array,
      default: null
    }
  },
  data() {
    const validateIP = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('参数不能为空'))
      } else if (!validIP(value)) {
        callback(new Error('参数格式错误'))
      }
      callback()
    }
    return {
      network_config: null,
      rules: {
        ip: [{ required: true, validator: validateIP, trigger: 'change' }],
        netmask: [{ required: true, validator: validateIP, trigger: 'change' }],
        gateway: [{ required: true, validator: validateIP, trigger: 'change' }],
        bms_ip: [{ required: true, validator: validateIP, trigger: 'change' }],
        srs_ip: [{ required: true, validator: validateIP, trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    async submitForm() {
      this.$refs.networkForm.validate(async valid => {
        if (valid) {
          const msg = this.$message({
            customClass: 'load_message',
            iconClass: 'el-icon-loading',
            duration: 0,
            center: true,
            message: '操作中...'
          })
          try {
            const res = await changeDeviceNetworkInfo({
              device_id: typeof this.deviceId === 'number' ? this.deviceId : null,
              device_ids: typeof this.deviceId === 'object' ? this.deviceId : null,
              network_config: this.network_config
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
        }
      })
    },
    async getDetails() {
      try {
        const res = await getDeviceNetworkInfo({
          device_id: typeof this.deviceId === 'number' ? this.deviceId : null,
          device_ids: typeof this.deviceId === 'object' ? this.deviceId : null
        })
        this.network_config = res.network_config
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
