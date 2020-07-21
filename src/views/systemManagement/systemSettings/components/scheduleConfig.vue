<template>
  <div class="dashboard-container">
    <div class="header_title">系统升级</div>
    <p>软件版本：V1.0.0</p>
    <p>软件更新</p>
    <div class="btn_list">
      <el-button
        type="primary"
        :disabled="!menus.find(e => e.id === 6).enable"
        size="small"
      >加载文件</el-button>
      <el-button
        class="gray"
        :disabled="!menus.find(e => e.id === 6).enable"
        size="small"
      >系统更新</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['menus'])
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/systemManage.scss";
.dashboard-container {
  p {
    font-size: 14px;
    color: #282828;
    margin: 25px 20px 30px;
  }
  .btn_list {
    padding: 0 20px;
  }
  .gray {
    background: #5087EC;
    color: #fff;
    &:hover {
      opacity: .8;
    }
  }
}
</style>
