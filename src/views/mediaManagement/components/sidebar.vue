<template>
  <div class="sidebar_wrap scroll">
    <right-click-menu-mod ref="right_menu" :menu-visible.sync="menuVisible">
      <li class="menu__item" @click="handlerChangeFolder">修改</li>
      <li class="menu__item" @click="handlerDeleteFolder">删除</li>
    </right-click-menu-mod>
    <div class="btn_box">
      <el-button class="btn" @click="addEvnet">添加文件夹</el-button>
    </div>
    <div class="list">
      <template v-for="item in folder_list">
        <div
          :key="item.id"
          class="item"
          :class="{active: folderId === item.id, disable: disable} "
          @click="handlerToggleFolderId(item)"
          @contextmenu.prevent="rightClickMenu($event, item)"
        >
          <i
            class="iconfont icon-wenjianjia"
            :class="{blue: item.folder_type === 1, orange: item.folder_type === 2, green: item.folder_type === 3, }"
          />
          <div class="text">
            <span>{{ item.name }}</span>
            <p
              v-if="item.folder_type === 2 && pending_review_number > 0"
              class="dropdown"
            >{{ pending_review_number }}</p>
          </div>
          <div v-if="review_remind" class="icon_box">
            <el-tooltip content="提醒管理员审核" class="icon" placement="top">
              <i v-if="item.folder_type === 2" class="iconfont icon-tixing2 orange" @click.stop="handlerRemindReview" />
            </el-tooltip>
          </div>
        </div>
      </template>
    </div>
    <el-dialog
      destroy-on-close
      :close-on-click-modal="false"
      class="el-dialog-box"
      title="添加文件夹"
      :visible.sync="outerVisible"
    >
      <el-form ref="fileForm" :rules="rules" :model="file" label-width="80px" size="small">
        <el-form-item v-if="!file.new_name" label="名称" prop="folder_name">
          <el-input v-model="file.folder_name" />
        </el-form-item>
        <el-form-item v-else label="名称" prop="new_name">
          <el-input v-model="file.new_name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlerAddMultimediaFolder">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { validName } from '@/utils/validate'
