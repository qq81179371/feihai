// 物联控制组件
<template>
  <div class="audio_source_wrap">
    <div class="title">
      <i class="iconfont icon-morenfanwei" />
      <span>接收成员 </span>
      <span v-if="taskProperty.place_id && taskProperty.place_id.length > 0" class="gray">(共{{ taskProperty.place_id.length }}个)</span>
    </div>
    <div class="member_content">
      <el-form
        ref="taskProperty"
        label-position="left"
        :model="taskProperty"
        label-width="100px"
        :rules="rules"
      >
        <!-- <div class="tit">接收成员</div> -->
        <el-form-item prop="place_id" label="接收成员">
          <el-cascader
            v-model="taskProperty.place_id"
            :options="memberList"
            size="small"
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
import { getReceivingMember } from '@/api/app'
export default {
  props: {
    taskProperty: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      deviceArrProps: {
        emitPath: false,
        label: 'r',
        multiple: true,
        value: 'id',
        children: 'room'
      },
      rules: {
        place_id: [
          { required: true, message: '请选择接收成员', trigger: 'change' }
        ]
      },
      memberList: []
    }
  },
  watch: {
    taskProperty: {
      handler(newVal) {
        this.$emit(`update:taskProperty`, newVal)
      },
      deep: true
    }
  },
  created() {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.audio_source_wrap {
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
  .member_content {
    display: flex;
    align-items: center;
    margin-top: 25px;
    .tit {
      font-size: 14px;
      color: #5d5d5d;
      margin-right: 25px;
    }
    .el-form-item {
      margin-bottom: 0;
      min-width: 320px;
      /deep/ .el-cascader {
        width: 220px;
      }
    }
  }
}
</style>
