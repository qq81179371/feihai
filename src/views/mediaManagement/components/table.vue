<template>
  <div class="main">
    <div class="title">
      <div class="title_box">
        <el-dropdown trigger="click" placement="bottom" @command="handleCommand">
          <span v-if="file_type_list" class="el-dropdown-link">
            文件-{{ file_type_list.find(e => e.id === fileTypeId).name }} ({{ total }})
            <i
              class="el-icon-arrow-down el-icon--right"
            />
          </span>
          <el-dropdown-menu v-if="file_type_list" slot="dropdown">
            <template v-for="item in file_type_list">
              <el-dropdown-item :key="item.id" :command="item.id">{{ item.name }}</el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="edit_btn" @click="handleEdit">{{ editText }}</div>
    </div>
    <div v-if="tableShow" class="table_box">
      <el-table
        ref="multipleTable"
        v-el-table-infinite-scroll="handleLoadMore"
        :data="file_list"
        highlight-current-row
        @row-click="changeClassId"
        @selection-change="handleSelectChange($event, file_list)"
      >
        <el-table-column
          :class-name="`selection_item ${isedit? 'isedit' : ''}`"
          :class="{isedit: isedit}"
          type="selection"
          width="30"
        />
        <el-table-column label="文件名称" prop="file_name" show-overflow-tooltip />
        <el-table-column label="文件类型" width="160px">
          <template slot-scope="scope">
            <i class="iconfont blue" :class="fileTypeIcon[scope.row.file_type]" />
            {{ file_type_list.find(e => e.id === scope.row.file_type).name }}
          </template>
        </el-table-column>
        <el-table-column label="文件状态" width="160px">
          <template slot-scope="scope">
            <span
              :class="{red: scope.row.file_state === 5, orange: scope.row.file_state === 4 || scope.row.file_state === 6}"
            >{{ file_state_lsit.find(e => e.id === scope.row.file_state).name }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="created_at" label="操作" width="125px">
          <template slot-scope="scope">
            <el-tooltip content="修改" placement="top">
              <i
                v-if="folderType !== 2"
                class="iconfont icon-xiugai orange cursor"
                @click="handlerModifyPlayer(scope.row)"
              />
            </el-tooltip>
            <el-tooltip content="播放" placement="top">
              <i class="iconfont icon-bofang1 green cursor" @click="filePlayer(scope.row)" />
            </el-tooltip>
            <el-tooltip content="下载" placement="top">
              <a
                v-if="scope.row.file_type === 1 || scope.row.file_type === 2"
                :href="scope.row.url"
                download
              >
                <i class="iconfont icon-xiazai blue cursor" />
              </a>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <i
                v-if="scope.row.file_state !== 4 && folderType === 2 && scope.row.file_state !== 6"
                class="iconfont icon-shanchu red cursor"
                @click="handlerDeletefile(scope.row)"
              />
            </el-tooltip>
            <el-tooltip content="审核" placement="top">
              <i
                v-if="scope.row.file_state === 4"
                class="iconfont icon-shenhe orange cursor"
                @click="handlerDocumentReview(scope.row)"
              />
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
      >
        <el-tooltip content="下载" class="icon" placement="top">
          <i class="iconfont icon-xiazai green" @click="goBatchSet" />
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
      title="播放"
      :visible.sync="outerVisible"
    >
      <videoPlayer :source="fileSrc" />
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="warning" @click="outerVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      destroy-on-close
      :close-on-click-modal="false"
      class="el-dialog-box"
      title="文件审核"
      :visible.sync="outerVisible1"
    >
      <el-form
        ref="addForm"
        :rules="rules"
        :model="file_review"
        size="small"
        label-width="180px"
        label-position="right"
      >
        <el-form-item label="审核" class="width_100" prop="name">
          <el-radio-group v-model="file_review.result">
            <el-radio :label="0">通过</el-radio>
            <el-radio :label="1">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="file_review.result === 1"
          label="拒绝原因"
          class="width_100"
          prop="module_sn"
        >
          <el-input v-model="file_review.reason" clearable />
        </el-form-item>
        <el-form-item label="发送通知给用户" class="width_100" prop="type">
          <el-select v-model="file_review.notice" clearable placeholder="请选择">
            <template v-for="item in notice_type">
              <el-option :key="item.id" :label="item.name" :value="item.id" />
            </template>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="handlerFileReview">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SelectActionBar from '@/components/SelectActionBar'
import elTableInfiniteScroll from 'el-table-infinite-scroll'
import EventBus from '@/common/eventBus'
import videoPlayer from '@/components/VideoPlayer/index.vue'
import {
  getMultimediaConfig,
  getMultimediaFileList,
  getFileReview,
  deleteFilePort
} from '@/api/app.js'
import handleSelectActionBar from '@/minix/handleSelectActionBar.js'
export default {
  directives: {
    'el-table-infinite-scroll': elTableInfiniteScroll
  },
  components: {
    SelectActionBar,
    videoPlayer
  },
  mixins: [handleSelectActionBar],
  props: {
    folderId: {
      type: Number,
      default: null
    },
    fileDetails: {
      type: Object,
      default: null
    },
    folderType: {
      type: Number,
      default: null
    },
    keyword: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableShow: false,
      fileSrc: null,
      outerVisible: false,
      outerVisible1: false,
      fileTypeId: 0,
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
      fileTypeIcon: {
        2: 'icon-yinpin',
        1: 'icon-duomeiti',
        3: 'icon-zhibo',
        4: 'icon-guankanzhibo'
      },
      page: 1,
      total: 0,
      file_type_list: null,
      file_state_lsit: [],
      auditFileContent: null,
      file_list: [],
      file_review: {
        result: 0,
        reason: '',
        notice: 0
      },
      deleteFile: [],
      notice_type: null,
      rules: {}
    }
  },
  watch: {
    folderId(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.tableShow = false
        this.file_list = []
        this.page = 1
        this.fileTypeId = 0
        this.handlerGetMultimediaFileList()
      }
    }
  },
  mounted() {
    this.handlerGetMultimediaConfig()
    this.handlerGetMultimediaFileList()
    EventBus.$on('refresh', () => {
      this.tableShow = false
      this.file_list = []
      this.page = 1
      this.handlerGetMultimediaFileList()
    })
    EventBus.$on('handlerKeyword', () => {
      this.tableShow = false
      this.file_list = []
      this.page = 1
      this.handlerGetMultimediaFileList()
    })
  },
  methods: {
    //  修改
    handlerModifyPlayer(row) {
      EventBus.$emit('sendData', row)
    },
    goBatchSet() {},
    handleBatchDelete() {
      if (this.batchList.length === 0) {
        this.$message({
          message: '请至少选择一个文件',
          type: 'warning'
        })
      } else {
        this.deleteFile = []
        this.batchList.forEach(e => {
          this.deleteFile.push({
            id: e.id,
            name: e.file_name
          })
        })
        this.handlerDeleteFileRequest()
      }
    },
    // 删除单个文件复制
    handlerDeletefile(row) {
      this.deleteFile = []
      const res = {
        id: row.id,
        name: row.file_name
      }
      this.deleteFile.push(res)
      this.handlerDeleteFileRequest()
    },
    // 处理删除文件请求
    async handlerDeleteFileRequest() {
      try {
        await this.$confirm(`此操作将永久删除文件, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await deleteFilePort({
          file: this.deleteFile
        })
        if (res) {
          const tableList = this.file_list.filter(
            i => res.delete_id.map(e => e).indexOf(i.id) === -1
          )
          this.file_list = tableList
          this.cancelSelect()
          this.total = this.total - res.delete_id.length
          this.$message({
            type: 'success',
            message: res.result.text
          })
        }
      } catch {
        return false
      }
    },
    // 打开审核弹窗
    handlerDocumentReview(row) {
      this.auditFileContent = row
      this.outerVisible1 = true
    },
    filePlayer(row) {
      this.outerVisible = true
      // this.fileSrc =
      //   row.file_type === 1 || row.file_type === 2
      //     ? window.location.host + row.url
      //     : row.url
      this.fileSrc = row.url
    },
    handleCommand(command) {
      if (this.fileTypeId !== command) {
        this.fileTypeId = command
        this.page = 1
        this.tableShow = false
        this.file_list = []
        this.handlerGetMultimediaFileList()
      }
    },
    changeClassId(e) {
      this.$emit('update:fileDetails', e)
    },
    // 获取列表数据
    async handlerGetMultimediaFileList() {
      try {
        const res = await getMultimediaFileList({
          file: {
            id: this.folderId,
            file_type: this.fileTypeId,
            folder_type: this.folderType,
            keyword: this.keyword
          },
          page: {
            page: this.page,
            size: 10
          }
        })
        if (res.file_list && this.folderId === res.folder_id) {
          this.tableShow = true
          this.file_list = [...this.file_list, ...res.file_list]
          EventBus.$emit('pending_review_number', res.pending_review_number)
          this.$emit('update:fileDetails', this.file_list[0])
        }
        this.total = res.total
      } catch (err) {
        throw err
      }
    },
    async handlerGetMultimediaConfig() {
      try {
        const res = await getMultimediaConfig()
        this.file_type_list = res.file_type
        this.file_state_lsit = res.file_state
        this.notice_type = res.notice_type
      } catch (err) {
        throw err
      }
    },
    handleLoadMore() {
      if (this.page * 10 < this.total) {
        this.page++
        this.handlerGetMultimediaFileList()
      }
    },
    goSetting() {
      this.$router.push({ name: 'allSetting' })
    },
    // 处理文件审核
    async handlerFileReview() {
      try {
        const res = await getFileReview({
          file_review: {
            ...this.file_review,
            file_id: this.auditFileContent.id
          }
        })
        this.outerVisible1 = false
        this.$message({
          type: 'success',
          message: res.result.text
        })
        this.page = 1
        this.tableShow = false
        this.file_list = []
        this.handlerGetMultimediaFileList()
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
  padding: 22px 0;
  border-bottom: 1px solid #ebeef5;
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
  >>> .el-table-column--selection .cell {
    padding: 0 0 0 10px;
  }
  /deep/ .el-table__body-wrapper {
    height: calc(100vh - 240px) !important;
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
  /deep/ .el-table::before {
    display: none;
  }
  // /deep/ .header_bg {
  //   background: #ededed;
  //   /deep/ th {
  //     background: #ededed;
  //   }
  // }
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
      cursor: pointer;
      font-size: 15px;
      color: #333;
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
        margin-right: 5px;
        font-size: 15px;
        color: #45b54c;
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
.iconfont {
  margin: 0 5px;
}
:export {
  tableHeight: calc(100vh-200px);
}
</style>
