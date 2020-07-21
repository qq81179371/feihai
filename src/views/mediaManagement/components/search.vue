<template>
  <div class="main">
    <div class="block">
      <!-- <span class="demonstration">名称:</span> -->
      <el-input v-model="input" class="input_item" size="small" placeholder="请输入内容" clearable />
    </div>
    <div class="block">
      <el-button size="small" type="primary" icon="el-icon-search" @click="handlerSearch">搜索</el-button>
    </div>
    <div class="block" :class="{disabled: folderType === 2 }">
      <el-dropdown trigger="click" placement="bottom-start" @command="handleNavAddTask">
        <span class="el-dropdown-link">
          <el-button
            size="small"
            type="success"
            icon="el-icon-circle-plus-outline"
            :disabled="folderType === 2"
          >添加媒体源</el-button>
        </span>
        <el-dropdown-menu slot="dropdown" class="dropdown_list">
          <template v-for="item in addTaskNavList">
            <el-dropdown-item :key="item.id" class="item" :command="item.id">
              <i class="iconfont" :class="item.icon" />
              {{ item.name }}
            </el-dropdown-item>
          </template>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      destroy-on-close
      :close-on-click-modal="false"
      class="el-dialog-box"
      title="在线互联网直播"
      :visible.sync="outerVisible"
    >
      <el-form
        ref="addForm"
        :rules="rules"
        :model="source"
        size="small"
        label-width="150px"
        label-position="right"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="source.name" clearable />
        </el-form-item>
        <el-form-item label="是否所有人可见" class="width_100" prop="visble">
          <el-radio-group v-model="source.visible">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="地址" class="width_100" prop="url">
          <el-input v-model="source.url" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddEvent">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      destroy-on-close
      :close-on-click-modal="false"
      class="el-dialog-box"
      title="实时采播"
      :visible.sync="outerVisible1"
    >
      <el-form
        ref="addForm1"
        :rules="rules"
        :model="source1"
        size="small"
        label-width="150px"
        label-position="right"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="source1.name" clearable />
        </el-form-item>
        <el-form-item label="是否所有人可见" class="width_100" prop="visble">
          <el-radio-group v-model="source1.visible">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="采播端口" class="width_100" prop="visble">
          <el-radio-group v-model="source1.visible">
            <template v-for="item in deviceInput">
              <el-radio :key="item.id" :label="item.index">{{ item.name }}</el-radio>
            </template>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="位置">
          <el-cascader
            v-model="source1.place_id"
            :options="memberList"
            :props="deviceArrProps"
            collapse-tags
            clearable
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="submitAddEvent">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      destroy-on-close
      :close-on-click-modal="false"
      class="el-dialog-box"
      title="媒体文件"
      :visible.sync="outerVisible2"
    >
      <el-form ref="fileForm1" :rules="rules" :model="deviceData" label-width="150px" size="small">
        <el-form-item label="名称" prop="name">
          <el-input v-model="deviceData.name" />
        </el-form-item>
        <el-form-item label="是否所有人可见" class="width_100" prop="visble">
          <el-radio-group v-model="deviceData.visible">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item required label="选择文件">
          <el-upload
            ref="videoUpload"
            action
            :auto-upload="false"
            :http-request="handlerPushSystemUpgrade"
            multiple
            :limit="1"
            :file-list="fileList"
            accept=".mp4, .3gp, .wmv, .rm, .rmvb, .avi, .mp3, .wma, .flac, .ape, ogg, .flv, .MID, .AAC, .PMP, .MPEG, .MPEG2, .ASF"
            :on-change="addUploadFile"
            :on-remove="removeFile"
            :on-success="successFile"
          >
            <el-button size="small" type="primary" @click="handleFlieList">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传音频/视频文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="outerVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="handlerPushSystemUpgrade1">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      destroy-on-close
      :close-on-click-modal="false"
      class="el-dialog-box"
      title="媒体文件"
      :visible.sync="outerVisible3"
    >
      <el-form ref="fileForm2" :rules="rules" :model="file" label-width="150px" size="small">
        <el-form-item label="名称" prop="name">
          <el-input v-model="file.name" />
        </el-form-item>
        <el-form-item label="是否所有人可见" class="width_100" prop="visble">
          <el-radio-group v-model="file.visible">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="outerVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="handlerAddMultimediaFolder">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { validName, validUrl } from '@/utils/validate'
