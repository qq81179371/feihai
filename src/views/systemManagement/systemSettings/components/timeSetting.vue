<template>
  <div class="dashboard-container">
    <div class="header_title">
      <h4>时间设置</h4>
      <el-button
        type="primary"
        size="small"
        :disabled="!menus.find(e => e.id === 6).enable"
        @click="addnode"
      >保存</el-button>
    </div>
    <div class="box box_shadow">
      <el-form
        ref="form"
        :model="deviceArrProps"
        label-position="left"
        label-width="130px"
        size="small"
      >
        <el-form-item label="时区选择">
          <el-select v-model="deviceArrProps.time_zone" placeholder="请选择活动区域">
            <template v-for="item in time_zone_list">
              <el-option :key="item.id" :label="item.name" :value="item.id" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="同步时间方式">
          <el-checkbox v-model="deviceArrProps.auto_time_sync" label="自动同步时间" name="type" />
        </el-form-item>
        <el-form-item label="手动同步时间">
          <el-button type="primary" @click="handlerSyncTime">同步</el-button>
        </el-form-item>
        <el-form-item label="服务器时间">
          <span>111111111111111111</span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getTime, postTime, getTimeSync } from '@/api/app'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      placeId: '',
      userInfo: '',
      time_zone_list: [],
      deviceArrProps: {
        time_zone: 21,
        auto_time_sync: true
      }
    }
  },
  computed: {
    ...mapGetters(['menus'])
  },
  mounted() {
    this.handlergGetReceivingMember()
  },
  methods: {
    async handlerSyncTime() {
      const msg = this.$message({
        customClass: 'load_message',
        iconClass: 'el-icon-loading',
        duration: 0,
        center: true,
        message: '同步中...'
      })
      try {
        const res = await getTimeSync()
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
    async addnode() {
      try {
        const res = await postTime({
          time_info: this.deviceArrProps
        })
        this.$message({
          message: res.result.text,
          type: 'success'
        })
      } catch (err) {
        throw err
      }
    },
    // 接收成员获取
    async handlergGetReceivingMember() {
      try {
        const res = await getTime()
        this.time_zone_list = res.time_info.time_zone_list
        this.deviceArrProps.time_zone = res.time_info.time_zone
        this.deviceArrProps.auto_time_sync = res.time_info.auto_time_sync
      } catch (err) {
        throw err
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/baseTitle.scss";
/deep/ .el-select {
  display: block;
  max-width: 600px;
}
</style>
