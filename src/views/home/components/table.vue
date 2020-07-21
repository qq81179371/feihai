<template>
  <div class="main">
    <div class="lists_title">
      <div class="block status_1">
        在线:{{ deviceInfoList.online_number }}/{{ deviceInfoList.total }}
      </div>
      <div class="block status_2">开机:{{ deviceInfoList.on_number }}</div>
      <div class="block status_3">关机:{{ deviceInfoList.off_number }}</div>
      <div class="block status_4">禁用:{{ deviceInfoList.lock_number }}</div>
      <el-button
        type="text"
        class="edit"
        :disabled="!menus.find(e => e.id === 1).enable"
        @click.stop="handleEdit"
      >{{ isedit ? "取消" : "编辑" }}</el-button>
    </div>
    <div class="table_box">
      <el-table
        ref="multipleTable"
        v-el-table-infinite-scroll="handleLoadMore"
        highlight-current-row
        header-row-class-name="header_bg"
        :data="deviceList"
        tooltip-effect="dark"
        style="width: 100%"
        @row-click="changeClassId"
        @selection-change="handleSelectChange"
      >
        <el-table-column
          :class-name="`selection_item ${isedit ? 'isedit' : ''}`"
          :class="{ isedit: isedit }"
          type="selection"
          width="30"
        />
        <el-table-column width="140">
          <template slot="header">
            <div class="table_title">
              设备
              <i class="iconfont icon-shebeiguanli1" />
            </div>
          </template>
          <template slot-scope="scope">{{ scope.row.place }}</template>
        </el-table-column>
        <el-table-column width="200">
          <template slot="header">
            <div class="table_title">
              基本信息
              <i class="iconfont icon-ziyuanxhdpi" />
            </div>
          </template>
          <template slot-scope="scope">
            <div class="scope_content">
              <p>IP: {{ scope.row.ip }}</p>
              <p>SN: {{ scope.row.sn }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="140">
          <template slot="header">
            <div class="table_title">
              设备状态
              <i class="iconfont icon-ziyuanxhdpi" />
            </div>
          </template>
          <template slot-scope="scope">
            <div class="device_status">
              <span
                v-if="scope.row.device_iot_state.device_state === 0"
                style="color:#45b54c"
              >
                <i class="iconfont icon-zhengque1" />
                在线
              </span>
              <span v-else>
                <i class="iconfont icon-cuowu1" />
                离线
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="地址">
          <template slot="header">
            <div class="table_title">
              物联状态
              <i class="iconfont icon-shebeiguanli" />
            </div>
          </template>
          <template slot-scope="scope">
            <div
              v-if="scope.row.device_iot_state.device_state === 0"
              class="icon_list"
            >
              <div
                v-for="(item, index) in scope.row.device_iot_state.iot_state"
                :key="index"
                class="item"
              >
                <i
                  class="iconfont"
                  :class="`${iconfont[item.type]} ${deviceStatus[item.state]}`"
                />
                <span>{{ item.name }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="100" align="center" label="地址">
          <template slot="header">
            <div class="table_title operate">
              操作
              <i class="iconfont icon-shezhi" />
            </div>
          </template>
          <template slot-scope="scope">
            <div class="operate_content">
              <el-tooltip content="中控设置" placement="top">
                <el-button
                  type="text"
                  :disabled="!menus.find(e => e.id === 1).enable"
                  @click="goSetting(scope.row)"
                >
                  <i
                    class="iconfont icon-shezhi"
                    :class="
                      `${
                        scope.row.device_iot_state.device_state === 0
                          ? deviceStatus[3]
                          : deviceStatus[2]
                      }`
                    "
                  />
                </el-button>
              </el-tooltip>
              <el-tooltip content="参数复制" placement="top">
                <el-button
                  type="text"
                  :disabled="!menus.find(e => e.id === 1).enable"
                  @click="toggleMenu(scope.row)"
                >
                  <i
                    class="iconfont icon-tihuantupian"
                    :class="deviceStatus[3]"
                  />
                </el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <transition name="slide-fade">
      <select-action-bar
        v-if="isedit"
        :checked.sync="allChcek"
        :indeterminate.sync="indeterminate"
        :select-num="selectNum"
        @selected="toggleSelection"
        @cancel="cancelSelect"
      >
        <el-tooltip content="控制" class="icon" placement="top">
          <i class="iconfont icon-piliangkongzhi" @click="goBatchSetControl" />
        </el-tooltip>
        <el-tooltip content="设置" class="icon" placement="top">
          <i class="iconfont icon-shezhi" @click="goBatchSet" />
        </el-tooltip>
        <el-tooltip content="删除" class="icon" placement="top">
          <i class="iconfont icon-shanchu red" @click="handleBatchDelete" />
        </el-tooltip>
      </select-action-bar>
    </transition>
    <el-dialog
      :close-on-click-modal="false"
      class="el-dialog-box"
      title="批量控制"
      :visible.sync="controlShow"
      destroy-on-close
    >
      <BulkControl :device-data.sync="batchList" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="controlShow = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  deleteDeviceList
} from '@/api/app.js'
import SelectActionBar from '@/components/SelectActionBar'
import BulkControl from './../components/bulkControl'
import elTableInfiniteScroll from 'el-table-infinite-scroll'
import { mapGetters } from 'vuex'
export default {
  directives: {
    'el-table-infinite-scroll': elTableInfiniteScroll
  },
  components: {
    SelectActionBar,
    BulkControl
  },
  props: {
    deviceInfoList: {
      type: Object,
      default: () => {}
    },
    classId: {
      type: Number,
      default: null
    },
    currentDevicesStatus: {
      type: Number,
      default: null
    },
    deviceList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      controlShow: false,
      indeterminate: false,
      allChcek: false,
      selectNum: 0,
      bottomOut: false,
      deviceStatus: {
        0: 'red',
        1: 'green',
        2: 'gray',
        3: 'blue'
      },
      isedit: false,
      iconfont: {
        0: 'icon-weibiaoti--',
        1: 'icon-deng-',
        2: 'icon-kongtiao',
        3: 'icon-shumatubiaozhizuochunsezhuanqu-',
        4: 'icon-fengshan',
        5: 'icon-mubu',
        6: 'icon-diannao1',
        7: 'icon-menjin',
        8: 'icon-chuanglian',
        9: 'icon-diannao',
        11: 'icon-qitashebei'
      },
      page: 1,
      batchList: []
    }
  },
  computed: {
    ...mapGetters(['menus'])
  },
  methods: {
    // 列表选中
    changeClassId(e) {
      this.$emit('update:classId', e.id)
      this.$emit(
        'update:currentDevicesStatus',
        e.device_iot_state.device_state
      )
      this.$emit('handleGetDeviceDetails')
    },
    // 多选钩子
    handleSelectChange(e) {
      this.selectNum = e.length
      if (this.deviceList.length === e.length) {
        this.allChcek = true
        this.indeterminate = false
      }
      if (e.length < this.deviceList.length && e.length > 0) {
        this.indeterminate = true
        this.allChcek = false
      }
      if (e.length === 0) {
        this.indeterminate = false
        this.allChcek = false
      }
      this.batchList = e
    },
    // 处理编辑
    handleEdit() {
      this.isedit = !this.isedit
      if (!this.isedit) {
        this.$refs.multipleTable.clearSelection()
        this.batchList = []
      }
    },
    // 取消选择
    cancelSelect() {
      this.$refs.multipleTable.clearSelection()
      this.isedit = false
      this.batchList = []
    },
    //  全选切换
    toggleSelection() {
      this.$refs.multipleTable.toggleAllSelection()
    },
    // 加载更多
    handleLoadMore() {
      this.$emit('handleLoadMore')
    },
    // 去设置
    goSetting(params) {
      this.$router.push({
        name: 'allSetting',
        query: {
          params: JSON.stringify(params),
          editType: 1
        }
      })
    },
    // 去批量设置
    goBatchSet() {
      if (this.batchList.length > 0) {
        this.$router.push({
          name: 'allSetting',
          query: {
            params: JSON.stringify(this.batchList),
            editType: 0
          }
        })
      } else {
        this.$message({
          message: '未选择设备',
          type: 'warning'
        })
      }
    },
    goBatchSetControl() {
      if (this.batchList.length > 0) {
        this.controlShow = true
      } else {
        this.$message({
          message: '未选择设备',
          type: 'warning'
        })
      }
    },
    // 打开复制替换
    toggleMenu(e) {
      this.$emit('handleMemberShow', e)
    },
    // 批量删除
    async handleBatchDelete() {
      if (this.batchList.length > 0) {
        try {
          await this.$confirm('此操作将永久删除设备, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          const res = await deleteDeviceList({
            device: {
              id: this.batchList.map(e => e.id)
            }
          })
          if (res) {
            this.isedit = false
            const tableList = this.deviceList.filter(
              i => this.batchList.map(e => e.id).indexOf(i.id) === -1
            )
            this.$emit('update:deviceList', tableList)
            this.batchList = []
            this.$message({
              type: 'success',
              message: res.result.text
            })
          }
        } catch {
          return false
        }
      } else {
        this.$message({
          message: '未选择设备',
          type: 'warning'
        })
      }
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
  transform: translateY(50px);
  opacity: 0;
}
.main {
  width: 100%;
}
.lists_title {
  display: flex;
  align-items: center;
  height: 50px;
  box-sizing: border-box;
  border-bottom: 1px solid #dddddd;
  padding-right: 20px;
  justify-content: flex-end;
  .block {
    font-size: 14px;
    height: 26px;
    line-height: 26px;
    padding: 0 10px;
    border-radius: 4px;
    margin-right: 15px;
  }
  .status_ {
    &1 {
      color: #72b4ff;
      background: rgba(236, 245, 255, 1);
      border: 1px solid rgba(216, 233, 253, 1);
    }
    &2 {
      color: #45b54c;
      background: rgba(238, 254, 243, 1);
      border: 1px solid rgba(181, 233, 184, 1);
    }
    &3 {
      color: #ff564c;
      background: rgba(254, 240, 240, 1);
      border: 1px solid rgba(255, 210, 207, 1);
    }
    &4 {
      color: #e9aa49;
      background: rgba(252, 246, 235, 1);
      border: 1px solid rgba(253, 230, 194, 1);
    }
  }
  .edit {
    // cursor: pointer;
    font-size: 12px;
    color: #333;
  }
}
.table_box {
  width: 100%;
  >>> .el-table-column--selection .cell {
    padding: 0 0 0 10px;
  }
  /deep/ .el-table__body-wrapper {
    height: calc(100vh - 210px) !important;
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
  /deep/ .header_bg {
    background: #ededed;
    /deep/ th {
      background: #ededed;
    }
  }
  /deep/ .el-table__empty-block {
    width: auto !important;
  }
  /deep/ .el-table__header {
    width: auto !important;
  }
  /deep/ .el-table__body {
    width: auto !important;
  }
  >>> .selection_item {
    /deep/ .cell {
      transition: all 0.4s;
      opacity: 0;
    }
    &.isedit {
      /deep/ .cell {
        opacity: 1;
        transition: all 0.4s;
      }
    }
  }
  .table_title {
    background: #ededed;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    color: 333;
    .iconfont {
      font-size: 12px;
      color: #333;
      margin-left: 5px;
    }
    &.operate {
      justify-content: center;
    }
  }
  .scope_content {
    p {
      margin: 0;
      padding: 0;
    }
  }
  .operate_content {
    display: flex;
    align-items: center;
    justify-content: space-around;
    .iconfont {
      // cursor: pointer;
      font-size: 18px;
      color: #333;
      margin: 0 5px;
      &.green {
        color: #45b54c;
      }
      &.red {
        // pointer-events: none;
        color: #ff3b30;
      }
      &.gray {
        pointer-events: none;
        color: #666666;
      }
      &.blue {
        color: #37acfe;
      }
    }
  }
  .device_status {
    display: flex;
    align-items: center;
    span {
      display: flex;
      align-items: center;
      margin-right: 10px;
      white-space: nowrap;
      .iconfont {
        &.icon-zhengque1 {
          color: #45b54c;
        }
        &.icon-cuowu1 {
          color: #666;
        }
        margin-right: 5px;
        font-size: 15px;
      }
    }
  }
  .icon_list {
    display: flex;
    flex-wrap: wrap;
    .item {
      display: flex;
      align-items: center;
      margin: 2px 10px 2px 0;
      .iconfont {
        font-size: 15px;
        margin-right: 2px;
        &.green {
          color: #45b54c;
        }
        &.red {
          color: #ff3b30;
        }
        &.gray {
          color: #666666;
        }
      }
      span {
        font-size: 14px;
        color: #333;
      }
    }
  }
}
:export {
  tableHeight: calc(100vh-200px);
}
</style>
