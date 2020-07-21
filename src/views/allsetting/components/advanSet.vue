<template>
  <div class="dashboard-container">
    <div class="header_title"><h4>高级设置</h4> <el-button type="primary" size="small" @click="submitForm">保存</el-button></div>
    <el-form
      v-if="advanced_parameter"
      ref="form"
      :model="advanced_parameter"
      label-width="150px"
      size="small"
      class="box_shadow"
      label-position="left"
    >
      <el-form-item label="磁控锁开锁延迟">
        <el-input v-model.number="advanced_parameter.magnetic_lock_open_time" />
      </el-form-item>
      <el-form-item label="磁控锁开锁电平">
        <el-radio-group v-model="advanced_parameter.magnetic_lock_open_level">
          <el-radio :label="0">高电平</el-radio>
          <el-radio :label="1">低电平</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="液晶面板待机息延迟">
        <el-input v-model.number="advanced_parameter.lcd_panel_off_time" />
      </el-form-item>
      <el-form-item label="刷卡联动">
        <el-checkbox
          v-model="advanced_parameter.card_swiped_unlock_panel"
          :label="1"
          name="type"
        >解锁控制面板</el-checkbox>
        <el-checkbox v-model="advanced_parameter.card_swiped_open_device" :label="1" name="type">开机</el-checkbox>
      </el-form-item>
      <el-form-item label="面板待机锁定">
        <el-checkbox-group v-model="advanced_parameter.panel_standby_lock">
          <el-checkbox label="开启" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item v-if="advanced_parameter.panel_standby_lock" label="面板待机锁定延迟">
        <el-input v-model.number="advanced_parameter.panel_standby_lock_time" />
      </el-form-item>
      <el-form-item label="电子钟息屏">
        <el-checkbox-group v-model="advanced_parameter.led_stabdby">
          <el-checkbox label="开启" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item v-if="advanced_parameter.led_stabdby" label="电子钟息屏时间范围">
        <el-time-select
          v-model="advanced_parameter.led_stabdby_starttime"
          placeholder="起始时间"
          :picker-options="{
            start: '00:00',
            step: '00:30',
            end: '23:00'
          }"
        />
        <el-time-select
          v-model="advanced_parameter.led_stabdby_endtime"
          placeholder="结束时间"
          :picker-options="{
            start: '00:00',
            step: '00:30',
            end: '23:00'
          }"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getAdvanSetting, putAdvanSetting } from '@/api/app'
export default {
  name: 'Dashboard',
  props: {
    deviceId: {
      type: Number || Array,
      default: null
    },
    basicData: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      advanced_parameter: null
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
        message: '操作中...'
      })
      try {
        const res = await putAdvanSetting({
          // device_id: this.deviceId,
          advanced_parameter: this.advanced_parameter,
          device_id: typeof this.deviceId === 'number' ? this.deviceId : null,
          device_ids: typeof this.deviceId === 'object' ? this.deviceId : null
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
        const res = await getAdvanSetting({
          device_id: typeof this.deviceId === 'number' ? this.deviceId : null,
          device_ids: typeof this.deviceId === 'object' ? this.deviceId : null
        })
        this.advanced_parameter = res.advanced_parameter
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
.operate_bar {
  margin: 25px 0;
  display: flex;
  align-items: center;
  display: flex;
  align-items: center;
  height: 56px;
}
</style>
