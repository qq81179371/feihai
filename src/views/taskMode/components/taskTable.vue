<template>
  <div class="table_warp">
    <right-click-menu-mod ref="right_menu" :menu-visible.sync="menuVisible">
      <li class="menu__item">
        <el-button
          type="text"
          :disabled="!menus.find(e => e.id === 2).enable"
          @click="handlerTaskStatus(1, 1)"
        >
          <span class="green">激活</span>
        </el-button>
      </li>
      <li class="menu__item">
        <el-button
          type="text"
          :disabled="!menus.find(e => e.id === 2).enable"
          @click="handlerTaskStatus(0, 1)"
        >
          <span class="red">停用</span>
        </el-button>
      </li>
      <li class="menu__item">
        <el-button
          type="text"
          :disabled="!menus.find(e => e.id === 2).enable"
          @click="navGoToChange"
        >修改</el-button>
      </li>
      <li class="menu__item">
        <el-button
          type="text"
          :disabled="!menus.find(e => e.id === 2).enable"
          @click="outerVisible1 = true"
        >复制</el-button>
      </li>
    </right-click-menu-mod>
    <div class="title">
      <div class="title_box">
        <el-dropdown trigger="click" placement="bottom" @command="handleDropItem">
          <span class="el-dropdown-link">
            任务-{{ titleName }}({{ total }})
            <i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <template v-for="item in taskTypeList">
              <el-dropdown-item :key="item.id" :command="item">{{ item.name }}</el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="edit_btn">
        <el-button
          type="text"
          :disabled="!menus.find(e => e.id === 2).enable"
          @click="handleEdit"
        >{{ editText }}</el-button>
      </div>
    </div>
    <div class="task_main">
      <div class="table_box" @contextmenu.prevent>
        <el-table
          ref="multipleTable"
          v-el-table-infinite-scroll="handleLoadMore"
          highlight-current-row
          :data="taskList"
          @row-click="handleRowTaskId"
          @row-contextmenu="rightClickMenu"
          @selection-change="handleSelectChange($event, taskList)"
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
                <el-button
                  type="text"
                  :disabled="!menus.find(e => e.id === 2).enable"
                  class="margin_5"
                  @click="handlerTaskPlayer(scope.row, 6)"
                >
                  <i class="iconfont icon-bofang1 green" />
                </el-button>
              </el-tooltip>
              <el-tooltip content="停止" placement="top">
                <el-button
                  type="text"
                  class="margin_5"
                  :disabled="!menus.find(e => e.id === 2).enable"
                  @click="handlerTaskPlayer(scope.row, 14)"
                >
                  <i class="iconfont icon-tingzhi red" />
                </el-button>
              </el-tooltip>
              <el-popover placement="top" width="220" trigger="hover">
                <div class="attributes_box">
                  <p>所有者: {{ scope.row.creator }}</p>
                  <p>创建时间: {{ scope.row.create_time }}</p>
                  <p>修改时间: {{ scope.row.update_time }}</p>
                </div>
                <i
                  slot="reference"
                  class="iconfont margin_5 icon-shuxingliebiaoxiangqing blue cursor"
                />
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
        <el-tooltip content="激活" class="icon" placement="top">
          <i class="iconfont icon-zhengque1 green" @click="handlerTaskStatus(1, 0)" />
        </el-tooltip>
        <el-tooltip content="停用" class="icon" placement="top">
          <i class="iconfont icon-cuowu1 red" @click="handlerTaskStatus(0, 0)" />
        </el-tooltip>
        <el-tooltip content="删除" class="icon" placement="top">
          <i class="iconfont icon-shanchu red" @click="handleBatchDelete" />
        </el-tooltip>
      </select-action-bar>
    </transition>
    <el-dialog
      destroy-on-close
      :close-on-click-modal="false"
      class="el-dialog-box"
      title="复制任务"
      :visible.sync="outerVisible1"
    >
      <el-form ref="fileForm" :rules="rules" :model="copyMod" label-width="80px" size="small">
        <el-form-item label="名称" prop="name">
          <el-input v-model="copyMod.name" clearable placeholder="请输入一个新名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="handlerCloneTask">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { validName } from '@/utils/validate'
