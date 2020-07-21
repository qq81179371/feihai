<template>
  <div class="select_action_bar">
    <el-checkbox
      v-model="checkedVal"
      class="check"
      :indeterminate="indeterminate"
      @change="toggleSelection"
    >
      <div class="text">全选</div>
    </el-checkbox>
    <div class="text">已选{{ selectNum }}项</div>
    <slot />
    <div class="text icon" @click="cancel">取消</div>
  </div>
</template>

<script>
export default {
  props: {
    checked: {
      type: Boolean,
      default: false
    },
    indeterminate: {
      type: Boolean,
      default: false
    },
    selectNum: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      checkedVal: false
    }
  },
  watch: {
    checked(val) {
      this.checkedVal = this.checked
    }
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    toggleSelection(val) {
      if (val) {
        this.$emit('update:checked', val)
        this.$emit('update:indeterminate', !val)
      } else {
        this.$emit('update:checked', val)
        this.$emit('update:indeterminate', val)
      }
      this.$emit('selected')
    }
  }
}
</script>

<style lang="scss" scoped>
.select_action_bar {
  padding-left: 220px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background: #ecf4fd;
  z-index: 1002;
  display: flex;
  align-items: center;
  .text {
    margin-right: 50px;
    font-size: 12px;
    color: #282828;
  }
  .icon {
    margin-right: 50px;
    cursor: pointer;
    &.iconfont {
      font-size: 18px;
      color: #666;
      &.green {
        color: #45b54c;
      }
      &.red {
        color: #ff3b30;
      }
      &.gray {
        color: #666666;
      }
      &.blue {
        color: #37acfe;
      }
    }
  }
}
</style>
