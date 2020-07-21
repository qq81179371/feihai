<template>
  <div class="info_box">
    <p>
      添加{{ taskName[taskType] }}
      <span />
    </p>
  </div>
</template>

<script>
export default {
  props: {
    taskType: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      taskName: {
        1: '物联控制任务',
        2: '音频广播任务',
        3: '视频广播任务'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.info_box {
  display: flex;
  p {
    margin-left: 30px;
    font-size: 16px;
    font-weight: bold;
    color: #282828;
    span {
      color: #fe4f05;
    }
  }
}
</style>
