// 基本信息
<template>
  <div class="basic_info">
    <div class="title">
      <i class="iconfont icon-jibenxinxi" />
      <span>基本信息</span>
    </div>
    <el-form
      ref="taskProperty"
      label-position="left"
      :model="taskProperty"
      label-width="100px"
      :rules="rules"
    >
      <div class="i_box">
        <el-form-item prop="name" label="名称">
          <el-input v-model="taskProperty.name" size="small" placeholder="请输入名称" />
        </el-form-item>
      </div>
      <div class="i_box">
        <el-form-item prop="priority" label="优先级">
          <el-input
            v-model.number="taskProperty.priority"
            size="small"
            placeholder="请输入优先级（1-100）"
          />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validName } from '@/utils/validate'
export default {
  props: {
    taskProperty: {
      type: Object,
      default: () => {}
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
  watch: {
    taskProperty: {
      handler(newVal) {
        this.$emit(`update:taskProperty`, newVal)
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.basic_info {
  width: 100%;
  padding: 40px 0;
  border-bottom: 1px dashed #e0e0e0;
  .title {
    display: flex;
    align-items: center;
    .iconfont {
      font-size: 20px;
      color: #33c32e;
      margin-right: 15px;
    }
    span {
      color: #090909;
      font-size: 14px;
      flex-wrap: 400px;
    }
  }
  .i_box {
    margin-top: 18px;
    display: flex;
    align-items: center;
    .el-form-item {
      margin-bottom: 0;
      min-width: 320px;
    }
  }
}
</style>
