<template>
  <div class="dashboard-container">
    <div class="header_title">
      <h4>LED消息</h4>
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
        <el-form-item label="消息类型">
          <el-select v-model="message.type" placeholder="请选择消息类型">
            <el-option label="文字消息" :value="1" />
            <el-option label="倒计时消息" :value="2" />
            <el-option label="时间消息" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="message.type !== 3" label="内容" prop="content">
          <el-input
            v-model="message.content"
            class="item_textarea"
            type="textarea"
            placeholder="请描述您要填写的内容"
          />
        </el-form-item>
        <el-form-item label="字体颜色">
          <el-radio-group v-model="message.color">
            <el-radio :label="1">
              红色
              <i class="red" />
            </el-radio>
            <el-radio :label="4">
              蓝色
              <i class="blue" />
            </el-radio>
            <el-radio :label="7">
              白色
              <i class="white" />
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="message.type === 2" label="目标日期" prop="timestamp">
          <el-date-picker
            v-model="message.timestamp"
            type="date"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
          <p>
            倒计时显示内容中时间的用#代替，示例：距离高考 还剩#天。
            <br>目标时间：倒计时截至日期
          </p>
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
import { getReceivingMember, postLedMessage } from '@/api/app'
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
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      message: {
        content: '',
        type: 1,
        color: 1,
        timestamp: null,
        font_size: 100,
        place_id: ''
      },
      rules: {
        content: [{ required: true, message: '请输入内容', trigger: 'change' }],
        place_id: [
          { required: true, message: '请选择接收成员', trigger: 'change' }
        ],
        timestamp: [
          { required: true, message: '请选择时间', trigger: 'change' }
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
            const res = await postLedMessage({
              led_message: this.message
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
.dashboard-container {
  // padding: 30px 30px 30px 20px;
  .header_title {
    font-size: 20px;
    color: #282828;
  }
  .btn {
    // margin: 30px 0;
  }
}
.item_input {
  width: 191px;
}
.item_textarea {
  max-width: 800px;
}
/deep/ .el-radio-group {
  display: flex;
}
/deep/ .el-radio {
  display: flex;
  align-items: center;
}
/deep/ .el-radio__label {
  display: flex;
  align-items: center;

  i {
    width: 30px;
    height: 14px;
    border: 1px solid #dadada;
    border-radius: 4px;
    display: inline-block;
    margin-left: 5px;
    &.red {
      background: #ff0000;
    }
    &.blue {
      background: #00a0e9;
    }
    &.white {
      background: #fff;
    }
  }
}
p {
  font-size: 12px;
  line-height: 20px;
  color: #999;
}
</style>
