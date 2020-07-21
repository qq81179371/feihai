<template>
  <div class="main">
    <div class="block">消息中心 / {{ title }}</div>
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
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters(['menus'])
  }
}
</script>

<style lang="scss" scoped>
.main {
  margin-left: 30px;
  display: flex;
  align-items: center;
  padding: 0 15px 0 0;
  .block {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #333;
  }
}
</style>