import {
  addMultimediaFolder,
  getMultimediaList,
  postRemindReview,
  deleteMultimediaFolder,
  changeMultimediaFolderName
} from '@/api/app'
import rightClickMenuMod from '@/components/RightClickMenu'
import EventBus from '@/common/eventBus'
export default {
  components: {
    rightClickMenuMod
  },
  props: {
    folderId: {
      type: Number,
      default: null
    },
    folderType: {
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
      disable: false,
      menuVisible: false,
      folder_list: [],
      review_remind: false,
      list: [
        {
          title: 'aaa',
          author: '1'
        },
        {
          title: 'aaa',
          author: '1'
        },
        {
          title: 'aaa',
          author: '1'
        }
      ],
      pending_review_number: 0,
      outerVisible: false,
      file: {
        folder_name: '',
        new_name: '',
        old_name: '',
        id: ''
      },
      rules: {
        folder_name: [
          { required: true, validator: validateName, trigger: 'change' }
        ],
        new_name: [
          { required: true, validator: validateName, trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.handlerGetList()
    EventBus.$on('pending_review_number', (data) => {
      this.pending_review_number = data
    })
  },
  methods: {
    // 获取文件夹列表
    async handlerGetList() {
      try {
        const res = await getMultimediaList()
        this.folder_list = res.folder_list
        this.review_remind = res.review_remind
        this.$emit('update:folderId', res.folder_list[0].id)
        this.$emit('update:folderType', res.folder_list[0].folder_type)
      } catch (err) {
        throw err
      }
    },
    async handlerRemindReview() {
      try {
        await this.$confirm(
          `提醒管理员审核, 是否继续?`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        const res = await postRemindReview()
        this.$message({
          type: 'success',
          message: res.result.text
        })
      } catch {
        return false
      }
    },
    handlerToggleFolderId(item) {
      this.disable = true
      setTimeout(() => {
        this.disable = false
      }, 300)
      this.$emit('update:folderId', item.id)
      this.$emit('update:folderType', item.folder_type)
    },
    addEvnet() {
      this.outerVisible = true
      this.file = {
        folder_name: '',
        new_name: '',
        old_name: '',
        id: ''
      }
    },
    // 右键菜单
    rightClickMenu(event, item) {
      this.file.old_name = item.name
      this.file.new_name = item.name
      this.file.id = item.id
      this.$refs.right_menu.$emit('rightClickMenu', event)
    },
    // 添加文件夹
    async handlerAddMultimediaFolder() {
      this.$refs.fileForm.validate(async valid => {
        if (valid) {
          try {
            let file
            if (this.file.new_name) {
              file = {
                new_name: this.file.new_name,
                old_name: this.file.old_name,
                id: this.file.id
              }
            } else {
              file = {
                folder_name: this.file.folder_name
              }
            }
            let res
            if (this.file.new_name) {
              res = await changeMultimediaFolderName({ file })
            } else {
              res = await addMultimediaFolder({ file })
            }
            this.$message({
              type: 'success',
              message: res.result.text
            })
            this.handlerGetList()
            this.outerVisible = false
          } catch (err) {
            throw err
          }
        }
      })
    },
    // 修改文件夹
    async handlerChangeFolder() {
      this.outerVisible = true
    },
    // 删除文件夹
    async handlerDeleteFolder() {
      try {
        await this.$confirm(
          `此操作将永久删除"${this.file.old_name}", 是否继续?`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        const res = await deleteMultimediaFolder({
          file: {
            id: this.file.id
          }
        })
        if (res) {
          this.folder_list = this.folder_list.filter(
            e => e.id !== this.file.id
          )
          this.$message({
            type: 'success',
            message: res.result.text
          })
        }
      } catch {
        return false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/dialogBase.scss";
.sidebar_wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
  padding-top: 50px;
  overflow-y: scroll;
  .btn_box {
    position: absolute;
    top: 30px;
    z-index: 1;
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    background: #fff;
    .btn {
      background: #5087ec;
      color: #fff;
      flex-shrink: 0;
      opacity: 1;
      &:hover {
        opacity: 0.8;
      }
    }
  }
  .list {
    width: 100%;
    padding: 10px 0;
    .item {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      padding: 0 15px 0 30px;
      cursor: pointer;
      color: #5d5d5d;
      font-size: 14px;
      &:hover,
      &.active {
        background: #e6fded;
      }
      .iconfont {
        font-size: 12px;
        &.icon-guanliyuan {
          color: #45b54c;
        }
        &.icon-yonghu1 {
          color: #f13025;
        }
      }
      .text {
        position: relative;
        margin: 0 5px;
        p {
          position: absolute;
          height: 15px;
          padding: 0 3px;
          border-radius: 8px;
          color: #fff;
          font-size: 12px;
          background: #ff3b30;
          display: flex;
          justify-content: center;
          align-items: center;
          top: -10px;
          right: -15px;
        }
      }
      &.disable {
        pointer-events: none;
      }
      .icon_box {
        flex: 1;
        display: flex;
        flex-direction: row-reverse;
      }
    }
  }
  .top_border {
    width: 100%;
    border-top: 1px solid #ddd;
    position: absolute;
    bottom: 0;
    padding: 0 15px;
    left: 0;
    .item {
      font-size: 12px;
      color: #282828;
      margin: 15px 0;
      line-height: 18px;
    }
  }
  .el-dialog-box {
    >>> .el-dialog {
      width: 50%;
      max-width: 750px;
    }
  }
  /deep/ .el-select {
    display: block;
  }
  /deep/ .el-form-item__content {
    max-width: 350px;
  }
}
</style>
