<template>
  <div class="main">
    <div class="block">
      <span class="demonstration">位置:</span>
      <el-select
        v-model="placeKeywords"
        class="item_select"
        collapse-tags
        placeholder="全部"
        size="small"
      >
        <el-option v-for="item in placesList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </div>
    <div class="block">
      <span class="demonstration">状态:</span>
      <el-select
        v-model="stateKeywords"
        class="item_select"
        collapse-tags
        placeholder="请选择"
        size="small"
      >
        <el-option v-for="item in statesList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </div>
    <div class="block">
      <!-- <span class="demonstration">设备信息:</span> -->
      <el-input v-model="deviceKeywords" clearable class="input_item" size="small" placeholder="请输入内容" />
    </div>
    <div class="block">
      <el-button
        size="small"
        type="primary"
        icon="el-icon-search"
        @click="handleSearchDeviceList"
      >搜索</el-button>
    </div>
    <div class="block">
      <el-button size="small" :disabled="!menus.find(e => e.id === 1).enable" type="primary" icon="el-icon-search" @click="handlerGetOnlineDevice">搜索网络设备</el-button>
    </div>
    <div class="block">
      <el-button size="small" type="warning" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
    </div>
    <div class="block flex1">
      <el-tooltip effect="dark" content="暂无权限" placement="left">
        <i v-if="!menus.find(e => e.id === 1).enable" class="iconfont red icon-quanxian" />
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    placesList: {
      type: Array,
      default: () => []
    },
    statesList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      deviceKeywords: '',
      placeKeywords: undefined,
      stateKeywords: undefined
    }
  },
  computed: {
    ...mapGetters(['menus'])
  },
  methods: {
    handlerGetOnlineDevice() {
      this.$emit('handlerGetOnlineDevice')
    },
    handleSearchDeviceList() {
      const device_search = {
        place: this.placeKeywords,
        online_state: this.stateKeywords,
        keyword: this.deviceKeywords
      }
      this.$emit('handleSearchDeviceList', device_search)
    },
    handleRefresh() {
      this.$emit('handleRefresh')
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  margin-left: 15px;
  display: flex;
  align-items: center;
  .block {
    display: flex;
    align-items: center;
    margin-right: 15px;
    height: 44px;
    .demonstration {
      font-size: 14px;
      color: #333;
      margin-right: 5px;
      white-space: nowrap;
    }
    .item_select {
      min-width: 150px;
      width: 150px;
      >>> .el-select__tags {
        height: 24px;
      }
    }
    .input_item {
      min-width: 180px;
      width: 12vw;
    }
  }
}
</style>
