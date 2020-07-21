<template>
  <div class="dashboard-container">
    <div class="header_title">
      <h4>系统升级</h4>
    </div>
    <div class="box_shadow">
      <h5>
        系统软件更新
        <p>软件版本：V1.0.0</p>
      </h5>
      <div class="btn_list">
        <el-upload
          action
          class="upload-demo"
          :http-request="handlerPushSystemUpgrade"
          :before-remove="beforeRemove"
          :limit="1"
          accept=".zip"
          :on-exceed="handleExceed"
          :disabled="!menus.find(e => e.id === 6).enable"
          :file-list="fileList"
        >
          <el-button
            size="small"
            type="primary"
            :disabled="!menus.find(e => e.id === 6).enable"
          >点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传zip文件，且不超过2M
          </div>
        </el-upload>
        <!-- <el-button class="gray" size="small">更新</el-button> -->
      </div>
    </div>
    <div class="box_shadow mtop">
      <h5>设备软件更新</h5>
      <div class="btn_list">
        <ul>
          <li>
            <span>接收成员</span>
            <el-cascader
              v-model="deviceData.place"
              size="small"
              :options="memberList"
              :props="deviceArrProps"
              collapse-tags
              clearable
            />
          </li>
          <li>
            <span>设备类型</span>
            <el-select
              v-model="deviceData.module"
              size="small"
              placeholder="请选择设备"
            >
              <template v-for="item in typeList">
                <el-option :key="item.id" :label="item.name" :value="item.id" />
              </template>
            </el-select>
          </li>
        </ul>
        <el-upload
          action
          class="upload-demo"
          :http-request="handlerPushDeviceUpgrade"
          :before-remove="beforeRemove"
          :limit="1"
          accept=".tar"
          :data="deviceData"
          :on-exceed="handleExceed"
          :file-list="fileList1"
          :disabled="
            !deviceData.place ||
              !deviceData.module ||
              !menus.find(e => e.id === 6).enable
          "
        >
          <el-button
            size="small"
            type="primary"
            :disabled="
              !deviceData.place ||
                !deviceData.module ||
                !menus.find(e => e.id === 6).enable
            "
          >点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传tar文件，且不超过2M
          </div>
        </el-upload>
        <!-- <el-button class="gray" size="small">更新</el-button> -->
      </div>
    </div>
  </div>
</template>

<script>
import {
  getDeviceType,
  getReceivingMember,
  pushSystemUpgrade,
  pushDeviceUpgrade
} from '@/api/app'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      deviceData: {
        place: null,
        module: null
      },
      typeList: null,
      memberList: null,
      deviceArrProps: {
        emitPath: false,
        label: 'r',
        multiple: true,
        value: 'id',
        children: 'room'
      },
      fileList: [],
      fileList1: []
    }
  },
  computed: {
    ...mapGetters(['menus'])
  },
  mounted() {
    this.handlergGetReceivingMember()
    this.handlerGetDeviceType()
  },
  methods: {
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
    async handlerGetDeviceType() {
      try {
        const res = await getDeviceType()
        this.typeList = res.upgrade_module
      } catch (err) {
        throw err
      }
    },
    async handlerPushSystemUpgrade(fileObj) {
      const formData = new FormData()
      formData.set('file', fileObj.file)
      const msg = this.$message({
        customClass: 'load_message',
        iconClass: 'el-icon-loading',
        duration: 0,
        center: true,
        message: '上传中...'
      })
      try {
        const res = await pushSystemUpgrade(formData)
        this.typeList = res.upgrade_module
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
    async handlerPushDeviceUpgrade(fileObj) {
      const formData = new FormData()
      formData.set('file', fileObj.file)
      formData.set('place', this.deviceData.place)
      formData.set('module', this.deviceData.module)
      const msg = this.$message({
        customClass: 'load_message',
        iconClass: 'el-icon-loading',
        duration: 0,
        center: true,
        message: '上传中...'
      })
      try {
        const res = await pushDeviceUpgrade(formData)
        this.typeList = res.upgrade_module
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
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>

<style lang="scss" scoped>
// @import "~@/styles/systemManage.scss";
@import "~@/styles/baseTitle.scss";
.dashboard-container {
  p {
    font-size: 14px;
    color: #666;
    margin: 10px 0 0;
  }
  h5 {
    color: #333;
    font-weight: 400;
    font-size: 16px;
    margin: 0px 0px 30px;
  }
  .btn_list {
    ul {
      li {
        margin-bottom: 20px;
        span {
          font-size: 14px;
          color: #666;
          margin-right: 10px;
        }
      }
    }
  }
  .gray {
    margin-top: 20px;
    background: #5087ec;
    color: #fff;
    &:hover {
      opacity: 0.8;
    }
  }
  /deep/ .el-upload-list {
    max-width: 800px;
  }
}
</style>
