<template>
  <div class="item">
    <div class="video_box">
      <videoPlayer :source="item.url" />
    </div>
    <div class="tit">
      <h5>{{ item.place }}</h5>
      <p>{{ item.url }}</p>
    </div>
  </div>
</template>
<script>
import videoPlayer from '@/components/VideoPlayer/index.vue'
export default {
  components: {
    videoPlayer
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  margin: 15px 15px 0;
  width: 350px;
  .video_box {
    width: 350px;
  }
  .tit {
    padding: 10px;
    h5 {
      font-weight: normal;
      margin: 0 0 5px ;
      font-size: 14px;
      color: #5d5d5d;
    }
    p {
      font-size: 12px;
      color: #bababa;
    }
  }
}
</style>
