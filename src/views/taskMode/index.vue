<template>
  <div class="wrap">
    <search-bar>
      <search @handleRefresh="handleRefresh" @handleSearchTask="handleSearchTask" />
    </search-bar>
    <!-- 内容中心 -->
    <div class="content">
      <div v-if="routeIdent === 'run'" class="runlf_box">
        <sidebar :folder-type.sync="sceneId" :task-time-type="taskTimeType" />
      </div>
      <div class="runright_box">
        <div class="details_box">
          <div class="lf_box">
            <task-table
              ref="taskTable"
              :type-id.sync="typeId"
              :total.sync="total"
              :task-id.sync="taskId"
              :task-list.sync="taskList"
              :isedit.sync="isedit"
              :task-type-list="taskTypeList"
              @handleRefresh="handleRefresh"
              @handleLoadMore="handleLoadMore"
            />
            <div v-if="!rightShow" class="open_up_left" @click="rightShow = !rightShow">
              <i class="iconfont icon-hou" />
            </div>
          </div>
          <transition name="slide-fade">
            <div v-show="rightShow" class="rg_box" :class="{an_1: rightShow, an_2: !rightShow}">
              <div class="right_title">{{ taskDetailsObj ? taskDetailsObj.name : '' }}</div>
              <transition name="slide-fade">
                <task-details v-if="taskDetailsObj" :task-details-obj="taskDetailsObj" />
              </transition>
              <transition name="slide-fade">
                <p v-if="!taskDetailsObj" class="no_more">未选择任务</p>
              </transition>
              <div v-if="rightShow" class="open_up_right" @click="rightShow = !rightShow">
                <i class="iconfont icon-hou" />
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTaskList, getTaskTypeList, getTaskDetails } from '@/api/task'
import sidebar from './../runMode/components/sidebar'
import searchBar from '@/components/searchbar'
import taskDetails from './components/taskDetails'
import taskTable from './components/taskTable'
import search from './components/search'
export default {
  components: {
    taskDetails,
    sidebar,
    searchBar,
    taskTable,
    search
  },
  data() {
    return {
      sceneId: null,
      taskId: null,
      isedit: false,
      rightShow: true,
      total: null,
      typeId: 0,
      page: 1,
      keyword: '',
      taskTimeType: null,
      taskDetailsObj: null,
      taskTypeList: [],
      taskList: [],
      routeIdent: ''
    }
  },
  watch: {
    typeId(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.taskId = null
        this.taskList = []
        this.page = 1
        this.handleGetTaskList()
      }
    },
    taskId(newVal, oldVal) {
      if (newVal !== oldVal && newVal) {
        this.handleGetTaskDetails()
      }
    },
    sceneId(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.taskId = null
        this.taskList = []
        this.page = 1
        this.handleGetTaskList()
      }
    }
  },
  created() {
    this.handleGetTaskListType()
    this.routeIdent = this.$route.name
    if (this.$route.name === 'task') {
      this.sceneId = 0
    }
  },
  methods: {
    handleRefresh() {
      this.taskId = null
      this.page = 1
      this.taskList = []
      this.handleGetTaskList()
    },
    handleLoadMore() {
      if (this.page * 10 < this.total) {
        this.page++
        this.handleGetTaskList()
      }
    },
    handleSearchTask(keyword) {
      this.taskList = []
      this.page = 1
      this.keyword = keyword
      this.handleGetTaskList()
    },
    async handleGetTaskListType() {
      try {
        const res = await getTaskTypeList()
        this.typeId = res.task_type[0].id
        this.taskTypeList = res.task_type
        this.taskTimeType = res.task_time_type
      } catch (err) {
        throw err
      }
    },
    async handleGetTaskList() {
      try {
        const res = await getTaskList({
          page: {
            page: this.page,
            size: 10
          },
          task_search: {
            type: this.typeId,
            keyword: this.keyword,
            scene_id: this.sceneId,
            order: 0
          }
        })
        if (res) {
          this.total = res.task_infos.total
          if (res.task_infos.task_lists) {
            if (!this.taskId) {
              this.taskId = res.task_infos.task_lists[0].id
            }
            this.taskList = [...this.taskList, ...res.task_infos.task_lists]
          } else {
            this.taskDetailsObj = null
          }
        }
      } catch (err) {
        throw err
      }
    },
    async handleGetTaskDetails() {
      this.taskDetailsObj = null
      try {
        const res = await getTaskDetails({
          task_id: this.taskId
        })
        this.taskDetailsObj = res.task_property
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
    rightClickMenu(row, column, event) {
      const $event = event
      this.$refs.right_menu.$emit('rightClickMenu', $event)
    }
  }
}
</script>

<style lang="scss" scoped>
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
.purple {
  background: #5087ec;
  color: #fff;
  &:hover {
    opacity: 0.9;
  }
}
.content {
  display: flex;
  .runlf_box {
    position: relative;
    padding: 30px 0 0;
    flex-shrink: 0;
    width: 160px;
    height: calc(100vh - 94px);
    border-right: 1px solid #ddd;
  }
  .runright_box {
    flex: 1;
    .details_box {
      display: flex;
      width: 100%;
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
        background: #f5f5f5;
        width: 400px;
        display: flex;
        flex-direction: column;
        // justify-content: center;
        align-items: center;
        border-left: 1px solid #e5e5e5;
        .no_more {
          line-height: 800px;
          font-size: 20px;
          color: #999;
          font-weight: 600;
        }
        &.an_1 {
          animation: widthSize 0.4s ease;
        }
        &.an_2 {
          animation: widthSizeL 0.4s ease;
        }
        .right_title {
          flex-shrink: 0;
          width: 100%;
          background: #fff;
          font-size: 20px;
          font-weight: bold;
          color: #555;
          height: 60px;
          display: flex;
          align-items: center;
          padding: 0 15px;
          // margin-bottom: 20px;
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
