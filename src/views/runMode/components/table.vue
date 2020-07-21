<template>
  <div class="main">
    <div class="title">
      <div class="title_box">
        <el-dropdown trigger="click" placement="bottom">
          <span class="el-dropdown-link">
            任务-全部 (25)
            <i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="edit_btn" @click.stop="isedit = !isedit">编辑</div>
    </div>
    <div class="table_box" @contextmenu.prevent>
      <el-table
        v-el-table-infinite-scroll="handleLoadMore"
        highlight-current-row
        :data="taskList"
        @row-contextmenu="rightClickMenu"
        @row-click="handleRowTaskId"
        @selection-change="handleSelectChange"
      >
        <el-table-column
          :class-name="`selection_item ${isedit? 'isedit' : ''}`"
          :class="{isedit: isedit}"
          type="selection"
          width="30"
        />
        <el-table-column prop="name" label="名称" show-overflow-tooltip />
        <el-table-column label="类型" prop="type" width="160px">
          <template slot-scope="scope">
            <div class="operate_content">
              <i
                class="iconfont"
                :class="`${taskTypeIcon[scope.row.type].icon} ${taskTypeIcon[scope.row.type].color}`"
              />
              {{ taskTypeList.find(e => e.id === scope.row.type).name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态" width="160px">
          <template slot-scope="scope">
            <div class="operate_content">
              <i
                class="iconfont"
                :class="`${taskStatusIcon[scope.row.state].icon} ${taskStatusIcon[scope.row.state].color}`"
              />
              {{ taskStatusIcon[scope.row.state].name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="160px" />
        <el-table-column prop="address" label="操作" width="125px">
          <template slot-scope="scope">
            <el-tooltip content="播放" placement="top">
              {{ scope.row.a }}
              <i class="iconfont margin_5 icon-bofang1 blue cursor" />
            </el-tooltip>
            <el-tooltip content="停止" placement="top">
              <i class="iconfont margin_5 icon-tingzhi red cursor" />
            </el-tooltip>
            <el-tooltip content="属性" placement="top">
              <i class="iconfont margin_5 icon-shuxingliebiaoxiangqing blue cursor" />
            </el-tooltip>
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
      />
    </transition>
    <!-- <el-button @click="toggleSelection()">取消选择</el-button> -->
  </div>
</template>

<script>
import SelectActionBar from '@/components/SelectActionBar'
import elTableInfiniteScroll from 'el-table-infinite-scroll'
import { getDeviceList, getMultimediaConfig } from '@/api/app.js'
export default {
  directives: {
    'el-table-infinite-scroll': elTableInfiniteScroll
  },
  components: {
    SelectActionBar
  },
  data() {
    return {
      indeterminate: false,
      selectNum: 0,
      allChcek: false,
      deviceStatus: {
        0: 'red',
        1: 'green',
        2: 'gray'
      },
      isedit: false,
      iconfont: {
        0: 'icon-weibiaoti--',
        1: 'icon-deng-',
        2: 'icon-kongtiao',
        3: 'icon-shumatubiaozhizuochunsezhuanqu-',
        4: 'icon-fengshan',
        6: 'icon-diannao1',
        7: 'icon-menjin',
        8: 'icon-chuanglian',
        9: 'icon-diannao',
        11: 'icon-qita'
      },
      deviceList: [],
      page: 1,
      total: null,
      file_type_list: [],
      file_state_lsit: []
    }
  },
  created() {
    // this.handleGetDeviceList()
  },
  mounted() {
    this.handlerGetMultimediaConfig()
  },
  methods: {
    async handlerGetMultimediaConfig() {
      try {
        const res = await getMultimediaConfig()
        this.file_type_list = res.file_type
        this.file_state_lsit = res.file_state
      } catch (err) {
        throw err
      }
    },
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
    },
    async handleGetDeviceList() {
      try {
        const res = await getDeviceList({
          page: {
            page: this.page,
            size: 10
          },
          device_search: {
            keyword: ''
          },
          place_id: 1,
          device_order: 5
        })
        this.deviceList = [
          ...this.deviceList,
          ...res.device_info_list.device_property_list
        ]
        if (!this.total) this.total = res.device_info_list.total
      } catch (err) {
        throw err
      }
    },
    cancelSelect() {
      this.$refs.multipleTable.clearSelection()
    },
    toggleSelection() {
      // if (val) {
      this.$refs.multipleTable.toggleAllSelection()
      // } else {
      // this.$refs.multipleTable.clearSelection()
      // }
    },
    // load() {
    //   if (this.page * 10 > this.total) {
    //     this.bottomOut = true
    //   } else {
    //     this.page++
    //     this.handleGetDeviceList()
    //   }
    // },
    goSetting() {
      this.$router.push({ name: 'allSetting' })
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
.title {
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  position: relative;
  padding: 20px 0;
  border-bottom: 1px solid #e5e5e5;
  .edit_btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 20px;
    font-size: 14px;
    color: #333;
    cursor: pointer;
  }
}
.table_box {
  width: 100%;
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
  /deep/ .el-table__empty-block {
    width: auto !important;
  }
  /deep/ .el-table__header {
    width: auto !important;
  }
  /deep/ .el-table__body {
    width: auto !important;
  }
  .operate_content {
    display: flex;
    align-items: center;
    .iconfont {
      cursor: pointer;
      font-size: 18px;
      color: #333;
      margin-right: 5px;
      &.green {
        color: #45b54c;
      }
      &.red {
        color: #ff3b30;
      }
      &.gray {
        color: #666666;
      }
      &.orange {
        color: #e39c20;
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
