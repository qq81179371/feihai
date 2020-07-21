<template>
  <div class="info_box">
    <div class="block">
      <!-- <span class="demonstration">名称:</span> -->
      <el-input
        v-model="input"
        class="input_item"
        size="small"
        placeholder="请输入内容"
        clearable
      />
    </div>
    <div class="block">
      <el-button
        size="small"
        type="primary"
        icon="el-icon-search"
        @click="handlerSearch"
      >搜索</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: ''
    }
  },
  methods: {
    handlerSearch() {
      this.$emit('update:keyword', this.input)
    }
  }
}
</script>
<style lang="scss" scoped>
.info_box {
  margin-left: 30px;
  display: flex;
  align-content: center;
}
.block {
  display: flex;
  align-items: center;
  margin-right: 15px;
  height: 44px;
  &.disabled {
    pointer-events: none;
  }
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
</style>
