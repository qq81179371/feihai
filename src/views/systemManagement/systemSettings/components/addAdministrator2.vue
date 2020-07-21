<template>
  <div class="admini_wrap">
    <div class="admini_content">
      <el-cascader-panel v-model="deviceArr" :props="options" collapse-tags clearable />
    </div>
    <div class="next_step">
      <el-button type="primary" size="small" @click="onSubmit">完成</el-button>
    </div>
  </div>
</template>
<script>
import { getPartitionSetList } from '@/api/app'
export default {
  data() {
    let levelNum = 1
    return {
      deviceArr: [],
      options: {
        lazy: true,
        emitPath: false,
        multiple: true,
        label: 'name',
        value: 'id',
        async lazyLoad(node, resolve) {
          const { level } = node
          try {
            const res = await getPartitionSetList({
              place: {
                level: levelNum === 3 ? levelNum : ++levelNum,
                parent_id: node.value || 0
              }
            })
            if (res.place_list) {
              const nodes = res.place_list.map(e => ({
                ...e,
                leaf: level >= 1
              }))
              resolve(nodes)
            } else resolve([])
          } catch (error) {
            throw error
          }
        }
      }
    }
  },
  methods: {
    onSubmit() {
      this.$emit('handleBatchChangeInfo', {
        authority_id: this.deviceArr
      }, 23)
    }
  }
}
</script>

<style lang="scss" scoped>
.admini_wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  .admini_title {
    margin: 20px 0 30px 0;
    width: 100%;
    /deep/ .el-step__title {
      font-size: 14px;
    }
  }
  .admini_info {
    /deep/ .el-form-item {
      margin-bottom: 10px;
    }
  }
  .admini_content {
    overflow-x: hidden;
    height: 350px;
  }
  .next_step {
    margin: 30px 0 20px;
    display: flex;
    justify-content: center;
  }
}
/deep/ .el-cascader-menu__wrap {
  height: 350px;
}
</style>
