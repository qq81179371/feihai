<template>
  <div class="system_settings_warp">
    <searchBar>
      <search :title="title" />
    </searchBar>
    <div class="details_box">
      <el-tabs v-model="title" tab-position="left" class="tabs">
        <el-tab-pane label="分区设置" name="分区设置" lazy>
          <partitionSet v-if="title === '分区设置'" />
        </el-tab-pane>
        <el-tab-pane label="网络设置" name="网络设置" lazy>
          <networkSet v-if="title === '网络设置'" />
        </el-tab-pane>
        <el-tab-pane label="用户管理" name="用户管理" lazy>
          <userManage v-if="title === '用户管理'" :config-obj="configObj" @handlerGetSystemCofing="handlerGetSystemCofing" />
        </el-tab-pane>
        <el-tab-pane label="一卡通管理" name="一卡通管理" lazy>
          <IDCardManage v-if="title === '一卡通管理'" :config-obj="configObj" />
        </el-tab-pane>
        <!-- <el-tab-pane label="课表配置" name="课表配置" lazy>
          <scheduleConfig v-if="title === '课表配置'" />
        </el-tab-pane> -->
        <el-tab-pane label="消息设置" name="消息设置" lazy>
          <messsageSet v-if="title === '消息设置' &&configObj" :config-obj="configObj" />
        </el-tab-pane>
        <el-tab-pane label="时间设置" name="时间设置" lazy>
          <timeSetting v-if="title === '时间设置'" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getSystemCofing } from '@/api/app'
import searchBar from '@/components/searchbar'
import search from './components/search'
import IDCardManage from './components/IDCardManage'
import messsageSet from './components/messsageSet'
import networkSet from './components/networkSet'
import partitionSet from './components/partitionSet'
// import scheduleConfig from './components/scheduleConfig'
import userManage from './components/userManage'
import timeSetting from './components/timeSetting'
export default {
  components: {
    // scheduleConfig,
    partitionSet,
    IDCardManage,
    messsageSet,
    timeSetting,
    userManage,
    networkSet,
    searchBar,
    search
  },
  data() {
    return {
      configObj: null,
      title: '分区设置'
    }
  },
  created() {
    this.handlerGetSystemCofing()
  },
  methods: {
    async handlerGetSystemCofing() {
      const res = await getSystemCofing()
      this.configObj = res
    }
  }
}
</script>
<style lang="scss" scoped>
.system_settings_warp {
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
        height: 100%;
      }
    }
  }
}
</style>
