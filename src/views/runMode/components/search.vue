<template>
  <div class="main">
    <div class="block">
      <span class="demonstration">名称:</span>
      <el-input v-model="input" class="input_item" size="small" placeholder="请输入内容" />
    </div>
    <div class="block">
      <el-button size="small" type="primary" icon="el-icon-search">搜索</el-button>
    </div>
    <div class="block">
      <el-button size="small" type="success" icon="el-icon-plus">新建任务</el-button>
    </div>
    <div class="block">
      <el-button size="small" type="warning" icon="el-icon-refresh">刷新</el-button>
    </div>
  </div>
</template>

<script>
import { getDeviceTypeList } from '@/api/app.js'
export default {
  data() {
    return {
      input: '',
      placesList: [],
      statesList: [],
      value1: [],
      value2: []
    }
  },
  created() {
    this.getTypelist()
  },
  methods: {
    async getTypelist() {
      try {
        const res = await getDeviceTypeList()
        this.placesList = res.places
        this.statesList = res.states
      } catch (err) {
        throw (err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  margin-left: 40px;
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