import {
  deleteTask,
  cloneTask,
  postPlayerTask,
  changeTaskStatus
} from '@/api/app'
import { getTaskDetails } from '@/api/task'
import handleSelectActionBar from '@/minix/handleSelectActionBar.js'
import elTableInfiniteScroll from 'el-table-infinite-scroll'
import rightClickMenuMod from '@/components/RightClickMenu'
import SelectActionBar from '@/components/SelectActionBar'
import EventBus from '@/common/eventBus'
import { mapGetters } from 'vuex'
export default {
  directives: {
    'el-table-infinite-scroll': elTableInfiniteScroll
  },
  components: {
    SelectActionBar,
    rightClickMenuMod
  },
  mixins: [handleSelectActionBar],
  props: {
    taskTypeList: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: null
    },
    taskList: {
      type: Array,
      default: null
    },
    taskId: {
      type: Number,
      default: null
    }
  },
  data() {
    const validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('名称不能为空'))
      }
      if (value !== '' && !validName(value)) {
        callback(new Error('名称不符合要求'))
      }
      callback()
    }
    return {
      copyMod: {
        name: ''
      },
      outerVisible1: false,
      titleName: '全部',
      dropList: [],
      sceneId: null,
      indeterminate: false,
      allChcek: false,
      selectNum: 0,
      taskTypeIcon: {
        1: {
          icon: 'icon-kongzhi',
          name: '控制任务',
          color: 'green'
        },
        2: {
          icon: 'icon-yinpin',
          name: '音频任务',
          color: 'orange'
        },
        3: {
          icon: 'icon-bofang',
          name: '视频任务',
          color: 'blue'
        }
      },
      taskStatusIcon: {
        1: {
          icon: 'icon-zhengque1',
          name: '正常',
          color: 'green'
        },
        0: {
          icon: 'icon-shebeijihuo',
          name: '未激活',
          color: 'gray'
        },
        2: {
          icon: 'icon-tingzhi1',
          name: '临时停播',
          color: 'red'
        }
      },
      taskInfo: null,
      menuVisible: false,
      rules: {
        name: [{ required: true, validator: validateName, trigger: 'change' }],
        priority: [
          { required: true, message: '请输入优先级', trigger: 'change' },
          {
            type: 'number',
            max: 100,
            min: 1,
            message: '最小值为1, 最大值为100',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['menus'])
  },
  mounted() {
    this.$on('handleEdit', val => {
      this.handleEdit()
    })
    EventBus.$on('handleSceneId', data => {
      this.sceneId = data
    })
  },
  methods: {
    // 更改任务状态
    handlerTaskStatus(status, one) {
      const ids = []
      if (one) {
        const id = {
          id: this.taskInfo.id
        }
        ids.push(id)
        this.handlerTaskStatusRequest(status, ids)
      }
      if (!one) {
        if (this.batchList.length === 0) {
          this.$message({
            message: '请至少选择一个任务',
            type: 'warning'
          })
        } else {
          this.batchList.forEach(e => {
            ids.push({
              id: e.id
            })
          })
          this.handlerTaskStatusRequest(status, ids)
        }
      }
    },
    // 复制任务
    async handlerCloneTask() {
      this.$refs.fileForm.validate(async valid => {
        if (valid) {
          try {
            const res = await cloneTask({
              task: {
                src_id: this.taskInfo.id,
                new_name: this.copyMod.name
              }
            })
            this.$message({
              type: 'success',
              message: res.result.text
            })
            this.outerVisible1 = false
            this.$emit('handleRefresh')
          } catch (err) {
            throw err
          }
        }
      })
    },
    // 导航去修改
    async navGoToChange() {
      try {
        const res = await getTaskDetails({
          task_id: this.taskInfo.id
        })
        this.$router.push({
          name: 'addTask',
          query: {
            sceneId: this.sceneId,
            id: this.taskInfo.id,
            param: JSON.stringify(res.task_property)
          }
        })
      } catch (err) {
        throw err
      }
    },
    // 处理更改任务状态请求
    async handlerTaskStatusRequest(status, ids) {
      const msg = this.$message({
        customClass: 'load_message',
        iconClass: 'el-icon-loading',
        duration: 0,
        center: true,
        message: '加载中...'
      })
      try {
        const res = await changeTaskStatus({
          task: {
            state: status,
            ids: ids
          }
        })
        msg.close()
        this.taskList.forEach(e => {
          if (ids.map(i => i.id).indexOf(e.id) !== -1) {
            e.state = status
          }
        })
        this.$message({
          type: 'success',
          message: res.result.text
        })
      } catch (err) {
        msg.close()
        throw err
      }
    },
    // 更改类型
    handleDropItem(e) {
      this.$emit('update:typeId', e.id)
      this.titleName = e.name
    },
    // 无限滚动
    handleLoadMore() {
      this.$emit('handleLoadMore')
    },
    // 获取详情
    handleRowTaskId(e) {
      this.$emit('update:taskId', e.id)
    },
    // 删除文件
    handleBatchDelete() {
      if (this.batchList.length === 0) {
        this.$message({
          message: '请至少选择一个文件',
          type: 'warning'
        })
      } else {
        const deleteFile = []
        this.batchList.forEach(e => {
          deleteFile.push({
            id: e.id
          })
        })
        this.handlerDeleteFileRequest(deleteFile)
      }
    },

    // 右键菜单
    rightClickMenu(row, column, event) {
      this.taskInfo = row
      this.$refs.right_menu.$emit('rightClickMenu', event, 'menu2')
    },
    // 处理删除文件请求
    async handlerDeleteFileRequest(deleteFile) {
      try {
        await this.$confirm(`此操作将永久删除文件, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await deleteTask({
          task_lists: deleteFile
        })
        const tableList = this.taskList.filter(
          i => deleteFile.map(e => e.id).indexOf(i.id) === -1
        )
        // this.taskList = tableList
        this.$emit('update:taskList', tableList)
        this.$emit('update:total', deleteFile.length)
        this.cancelSelect()
        // this.total = this.total - deleteFile.length
        this.$message({
          type: 'success',
          message: res.result.text
        })
      } catch {
        return false
      }
    },
    // 播放任务
    async handlerTaskPlayer(row, cmd) {
      const msg = this.$message({
        customClass: 'load_message',
        iconClass: 'el-icon-loading',
        duration: 0,
        center: true,
        message: '加载中...'
      })
      try {
        const res = await postPlayerTask(
          {
            task_id: row.id
          },
          cmd
        )
        msg.close()
        this.$message({
          type: 'success',
          message: res.result.text
        })
      } catch (err) {
        msg.close()
        throw err
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/dialogBase.scss";
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
.table_box {
  width: 100%;
  /deep/ .el-table__body-wrapper {
    padding-bottom: 60px;
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
.attributes_box {
  p {
    line-height: 26px;
  }
}
.table_warp {
  width: 100%;
  .title {
    display: flex;
    justify-content: center;
    width: 100%;
    position: relative;
    padding: 21px 0;
    border-bottom: 1px solid #ebeef5;
    .edit_btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 15px;
      font-size: 14px;
      color: #333;
      // cursor: pointer;
    }
  }
  .task_main {
    width: 100%;
    padding: 0px 0 30px 0px;
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
  }
}
</style>
