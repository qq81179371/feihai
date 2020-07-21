<template>
  <div class="info_box">
    <p>
      {{ infoTitle }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    infoTitle: {
      type: String,
      default: null
    }
  }
}
</script>
<style lang="scss" scoped>
.info_box {
  display: flex;
  p {
    margin-left: 30px;
    font-size: 14px;
    color: #282828;
    span {
      color: #fe4f05;
    }
  }
}
</style>
