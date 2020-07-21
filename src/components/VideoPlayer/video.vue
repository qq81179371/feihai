<template>
  <div>
    <video-player
      ref="videoPlayerBox"
      class="video-player vjs-custom-skin"
      :allowfullscreen="true"
      :playsinline="true"
      :options="playerOptions"
      @play="onPlayerPlay($event)"
    />
  </div>
</template>

<script>
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'videojs-flash/dist/videojs-flash'
export default {
  components: {
    videoPlayer
  },
  props: {
    source: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      playerOptions: {
        sources: [{
          // type: 'rtmp/flv',
          src: 'rtmp://live.hkstv.hk.lxdns.com/live/hks1'
        }],
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: true, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: false, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        techOrder: ['flash', 'html5'],
        sourceOrder: true,
        flash: {
          hls: { withCredentials: false }
          // swf: '../../../../static/media/video-js.swf'
        },
        html5: { hls: { withCredentials: false }},
        // poster: '../../../../static/aa.jpg', // 你的封面地址
        width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true // 全屏按钮
        }
      }
    }
  },
  computed: {
    player() {
      return this.$refs.videoPlayerBox.player
    }
  },
  // watch: {
  //   source: {
  //     handler(newVal) {
  //       this.playerOptions.sources = newVal
  //     },
  //     immediate: true
  //   }
  // },
  created() {},
  mounted() {},
  beforeDestroy() {
    this.$refs.videoPlayerBox.dispose()
  },
  methods: {
    // playerOptions() {
    //   return {
    //     playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
    //     autoplay: true, // 如果true,浏览器准备好时开始回放。
    //     muted: false, // 默认情况下将会消除任何音频。
    //     loop: false, // 导致视频一结束就重新开始。
    //     preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
    //     language: 'zh-CN',
    //     aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
    //     fluid: false, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
    //     techOrder: ['flash', 'html5'],
    //     sourceOrder: true,
    //     flash: {
    //       hls: { withCredentials: false },
    //       swf: '../../../../static/media/video-js.swf'
    //     },
    //     html5: { hls: { withCredentials: false }},
    //     sources: [{
    //       type: 'mp4',
    //       src: `http://vfx.mtime.cn/Video/2019/02/04/mp4/190204084208765161.mp4`
    //     }],
    //     poster: '../../../../static/aa.jpg', // 你的封面地址
    //     width: document.documentElement.clientWidth,
    //     notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
    //     controlBar: {
    //       timeDivider: true,
    //       durationDisplay: true,
    //       remainingTimeDisplay: false,
    //       fullscreenToggle: true // 全屏按钮
    //     }
    //   }
    // }
    onPlayerPlay(e) {
      console.log(e)
    }
  }
}
</script>

<style scoped>
.video-player {
  width: 300px;
  min-height: 500px;
}
</style>
