<template>
  <div class="system_settings_warp">
    <searchBar>
      <search :title="title" />
    </searchBar>
    <div class="details_box">
      <el-tabs v-model="title" tab-position="left" class="tabs">
        <el-tab-pane label="推送字幕" name="推送字幕">
          <systemInfo />
        </el-tab-pane>
        <el-tab-pane label="LED消息" name="LED消息">
          <systemUpgrade />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import searchBar from '@/components/searchbar'
import search from './components/search'
import systemInfo from './components/systemInfo'
import systemUpgrade from './components/systemUpgrade'
export default {
  components: {
    systemUpgrade,
    systemInfo,
    searchBar,
    search
  },
  data() {
    return {
      title: '推送字幕'
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
      /deep/ .el-tabs__nav-wrap {
        padding-top: 20px;
      }
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
