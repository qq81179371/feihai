<template>
  <div class="main">
    <el-tabs v-model="activeName" class="tabs">
      <el-tab-pane label="物联" name="first">
        <div class="box">
          <transition name="slide-fade">
            <things v-if="deviceDetails" :device-details-props.sync="deviceDetails" />
          </transition>
        </div>
      </el-tab-pane>
      <el-tab-pane label="控制" name="second">
        <div class="box">
          <transition name="slide-fade">
            <control v-if="deviceDetails" :device-details-props.sync="deviceDetails" />
          </transition>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div v-if="!deviceDetails && currentDevicesStatus" class="no_more">
      <img :src="deviceoff" alt>
      设备离线
    </div>
  </div>
</template>

<script>
import control from './control.vue'
import things from './things.vue'
import deviceoff from '@/assets/home/device-off.png'
export default {
  components: {
    control,
    things
  },
  props: {
    deviceDetails: {
      type: Object,
      default: () => {}
    },
    currentDevicesStatus: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      deviceoff,
      activeName: 'first'
    }
  }
}
</script>

<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(100px);
  opacity: 0;
}
.main {
  width: 100%;
  height: 100%;
  background: #f2f2f2;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(69, 181, 76, 1);
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }
}
.tabs {
  // height: 100%;
  /deep/ .el-tabs__header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: #fff;
    height: 50px;
    padding-left: 20px;
    z-index: 2;
  }
  /deep/ .el-tabs__nav-wrap {
    &::after {
      display: none;
    }
  }
  /deep/ .el-tabs__item {
    font-size: 16px;
    color: #ccc;
  }
  /deep/ .is-active {
    color: #282828;
  }
  /deep/ .el-tabs__active-bar {
    background: #282828;
  }
  /deep/ .el-tabs__content {
    height: 100%;
    .el-tab-pane {
      height: 100%;
    }
  }
  .box {
    padding-top: 50px;
    background: #f2f2f2;
    border-radius: 4px 4px 4px 4px;
    // margin: 0 15px;
    padding-bottom: 50px;
    min-height: 100%;
    // overflow-y: scroll;
    // &::-webkit-scrollbar {
    //   width: 4px;
    // }
    // &::-webkit-scrollbar-thumb {
    //   border-radius: 10px;
    //   box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    //   background: rgba(69, 181, 76, 1);
    // }
    // &::-webkit-scrollbar-track {
    //   box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    //   border-radius: 0;
    //   background: rgba(0, 0, 0, 0.1);
    // }
  }
}
.no_more {
  height: 80%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  line-height: 40px;
  font-size: 18px;
  color: #888;
}
</style>
