<template>
  <div v-if="deviceDetails" class="warp">
    <div class="device_state">
      <div class="icon_box">
        <div class="icon">
          <img src="./../../../assets/appIcon/mb.png" alt>
        </div>
        <span>面板锁定</span>
      </div>
      <div class="state_icon">
        <div class="icon cursor" @click="handlePutDeviceControl(deviceDetails.device_state, 2)">
          <img v-if="deviceDetails.device_state === 0" src="./../../../assets/appIcon/kgl.png" alt>
          <img v-else src="./../../../assets/appIcon/kgh.png" alt>
        </div>
      </div>
    </div>
    <div class="signal_source">
      <div class="item">
        <div class="lf">
          <div class="icon">
            <img src="./../../../assets/appIcon/xinhaoyuan.png" alt>
          </div>
          <span>主信号源</span>
        </div>
        <div class="rg_list">
          <div class="mode">
            <div
              v-for="item in deviceInput"
              :key="item.index"
              class="m_item"
              :class="{active: deviceDetails.device_input_source === item.index}"
              :disabled="true"
              @click="handlePutDeviceControl(item, 32768)"
            >
              <div class="icon">
                <img
                  v-if="deviceDetails.device_input_source === item.index"
                  src="./../../../assets/appIcon/quere.png"
                  alt
                >
              </div>
              <span>{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="lf">
          <div class="icon">
            <img src="./../../../assets/appIcon/xinghaoyuen2.png" alt>
          </div>
          <span>辅信号源</span>
        </div>
        <div class="rg_list">
          <div class="mode">
            <div
              v-for="item in deviceInput"
              :key="item.index"
              class="m_item"
              :class="{active: deviceDetails.live_input_source === item.index}"
              @click="handlePutDeviceControl(item, 524288)"
            >
              <div class="icon">
                <img
                  v-if="deviceDetails.live_input_source === item.index"
                  src="./../../../assets/appIcon/quere.png"
                  alt
                >
              </div>
              <span>{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="audio_">
      <div class="tit">
        <span>音频控制</span>
        <div class="icon cursor">
          <img v-if="!deviceDetails.device_mute" src="./../../../assets/appIcon/labaa.png" alt @click="deviceMute(1)">
          <i v-else class="iconfont icon-jingyin gray" @click="deviceMute(0)" />
        </div>
      </div>
      <div class="a_list">
        <div class="item">
          <div class="icon">
            <img mode="aspectFit" src="./../../../assets/appIcon/maikefeng.png" alt>
          </div>
          <div class="slider">
            <el-slider
              v-model="deviceDetails.microphone_volume"
              :min="0"
              :step="2"
              :max="100"
              @change="sliderChange($event, 8)"
            />
          </div>
          <span>{{ deviceDetails.microphone_volume }}</span>
        </div>
        <div class="item">
          <div class="icon">
            <img mode="aspectFit" src="./../../../assets/appIcon/laba.png" alt>
          </div>
          <div class="slider">
            <el-slider
              v-model="deviceDetails.speaker_volume"
              :min="0"
              :step="2"
              :max="100"
              @change="sliderChange($event, 32)"
            />
          </div>
          <span>{{ deviceDetails.speaker_volume }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { classMaster } from '@/minix/classMaster.js'
export default {
  mixins: [classMaster],
  data() {
    return {
      deviceInput: [
        {
          index: 3,
          name: '电脑'
        },
        {
          index: 0,
          name: 'HDMI1'
        },
        {
          index: 1,
          name: 'HDMI2'
        },
        {
          index: 2,
          name: '广播'
        }
      ]
    }
  },
  methods: {
    sliderChange(e, cmd) {
      this.handlePutDeviceControl(e, cmd)
    },
    deviceMute(e) {
      this.handlePutDeviceControl(e, 33554432)
    }
  }
}
</script>

<style lang="scss" scoped>
.icon {
  img {
    max-width: 100%;
    max-height: 100%;
  }
}
.warp {
  background: #f2f2f2;
  min-height: 100%;
  padding: 15px 10px;
  .device_state {
    width: 175px;
    height: 80px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 4px 0px rgba(230, 230, 230, 0.24);
    border-radius: 15px;
    margin-bottom: 10px;
    display: flex;
    padding: 15px;
    align-items: center;
    .icon_box {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 30px;
      .icon {
        width: 30px;
        height: 30px;
      }
      span {
        font-size: 14px;
        color: #555;
        white-space: nowrap;
        margin: 7px 0 0;
      }
    }
    .state_icon {
      .icon {
        width: 37px;
        height: 37px;
        &:hover {
          opacity: .8;
        }
      }
    }
  }
  .signal_source {
    .item {
      width: 370px;
      padding: 12px 20px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      background: #fff;
      border-radius: 15px;
      .lf {
        display: flex;
        flex-direction: column;
        .icon {
          width: 30px;
          height: 30px;
        }
        span {
          margin-top: 10px;
          font-size: 14px;
          color: #555;
        }
      }
      .rg_list {
        .mode {
          margin-left: 40px;
          width: 200px;
          display: flex;
          flex-wrap: wrap;
          .m_item {
            cursor: pointer;
            display: flex;
            align-items: center;
            width: 50%;
            margin: 7px 0;
            .icon {
              width: 16px;
              border: 1px solid #999;
              height: 16px;
              margin-right: 10px;
              border-radius: 50%;
            }
            span {
              font-size: 14px;
              color: #999;
            }
            &.active {
              .icon {
                border: none;
              }
            }
          }
        }
      }
    }
  }
  .audio_ {
    border-radius: 15px;
    margin: 15px 0 0 0;
    max-width: 370px;
    padding: 10px 40px 10px 12.5px;
    background: #fff;
    .tit {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        font-size: 14px;
        color: #555;
      }
      .icon {
        width: 22px;
        height: 22px;
      }
    }
    .a_list {
      .item {
        margin: 15px 0;
        display: flex;
        align-items: center;
        .icon {
          width: 30px;
          height: 30px;
        }
        .slider {
          margin: 0 25px;
          width: 220px;
        }
      }
    }
  }
}
.disable {
  pointer-events: none;
}
</style>
