<template>
  <div class="bulk_control_warpper">
    <div class="title">已选择中{{ deviceData.length }}个设备</div>
    <div class="panel_box">
      <div class="tit">
        <div class="lf">
          面板锁定
        </div>
      </div>
      <div class="content">
        <div class="name">
          <i class="iconfont icon-__zongkongmianban" />
        </div>
        <div class="green_circle" @click="handleChange(0, 2)">
          <i class="iconfont icon-jiesuo" />
        </div>
        <div class="red_circle" @click="handleChange(1, 2)">
          <i class="iconfont icon-suo" />
        </div>
      </div>
    </div>
    <div class="audio_box">
      <div class="tit">
        <div class="lf">
          音频控制
        </div>
        <div class="rg">
          <i class="iconfont icon-guangbo green cursor" @click="handleChange(0, 33554432)" />
          <i class="iconfont icon-jingyin gray cursor" @click="handleChange(1, 33554432)" />
        </div>
      </div>
      <div class="content">
        <div class="item">
          <div class="lf">
            <i class="iconfont icon-maikefenghuatongyuyin" />
          </div>
          <div class="mid">
            <el-slider
              v-model="microphone_volume"
              @change="handleChange($event, 8)"
            />
          </div>
          <div class="rg">{{ microphone_volume }}</div>
        </div>
        <div class="item">
          <div class="lf">
            <i class="iconfont icon-mn_shengyin" />
          </div>
          <div class="mid">
            <el-slider
              v-model="speaker_volume"
              @change="handleChange($event, 32)"
            />
          </div>
          <div class="rg">{{ speaker_volume }}</div>
        </div>
      </div>
    </div>
    <div class="lists">
      <div v-for="(item, index) in controlList" :key="index" class="item">
        <div class="name">
          {{ item.name }}
        </div>
        <div
          class="green_circle"
          @click="handleChange(1, 2048, item.type, item.id)"
        >
          NO
        </div>
        <div
          class="red_circle"
          @click="handleChange(0, 2048, item.type, item.id)"
        >
          OFF
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getDeviceManageType, putDeviceAllControl } from '@/api/app.js'
export default {
  props: {
    deviceData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      microphone_volume: 50,
      speaker_volume: 50,
      controlList: []
    }
  },
  mounted() {
    this.handleGetDeviceManageType()
  },
  methods: {
    async handleChange(e, cmd, type, id) {
      const msg = this.$message({
        customClass: 'load_message',
        iconClass: 'el-icon-loading',
        duration: 0,
        center: true,
        message: '加载中...'
      })
      try {
        const res = await putDeviceAllControl({
          device_ids: this.deviceData.map(item => item.id),
          batch_control_item: {
            id: id || 0,
            type: type || 0,
            value: e,
            command: cmd
          }
        })
        msg.close()
        this.$message({
          message: res.result.text,
          type: 'success'
        })
      } catch (err) {
        msg.close()
        throw err
      }
    },
    async handleGetDeviceManageType() {
      try {
        const res = await getDeviceManageType()
        this.controlList = res.batch_control_item_list
      } catch (err) {
        throw err
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/dialogBase.scss";
.bulk_control_warpper {
  background: #fff;
  overflow-x: hidden;
  width: 400px;
  margin-left: 50px;
  .title {
    padding: 15px 20px;
    font-size: 16px;
    color: #ffa200;
  }
  .tit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    .lf {
      font-size: 14px;
      color: #333;
    }
    .rg {
      width: 30%;
      display: flex;
      justify-content: space-between;
      .iconfont {
        font-size: 16px;
      }
    }
  }
  .green_circle,
  .red_circle {
    cursor: pointer;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    color: #fff;
    font-size: 12px;
    &.green_circle {
      background: #45b54c;
    }
    &.red_circle {
      background: #ff3b30;
    }
    &:hover {
      opacity: .8;
    }
    .iconfont {
      font-size: 14px;
    }
  }
  .panel_box {
    .content {
      display: flex;
      padding: 15px 20px;
      border-bottom: 1px solid #e5e5e5;
      justify-content: space-between;
      .name {
        width: 50%;
        .iconfont {
          font-size: 30px;
          color: #45b54c;
        }
      }
    }
  }
  .audio_box {
    padding: 15px 0;
    border-bottom: 1px solid #e5e5e5;
    .content {
      padding: 0 20px;
      .item {
        margin-top: 15px;
        display: flex;
        align-items: center;
        .lf {
          .iconfont {
            font-size: 16px;
          }
        }
        .mid {
          flex: 1;
          margin: 0 10px;
        }
        .rg {
          font-size: 14px;
          color: #666666;
        }
      }
    }
  }
  .lists {
    .item {
      padding: 15px 20px;
      // border-bottom: 1px solid #e5e5e5;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .name {
        width: 50%;
        font-size: 14px;
        color: #333;
      }
    }
  }
}
</style>
