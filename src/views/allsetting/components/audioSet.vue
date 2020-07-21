<template>
  <div class="dashboard-container scroll">
    <div class="header_title">
      <h4>音频设置</h4>
      <el-button
        type="primary"
        size="small"
        @click="submitForm"
      >保存</el-button>
    </div>
    <div class="box_shadow margin_bottom">
      <div class="form_header">
        <i class="iconfont icon-yinpin green" />
        <span>音频</span>
      </div>
      <el-form
        ref="networkForm"
        :model="audio"
        label-width="80px"
        size="small"
        label-position="left"
      >
        <el-form-item
          label="增益"
          prop="ip"
        ><el-select v-model.number="audio.gain" placeholder="请选择活动区域">
          <el-option label="0bB" :value="3" />
          <el-option label="1.75dB" :value="2" />
          <el-option label="7.5dB" :value="1" />
          <el-option label="11.25dB" :value="0" />
        </el-select>
        </el-form-item>
        <el-form-item label="音量" prop="gateway">
          <div class="slider_box">
            <i class="iconfont icon-guangbo green" />
            <el-slider
              v-model="audio.volume"
              class="green slider"
              :step="2"
            />
            <span>{{ audio.volume }}</span>
          </div>
        </el-form-item>
        <el-form-item label="低音" prop="gateway">
          <div class="slider_box">
            <i class="iconfont icon-gaopin blue" />
            <el-slider
              v-model="audio.bass"
              class="slider blue"
              :show-tooltip="false"
              :step="2"
              :min="-14"
              :max="14"
            />
            <span />
          </div>
        </el-form-item>
        <el-form-item label="高音" prop="gateway">
          <div class="slider_box">
            <i class="iconfont icon-gaopin navy" />
            <el-slider
              v-model="audio.treble"
              class="slider navy"
              :show-tooltip="false"
              :step="2"
              :min="-14"
              :max="14"
            />
            <span />
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="box_shadow margin_bottom">
      <div class="form_header">
        <i class="iconfont icon-maikefeng orange" />
        <span>麦克风</span>
      </div>
      <el-form
        ref="networkForm"
        :model="microphone"
        label-width="80px"
        size="small"
        label-position="left"
      >
        <el-form-item
          label="增益"
          prop="ip"
        ><el-select
          v-model.number="microphone.gain"
          placeholder="请选择活动区域"
        >
          <el-option label="0bB" :value="3" />
          <el-option label="1.75dB" :value="2" />
          <el-option label="7.5dB" :value="1" />
          <el-option label="11.25dB" :value="0" />
        </el-select>
        </el-form-item>
        <el-form-item label="音量" prop="gateway">
          <div class="slider_box">
            <i class="iconfont icon-guangbo green" />
            <el-slider
              v-model="microphone.volume"
              :step="2"
              class="green slider"
            />
            <span>{{ microphone.volume }}</span>
          </div>
        </el-form-item>
        <el-form-item label="低音" prop="gateway">
          <div class="slider_box">
            <i class="iconfont icon-gaopin blue" />
            <el-slider
              v-model="microphone.bass"
              class="slider blue"
              :show-tooltip="false"
              :step="2"
              :min="-14"
              :max="14"
            />
            <span />
          </div>
        </el-form-item>
        <el-form-item label="高音" prop="gateway">
          <div class="slider_box">
            <i class="iconfont icon-gaopin navy" />
            <el-slider
              v-model="microphone.treble"
              class="slider navy"
              :show-tooltip="false"
              :step="2"
              :min="-14"
              :max="14"
            />
            <span />
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="box_shadow">
      <div class="form_header">
        <i class="iconfont icon-iconset0272 orange" />
        <span>广播</span>
      </div>
      <el-form
        ref="networkForm"
        :model="broadcast"
        label-width="80px"
        size="small"
        label-position="left"
      >
        <el-form-item label="音量" prop="gateway">
          <div class="slider_box">
            <i class="iconfont icon-guangbo green" />
            <el-slider
              v-model="broadcast.volume"
              class="green slider"
              :step="2"
            />
            <span>{{ broadcast.volume }}</span>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { getAudioSetParams, postAudioSetParams } from '@/api/app'
export default {
  props: {
    deviceId: {
      type: Number || Array,
      default: null
    }
  },
  data() {
    return {
      audio: {
        volume: 0,
        channel: 3,
        gain: 0,
        bass: 0,
        treble: 0
      },
      microphone: {
        volume: 0,
        channel: 2,
        gain: 0,
        bass: 0,
        treble: 0
      },
      broadcast: {
        volume: 0,
        channel: 1
      }
    }
  },
  mounted() {
    this.handleGetAudioSetParams()
  },
  methods: {
    async handleGetAudioSetParams() {
      try {
        const res = await getAudioSetParams({
          device_id: typeof this.deviceId === 'number' ? this.deviceId : null,
          device_ids: typeof this.deviceId === 'object' ? this.deviceId : null
        })
        this.audio = { ...res.device_audio.find(item => item.channel === 3) }
        this.microphone = { ...res.device_audio.find(item => item.channel === 2) }
        this.broadcast = { ...res.device_audio.find(item => item.channel === 1) }
      } catch (err) {
        throw (err)
      }
    },
    async  submitForm() {
      const msg = this.$message({
        customClass: 'load_message',
        iconClass: 'el-icon-loading',
        duration: 0,
        center: true,
        message: '加载中...'
      })
      try {
        const res = await postAudioSetParams({
          device_id: typeof this.deviceId === 'number' ? this.deviceId : null,
          device_ids: typeof this.deviceId === 'object' ? this.deviceId : null,
          device_audio: [this.audio, this.microphone, this.broadcast]
        })
        msg.close()
        this.$message({
          type: 'success',
          message: res.result.text
        })
      } catch (err) {
        msg.close()
        throw (err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/baseTitle.scss";
@import "~@/styles/settings.scss";
.dashboard-container {
  height: calc(100vh - 90px);
  padding-bottom: 30px;
  overflow-y: scroll;
}
.form_header {
  margin-bottom: 30px;
  span {
    margin-left: 10px;
    color: #282828;
    font-size: 16px;
    font-weight: bold;
  }
}
.margin_bottom {
  margin-bottom: 30px;
}
.slider_box {
  max-width: 350px;
  display: flex;
  align-items: center;
  i,
  span {
    width: 30px;
    display: flex;
  }
  .slider {
    flex: 1;
    margin: 0 15px;
    &.blue {
      /deep/ .el-slider__bar {
        background: #37acfe;
      }
    }

    &.navy {
      /deep/ .el-slider__bar {
        background: #5087ec;
      }
    }

    &.green {
      /deep/ .el-slider__bar {
        background: #45b54c;
      }
    }
  }
}
</style>
