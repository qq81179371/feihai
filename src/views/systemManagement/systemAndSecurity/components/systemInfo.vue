<template>
  <div class="dashboard-container">
    <div class="header_title">
      <h4>系统配置</h4>
    </div>
    <div class="form_box box_shadow">
      <div class="form_item">
        <div class="name_lable">系统名称</div>
        <el-input v-model="name" class="input_item" placeholder="请输入名称" clearable />
        <el-button
          type="primary"
          size="small"
          :disabled="!menus.find(e => e.id === 6).enable"
          @click="HandleSubmit"
        >保存</el-button>
      </div>
    </div>
    <div class="form_box box_shadow">
      <div class="avatar_up">
        <div class="up_title">系统图标设置</div>
        <div class="upload_box">
          <el-upload
            ref="videoUpload"
            action
            class="upload-demo"
            :auto-upload="false"
            :show-file-list="false"
            :file-list="fileList"
            :on-success="handleAvatarSuccess"
            :http-request="handlerUploadAction"
            :disabled="!menus.find(e => e.id === 6).enable"
            :on-change="addUploadFile"
            :on-error="uploadError"
            :on-remove="removeFile"
            accept=".jpg, .png"
          >
            <el-button
              size="small"
              :disabled="!menus.find(e => e.id === 6).enable"
              type="primary"
            >点击预览</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
          <div class="default_avatar">
            <div class="_img">
              <img :src="imageUrl" alt>
            </div>
            <div class="btn">
              <el-button
                type="primary"
                size="small"
                :disabled="!menus.find(e => e.id === 6).enable"
                @click="handlerSaveLogo"
              >保存</el-button>
              <el-button size="small" :disabled="!menus.find(e => e.id === 6).enable" @click="handlerGetResetLogo">恢复默认</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { updateSystemName, uploadAction, getResetLogo } from '@/api/app'
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      name: '',
      avatarUrl: '',
      fileList: [],
      imageUrl: ''
    }
  },
  computed: {
    ...mapGetters(['schoolName', 'schoolLogo', 'menus'])
  },
  watch: {
    schoolName: {
      handler(val) {
        this.name = val
      },
      immediate: true
    },
    schoolLogo: {
      handler(val) {
        this.imageUrl = val
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(['user/changeSchoolName', 'user/changeSchoolLogo']),
    removeFile(file, fileList) {
      this.fileList = fileList
    },
    async handlerGetResetLogo() {
      try {
        const res = await getResetLogo()
        this.$message({
          message: res.result.text,
          type: 'success'
        })
        this['user/changeSchoolLogo'](res.logo)
      } catch (err) {
        throw err
      }
    },
    uploadError() {
      this.imageUrl = this.avatar
    },
    handlerSaveLogo() {
      if (this.fileList.length !== 0) {
        this.$refs.videoUpload.submit()
      } else {
        this.$message.warning('请先选择文件')
      }
    },
    addUploadFile(file, fileList) {
      this.fileList = fileList
      if (fileList.length > 0) {
        this.imageUrl = URL.createObjectURL(file.raw)
      }
    },
    realTime(data) {
      // 实时预览
      this.previews = data
    },
    async HandleSubmit() {
      try {
        const res = await updateSystemName({
          place: {
            parent_id: 0,
            level: 1,
            name: this.name
          }
        })
        this.$message({
          message: res.result.text,
          type: 'success'
        })
        this['user/changeSchoolName'](this.name)
      } catch (err) {
        throw err
      }
    },
    async handlerUploadAction(fileObj) {
      const formData = new FormData()
      formData.set('file', fileObj.file)
      const msg = this.$message({
        customClass: 'load_message',
        iconClass: 'el-icon-loading',
        duration: 0,
        center: true,
        message: '加载中...'
      })
      try {
        const res = await uploadAction(formData)
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
    handleAvatarSuccess(res, file) {
      this['user/changeSchoolLogo'](URL.createObjectURL(file.raw))
      // this.imageUrl = URL.createObjectURL(file.raw)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/baseTitle.scss";
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
/deep/ .el-upload-dragger {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: auto;
  max-width: 360px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  max-width: 280px;
  max-height: 280px;
  text-align: center;
}
.avatar {
  max-width: 100%;
  max-height: 100%;
}
.form_box {
  margin: 0 0 30px 0;
  .form_item {
    display: flex;
    align-items: center;
    .name_lable {
      white-space: nowrap;
      font-size: 14px;
      color: #282828;
      margin-right: 20px;
    }
    .input_item {
      width: 240px;
      margin-right: 20px;
    }
  }
  .avatar_up {
    .up_title {
      margin: 0 0 30px 0;
      font-size: 14px;
      color: #282828;
    }
    .upload_box {
      // display: flex;
      // align-items: flex-end;
      .default_avatar {
        margin: 0 0 25px 0px;
        .img_tit {
          font-size: 14px;
          color: #282828;
        }
        ._img {
          margin: 20px 0;
          width: 210px;
          height: 50px;
          display: flex;
          justify-content: center;
          border-radius: 4px;
          align-items: center;
          background: #f5f5f5;
          img {
            max-width: 100%;
            max-height: 40px;
          }
        }
      }
    }
  }
}
</style>