import EventBus from '@/common/eventBus'
import {
  addInternetLiveMediaSource,
  addBroadcastMediaSource,
  getReceivingMember,
  changeMediaSource,
  uploadVideo
} from '@/api/app.js'
export default {
  props: {
    keyword: {
      type: String,
      default: ''
    },
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
    const validateUrl = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('地址不能为空'))
      }
      if (value !== '' && !validUrl(value)) {
        callback(new Error('地址不符合要求'))
      }
      callback()
    }
    return {
      fileList: [],
      fileId: null,
      source: {
        url: '',
        name: '',
        visible: 0
      },
      deviceData: {
        name: '',
        visible: 0
      },
      source1: {
        name: '',
        select_source: 1,
        place_id: null,
        visible: 0
      },
      outerVisible: false,
      outerVisible1: false,
      outerVisible2: false,
      outerVisible3: false,
      input: this.keyword,
      value1: [],
      value2: [],
      addTaskNavList: [
        {
          icon: 'icon-wenjian',
          pathName: 'addTask',
          id: 0,
          name: '媒体文件'
        },
        {
          icon: 'icon-zhibo',
          pathName: 'addTask',
          id: 1,
          name: '在线互联网直播'
        },
        {
          icon: 'icon-guankanzhibo',
          pathName: 'addTask',
          id: 2,
          name: '实时采播'
        }
      ],
      deviceInput: [
        {
          index: 0,
          name: 'HDMI1'
        },
        {
          index: 1,
          name: 'HDMI2'
        },
        {
          index: 3,
          name: '电脑'
        }
      ],
      rules: {
        name: [{ required: true, validator: validateName, trigger: 'blur' }],
        new_name: [
          { required: true, validator: validateName, trigger: 'change' }
        ],
        url: [{ required: true, validator: validateUrl, trigger: 'change' }]
      },
      memberList: [],
      deviceArrProps: {
        emitPath: false,
        label: 'r',
        value: 'id',
        children: 'room'
      },
      file: {
        name: '',
        visible: '',
        id: ''
      },
      fileObj: {}
    }
  },
  watch: {
    input(newValue, oldvalue) {
      this.$emit('update:keyword', newValue)
    },
    keyword(newValue) {
      this.input = newValue
    },
    outerVisible(newVal) {
      if (!newVal) {
        this.source = {
          url: '',
          name: '',
          visible: 0
        }
      }
    },
    outerVisible1(newVal) {
      if (!newVal) {
        this.source1 = {
          source: '',
          name: '',
          select_source: 1,
          place_id: null,
          visible: 0
        }
      }
    }
  },
  mounted() {
    // 3在线互联网   4实时采播
    EventBus.$on('sendData', row => {
      this.fileId = row.id
      if (row.file_type === 3) {
        this.handleNavAddTask(1)
        this.source.url = row.url
        this.source.name = row.file_name
        this.source.visible = row.for_all_users
      }
      if (row.file_type === 4) {
        this.handleNavAddTask(2)
        this.source1.select_source = row.select_source
        this.source1.name = row.file_name
        this.source1.visible = row.for_all_users
        this.source1.place_id = row.place_id
      }
      if (row.file_type !== 3 && row.file_type !== 4) {
        console.log(row)

        this.file = {
          name: row.file_name,
          id: row.id,
          visible: row.for_all_users
        }
        this.outerVisible3 = true
      }
    })
  },
  created() {
    this.handlergGetReceivingMember()
  },
  methods: {
    handleFlieList() {
      if (this.fileList.length > 0) {
        this.$refs.videoUpload.clearFiles()
      }
    },
    successFile(res) {
      this.outerVisible2 = false
      this.refresh()
    },
    removeFile(file, fileList) {
      this.fileList = fileList
    },
    addUploadFile(file, fileList) {
      console.log(file)
      this.deviceData.name = file.name.substring(0, file.name.indexOf('.'))
      this.fileList = fileList
    },
    async handlerPushSystemUpgrade(fileObj) {
      const formData = new FormData()
      formData.set('file', fileObj.file)
      formData.set('name', this.deviceData.name)
      formData.set('visible', this.deviceData.visible)
      formData.set('folder_id', this.folderId)
      const msg = this.$message({
        customClass: 'load_message',
        iconClass: 'el-icon-loading',
        duration: 0,
        center: true,
        message: '上传中...'
      })
      try {
        const res = await uploadVideo(formData)
        msg.close()
        this.$message({
          type: 'success',
          message: res.result.text
        })
      } catch (err) {
        msg.close()
        throw err
      }
    },
    async handlerPushSystemUpgrade1() {
      this.$refs.fileForm1.validate(async valid => {
        if (valid) {
          if (this.fileList.length !== 0) {
            this.$refs.videoUpload.submit()
          } else {
            this.$message.warning('请先选择文件')
          }
        }
      })
    },
    refresh() {
      EventBus.$emit('refresh')
    },
    async submitAddEvent() {
      if (this.outerVisible) {
        this.$refs.addForm.validate(async valid => {
          if (valid) {
            try {
              const res = await addInternetLiveMediaSource({
                folder_id: this.folderId,
                id: this.fileId,
                source: this.source
              })
              this.$message({
                type: 'success',
                message: res.result.text
              })
              this.outerVisible = false
              this.refresh()
            } catch (err) {
              throw err
            }
          }
        })
      }
      if (this.outerVisible1) {
        this.$refs.addForm1.validate(async valid => {
          if (valid) {
            try {
              const res = await addBroadcastMediaSource({
                folder_id: this.folderId,
                id: this.fileId,
                source: this.source1
              })
              this.$message({
                type: 'success',
                message: res.result.text
              })
              this.outerVisible1 = false
              this.refresh()
            } catch (err) {
              throw err
            }
          }
        })
      }
      this.fileId = null
    },
    // 接收成员获取
    async handlergGetReceivingMember() {
      try {
        const res = await getReceivingMember(
          {
            search: {
              keyword: ''
            }
          },
          1
        )
        this.memberList = res.placelist
      } catch (err) {
        throw err
      }
    },
    async handlerAddMultimediaFolder() {
      this.$refs.fileForm2.validate(async valid => {
        if (valid) {
          try {
            const res = await changeMediaSource({
              file: this.file
            })
            this.$message({
              type: 'success',
              message: res.result.text
            })
            this.outerVisible3 = false
            this.fileId = null
            this.refresh()
          } catch (err) {
            throw err
          }
        }
      })
    },
    handleNavAddTask(e) {
      if (e === 1) {
        this.outerVisible = true
      }
      if (e === 2) {
        this.outerVisible1 = true
      }
      if (e === 0) {
        this.outerVisible2 = true
      }
    },
    handlerSearch() {
      EventBus.$emit('handlerKeyword')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/dialogBase.scss";
.main {
  margin-left: 40px;
  display: flex;
  align-items: center;
  .block {
    display: flex;
    align-items: center;
    margin-right: 15px;
    height: 44px;
    &.disabled {
      pointer-events: none;
    }
    .demonstration {
      font-size: 14px;
      color: #333;
      margin-right: 5px;
      white-space: nowrap;
    }
    .item_select {
      min-width: 150px;
      width: 150px;
      >>> .el-select__tags {
        height: 24px;
      }
    }
    .input_item {
      min-width: 180px;
      width: 12vw;
    }
  }
}
</style>
