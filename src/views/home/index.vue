<template>
  <div class="warp">
    <search-bar>
      <search
        :states-list="statesList"
        :places-list="placesList"
        @handleRefresh="handleRefresh"
        @handleSearchDeviceList="handleSearchDeviceList"
        @handlerGetOnlineDevice="handlerGetOnlineDevice"
      />
    </search-bar>
    <div class="details_box">
      <div class="lf_box">
        <device-list
          v-if="tableShow"
          :device-list.sync="deviceList"
          :device-info-list="deviceInfoList"
          :class-id.sync="classId"
          :current-devices-status.sync="currentDevicesStatus"
          @handleGetDeviceDetails="handleGetDeviceDetails"
          @handleMemberShow="handleMemberShow"
          @handleLoadMore="handleLoadMore"
        />
        <div v-if="!rightShow" class="open_up_left" @click="rightShow = !rightShow">
          <i class="iconfont icon-hou" />
        </div>
      </div>
      <transition name="slide-fade">
        <div v-show="rightShow" class="rg_box" :class="{an_1: rightShow, an_2: !rightShow}">
          <device-details
            :current-devices-status="currentDevicesStatus"
            :device-details="deviceDetails"
          />
          <div v-if="rightShow" class="open_up_right" @click="rightShow = !rightShow">
            <i class="iconfont icon-hou" />
          </div>
        </div>
      </transition>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      class="el-dialog-box"
      title="设备参数复制与替换"
      :visible.sync="memberShow"
      destroy-on-close
    >
      <replaceFunction :device-data.sync="deviceData" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDeviceOperation">取 消</el-button>
        <el-button type="primary" @click="submitDeviceOperation">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDeviceTypeList,
  getDeviceList,
  getOnlineDevice,
  getDeviceDetails,
  putDeviceChange
} from '@/api/app.js'
import searchBar from '@/components/searchbar'
import search from './components/search'
import EventBus from '@/common/eventBus'
import deviceList from './components/table'
import deviceDetails from './components/deviceDetails'
import replaceFunction from './components/replaceFunction'
export default {
  components: {
    replaceFunction,
    deviceDetails,
    deviceList,
    searchBar,
    search
  },
  data() {
    return {
      tableShow: true,
      deviceArr: [],
      memberShow: false,
      rightShow: true,
      placesList: [],
      statesList: [],
      page: 1,
      device_search: {
        keyword: '',
        place: undefined,
        online_state: undefined
      },
      // 设备ID
      classId: null,
      // 当前设备状态
      currentDevicesStatus: 1,
      deviceList: [],
      deviceDetails: null,
      deviceInfoList: {},
      // 设备操作复制参数
      deviceData: {
        device_id: null,
        place_id: [],
        menu_ids: [],
        cmd: 11
      }
    }
  },
  created() {
    this.getTypelist()
    this.handleGetDeviceList()
    EventBus.$on('onHandleGetDeviceDetails', () => {
      this.handleGetDeviceDetails()
    })
  },
  methods: {
    async handlerGetOnlineDevice() {
      const msg = this.$message({
        customClass: 'load_message',
        iconClass: 'el-icon-loading',
        duration: 0,
        center: true,
        message: '搜索中...'
      })
      try {
        const res = await getOnlineDevice()
        this.$message({
          message: res.result.text,
          type: 'success'
        })
        msg.close()
      } catch (err) {
        msg.close()
        throw err
      }
    },
    // 获取类型
    async getTypelist() {
      try {
        const res = await getDeviceTypeList()
        this.placesList = res.places
        this.statesList = res.states
      } catch (err) {
        throw err
      }
    },
    // 获取设备列表
    async handleGetDeviceList() {
      try {
        const res = await getDeviceList({
          page: {
            page: this.page,
            size: 10
          },
          device_search: this.device_search,
          device_order: 5
        })
        this.tableShow = true
        if (res.device_info_list.device_property_list) {
          this.deviceList = [
            ...this.deviceList,
            ...res.device_info_list.device_property_list
          ]
          if (this.page === 1) {
            this.classId = this.deviceList[0].id
            this.currentDevicesStatus = this.deviceList[0].device_iot_state.device_state
            this.handleGetDeviceDetails()
          }
        }
        this.deviceInfoList = res.device_info_list
      } catch (err) {
        throw err
      }
    },
    // 获取设备详情
    async handleGetDeviceDetails() {
      this.deviceDetails = null
      if (!this.currentDevicesStatus) {
        try {
          const res = await getDeviceDetails({
            device: {
              id: this.classId
            }
          })
          if (res) {
            this.deviceDetails = res.device_control_info
          }
        } catch (err) {
          throw err
        }
      }
    },
    // 刷新
    handleRefresh() {
      this.tableShow = false
      this.page = 1
      this.deviceList = []
      this.handleGetDeviceList()
    },
    // 加载更多
    handleLoadMore() {
      if (this.page * 10 < this.deviceInfoList.total) {
        this.page++
        this.handleGetDeviceList()
      }
    },
    // 搜素设备
    handleSearchDeviceList(device_search) {
      this.tableShow = false
      this.device_search = device_search
      this.page = 1
      this.deviceList = []
      this.handleGetDeviceList()
    },
    // 参数复制
    async handleMemberShow(e) {
      this.memberShow = !this.memberShow
      this.deviceData.device_id = e.id
    },
    // 取消设备操作
    cancelDeviceOperation() {
      this.memberShow = false
    },
    // 提交设备复制 OR 替换
    async submitDeviceOperation() {
      const { device_id, place_id, menu_ids, cmd } = this.deviceData
      if (cmd === 11 && menu_ids.length === 0) {
        this.$message({
          message: '参数错误,无法提交',
          type: 'warning'
        })
        return false
      }
      if ((cmd === 11 && place_id.length === 0) || (cmd === 12 && !place_id)) {
        this.$message({
          message: '参数错误,无法提交',
          type: 'warning'
        })
        return false
      }
      try {
        const res = await putDeviceChange(
          {
            device_id,
            place_id,
            menu_ids
          },
          cmd
        )
        if (res) {
          this.$message({
            message: res.result.text,
            type: 'success'
          })
          this.memberShow = false
        }
      } catch (err) {
        throw err
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/dialogBase.scss";
.slide-fade-enter-active {
  transition: all 0.4s;
}
.slide-fade-leave-active {
  transition: all 0.4s;
}
.slide-fade-enter,
.slide-fade-leave-to {
  opacity: 0;
}
.warp {
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
}
.details_box {
  display: flex;
  height: 100%;
  .lf_box {
    position: relative;
    background: #fff;
    height: 100%;
    flex: 1;
    transition: all 0.4s;
  }
  .rg_box {
    position: relative;
    flex-shrink: 0;
    background: #e5e5e5;
    width: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-left: 1px solid #e5e5e5;
    .no_more {
      display: flex;
      align-items: center;
      flex-direction: column;
      line-height: 40px;
      font-size: 18px;
      color: #888;
    }
    &.an_1 {
      animation: widthSize 0.4s ease;
    }
    &.an_2 {
      animation: widthSizeL 0.4s ease;
    }
  }
  .open_up_right,
  .open_up_left {
    position: absolute;
    z-index: 2;
    right: 388px;
    top: 50%;
    margin-top: -40px;
    height: 80px;
    background: #d0d0d0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 12px;
    border-radius: 10px 0 0px 10px;
    transform: rotate(180deg);
    cursor: pointer;
    .iconfont {
      font-size: 12px;
      color: #656565;
    }
    &.open_up_left {
      transform: rotate(0deg);
      right: 0px;
    }
    &.open_up_right {
      animation: open_up_right_an 0.4s ease;
    }
  }
}
@keyframes widthSize {
  0% {
    width: 0px;
  }
  100% {
    width: 400px;
  }
}
@keyframes widthSizeL {
  0% {
    width: 400px;
  }
  100% {
    width: 0px;
  }
}
@keyframes open_up_right_an {
  0% {
    right: 0px;
  }
  100% {
    right: 388px;
  }
}
</style>
