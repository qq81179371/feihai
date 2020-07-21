<template>
  <div class="admini_wrap">
    <div class="admini_content">
      <el-checkbox-group v-model="formAuthority">
        <el-checkbox
          v-for="item in authorityList"
          :key="item.id"
          :label="item.id"
          name="operate"
        >{{ item.operate }}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="next_step">
      <el-button type="primary" size="small" @click="onSubmit">完成</el-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      formAuthority: []
    }
  },
  computed: {
    ...mapGetters(['authorityList'])
  },
  methods: {
    onSubmit() {
      this.$emit('handleBatchChangeInfo', {
        authority_id: this.formAuthority
      }, 22)
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
    height: 400px;
    .el-checkbox-group {
      display: flex;
      flex-direction: column;
      .el-checkbox {
        margin: 20px 0;
      }
    }
  }
  .next_step {
    margin: 30px 0 20px;
    display: flex;
    justify-content: center;
  }
}
</style>
