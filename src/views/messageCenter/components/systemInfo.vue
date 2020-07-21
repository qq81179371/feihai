<template>
  <div class="dashboard-container">
    <div class="header_title">
      <h4>推送字幕</h4>
      <el-button :disabled="!menus.find(e => e.id === 4).enable" type="primary" size="small" class="btn" @click="handlerPostCaptionMessage">推送</el-button>
    </div>
    <div class="box_shadow">
      <el-form
        ref="form"
        :rules="rules"
        :model="message"
        label-width="110px"
        size="small"
        label-position="left"
      >
        <el-form-item label="内容" prop="content">
          <el-input
            v-model="message.content"
            class="item_textarea"
            type="textarea"
            placeholder="请描述您要填写的内容"
          />
        </el-form-item>
        <el-form-item label="字体颜色" prop="color">
          <el-color-picker v-model="message.color" />
        </el-form-item>
        <el-form-item label="字体大小" prop="font_size">
          <el-select v-model="message.font_size" placeholder="请选择活动区域">
            <el-option :label="100" :value="100" />
            <el-option :label="200" :value="200" />
            <el-option :label="300" :value="300" />
            <el-option :label="400" :value="400" />
            <el-option :label="500" :value="500" />
          </el-select>
        </el-form-item>
        <el-form-item label="播放时长" prop="time">
          <el-input v-model.number="message.time" class="item_input" placeholder="播放时长" />
        </el-form-item>
        <el-form-item label="接收成员" prop="place_id">
          <el-cascader
            v-model="message.place_id"
            size="small"
            :options="memberList"
            :props="deviceArrProps"
            collapse-tags
            clearable
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getReceivingMember, postCaptionMessage } from '@/api/app'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      memberList: null,
      deviceArrProps: {
        emitPath: false,
        label: 'r',
        multiple: true,
        value: 'id',
        children: 'room'
      },
      message: {
        content: '',
        type: 1,
        color: '',
        time: null,
        font_size: 100,
        place_id: ''
      },
      rules: {
        content: [{ required: true, message: '请输入内容', trigger: 'change' }],
        color: [{ required: true, message: '请选择颜色', trigger: 'change' }],
        time: [
          { required: true, message: '请输入播放时长', trigger: 'change' }
        ],
        place_id: [
          { required: true, message: '请选择接收成员', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['menus'])
  },
  mounted() {
    this.handlergGetReceivingMember()
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
    async handlerPostCaptionMessage() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            const res = await postCaptionMessage({
              message: this.message
            })
            this.$message({
              type: 'success',
              message: res.result.text
            })
          } catch (err) {
            throw err
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/baseTitle.scss";
.item_input {
  width: 191px;
}
.item_textarea {
  max-width: 800px;
}
</style>
