<template>
  <div class="main">
    <div class="block">系统管理 / 系统与安全 / {{ title }}</div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  margin-left: 30px;
  display: flex;
  align-items: center;
  .block {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #333;
  }
}
</style>
